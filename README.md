# ML Lab

Interactive machine-learning practice lab: gradient descent you can break, overfitting detective, attention mechanics.

Part of the Dead Air University practice-lab ecosystem. Implements the
[`dau-practice-labs`](https://github.com/anil-ganti-nbc/dau-practice-labs)
`?practice=` contract: DAU launches this app with a signed-shape payload,
and finished takes are posted back to the opener window.

## Run

```sh
npm install
npm run dev          # http://localhost:8097
```

Standalone demo: `http://localhost:8097/?practice=demo`

## Develop

```sh
npm run typecheck    # strict TS, no emit
npm test             # schema + model + cross-repo contract conformance
npm run build        # production build
```

## Contract

- Payload: `?practice=<url-safe-base64-json>` (`ml-gd` / `gradient` in the demo)
- Result: `postMessage` to `window.opener` as `ml-lab:practice-result`
- This lab never writes DAU mastery, reviews, or quiz scores.

MIT — see LICENSE.
