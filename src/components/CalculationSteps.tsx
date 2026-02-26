interface Props {
  inputs: number[];
  weights: number[];
  bias: number;
  theta: number;
  weightedSum: number;
  output: number;
  activationFn: string;
}

const activationLabels: Record<string, string> = {
  limiar: "Limiar (θ)",
  step: "Step",
  sigmoid: "Sigmoid",
  tanh: "Tanh",
  relu: "ReLU",
  gaussian: "Gaussiana",
};

const CalculationSteps = ({ inputs, weights, bias, theta, weightedSum, output, activationFn }: Props) => {
  const terms = inputs.map((x, i) => `(${x.toFixed(1)} × ${weights[i].toFixed(2)})`).join(" + ");
  const products = inputs.map((x, i) => (x * weights[i]).toFixed(2)).join(" + ");

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <h3 className="text-sm font-semibold text-primary glow-text font-mono tracking-wider uppercase">
        Cálculo Passo a Passo
      </h3>

      <div className="space-y-2 font-mono text-sm">
        <div className="flex items-start gap-3">
          <span className="text-muted-foreground text-xs mt-0.5 w-4 shrink-0">1.</span>
          <div>
            <span className="text-muted-foreground">Multiplicação: </span>
            <span className="text-foreground">{terms}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-muted-foreground text-xs mt-0.5 w-4 shrink-0">2.</span>
          <div>
            <span className="text-muted-foreground">Soma ponderada: </span>
            <span className="text-foreground">{products} + ({bias.toFixed(2)})</span>
            <span className="text-primary font-bold"> = {weightedSum.toFixed(4)}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-muted-foreground text-xs mt-0.5 w-4 shrink-0">3.</span>
          <div>
            <span className="text-muted-foreground">Função de ativação ({activationLabels[activationFn] || activationFn}): </span>
            <span className="text-node-output font-bold text-base">{output.toFixed(4)}</span>
            {activationFn === "limiar" && (
              <span className="text-muted-foreground text-xs block mt-1">
                θ = {theta.toFixed(2)} → y* {weightedSum > theta ? `> θ → y = 1` : weightedSum < -theta ? `< -θ → y = -1` : `∈ [-θ, θ] → y = 0`}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground font-mono">
          y = f(Σ(xᵢ·wᵢ) + b) = f({weightedSum.toFixed(4)}) = <span className="text-node-output font-bold">{output.toFixed(4)}</span>
        </p>
      </div>
    </div>
  );
};

export default CalculationSteps;
