/**
 * The six ML Lab modules. Five sourced decks plus a live descent visualizer.
 */

import type { PracticePayload } from "./lib/practice/schema";
import { countAttempt, type SessionState } from "./lib/practice/session";
import {
  ATTENTION_ITEMS,
  GRADIENT_ITEMS,
  NEURON_ITEMS,
  TRAINEVAL_ITEMS,
  type McqItem,
} from "./content/bank";

export interface ModuleCtx {
  payload: PracticePayload;
  session: SessionState;
  root: HTMLElement;
  stage: HTMLElement;
  onReady: (ready: boolean) => void;
}

function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  text = "",
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (text) node.textContent = text;
  return node;
}

function paramNumber(payload: PracticePayload, key: string, fallback: number): number {
  const value = payload.parameters?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function mountMcq(
  ctx: ModuleCtx,
  title: string,
  pool: McqItem[],
  needed: number,
): void {
  const deck = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(needed, pool.length));
  let index = 0;

  const prompt = h("p", {}, "");
  const source = h("p", { class: "hint" }, "");
  const options = h("div", { class: "stack" });
  const feedback = h("p", { class: "hint" }, "");
  const progress = h("p", { class: "hint" }, `0 / ${deck.length}`);

  function show(): void {
    if (index >= deck.length) {
      ctx.onReady(true);
      feedback.textContent = "Deck complete. Hit Complete.";
      return;
    }
    const item = deck[index];
    prompt.textContent = item.prompt;
    source.textContent = `from ${item.source}`;
    progress.textContent = `${index} answered`;
    feedback.textContent = "";
    options.replaceChildren(
      ...item.choices.map((choice, choiceIndex) => {
        const btn = h("button", { class: "btn" }, choice);
        btn.addEventListener("click", () => {
          if (btn.disabled) return;
          if (choiceIndex !== item.answerIndex) countAttempt(ctx.session);
          for (const sibling of options.children) (sibling as HTMLButtonElement).disabled = true;
          options.children[item.answerIndex].classList.add("correct");
          feedback.textContent = item.why;
          index += 1;
          window.setTimeout(show, 1800);
        });
        return btn;
      }),
    );
  }

  ctx.root.append(h("h2", { class: "label" }, title), prompt, source, options, feedback, progress);
  show();
}

export function mountGradient(ctx: ModuleCtx): void {
  mountMcq(ctx, "Step opposite the gradient", GRADIENT_ITEMS, paramNumber(ctx.payload, "questions", 3));
}

export function mountTraineval(ctx: ModuleCtx): void {
  mountMcq(ctx, "Fit the sample, respect the population", TRAINEVAL_ITEMS, paramNumber(ctx.payload, "questions", 4));
}

export function mountNeuron(ctx: ModuleCtx): void {
  mountMcq(ctx, "Sums, shifts and bends", NEURON_ITEMS, paramNumber(ctx.payload, "questions", 3));
}

export function mountAttention(ctx: ModuleCtx): void {
  mountMcq(ctx, "Inside attention", ATTENTION_ITEMS, paramNumber(ctx.payload, "questions", 4));
}

/** Mixed review across every deck. */
export function mountScenarios(ctx: ModuleCtx): void {
  const everything = [...GRADIENT_ITEMS, ...TRAINEVAL_ITEMS, ...NEURON_ITEMS, ...ATTENTION_ITEMS];
  mountMcq(ctx, "Mixed review", everything, paramNumber(ctx.payload, "questions", 5));
}

// ---------------------------------------------------------------------------
// Free: live gradient descent on a parabola
// ---------------------------------------------------------------------------

export function mountFree(ctx: ModuleCtx): void {
  // J(θ) = θ² — one bowl, exactly as the convexity lesson promises.
  let theta = -8;
  let alpha = 0.1;

  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 400 240");
  svg.setAttribute("class", "movement");

  // Bowl curve.
  const path = document.createElementNS(NS, "path");
  let d = "";
  for (let i = 0; i <= 100; i += 1) {
    const t = -10 + (20 * i) / 100;
    const x = 200 + t * 18;
    const y = 220 - Math.min(210, t * t * 1.1);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)} `;
  }
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#4a4436");
  svg.appendChild(path);

  // Minimum marker.
  const minMarker = document.createElementNS(NS, "circle");
  minMarker.setAttribute("cx", "200");
  minMarker.setAttribute("cy", "219");
  minMarker.setAttribute("r", "3");
  minMarker.setAttribute("fill", "#7fb069");
  svg.appendChild(minMarker);

  // The parameter ball.
  const ball = document.createElementNS(NS, "circle");
  ball.setAttribute("r", "7");
  ball.setAttribute("fill", "#d4a24e");
  svg.appendChild(ball);

  ctx.stage.appendChild(svg);

  const readout = h("p", { class: "hint" }, "");
  const sliderLabel = h("p", { class: "hint" }, `α = ${alpha}`);
  const slider = h("input", { type: "range", min: "1", max: "105", value: String(alpha * 100) });

  function draw(): void {
    ball.setAttribute("cx", String(200 + theta * 18));
    ball.setAttribute("cy", String(220 - Math.min(210, theta * theta * 1.1)));
    readout.textContent = `θ = ${theta.toFixed(3)} · loss = ${(theta * theta).toFixed(3)} · step −α·∇ = −α·2θ`;
  }

  slider.addEventListener("input", () => {
    alpha = Number(slider.value) / 100;
    sliderLabel.textContent = `α = ${alpha}`;
  });

  const timer = window.setInterval(() => {
    if (Math.abs(theta) < 0.01) {
      readout.textContent = `Converged to θ ≈ 0 in a convex bowl. Every local minimum you found was the global one.`;
      ctx.onReady(true);
      return;
    }
    theta = theta - alpha * 2 * theta; // ∇J = 2θ
    draw();
  }, 120);

  sliderLabel.style.marginTop = "8px";
  ctx.stage.append(readout, slider, sliderLabel);
  ctx.root.append(
    h("h2", { class: "label" }, "One bowl"),
    h(
      "p",
      { class: "hint" },
      "Live descent on J(θ) = θ². Push α past ~1.0 and watch the step overshoot the bowl — that is the whole lesson of the hyperparameter.",
    ),
  );
  draw();
}
