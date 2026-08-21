import { describe, it } from "node:test";

import {
  buildPracticeResult,
  parsePracticePayload,
} from "../src/lib/practice/schema.ts";
import assert from "node:assert/strict";
import {
  ATTENTION_ITEMS,
  GRADIENT_ITEMS,
  NEURON_ITEMS,
  TRAINEVAL_ITEMS,
  type McqItem,
} from "../src/content/bank.ts";

const VALID = {
  schemaVersion: 1,
  sourceApp: "dau",
  conceptId: "ml-gd",
  lessonId: "ml-gd-10",
  practiceType: "gradient",
  goal: "Step opposite the gradient — but mind the size of the step.",
};

describe("practice payload schema", () => {
  it("accepts a well-formed DAU payload", () => {
    assert.ok(parsePracticePayload(VALID).ok);
  });

  it("rejects non-cmp concept ids and bad source apps", () => {
    assert.equal(parsePracticePayload({ ...VALID, conceptId: "dm-riff-cell" }).ok, false);
    assert.equal(parsePracticePayload({ ...VALID, sourceApp: "other" }).ok, false);
  });
});

describe("content bank integrity", () => {
  const pools: Array<[string, McqItem[]]> = [
    ["gradient", GRADIENT_ITEMS],
    ["traineval", TRAINEVAL_ITEMS],
    ["neuron", NEURON_ITEMS],
    ["attention", ATTENTION_ITEMS],
  ];

  for (const [name, items] of pools) {
    it(`${name}: every item is well-formed and sourced`, () => {
      for (const item of items) {
        assert.ok(item.source.startsWith("ml-"), `${item.id}: source must be a cmp lesson`);
        assert.ok(item.choices.length >= 3, `${item.id}: choices`);
        assert.ok(item.answerIndex < item.choices.length, `${item.id}: answer range`);
        assert.ok(item.why.length >= 20, `${item.id}: why too thin`);
      }
    });

    it(`${name}: ids unique, answer positions vary`, () => {
      assert.equal(new Set(items.map((i) => i.id)).size, items.length);
      assert.ok(new Set(items.map((i) => i.answerIndex)).size > 1, "answers should not all sit at one index");
    });
  }

});

describe("practice result schema", () => {
  it("round-trips a completed result", () => {
    const built = buildPracticeResult({
      conceptId: "ml-gd",
      lessonId: "ml-gd-10",
      completed: true,
      attempts: 0,
      timeSpentMs: 20_000,
      selfRating: 3,
    });
    assert.ok(built.ok);
    if (built.ok) assert.equal(built.value.sourceApp, "ml-lab");
  });
  it("the gradient deck covers direction, step size and convexity", () => {
    const sources = GRADIENT_ITEMS.map((item) => item.source);
    for (const required of ["ml-gd-10", "ml-convex-10"]) {
      assert.ok(sources.includes(required), `missing ${required}`);
    }
  });
});
