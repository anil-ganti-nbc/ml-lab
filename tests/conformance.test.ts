import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ML_LAB_ID,
  PRACTICE_QUERY_PARAM,
  SOURCE_APP_DAU,
  adaptMlResultMessage,
  buildMlLaunchUrl,
  canLaunchLab,
  getCompatibleLabs,
  getLab,
  readPracticeParam,
} from "../../dau-practice-labs/src/practice-labs/index.ts";

import { buildPracticeResult } from "../src/lib/practice/schema.ts";
import { parsePracticeSearch } from "../src/lib/practice/codec.ts";

const LAUNCH_BASE = "http://localhost:8097/";

function dauRequest(overrides = {}) {
  return {
    schemaVersion: 1,
    sourceApp: SOURCE_APP_DAU,
    labId: ML_LAB_ID,
    conceptId: "ml-gd",
    lessonId: "ml-gd-10",
    practiceType: "gradient",
    goal: "Step opposite the gradient — but mind the size of the step.",
    ...overrides,
  };
}

describe("dau-practice-labs contract conformance", () => {
  it("registry marks compiler-workbench launchable, resolvable, compatible", () => {
    const lab = getLab(ML_LAB_ID);
    assert.ok(lab, "packet-lab must be registered");
    assert.equal(lab.status, "implemented-external");
    assert.ok(canLaunchLab(ML_LAB_ID));
    assert.ok(lab.launchUrl);
    const compatible = getCompatibleLabs("ml-foundations", "ml-gd");
    assert.ok(compatible.some((entry) => entry.labId === ML_LAB_ID));
  });

  it("contract-built launch URL decodes into a valid payload", () => {
    const built = buildMlLaunchUrl(LAUNCH_BASE, dauRequest());
    assert.ok(built.ok, `adapter rejected: ${built.ok ? "" : built.message}`);
    const token = readPracticeParam(new URL(built.data).search) ?? "";
    const parsed = parsePracticeSearch(token, undefined as never);
    assert.ok(parsed.ok && parsed.value);
    if (parsed.ok && parsed.value) {
      assert.equal(parsed.value.sourceApp, "dau");
      assert.equal(parsed.value.conceptId, "ml-gd");
      assert.equal(parsed.value.practiceType, "gradient");
    }
  });

  it("result adapts into the canonical DAU envelope", () => {
    const built = buildMlLaunchUrl(LAUNCH_BASE, dauRequest());
    assert.ok(built.ok);
    const token = readPracticeParam(new URL(built.data).search) ?? "";
    const parsed = parsePracticeSearch(token, undefined as never);
    assert.ok(parsed.ok && parsed.value);

    const result = buildPracticeResult({
      conceptId: parsed.value.conceptId,
      lessonId: parsed.value.lessonId,
      completed: true,
      attempts: 2,
      timeSpentMs: 28_000,
      selfRating: 3,
    });
    assert.ok(result.ok);

    const adapted = adaptMlResultMessage(
      { type: "ml-lab:practice-result", result: result.value },
      { conceptId: "ml-gd", lessonId: "ml-gd-10" },
    );
    assert.ok(adapted.ok);
    if (adapted.ok) {
      assert.equal(adapted.data.type, "dau:practice-result");
      assert.equal(adapted.data.adaptedFrom, "ml-lab");
      assert.equal(adapted.data.result.labId, ML_LAB_ID);
    }
  });

  it("rejects wrong labs and foreign id families", () => {
    assert.equal(buildMlLaunchUrl(LAUNCH_BASE, dauRequest({ labId: "chudbox" })).ok, false);
    assert.equal(
      buildMlLaunchUrl(LAUNCH_BASE, dauRequest({ conceptId: "semi-cmp", lessonId: "semi-cmp-10" })).ok,
      false,
    );
  });
});
