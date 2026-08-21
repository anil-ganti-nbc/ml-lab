/**
 * ML LAB CONTENT BANK — the single reviewable fact file.
 * Every graded item is conceptual and sourced from the DAU ml curriculum.
 */

export interface McqItem {
  id: string;
  source: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  why: string;
}

// ---------------------------------------------------------------------------
// Gradient descent & optimization
// ---------------------------------------------------------------------------

export const GRADIENT_ITEMS: McqItem[] = [
  {
    id: "gd-direction",
    source: "ml-gd-10",
    prompt: "Gradient descent steps…",
    choices: [
      "Opposite the gradient — θ ← θ − α∇J(θ)",
      "Along the gradient, toward steeper loss",
      "In a random direction each step",
      "Only at the minimum",
    ],
    answerIndex: 0,
    why: "The gradient points toward steepest increase; descent steps the other way.",
  },
  {
    id: "gd-step-size",
    source: "ml-gd-10",
    prompt: "The loss oscillates wildly or explodes between steps. The classic diagnosis?",
    choices: [
      "The gradient is wrong",
      "There are too many features",
      "α is too large — the step overshoots the bowl",
      "α is too small — the step crawls",
    ],
    answerIndex: 2,
    why: "Too large overshoots; too small crawls. α is a hyperparameter, not a moral.",
  },
  {
    id: "gd-convexity",
    source: "ml-convex-10",
    prompt: "A convex loss surface guarantees…",
    choices: [
      "One bowl — any local minimum you reach is the global one",
      "Many basins to explore",
      "Faster clock speed",
      "Zero training error",
    ],
    answerIndex: 0,
    why: "One bowl or many basins changes everything about where your step can trap you.",
  },
  {
    id: "gd-feature-scale",
    source: "ml-feature-scale-10",
    prompt: "Unscaled features (one axis 0–1, another 0–10,000) make gradient descent…",
    choices: [
      "Perfectly fine — gradients do not care about scale",
      "Convex when it was not before",
      "Crooked — the path zigzags because one axis dominates every step",
      "Impossible to run",
    ],
    answerIndex: 2,
    why: "Unscaled axes crook the path; rescaling makes the bowl round and the steps honest.",
  },
];

// ---------------------------------------------------------------------------
// Training vs evaluation
// ---------------------------------------------------------------------------

export const TRAINEVAL_ITEMS: McqItem[] = [
  {
    id: "te-overfit-signature",
    source: "ml-overfit-10",
    prompt: "Training loss keeps falling while validation loss rises. That signature means…",
    choices: [
      "Overfitting — the model memorized accidents that will not recur",
      "Underfitting — the model is too simple",
      "The learning rate is too small",
      "Nothing; both losses always move together",
    ],
    answerIndex: 0,
    why: "Sample fit, population miss: the hypothesis class had room to memorize the sheet's noise.",
  },
  {
    id: "te-three-splits",
    source: "ml-train-val-test-5",
    prompt: "Why does validation exist when test already exists?",
    choices: [
      "They are synonyms from different textbooks",
      "Validation lets you peek and tune without spending the test set's unseen-example contract",
      "Validation is a smaller test set for slow machines",
      "Test is only for competitions",
    ],
    answerIndex: 1,
    why: "Tuning on the set you later report is the original sin. Validation exists so peeking has a price you can afford.",
  },
  {
    id: "te-early-stop",
    source: "ml-early-stop-10",
    prompt: "Early stopping quits training when…",
    choices: [
      "The GPU gets too hot",
      "Every epoch has been visited twice",
      "Validation performance stops improving — quit while validation is honest",
      "Training loss reaches exactly zero",
    ],
    answerIndex: 2,
    why: "More epochs past that point buy memorization, not generalization.",
  },
  {
    id: "te-metrics-lie",
    source: "ml-metrics-class-10",
    prompt: "Accuracy reads 99% on a fraud dataset where 99% of rows are legitimate. The catch?",
    choices: [
      "Precision/recall matter more — accuracy lies under class imbalance",
      "The model is production-ready",
      "Fraud detection cannot use machine learning",
      "The test set must be wrong",
    ],
    answerIndex: 0,
    why: "Predicting 'legitimate' for everyone scores 99% and catches zero fraud. Precision after accuracy lies.",
  },
];

// ---------------------------------------------------------------------------
// Neurons & backprop
// ---------------------------------------------------------------------------

export const NEURON_ITEMS: McqItem[] = [
  {
    id: "neuron-activation-why",
    source: "ml-activation-10",
    prompt: "Without a nonlinear activation between layers, a deep stack of layers is…",
    choices: [
      "Equivalent to one linear layer — the bend is what makes depth real",
      "Strictly more powerful per layer",
      "Unable to run forward passes",
      "Guaranteed to overfit",
    ],
    answerIndex: 0,
    why: "Composing linear maps gives a linear map. The activation supplies the bend.",
  },
  {
    id: "neuron-backprop-is",
    source: "ml-backprop-10",
    prompt: "Backpropagation is…",
    choices: [
      "A separate neural-network-specific theorem",
      "Forward-mode differentiation with extra steps",
      "A regularization technique",
      "Reverse-mode autodiff on a scalar loss — the chain rule run backward through the composition",
    ],
    answerIndex: 3,
    why: "Millions of parameters, one loss: reverse mode is the cheap direction. Each op applies a vector-Jacobian product.",
  },
  {
    id: "neuron-vanishing",
    source: "ml-vanishing-10",
    prompt: "Deep stacks can lose gradient because…",
    choices: [
      "A product of many small Jacobians dies — or blows up — across depth",
      "Activations are stored in low precision",
      "The dataset is too large",
      "Softmax outputs negative values",
    ],
    answerIndex: 0,
    why: "A product that dies or blows up: depth multiplies local derivatives whether you want it or not.",
  },
  {
    id: "neuron-softmax-role",
    source: "ml-softmax-10",
    prompt: "Softmax turns raw scores into…",
    choices: [
      "A probability distribution — positive, summing to one",
      "A sorted list of labels",
      "Binary decisions per class",
      "A gradient estimate",
    ],
    answerIndex: 0,
    why: "Scores become a distribution so cross-entropy has something honest to compare against the truth.",
  },
];

// ---------------------------------------------------------------------------
// Attention & transformers
// ---------------------------------------------------------------------------

export const ATTENTION_ITEMS: McqItem[] = [
  {
    id: "attn-qkv-roles",
    source: "ml-qkv-10",
    prompt: "In attention, what are the three projections' roles?",
    choices: [
      "Queries ask, keys advertise, values carry the payload",
      "Queries carry content, keys score, values look up",
      "All three are copies used for redundancy",
      "Queries sort, keys filter, values normalize",
    ],
    answerIndex: 0,
    why: "Scores come from queries against keys; the mix is of values. Swap those jobs and you average the wrong object.",
  },
  {
    id: "attn-positional",
    source: "ml-positional-10",
    prompt: "Why do transformers need positional information added?",
    choices: [
      "It speeds up matrix multiplication",
      "Attention itself is order-blind — order has to be supplied to the mixer",
      "Tokens arrive pre-sorted by length",
      "Positional data replaces the loss function",
    ],
    answerIndex: 1,
    why: "A bag-of-token mixer cannot see word order unless something injects it.",
  },
  {
    id: "attn-kv-cache",
    source: "ml-kv-cache-10",
    prompt: "Serving generation token-by-token, the KV cache exists so the model…",
    choices: [
      "Remembers the prefix instead of rebuilding every past projection each step",
      "Stores user conversations permanently",
      "Skips the softmax entirely",
      "Compresses weights on disk",
    ],
    answerIndex: 0,
    why: "Remember the prefix, do not rebuild it — that is the difference between cheap next tokens and quadratic pain.",
  },
  {
    id: "attn-hallucination",
    source: "ml-hallucination-10",
    prompt: "The curriculum's framing of hallucination?",
    choices: [
      "A bug fixed by more epochs",
      "Proof the tokenizer failed",
      "An artifact of small context windows only",
      "A confident continuation is not a retrieval — fluency is not a diagnosis",
    ],
    answerIndex: 3,
    why: "The objective predicts plausible continuations; nothing in it promises truth.",
  },
];

// ---------------------------------------------------------------------------
// Extended deck: LLM practice, tokenizers, scaling
// ---------------------------------------------------------------------------

export const ML_EXTRA_ITEMS: McqItem[] = [
  {
    id: "mx-tokenizer-units",
    source: "ml-tokenizer-10",
    prompt: "A tokenizer defines…",
    choices: [
      "The grammar of the prompt language",
      "The units the model actually sees — subwords, not necessarily words",
      "How attention heads are named",
      "The output sampling temperature",
    ],
    answerIndex: 1,
    why: "Every downstream number is a sequence over tokenizer units; spelling changes shift everything.",
  },
  {
    id: "mx-pretrain-objective",
    source: "ml-pretrain-10",
    prompt: "Pretraining a base model means…",
    choices: [
      "One objective — predict the next token — on a lot of unlabeled text",
      "Supervised labels for every sentence",
      "Reinforcement learning from human feedback first",
      "Memorizing a fixed question bank",
    ],
    answerIndex: 0,
    why: "One objective, enormous corpus. Everything else — instruction following, alignment — layers on later.",
  },
  {
    id: "mx-finetune-distribution",
    source: "ml-finetune-10",
    prompt: "Fine-tuning continues training on…",
    choices: [
      "A narrower distribution than pretraining saw",
      "Random noise to reset the weights",
      "Exactly the same data at a lower rate",
      "Only the tokenizer vocabulary",
    ],
    answerIndex: 0,
    why: "Narrower distribution, same machinery — which is also why narrow fine-tunes can forget broad skills.",
  },
  {
    id: "mx-peft-idea",
    source: "ml-peft-10",
    prompt: "Parameter-efficient fine-tuning (PEFT) works by…",
    choices: [
      "Changing a small adapter instead of every weight in the model",
      "Reducing the context window",
      "Training only the tokenizer",
      "Quantizing activations to integers",
    ],
    answerIndex: 0,
    why: "Freeze the base, train the adapter: a fraction of the knobs, most of the steering.",
  },
  {
    id: "mx-prompt-control",
    source: "ml-prompt-10",
    prompt: "Prompting is best understood as…",
    choices: [
      "Inference-time control written in tokens — no weight changes involved",
      "A compile step for the model",
      "A substitute for evaluation",
      "Fine-tuning through the chat box",
    ],
    answerIndex: 0,
    why: "Same weights, different conditioning. That is both its power and its fragility.",
  },
  {
    id: "mx-rag-flow",
    source: "ml-rag-10",
    prompt: "Retrieval-augmented generation means…",
    choices: [
      "Look it up, then continue — external text joins the context before generation",
      "Generating twice and keeping the longer answer",
      "Compressing the KV cache",
      "Training against a search engine",
    ],
    answerIndex: 0,
    why: "The model conditions on retrieved passages, which grounds answers the weights alone cannot guarantee.",
  },
  {
    id: "mx-scale-coupled",
    source: "ml-scale-10",
    prompt: "'Scale' in the curriculum is…",
    choices: [
      "Parameters, data, and compute as coupled knobs you must grow together",
      "Only the parameter count",
      "The physical size of the cluster",
      "A synonym for quantization",
    ],
    answerIndex: 0,
    why: "Grow one without the others and you waste it — the knobs are coupled by construction.",
  },
  {
    id: "mx-lm-objective",
    source: "ml-lm-obj-10",
    prompt: "The language-model objective is…",
    choices: [
      "Predict the next token from the past",
      "Classify sentences as true or false",
      "Translate between languages",
      "Summarize its own training data",
    ],
    answerIndex: 0,
    why: "Everything a base LM does — style, facts, code — is in service of that one prediction.",
  },
  {
    id: "mx-eval-leaderboard",
    source: "ml-eval-llm-10",
    prompt: "The curriculum's warning about LLM leaderboards?",
    choices: [
      "A leaderboard is not the job — benchmark wins do not guarantee your task works",
      "Leaderboards update too slowly",
      "They only test GPU throughput",
      "They are identical to validation loss",
    ],
    answerIndex: 0,
    why: "Fluent is not a diagnosis and a rank is not a use case. Evaluate on what you actually serve.",
  },
];
