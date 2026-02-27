import { useMemo, useState } from "react";
import { BrainCircuit } from "lucide-react";

type GateKey = "and" | "or" | "nand" | "nor" | "xor" | "xnor";

interface GateDefinition {
  key: GateKey;
  label: string;
  description: string;
  targets: number[];
}

interface IterationRow {
  iteration: number;
  epoch: number;
  sampleIndex: number;
  x1: number;
  x2: number;
  d: number;
  net: number;
  y: number;
  error: number;
  deltaW1: number;
  deltaW2: number;
  deltaB: number;
  w1: number;
  w2: number;
  b: number;
}

interface GateSimulationResult {
  converged: boolean;
  epochs: number;
  rows: IterationRow[];
  finalW1: number;
  finalW2: number;
  finalB: number;
}

interface Props {
  activationFn: string;
}

const LEARNING_RATE = 0.2;
const ALPHA = 1;
const THETA = 0;
const MAX_EPOCHS = 20;
const PATTERNS: Array<[number, number]> = [
  [1, 1],
  [1, 0],
  [0, 1],
  [0, 0],
];

const gateDefinitions: GateDefinition[] = [
  { key: "and", label: "E (AND)", description: "Saída +1 somente quando x1=1 e x2=1.", targets: [1, -1, -1, -1] },
  { key: "or", label: "OU (OR)", description: "Saída +1 quando pelo menos uma entrada é 1.", targets: [1, 1, 1, -1] },
  { key: "nand", label: "NAND", description: "Negação da AND.", targets: [-1, 1, 1, 1] },
  { key: "nor", label: "NOR", description: "Negação da OR.", targets: [-1, -1, -1, 1] },
  { key: "xor", label: "XOR", description: "Saída +1 quando entradas são diferentes.", targets: [-1, 1, 1, -1] },
  { key: "xnor", label: "XNOR", description: "Saída +1 quando entradas são iguais.", targets: [1, -1, -1, 1] },
];

const activationLabels: Record<string, string> = {
  limiar: "Limiar (θ)",
  step: "Step",
  sigmoid: "Sigmoid",
  tanh: "Tanh",
  relu: "ReLU",
  gaussian: "Gaussiana",
};

const format = (value: number, digits = 2) => value.toFixed(digits);

const activationForTraining = (net: number) => {
  if (net > THETA) return 1;
  if (net < -THETA) return -1;
  return 0;
};

const simulateGate = (gate: GateDefinition): GateSimulationResult => {
  let w1 = 0;
  let w2 = 0;
  let b = 0;
  let converged = false;
  let iteration = 0;
  const rows: IterationRow[] = [];
  let completedEpochs = MAX_EPOCHS;

  for (let epoch = 1; epoch <= MAX_EPOCHS; epoch++) {
    let epochErrors = 0;
    for (let sampleIndex = 0; sampleIndex < PATTERNS.length; sampleIndex++) {
      iteration += 1;
      const [x1, x2] = PATTERNS[sampleIndex];
      const d = gate.targets[sampleIndex];
      const net = x1 * w1 + x2 * w2 + b;
      const y = activationForTraining(net);
      const error = d - y;
      const deltaW1 = LEARNING_RATE * error * x1;
      const deltaW2 = LEARNING_RATE * error * x2;
      const deltaB = LEARNING_RATE * error;

      w1 += deltaW1;
      w2 += deltaW2;
      b += deltaB;

      if (error !== 0) epochErrors += 1;

      rows.push({
        iteration,
        epoch,
        sampleIndex: sampleIndex + 1,
        x1,
        x2,
        d,
        net,
        y,
        error,
        deltaW1,
        deltaW2,
        deltaB,
        w1,
        w2,
        b,
      });
    }

    if (epochErrors === 0) {
      converged = true;
      completedEpochs = epoch;
      break;
    }
  }

  return { converged, epochs: completedEpochs, rows, finalW1: w1, finalW2: w2, finalB: b };
};

const getIterationInterpretation = (row: IterationRow) => {
  if (row.error === 0) return "Como y = d, não há erro. Pesos e bias permanecem iguais.";
  if (row.error > 0) return "A saída ficou abaixo do desejado. A atualização aumenta a resposta da rede.";
  return "A saída ficou acima do desejado. A atualização reduz a resposta da rede.";
};

const formatBoundaryEquation = (w1: number, w2: number, b: number) => {
  if (Math.abs(w1) < 1e-9 && Math.abs(w2) < 1e-9) return "fronteira indefinida (w1 = w2 = 0)";
  return `${format(w1, 2)}·x1 + ${format(w2, 2)}·x2 + ${format(b, 2)} = 0`;
};

const CHART_MIN = -0.2;
const CHART_MAX = 1.2;
const CHART_SIZE = 220;
const CHART_PADDING = 24;

const getBoundarySegment = (w1: number, w2: number, b: number) => {
  if (Math.abs(w1) < 1e-9 && Math.abs(w2) < 1e-9) return null;
  const points: Array<{ x: number; y: number }> = [];
  const pushPoint = (x: number, y: number) => {
    if (x < CHART_MIN - 1e-9 || x > CHART_MAX + 1e-9) return;
    if (y < CHART_MIN - 1e-9 || y > CHART_MAX + 1e-9) return;
    if (!points.some((p) => Math.abs(p.x - x) < 1e-6 && Math.abs(p.y - y) < 1e-6)) points.push({ x, y });
  };
  if (Math.abs(w2) > 1e-9) {
    pushPoint(CHART_MIN, -(w1 * CHART_MIN + b) / w2);
    pushPoint(CHART_MAX, -(w1 * CHART_MAX + b) / w2);
  }
  if (Math.abs(w1) > 1e-9) {
    pushPoint(-(w2 * CHART_MIN + b) / w1, CHART_MIN);
    pushPoint(-(w2 * CHART_MAX + b) / w1, CHART_MAX);
  }
  if (points.length < 2) return null;
  return [points[0], points[1]] as const;
};

const toChartX = (x: number) => CHART_PADDING + ((x - CHART_MIN) / (CHART_MAX - CHART_MIN)) * CHART_SIZE;
const toChartY = (y: number) => CHART_PADDING + ((CHART_MAX - y) / (CHART_MAX - CHART_MIN)) * CHART_SIZE;

interface IterationBoundaryChartProps {
  title: string;
  w1: number;
  w2: number;
  b: number;
  targets: number[];
  activeSampleIndex: number;
}

const IterationBoundaryChart = ({ title, w1, w2, b, targets, activeSampleIndex }: IterationBoundaryChartProps) => {
  const segment = getBoundarySegment(w1, w2, b);
  const svgSize = CHART_SIZE + CHART_PADDING * 2;
  return (
    <div className="rounded-md border border-border bg-card p-3 space-y-2">
      <p className="text-xs font-semibold text-foreground">{title}</p>
      <p className="text-[11px] text-muted-foreground font-mono break-words">{formatBoundaryEquation(w1, w2, b)}</p>
      <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full max-w-[320px] mx-auto">
        <rect x={CHART_PADDING} y={CHART_PADDING} width={CHART_SIZE} height={CHART_SIZE} rx={6} fill="hsl(220, 18%, 10%)" stroke="hsl(220, 15%, 25%)" />
        {[0, 1].map((tick) => (
          <g key={`grid-${tick}`}>
            <line x1={toChartX(tick)} y1={CHART_PADDING} x2={toChartX(tick)} y2={CHART_PADDING + CHART_SIZE} stroke="hsl(220, 15%, 20%)" strokeWidth={1} />
            <line x1={CHART_PADDING} y1={toChartY(tick)} x2={CHART_PADDING + CHART_SIZE} y2={toChartY(tick)} stroke="hsl(220, 15%, 20%)" strokeWidth={1} />
          </g>
        ))}
        <line x1={toChartX(0)} y1={CHART_PADDING} x2={toChartX(0)} y2={CHART_PADDING + CHART_SIZE} stroke="hsl(220, 15%, 35%)" strokeWidth={1.2} />
        <line x1={CHART_PADDING} y1={toChartY(0)} x2={CHART_PADDING + CHART_SIZE} y2={toChartY(0)} stroke="hsl(220, 15%, 35%)" strokeWidth={1.2} />
        {segment && (
          <line x1={toChartX(segment[0].x)} y1={toChartY(segment[0].y)} x2={toChartX(segment[1].x)} y2={toChartY(segment[1].y)} stroke="hsl(187, 80%, 55%)" strokeWidth={2.2} />
        )}
        {PATTERNS.map(([px1, px2], index) => {
          const target = targets[index];
          const isActive = activeSampleIndex === index + 1;
          const color = target === 1 ? "hsl(214, 86%, 66%)" : "hsl(0, 85%, 65%)";
          return (
            <g key={`point-${index}`}>
              {isActive && <circle cx={toChartX(px1)} cy={toChartY(px2)} r={10} fill="transparent" stroke="hsl(52, 100%, 60%)" strokeWidth={2} />}
              <circle cx={toChartX(px1)} cy={toChartY(px2)} r={6} fill={color} stroke="white" strokeWidth={1.2} />
              <text x={toChartX(px1) + 10} y={toChartY(px2) - 8} fill={color} fontSize="10" fontFamily="JetBrains Mono, monospace">{target}</text>
            </g>
          );
        })}
      </svg>
      {!segment && <p className="text-[11px] text-muted-foreground">Sem fronteira definida neste passo.</p>}
    </div>
  );
};

const IterationPracticeSection = ({ activationFn }: Props) => {
  const [selectedGate, setSelectedGate] = useState<GateKey>("and");
  const [selectedEpochByGate, setSelectedEpochByGate] = useState<Record<GateKey, number>>({
    and: 1, or: 1, nand: 1, nor: 1, xor: 1, xnor: 1,
  });
  const [selectedSampleByGate, setSelectedSampleByGate] = useState<Record<GateKey, number>>({
    and: 1, or: 1, nand: 1, nor: 1, xor: 1, xnor: 1,
  });

  const gateResults = useMemo(() => {
    const map = new Map<GateKey, { gate: GateDefinition; result: GateSimulationResult }>();
    gateDefinitions.forEach((gate) => map.set(gate.key, { gate, result: simulateGate(gate) }));
    return map;
  }, []);

  const selectedGateData = gateResults.get(selectedGate)!;
  const availableEpochs = Array.from(new Set(selectedGateData.result.rows.map((row) => row.epoch)));
  const selectedEpoch = Math.min(selectedEpochByGate[selectedGate], availableEpochs[availableEpochs.length - 1]);
  const epochRows = selectedGateData.result.rows.filter((row) => row.epoch === selectedEpoch);
  const selectedSample = Math.min(selectedSampleByGate[selectedGate], epochRows.length || 1);
  const selectedIteration = epochRows.find((row) => row.sampleIndex === selectedSample) ?? epochRows[0];
  const epochErrors = epochRows.filter((row) => row.error !== 0).length;
  const epochHits = epochRows.length - epochErrors;
  const epochConverged = epochErrors === 0;
  const epochStartIteration = epochRows[0]?.iteration ?? 0;
  const epochEndIteration = epochRows[epochRows.length - 1]?.iteration ?? 0;
  const currentActivationLabel = activationLabels[activationFn] || activationFn;

  const previousW1 = selectedIteration.w1 - selectedIteration.deltaW1;
  const previousW2 = selectedIteration.w2 - selectedIteration.deltaW2;
  const previousB = selectedIteration.b - selectedIteration.deltaB;

  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-primary glow-text font-mono tracking-wider uppercase">
            Prática por Iteração
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">Treino didático do Perceptron com portas lógicas bipolares.</p>
      </div>

      <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-4 space-y-2">
        <p className="text-sm font-semibold text-sky-200">
          Função de ativação
        </p>
        <p className="text-xs text-sky-100/90">
          Nesta seção, a prática por iteração continua usando a regra clássica de treino do Perceptron, com saída bipolar e comparação em θ=0.
        </p>
        <p className="text-xs text-sky-100/90">
          Isso foi mantido de propósito para facilitar o aprendizado: primeiro você entende como o Perceptron atualiza pesos e bias passo a passo; depois compara esse comportamento com outras funções de ativação nas demais áreas da página.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {gateDefinitions.map((gate, index) => (
          <button
            key={gate.key}
            onClick={() => {
              setSelectedGate(gate.key);
              setSelectedEpochByGate((prev) => ({ ...prev, [gate.key]: 1 }));
              setSelectedSampleByGate((prev) => ({ ...prev, [gate.key]: 1 }));
            }}
            className={`px-3 py-2 rounded-md text-xs font-mono font-semibold transition-colors text-left ${
              selectedGate === gate.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {index + 1}. {gate.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">
          Exercício: Classificação da função lógica {selectedGateData.gate.label}
        </h4>
        <p className="text-xs text-muted-foreground">{selectedGateData.gate.description}</p>
        <p className="text-xs text-muted-foreground">
          Valores iniciais: δ = {String(LEARNING_RATE).replace(".", ",")} | α = {ALPHA} | θ = {THETA} | w1 = 0 | w2 = 0 | b = 0
        </p>

        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-xs font-mono">
            <thead className="bg-secondary/60">
              <tr>
                <th className="px-3 py-2 text-left">x1</th>
                <th className="px-3 py-2 text-left">x2</th>
                <th className="px-3 py-2 text-left">d</th>
              </tr>
            </thead>
            <tbody>
              {PATTERNS.map(([px1, px2], i) => (
                <tr key={`${px1}-${px2}-${i}`} className="border-t border-border/60">
                  <td className="px-3 py-2">{px1}</td>
                  <td className="px-3 py-2">{px2}</td>
                  <td className="px-3 py-2">{selectedGateData.gate.targets[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-md border border-border bg-card px-3 py-2 text-xs font-mono">
          {selectedGateData.result.converged ? (
            <p className="text-emerald-300">
              Convergiu em {selectedGateData.result.epochs} época(s). Resultado final: w1={format(selectedGateData.result.finalW1)}, w2={format(selectedGateData.result.finalW2)}, b={format(selectedGateData.result.finalB)}.
            </p>
          ) : (
            <p className="text-amber-300">
              Não convergiu em {MAX_EPOCHS} épocas (esperado para portas não linearmente separáveis, como XOR/XNOR).
            </p>
          )}
        </div>

        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 space-y-3">
          <h5 className="text-sm font-semibold text-emerald-300">Resolução Didática</h5>
          <p className="text-xs text-emerald-100/90">Acompanhe o treinamento em duas etapas: escolha a época e depois a amostra.</p>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-emerald-200">1) Escolha a época</p>
            <div className="flex flex-wrap gap-2">
              {availableEpochs.map((epoch) => {
                const isActive = selectedEpoch === epoch;
                return (
                  <button
                    key={`${selectedGate}-epoch-${epoch}`}
                    onClick={() => {
                      setSelectedEpochByGate((prev) => ({ ...prev, [selectedGate]: epoch }));
                      setSelectedSampleByGate((prev) => ({ ...prev, [selectedGate]: 1 }));
                    }}
                    className={`min-w-9 px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {epoch}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-emerald-200">2) Escolha a amostra da época {selectedEpoch}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {epochRows.map((row) => {
                const isActive = selectedIteration.iteration === row.iteration;
                return (
                  <button
                    key={`${selectedGate}-sample-${row.iteration}`}
                    onClick={() => setSelectedSampleByGate((prev) => ({ ...prev, [selectedGate]: row.sampleIndex }))}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors text-left ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    A{row.sampleIndex}: ({row.x1},{row.x2}) d={row.d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-3 space-y-3">
            <h6 className="text-xs font-semibold text-foreground">Resumo da época {selectedEpoch}</h6>
            <p className="text-xs text-muted-foreground">
              Uma época representa a passagem completa por todas as amostras do conjunto de treino.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
              <div className="rounded-md border border-border bg-secondary/30 px-2.5 py-2">
                <p className="text-muted-foreground">Amostras</p>
                <p className="text-foreground font-semibold">{epochRows.length}</p>
              </div>
              <div className="rounded-md border border-border bg-secondary/30 px-2.5 py-2">
                <p className="text-muted-foreground">Acertos</p>
                <p className="text-emerald-300 font-semibold">{epochHits}</p>
              </div>
              <div className="rounded-md border border-border bg-secondary/30 px-2.5 py-2">
                <p className="text-muted-foreground">Erros</p>
                <p className="text-amber-300 font-semibold">{epochErrors}</p>
              </div>
              <div className="rounded-md border border-border bg-secondary/30 px-2.5 py-2">
                <p className="text-muted-foreground">Iterações</p>
                <p className="text-foreground font-semibold">
                  {epochStartIteration}-{epochEndIteration}
                </p>
              </div>
            </div>
            <p className={`text-xs ${epochConverged ? "text-emerald-300" : "text-amber-300"}`}>
              {epochConverged
                ? "Sem erros nesta época: o Perceptron já estabilizou para esse conjunto."
                : "Ainda houve erros nesta época: o Perceptron segue ajustando pesos e bias."}
            </p>
          </div>

          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-[11px] sm:text-xs font-mono">
              <thead className="bg-secondary/60">
                <tr>
                  <th className="px-2 py-2 text-left">Amostra</th>
                  <th className="px-2 py-2 text-left">Padrão</th>
                  <th className="px-2 py-2 text-left">d</th>
                  <th className="px-2 py-2 text-left">y*</th>
                  <th className="px-2 py-2 text-left">y</th>
                  <th className="px-2 py-2 text-left">e</th>
                  <th className="hidden sm:table-cell px-2 py-2 text-left">w1</th>
                  <th className="hidden sm:table-cell px-2 py-2 text-left">w2</th>
                  <th className="hidden sm:table-cell px-2 py-2 text-left">b</th>
                </tr>
              </thead>
              <tbody>
                {epochRows.map((row) => (
                  <tr key={`${selectedGate}-epoch-row-${row.iteration}`} className={`border-t border-border/60 ${row.iteration === selectedIteration.iteration ? "bg-primary/10" : ""}`}>
                    <td className="px-2 py-1.5">{row.sampleIndex}</td>
                    <td className="px-2 py-1.5">({row.x1}, {row.x2})</td>
                    <td className="px-2 py-1.5">{row.d}</td>
                    <td className="px-2 py-1.5">{format(row.net, 2)}</td>
                    <td className="px-2 py-1.5">{row.y}</td>
                    <td className="px-2 py-1.5">{row.error}</td>
                    <td className="hidden sm:table-cell px-2 py-1.5">{format(row.w1, 2)}</td>
                    <td className="hidden sm:table-cell px-2 py-1.5">{format(row.w2, 2)}</td>
                    <td className="hidden sm:table-cell px-2 py-1.5">{format(row.b, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-md border border-border bg-card p-3 space-y-3 text-[11px] sm:text-xs font-mono break-words">
            <p className="text-primary font-semibold">
              Época {selectedIteration.epoch}, amostra {selectedIteration.sampleIndex} (iteração {selectedIteration.iteration})
            </p>
            <p>Padrão apresentado: (x1, x2) = ({selectedIteration.x1}, {selectedIteration.x2}) com d = {selectedIteration.d}</p>
            <p>Pesos anteriores: w1={format(previousW1, 2)}, w2={format(previousW2, 2)}, b={format(previousB, 2)}</p>

            <div className="rounded-md border border-border bg-secondary/30 p-2 space-y-1">
              <p>y* = x1·w1 + x2·w2 + b</p>
              <p>y* = ({selectedIteration.x1}·{format(previousW1, 2)}) + ({selectedIteration.x2}·{format(previousW2, 2)}) + {format(previousB, 2)} = {format(selectedIteration.net, 2)}</p>
              <p>Ativação (θ=0): y = {selectedIteration.y > 0 ? "1" : selectedIteration.y < 0 ? "-1" : "0"}</p>
              <p>Erro: e = d - y = {selectedIteration.d} - ({selectedIteration.y}) = {selectedIteration.error}</p>
            </div>

            <div className="rounded-md border border-border bg-secondary/30 p-2 space-y-1">
              <p>Δw1 = δ·e·x1 = {String(LEARNING_RATE).replace(".", ",")}·({selectedIteration.error})·({selectedIteration.x1}) = {format(selectedIteration.deltaW1, 2)}</p>
              <p>Δw2 = δ·e·x2 = {String(LEARNING_RATE).replace(".", ",")}·({selectedIteration.error})·({selectedIteration.x2}) = {format(selectedIteration.deltaW2, 2)}</p>
              <p>Δb = δ·e = {String(LEARNING_RATE).replace(".", ",")}·({selectedIteration.error}) = {format(selectedIteration.deltaB, 2)}</p>
            </div>

            <div className="rounded-md border border-border bg-secondary/30 p-2 space-y-1">
              <p>w1(novo) = w1(ant) + Δw1 = {format(previousW1, 2)} + ({format(selectedIteration.deltaW1, 2)}) = {format(selectedIteration.w1, 2)}</p>
              <p>w2(novo) = w2(ant) + Δw2 = {format(previousW2, 2)} + ({format(selectedIteration.deltaW2, 2)}) = {format(selectedIteration.w2, 2)}</p>
              <p>b(novo) = b(ant) + Δb = {format(previousB, 2)} + ({format(selectedIteration.deltaB, 2)}) = {format(selectedIteration.b, 2)}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <IterationBoundaryChart
                title="Fronteira antes da atualização"
                w1={previousW1}
                w2={previousW2}
                b={previousB}
                targets={selectedGateData.gate.targets}
                activeSampleIndex={selectedIteration.sampleIndex}
              />
              <IterationBoundaryChart
                title="Fronteira depois da atualização"
                w1={selectedIteration.w1}
                w2={selectedIteration.w2}
                b={selectedIteration.b}
                targets={selectedGateData.gate.targets}
                activeSampleIndex={selectedIteration.sampleIndex}
              />
            </div>

            <div className="rounded-md border border-border bg-secondary/30 p-2 space-y-1">
              <p>Fronteira antes: {formatBoundaryEquation(previousW1, previousW2, previousB)}</p>
              <p>Fronteira depois: {formatBoundaryEquation(selectedIteration.w1, selectedIteration.w2, selectedIteration.b)}</p>
              <p className="text-muted-foreground">{getIterationInterpretation(selectedIteration)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IterationPracticeSection;
