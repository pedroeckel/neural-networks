import { Slider } from "@/components/ui/slider";

interface Props {
  inputs: number[];
  weights: number[];
  bias: number;
  theta: number;
  activationFn: string;
  onInputChange: (index: number, value: number) => void;
  onWeightChange: (index: number, value: number) => void;
  onBiasChange: (value: number) => void;
  onThetaChange: (value: number) => void;
  onActivationChange: (fn: string) => void;
}

const activationFunctions = [
  { id: "limiar", label: "Limiar" },
  { id: "step", label: "Step" },
  { id: "sigmoid", label: "Sigmoid" },
  { id: "tanh", label: "Tanh" },
  { id: "relu", label: "ReLU" },
  { id: "gaussian", label: "Gaussiana" },
];

const ControlPanel = ({
  inputs,
  weights,
  bias,
  theta,
  activationFn,
  onInputChange,
  onWeightChange,
  onBiasChange,
  onThetaChange,
  onActivationChange,
}: Props) => {
  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <h3 className="text-xs font-semibold text-node-input font-mono tracking-wider uppercase">
          Entradas
        </h3>
        {inputs.map((val, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">x{i + 1}</span>
              <span className="text-node-input font-semibold">{val.toFixed(1)}</span>
            </div>
            <Slider
              value={[val]}
              min={-2}
              max={2}
              step={0.1}
              onValueChange={([v]) => onInputChange(i, v)}
              className="[&_[role=slider]]:bg-node-input [&_[role=slider]]:border-node-input [&_.range]:bg-node-input"
            />
          </div>
        ))}
      </div>

      {/* Weights */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <h3 className="text-xs font-semibold text-primary font-mono tracking-wider uppercase">
          Pesos
        </h3>
        {weights.map((val, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">w{i + 1}</span>
              <span className="text-primary font-semibold">{val.toFixed(2)}</span>
            </div>
            <Slider
              value={[val]}
              min={-2}
              max={2}
              step={0.05}
              onValueChange={([v]) => onWeightChange(i, v)}
            />
          </div>
        ))}
      </div>

      {/* Bias */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="text-xs font-semibold text-node-bias font-mono tracking-wider uppercase">
          Bias
        </h3>
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">b</span>
            <span className="text-node-bias font-semibold">{bias.toFixed(2)}</span>
          </div>
          <Slider
            value={[bias]}
            min={-3}
            max={3}
            step={0.05}
            onValueChange={([v]) => onBiasChange(v)}
            className="[&_[role=slider]]:bg-node-bias [&_[role=slider]]:border-node-bias [&_.range]:bg-node-bias"
          />
        </div>
      </div>

      {/* Theta (Limiar) */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="text-xs font-semibold text-accent font-mono tracking-wider uppercase">
          Limiar (θ)
        </h3>
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">θ</span>
            <span className="text-accent font-semibold">{theta.toFixed(2)}</span>
          </div>
          <Slider
            value={[theta]}
            min={0}
            max={3}
            step={0.05}
            onValueChange={([v]) => onThetaChange(v)}
          />
        </div>
        <p className="text-[10px] text-muted-foreground font-mono">
          Usado na função Limiar: y=1 se y*&gt;θ, y=0 se −θ≤y*≤θ, y=−1 se y*&lt;−θ
        </p>
      </div>

      {/* Activation Function */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="text-xs font-semibold text-foreground font-mono tracking-wider uppercase">
          Função de Ativação
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {activationFunctions.map((fn) => (
            <button
              key={fn.id}
              onClick={() => onActivationChange(fn.id)}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all ${
                activationFn === fn.id
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {fn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
