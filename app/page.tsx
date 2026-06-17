import Section from "@/components/Section";
import DatasetWidget from "@/components/widgets/DatasetWidget";
import ArchitectureWidget from "@/components/widgets/ArchitectureWidget";
import ReluWidget from "@/components/widgets/ReluWidget";
import TrainingWidget from "@/components/widgets/TrainingWidget";
import ErrorTableWidget from "@/components/widgets/ErrorTableWidget";
import GradientWidget from "@/components/widgets/GradientWidget";

export default function Home() {
  return (
    <>
      <style>{`
        .author-link {
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0;
        }
        .author-link:hover {
          color: #0d9488;
        }
        .author-link .author-name {
          transition: color 0.2s ease;
        }
        .author-link .author-arrow {
          display: inline-block;
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          margin-left: 3px;
          font-size: 11px;
        }
        .author-link:hover .author-arrow {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
      <main
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "5rem 1.5rem 8rem",
        }}
      >
      {/* ── Header ── */}
      <header style={{ marginBottom: "5rem" }}>
        <p
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "12px",
            color: "var(--muted)",
            marginBottom: "1rem",
            letterSpacing: "0.05em",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>MECHANISTIC INTERPRETABILITY · 2026</span>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <a
              href="https://github.com/Bhuvankambley2003/mechanistic-interpretability"
              target="_blank"
              rel="noopener noreferrer"
              className="author-link"
            >
              <span className="author-name">GitHub</span>
              <span className="author-arrow">↗</span>
            </a>
            <a
              href="https://bhu1.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="author-link"
            >
              <span className="author-name">Built by Bhuvan Kambley</span>
              <span className="author-arrow">↗</span>
            </a>
          </div>
        </p>

        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 500,
            lineHeight: 1.25,
            marginBottom: "1.25rem",
            color: "var(--ink)",
          }}
        >
          What Does a 49-Parameter Neural Network Actually Learn?
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "var(--muted)",
            lineHeight: 1.75,
            marginBottom: "2rem",
            maxWidth: "600px",
          }}
        >
          A ground-up mechanistic study of how weights and biases evolve
          during training — using{" "}
          <code
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "13px",
              background: "var(--accent-light)",
              color: "var(--accent)",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            y = x² + 0.01
          </code>{" "}
          as a controlled environment. No PyTorch. No TensorFlow. Every
          gradient computed by hand in NumPy.
        </p>

        <div
          style={{
            borderTop: "1px solid var(--rule)",
            paddingTop: "1.25rem",
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            fontSize: "13px",
            color: "var(--muted)",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          {[
            ["300", "data points"],
            ["49", "parameters"],
            ["8,000", "epochs"],
            ["0.0155", "final MSE"],
          ].map(([num, label]) => (
            <div key={label}>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>{num}</span>{" "}
              {label}
            </div>
          ))}
        </div>
      </header>

      {/* ── Section 1 ── */}
      <Section number="01" title="Why This Experiment">
        <p style={prose}>
          Most people learn neural networks by calling{" "}
          <code style={code}>model.fit()</code> and watching accuracy go up.
          That tells you nothing about what is actually happening inside. This
          project takes the opposite approach — build everything from scratch,
          track every parameter at every epoch, and ask: what did the network
          actually learn and how did it get there?
        </p>
        <p style={prose}>
          Mechanistic interpretability is the field that tries to answer this
          question at scale — for GPT, Claude, and other large models. But
          those models have billions of parameters. The same phenomena exist in
          a 49-parameter network, and at that scale you can actually see them.
        </p>
        <p style={prose}>
          The experiment: train a small neural network to learn the
          relationship{" "}
          <code style={code}>y = x² + 0.01</code> from noisy data. Watch every
          weight and bias update in real time. Find out whether the network
          discovers the true constant <code style={code}>0.01</code> or stores
          it somewhere unexpected.
        </p>
        <blockquote
          style={{
            borderLeft: "3px solid var(--accent)",
            margin: "2rem 0",
            paddingLeft: "1.25rem",
            color: "var(--muted)",
            fontSize: "15px",
            fontStyle: "italic",
          }}
        >
          "A neural network does not care about human-interpretable structure.
          It finds the easiest path down the loss surface — which is almost
          never the path you expect."
        </blockquote>
      </Section>

      {/* ── Section 2 ── */}
      <Section number="02" title="The Dataset">
        <p style={prose}>
          The training data is 300 points drawn from{" "}
          <code style={code}>y = x² + 0.01 + ε</code> where x is uniformly
          spaced between −3 and 3, and ε is Gaussian noise with standard
          deviation 0.05. The noise serves a critical purpose — it prevents
          the network from memorising exact values and forces it to learn the
          underlying signal.
        </p>
        <p style={prose}>
          The constant <code style={code}>0.01</code> is deliberately small.
          It sits at the vertex of the parabola — the minimum point where
          x = 0. The question we are asking: does the network store this
          constant cleanly in the output bias, or does it distribute it across
          parameters in an entangled way?
        </p>
        <DatasetWidget />
        <p style={{ ...prose, marginTop: "1.5rem" }}>
          The scatter plot above shows the raw training data — notice the
          slight vertical scatter from noise. The line below shows the true
          underlying curve the network must discover purely from the noisy
          points.
        </p>
      </Section>

      {/* ── Section 3 ── */}
      <Section number="03" title="The Architecture">
        <p style={prose}>
          The network has three layers: one input neuron (x), sixteen hidden
          neurons with ReLU activation, and one output neuron (ŷ). This gives
          exactly 49 learnable parameters — small enough to inspect every
          single one.
        </p>
        <div
          style={{
            background: "#F5F5F3",
            borderRadius: "8px",
            padding: "1rem 1.25rem",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "13px",
            color: "var(--ink)",
            margin: "1.5rem 0",
            lineHeight: 2,
          }}
        >
          <div>W1 · shape (1, 16) → 16 weights · input to hidden</div>
          <div>b1 · shape (1, 16) → 16 biases · one per hidden neuron</div>
          <div>W2 · shape (16, 1) → 16 weights · hidden to output</div>
          <div>b2 · shape (1, 1) &nbsp;→ 1 bias &nbsp;· output layer</div>
          <div
            style={{
              borderTop: "1px solid var(--rule)",
              marginTop: "0.5rem",
              paddingTop: "0.5rem",
              color: "var(--accent)",
            }}
          >
            Total: 49 learnable parameters
          </div>
        </div>
        <p style={prose}>
          Each hidden neuron computes{" "}
          <code style={code}>Z1[i] = x × W1[i] + b1[i]</code>, then applies
          ReLU: <code style={code}>A1[i] = max(0, Z1[i])</code>. The output
          neuron sums all sixteen hidden outputs weighted by W2, then adds b2.
          Click any neuron below to see its role.
        </p>
        <ArchitectureWidget />
      </Section>

      {/* ── Section 4 ── */}
      <Section number="04" title="How ReLU Builds Any Shape">
        <p style={prose}>
          A single ReLU neuron produces one bent line — flat on one side,
          sloped on the other. The bend point is controlled by b1. The slope
          is controlled by W1. On its own, this is useless for fitting a
          curve.
        </p>
        <p style={prose}>
          But sixteen bent lines, each bending at a different point along the
          x axis with a different slope, can approximate any smooth function
          when added together with the right W2 weights. This is the universal
          approximation theorem made tangible.
        </p>
        <ReluWidget />
        <p style={{ ...prose, marginTop: "1.5rem" }}>
          Gradient descent adjusts W1 and b1 for each neuron — sliding the
          bend point left or right, steepening or flattening the slope — until
          the sum of all sixteen lines matches the training data as closely as
          possible.
        </p>
      </Section>

      {/* ── Section 5 ── */}
      <Section number="05" title="Gradient Descent — The Update Engine">
        <p style={prose}>
          After each forward pass the network computes the mean squared error
          between its predictions and the true values. Backpropagation then
          calculates how much each of the 49 parameters contributed to that
          error. Gradient descent nudges each parameter slightly in the
          direction that reduces the loss.
        </p>
        <p style={prose}>
          The update rule is simple:{" "}
          <code style={code}>param ← param − η × gradient</code>. Applied
          8,000 times across all 49 parameters simultaneously, this is the
          entire mechanism of learning.
        </p>
        <GradientWidget />
        <p style={{ ...prose, marginTop: "1.5rem" }}>
          Notice how the steps get smaller as the ball approaches the minimum.
          This is not because the learning rate changed — it is because the
          gradient itself shrinks as the loss flattens. The system naturally
          decelerates near the answer.
        </p>
      </Section>

      {/* ── Section 6 ── */}
      <Section number="06" title="The Training Run — 8,000 Epochs">
        <p style={prose}>
          Training ran for 8,000 epochs with learning rate 0.005. Every 20
          epochs a snapshot was saved — all 49 parameter values, all 49
          gradient values, training loss, and test loss. Use the scrubber
          below to move through the full training history.
        </p>
        <TrainingWidget />
        <p style={{ ...prose, marginTop: "1.5rem" }}>
          Watch the output bias b2 in particular. It starts near zero, drifts
          deeply negative in the first 700 epochs, then slowly climbs back
          toward — and then past — the true constant 0.01. This drift is not
          random. It is the mechanistic signature of the hidden layer
          systematically underestimating x², with b2 compensating.
        </p>
      </Section>

      {/* ── Section 7 ── */}
      <Section number="07" title="What We Found — The Error Table">
        <p style={prose}>
          After training, we tested the network at seven specific x values and
          decomposed each prediction into its components: what the hidden layer
          produced (A1·W2) and what the output bias contributed (b2). The
          results revealed a fundamental architectural tension.
        </p>
        <ErrorTableWidget />
        <p style={{ ...prose, marginTop: "1.5rem" }}>
          The network is accurate at x = ±1, ±2 but catastrophically wrong at
          x = 0 — the vertex of the parabola. The output bias b2 settled at
          0.175 instead of 0.01 because the hidden layer systematically
          underestimates x² near zero, and b2 became a blunt compensating
          instrument. It cannot be input-dependent so it overcompensates at
          the center while being approximately correct at the extremes.
        </p>
      </Section>

      {/* ── Section 8 ── */}
      <Section number="08" title="Findings and Implications">
        <p style={prose}>
          Four mechanistic findings emerged from this experiment, each with
          direct implications for understanding larger models.
        </p>

        {[
          {
            title: "Equifinality",
            body:
              "The true constant 0.01 is not stored in the output bias b2. Instead it is distributed across b2, W2, and b1 collectively — multiple parameters conspiring to produce the correct output through a path no designer chose. In GPT-scale models, single facts like a country’s capital are similarly distributed across thousands of weights. There is no single neuron that ‘stores’ a fact.",
          },
          {
            title: "Symmetry breaking",
            body:
              "The network received perfectly symmetric data (x² is identical for x=1 and x=−1) yet learned an asymmetric internal representation — errors at x=−1 and x=+1 differ by nearly 0.1. ReLU neurons are inherently directional, and the optimiser found genuinely different internal circuits for each side of the parabola. Symmetry in the data does not guarantee symmetry in the learned representation.",
          },
          {
            title: "Compensating bias drift",
            body:
              "b2 climbed to 0.175 because the loss surface had a gentler slope in the b2 direction than in the W2 direction. Gradient descent took the path of least resistance — adjusting b2 rather than perfectly reshaping all 32 weights in W2. This is why interpreting any single parameter in isolation is misleading: its value is meaningless without knowing what the other 48 are doing.",
          },
          {
            title: "Gradient starvation and dead neurons",
            body:
              "Several hidden neurons spent the majority of training in the ‘dead’ zone — their pre-activation Z1 stayed negative, ReLU output was zero, and they received no gradient signal. These neurons never updated. The network effectively trained on fewer than 16 neurons for most inputs, yet still converged. This mirrors the dead-neuron problem in deeper networks, where large fractions of capacity can be permanently disabled by poor initialisation or high learning rates.",
          },
        ].map(({ title, body }) => (
          <div
            key={title}
            style={{
              borderLeft: "3px solid var(--rule)",
              paddingLeft: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 500,
                marginBottom: "0.5rem",
                color: "var(--ink)",
              }}
            >
              {title}
            </h3>
            <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
              {body}
            </p>
          </div>
        ))}

        <p style={{ ...prose, marginTop: "2rem" }}>
          These phenomena — equifinality, symmetry breaking, compensating
          drift, gradient starvation — are not quirks of a toy model. They are
          the same phenomena mechanistic interpretability researchers document
          in GPT-2, LLaMA, and Claude. Studying them in a network with 49
          parameters makes them visible and reproducible. Studying them in a
          model with 7 billion parameters is the frontier of AI safety research.
        </p>
      </Section>

      {/* ── Section 9 ── */}
      <Section number="09" title="More to Come">
        <p style={prose}>
          This research is just getting started. What you have read here is the
          first experiment in a continuing series — one that will grow deeper
          and more complex with each new study.
        </p>
        <p style={prose}>
          The next step is to take everything uncovered in this 49-parameter
          network and ask: what changes when we add a second hidden layer? Does
          equifinality become more or less pronounced? Do dead neurons behave
          differently? How does the loss surface shift when the network has more
          expressive power but also more ways to overfit?
        </p>
        <blockquote
          style={{
            borderLeft: "3px solid var(--accent)",
            margin: "2rem 0",
            paddingLeft: "1.25rem",
            color: "var(--muted)",
            fontSize: "15px",
            fontStyle: "italic",
          }}
        >
          "Understanding what a 1-hidden-layer network learns is the foundation.
          Understanding what a 2-hidden-layer network learns is where it starts
          to get surprising."
        </blockquote>
        <p style={prose}>
          From there, the path leads toward attention mechanisms, induction
          heads, and eventually the internal circuits of real language models.
          Each step will be built from scratch, tracked at every epoch, and
          published here — openly and interactively.
        </p>
        <p style={{ ...prose, color: "var(--ink)", fontWeight: 500 }}>
          Stay tuned.
        </p>
      </Section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--rule)",
          paddingTop: "2rem",
          fontSize: "13px",
          color: "var(--muted)",
          fontFamily: "var(--font-geist-mono)",
        }}
      >
        <p>
          Built from scratch in NumPy. No autograd. No deep learning
          frameworks.
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          Source:{" "}
          <a
            href="https://github.com"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            github.com
          </a>{" "}
          · 2026
        </p>
        <p style={{ marginTop: "1.5rem", borderTop: "1px solid var(--rule)", paddingTop: "1.5rem" }}>
          Built by{" "}
          <span style={{ color: "var(--ink)", fontWeight: 500 }}>Bhuvan Kambley</span>
        </p>
      </footer>
    </main>
    </>
  );
}

const prose: React.CSSProperties = {
  fontSize: "15px",
  color: "var(--muted)",
  lineHeight: 1.8,
  marginBottom: "1rem",
};

const code: React.CSSProperties = {
  fontFamily: "var(--font-geist-mono)",
  fontSize: "13px",
  background: "var(--accent-light)",
  color: "var(--accent)",
  padding: "1px 6px",
  borderRadius: "4px",
};
