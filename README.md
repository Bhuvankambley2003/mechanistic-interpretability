# Mechanistic Interpretability — What Does a 49-Parameter Neural Network Actually Learn?

> A ground-up mechanistic study of how weights and biases evolve during training.  
> Built from scratch in NumPy. No PyTorch. No TensorFlow. Every gradient computed by hand.

**Live site:** [mechanistic-intrepretability-study.vercel.app](https://mechanistic-interpretability-study.vercel.app/)  
**Author:** [Bhuvan Kambley](https://bhu1.vercel.app)

---

## Overview

This is an interactive research publication that documents a mechanistic interpretability experiment on one of the smallest possible neural networks — a single hidden layer with 16 neurons, trained to learn `y = x² + 0.01` from noisy data.

The goal is not accuracy. The goal is **understanding** — tracking every one of the 49 parameters at every epoch, and asking what the network actually learned vs. what we expected it to learn.

This project is the first in a continuing series of mechanistic interpretability experiments, building from toy models toward transformer internals.

---

## The Experiment

### Task
Train a neural network to approximate the function:

```
y = x² + 0.01 + ε
```

where:
- `x` is uniformly spaced in `[−3, 3]`
- `ε ~ N(0, 0.05)` is Gaussian noise
- The constant `0.01` sits at the parabola's vertex (x = 0)

### Architecture

```
Input (x)  →  [W1: 16 weights]  →  Hidden layer (16 neurons, ReLU)  →  [W2: 16 weights]  →  Output (ŷ)
               [b1: 16 biases]                                           [b2: 1 bias]
```

| Parameter | Shape    | Count | Role                        |
|-----------|----------|-------|-----------------------------|
| W1        | (1, 16)  | 16    | Input → hidden weights      |
| b1        | (1, 16)  | 16    | Hidden neuron biases        |
| W2        | (16, 1)  | 16    | Hidden → output weights     |
| b2        | (1, 1)   | 1     | Output bias                 |
| **Total** |          | **49**| **Learnable parameters**    |

### Training Setup

| Setting         | Value         |
|-----------------|---------------|
| Data points     | 300           |
| Train / test    | 240 / 60      |
| Epochs          | 8,000         |
| Learning rate   | 0.005         |
| Loss function   | Mean Squared Error |
| Initialisation  | He (Kaiming)  |
| Framework       | NumPy only — no autograd |

---

## Research Findings

### 1. Equifinality
The true constant `0.01` is **not stored in the output bias b2**. Instead it is distributed across `b2`, `W2`, and `b1` collectively — multiple parameters conspiring to produce the correct output through a path no designer chose.

In GPT-scale models, single facts (like a country's capital) are similarly distributed across thousands of weights. There is no single neuron that "stores" a fact.

### 2. Symmetry Breaking
The network received perfectly symmetric data (`x²` is identical for `x = 1` and `x = −1`) yet learned an **asymmetric internal representation** — errors at `x = −1` and `x = +1` differ by nearly 0.1.

ReLU neurons are inherently directional, and the optimiser found genuinely different internal circuits for each side of the parabola. Symmetry in the data does not guarantee symmetry in the learned representation.

### 3. Compensating Bias Drift
`b2` climbed to **0.175** (target: 0.01) because the loss surface had a gentler slope in the `b2` direction than in the `W2` direction. Gradient descent took the path of least resistance.

This is why interpreting any single parameter in isolation is misleading: its value is meaningless without knowing what the other 48 are doing.

### 4. Gradient Starvation and Dead Neurons
Several hidden neurons spent the majority of training in the "dead" zone — their pre-activation `Z1` stayed negative, ReLU output was zero, and they received no gradient signal. **These neurons never updated.**

The network effectively trained on fewer than 16 neurons for most inputs, yet still converged. This mirrors the dead-neuron problem in deeper networks, where large fractions of capacity can be permanently disabled by poor initialisation or high learning rates.

### Error Decomposition (at final epoch)

| x   | True y  | Hidden (A1·W2) | b2    | Output | Error    |
|-----|---------|----------------|-------|--------|----------|
| −3  | 9.010   | 8.486          | 0.175 | 8.662  | −0.348   |
| −2  | 4.010   | 3.898          | 0.175 | 4.073  | +0.063   |
| −1  | 1.010   | 0.834          | 0.175 | 1.010  | −0.0004  |
|  0  | 0.010   | 0.000          | 0.175 | 0.175  | +0.165   |
| +1  | 1.010   | 0.931          | 0.175 | 1.106  | +0.096   |
| +2  | 4.010   | 3.902          | 0.175 | 4.078  | +0.068   |
| +3  | 9.010   | 8.454          | 0.175 | 8.629  | −0.381   |

The network is accurate at `x = ±1, ±2` but worst at `x = 0` — precisely because `b2` is a constant and cannot be input-dependent.

---

## Interactive Widgets

The site includes five interactive, client-side widgets built in React:

| Widget | What it shows |
|---|---|
| **DatasetWidget** | Scatter plot of the 300 training points with the true curve |
| **ArchitectureWidget** | Clickable SVG diagram of the full network — click any neuron to see its role |
| **ReluWidget** | Live demo of how two ReLU neurons sum to approximate a curve — drag sliders to explore |
| **GradientWidget** | Interactive gradient descent simulation — step manually or auto-run |
| **TrainingWidget** | Full training history scrubber — move through all 8,000 epochs, watch b2 drift |
| **ErrorTableWidget** | Colour-coded prediction breakdown at 7 test points |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS + inline styles |
| Charts | Recharts |
| Fonts | Geist Sans + Geist Mono (via `next/font`) |
| ML implementation | NumPy (Python, offline) |
| Hosting | Vercel |

---

## Project Structure

```
mechanistic-interpretability-site/
├── app/
│   ├── layout.tsx          # Root layout with full SEO metadata
│   ├── page.tsx            # Main article page (all 9 sections)
│   └── globals.css         # Design tokens and base styles
├── components/
│   ├── Section.tsx         # Numbered section wrapper component
│   └── widgets/
│       ├── ArchitectureWidget.tsx
│       ├── DatasetWidget.tsx
│       ├── ErrorTableWidget.tsx
│       ├── GradientWidget.tsx
│       ├── ReluWidget.tsx
│       └── TrainingWidget.tsx
├── public/
│   └── training_log.json   # Full 8,000-epoch training history (49 params × 400 snapshots)
└── next.config.ts
```

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/Bhuvankambley2003/mechanistic-interpretability.git
cd mechanistic-interpretability

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## What's Next

This is the first experiment in a continuing series. The research will continue onto:

- **2-layer networks** — what changes when a second hidden layer is added? Does equifinality deepen?
- **Dead neuron analysis** — how much capacity is actually used across random seeds?
- **Loss landscape visualisation** — plotting the W2–b2 valley that traps gradient descent
- **Attention mechanisms** — induction heads in a 2-layer attention-only transformer
- **Grokking** — why networks suddenly generalise after memorisation
- **Sparse autoencoders** — decomposing polysemantic neurons

Each experiment will be built from scratch, tracked at every step, and published as an interactive article.

---

## References and Inspiration

- Elhage et al. (2021) — [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html)
- Olah et al. — [Zoom In: An Introduction to Circuits](https://distill.pub/2020/circuits/zoom-in/)
- Neel Nanda — [Mechanistic Interpretability Tutorials](https://neelnanda.io)
- Anthropic — [Toy Models of Superposition](https://transformer-circuits.pub/2022/toy_model/index.html)

---

## License

MIT — free to use, adapt, and build on. Attribution appreciated.

---

*Built by [Bhuvan Kambley](https://bhu1.vercel.app) · 2026*
