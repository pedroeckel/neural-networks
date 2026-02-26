import { ListOrdered } from "lucide-react";

const AlgorithmSteps = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <ListOrdered className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-primary glow-text font-mono tracking-wider uppercase">
          Algoritmo do Perceptron
        </h3>
      </div>

      <div className="space-y-3 font-mono text-sm">
        <Step number={0}>
          <span className="text-muted-foreground">Inicializar os pesos, o bias e a taxa de aprendizado:</span>
          <code className="block mt-1 text-primary bg-primary/10 px-2 py-1 rounded text-xs">
            w = 0, &nbsp; b = 0, &nbsp; η = 1
          </code>
        </Step>

        <Step number={1}>
          <span className="text-muted-foreground">
            Enquanto o critério de parada <strong className="text-foreground">não</strong> for satisfeito, execute os passos 2–6:
          </span>
        </Step>

        <div className="ml-4 border-l-2 border-primary/20 pl-4 space-y-3">
          <Step number={2}>
            <span className="text-muted-foreground">
              Para cada par de dados de treinamento <code className="text-accent-foreground bg-secondary px-1 rounded">(x, d)</code>, execute os passos 3–5:
            </span>
          </Step>

          <div className="ml-4 border-l-2 border-primary/10 pl-4 space-y-3">
            <Step number={3}>
              <span className="text-muted-foreground">Calcule a saída líquida:</span>
              <code className="block mt-1 text-primary bg-primary/10 px-2 py-1 rounded text-xs">
                y* = b + Σᵢ xᵢ · wᵢ
              </code>
            </Step>

            <Step number={4}>
              <span className="text-muted-foreground">Aplique a função de ativação:</span>
              <div className="mt-1 space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-node-output font-bold">Se y* &gt; θ</span>
                  <span className="text-muted-foreground">→</span>
                  <code className="text-primary bg-primary/10 px-2 py-0.5 rounded">y = 1</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-node-output font-bold">Se −θ ≤ y* ≤ θ</span>
                  <span className="text-muted-foreground">→</span>
                  <code className="text-primary bg-primary/10 px-2 py-0.5 rounded">y = 0</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-node-output font-bold">Se y* &lt; −θ</span>
                  <span className="text-muted-foreground">→</span>
                  <code className="text-primary bg-primary/10 px-2 py-0.5 rounded">y = −1</code>
                </div>
              </div>
            </Step>

            <Step number={5}>
              <span className="text-muted-foreground">Atualize pesos e bias:</span>
              <div className="mt-1 space-y-1.5 text-xs">
                <div className="bg-secondary/50 rounded p-2">
                  <p className="text-foreground font-semibold mb-1">Se y ≠ d (erro):</p>
                  <code className="text-primary block">
                    wᵢ<sup>novo</sup> = wᵢ<sup>ant</sup> + η · d · xᵢ
                  </code>
                  <code className="text-primary block mt-0.5">
                    b<sup>novo</sup> = b<sup>ant</sup> + η · d
                  </code>
                </div>
                <div className="bg-secondary/30 rounded p-2">
                  <p className="text-foreground font-semibold mb-1">Caso contrário (acerto):</p>
                  <code className="text-muted-foreground block">
                    wᵢ<sup>novo</sup> = wᵢ<sup>ant</sup> &nbsp;(sem alteração)
                  </code>
                  <code className="text-muted-foreground block mt-0.5">
                    b<sup>novo</sup> = b<sup>ant</sup> &nbsp;(sem alteração)
                  </code>
                </div>
              </div>
            </Step>
          </div>

          <Step number={6}>
            <span className="text-muted-foreground">
              Teste a <strong className="text-foreground">condição de parada</strong>: convergência quando não há mais erros em toda a época, ou número máximo de épocas atingido.
            </span>
          </Step>
        </div>
      </div>
    </div>
  );
};

const Step = ({ number, children }: { number: number; children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <span className="shrink-0 w-6 h-6 rounded-md bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
      {number}
    </span>
    <div className="flex-1">{children}</div>
  </div>
);

export default AlgorithmSteps;
