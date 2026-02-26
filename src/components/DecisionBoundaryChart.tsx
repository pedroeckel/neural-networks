import { useState, useMemo, useCallback, useRef } from "react";
import { Trash2 } from "lucide-react";

interface Props {
  weights: number[];
  bias: number;
  theta: number;
  activationFn: string;
}

const GRID_SIZE = 300;
const PADDING = 40;
const RANGE = 2;
const EPSILON = 0.001;
const GAUSSIAN_Z_CUTOFF = Math.sqrt(Math.log(2)); // exp(-z^2) >= 0.5

interface DataPoint {
  x1: number;
  x2: number;
}

const defaultPoints: DataPoint[] = [
  { x1: 1.0, x2: 1.5 },
  { x1: 0.5, x2: 1.0 },
  { x1: 1.5, x2: 0.5 },
  { x1: -0.5, x2: -1.0 },
  { x1: -1.0, x2: -0.5 },
  { x1: -1.5, x2: -1.5 },
  { x1: 0.3, x2: -0.8 },
  { x1: -0.8, x2: 0.5 },
  { x1: 1.2, x2: -0.3 },
  { x1: -0.2, x2: 1.2 },
  { x1: 0.8, x2: 0.8 },
  { x1: -1.2, x2: 0.2 },
];

const makeActivationFns = (theta: number): Record<string, (x: number) => number> => ({
  limiar: (x) => (x > theta ? 1 : x < -theta ? -1 : 0),
  step: (x) => (x >= 0 ? 1 : 0),
  sigmoid: (x) => 1 / (1 + Math.exp(-x)),
  tanh: (x) => Math.tanh(x),
  relu: (x) => Math.max(0, x),
  gaussian: (x) => Math.exp(-(x * x)),
});

const toSvg = (val: number) =>
  PADDING + ((val + RANGE) / (2 * RANGE)) * GRID_SIZE;

const fromSvg = (px: number) =>
  ((px - PADDING) / GRID_SIZE) * (2 * RANGE) - RANGE;

const DecisionBoundaryChart = ({ weights, bias, theta, activationFn }: Props) => {
  const [points, setPoints] = useState<DataPoint[]>(defaultPoints);
  const svgRef = useRef<SVGSVGElement>(null);
  const fns = useMemo(() => makeActivationFns(theta), [theta]);
  const fn = fns[activationFn];

  const classifiedPoints = useMemo(
    () =>
      points.map((p) => {
        const z = p.x1 * weights[0] + p.x2 * weights[1] + bias;
        const output = fn(z);
        const cls = activationFn === "sigmoid" || activationFn === "gaussian"
          ? (output >= 0.5 ? 1 : 0)
          : activationFn === "tanh"
          ? (output >= 0 ? 1 : 0)
          : output > 0 ? 1 : 0;
        return { ...p, output, cls };
      }),
    [points, weights, bias, activationFn, fn]
  );

  const boundaryLevels = useMemo(() => {
    if (activationFn === "limiar") return [theta];
    if (activationFn === "gaussian") return [-GAUSSIAN_Z_CUTOFF, GAUSSIAN_Z_CUTOFF];
    return [0];
  }, [activationFn, theta]);

  const boundaryLines = useMemo(() => {
    const [w1, w2] = weights;
    if (Math.abs(w2) < EPSILON && Math.abs(w1) < EPSILON) return [];

    return boundaryLevels.map((level) => {
      const adjustedBias = bias - level;
      if (Math.abs(w2) >= EPSILON) {
        const x1Start = -RANGE;
        const x1End = RANGE;
        return [
          { x: x1Start, y: -(w1 * x1Start + adjustedBias) / w2 },
          { x: x1End, y: -(w1 * x1End + adjustedBias) / w2 },
        ];
      }
      const x1 = -adjustedBias / w1;
      return [{ x: x1, y: -RANGE }, { x: x1, y: RANGE }];
    });
  }, [weights, bias, boundaryLevels]);

  const boundaryHint = useMemo(() => {
    if (activationFn === "limiar") {
      return `Regra atual: classe 1 quando y* > θ. Fronteira exibida: y* = θ (${theta.toFixed(2)}).`;
    }
    if (activationFn === "gaussian") {
      return `Regra atual: classe 1 quando saída ≥ 0.5, equivalente a |y*| ≤ ${GAUSSIAN_Z_CUTOFF.toFixed(2)}.`;
    }
    return "Regra atual: classe 1 separada por y* = 0.";
  }, [activationFn, theta]);

  const handleSvgClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scaleX = (GRID_SIZE + PADDING * 2) / rect.width;
      const scaleY = (GRID_SIZE + PADDING * 2) / rect.height;
      const svgX = (e.clientX - rect.left) * scaleX;
      const svgY = (e.clientY - rect.top) * scaleY;

      // Check if inside the chart area
      if (svgX < PADDING || svgX > PADDING + GRID_SIZE || svgY < PADDING || svgY > PADDING + GRID_SIZE) return;

      const x1 = fromSvg(svgX);
      const x2 = -fromSvg(svgY); // Y is inverted

      // Check if clicking near an existing point to remove it
      const hitIndex = points.findIndex((p) => {
        const dx = toSvg(p.x1) - svgX;
        const dy = toSvg(-p.x2) - svgY;
        return Math.sqrt(dx * dx + dy * dy) < 12;
      });

      if (hitIndex >= 0) {
        setPoints((prev) => prev.filter((_, i) => i !== hitIndex));
      } else {
        // Round to 1 decimal
        setPoints((prev) => [...prev, { x1: Math.round(x1 * 10) / 10, x2: Math.round(x2 * 10) / 10 }]);
      }
    },
    [points]
  );

  const clearPoints = () => setPoints([]);
  const resetPoints = () => setPoints(defaultPoints);

  const svgWidth = GRID_SIZE + PADDING * 2;
  const svgHeight = GRID_SIZE + PADDING * 2;
  const ticks = [-2, -1, 0, 1, 2];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-foreground font-mono tracking-wider uppercase">
          Fronteira de Decisão
        </h3>
        <div className="flex gap-2">
          <button
            onClick={resetPoints}
            className="px-3 py-1 rounded-md text-[10px] font-mono font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            Resetar
          </button>
          <button
            onClick={clearPoints}
            className="px-3 py-1 rounded-md text-[10px] font-mono font-semibold bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Limpar
          </button>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground font-mono mb-3">
        Clique para adicionar pontos · Clique em um ponto para removê-lo
      </p>
      <p className="text-[10px] text-muted-foreground font-mono mb-3">
        {boundaryHint}
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full cursor-crosshair"
        style={{ maxHeight: "360px" }}
        onClick={handleSvgClick}
      >
        {/* Background */}
        <rect x={PADDING} y={PADDING} width={GRID_SIZE} height={GRID_SIZE} fill="hsl(220, 18%, 8%)" rx={4} />

        {/* Grid lines */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={toSvg(t)} y1={PADDING} x2={toSvg(t)} y2={PADDING + GRID_SIZE} stroke="hsl(220, 15%, 15%)" strokeWidth={t === 0 ? 1.5 : 0.5} />
            <line x1={PADDING} y1={toSvg(t)} x2={PADDING + GRID_SIZE} y2={toSvg(t)} stroke="hsl(220, 15%, 15%)" strokeWidth={t === 0 ? 1.5 : 0.5} />
            <text x={toSvg(t)} y={PADDING + GRID_SIZE + 14} textAnchor="middle" fill="hsl(215, 15%, 40%)" fontSize="9" fontFamily="JetBrains Mono">{t}</text>
            <text x={PADDING - 8} y={toSvg(-t) + 3} textAnchor="end" fill="hsl(215, 15%, 40%)" fontSize="9" fontFamily="JetBrains Mono">{t}</text>
          </g>
        ))}

        {boundaryLines.length > 0 && (
          <defs>
            <clipPath id="chart-clip">
              <rect x={PADDING} y={PADDING} width={GRID_SIZE} height={GRID_SIZE} />
            </clipPath>
          </defs>
        )}

        {boundaryLines.map((line, i) => (
          <line
            key={`boundary-${i}`}
            x1={toSvg(line[0].x)} y1={toSvg(-line[0].y)}
            x2={toSvg(line[1].x)} y2={toSvg(-line[1].y)}
            stroke="hsl(187, 80%, 50%)"
            strokeWidth={2.5}
            strokeDasharray={i % 2 === 0 ? "8 4" : "3 4"}
            clipPath="url(#chart-clip)"
            opacity={0.9}
          />
        ))}

        {/* Data points */}
        {classifiedPoints.map((p, i) => (
          <g key={i} className="cursor-pointer">
            {/* Hover hitbox */}
            <circle cx={toSvg(p.x1)} cy={toSvg(-p.x2)} r={12} fill="transparent" />
            <circle
              cx={toSvg(p.x1)} cy={toSvg(-p.x2)} r={7}
              fill={p.cls === 1 ? "hsl(150, 70%, 45%)" : "hsl(0, 70%, 50%)"}
              fillOpacity={0.85}
              stroke={p.cls === 1 ? "hsl(150, 70%, 65%)" : "hsl(0, 70%, 70%)"}
              strokeWidth={1.5}
            />
            <text x={toSvg(p.x1)} y={toSvg(-p.x2) + 3.5} textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="JetBrains Mono">
              {p.cls}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text x={PADDING + GRID_SIZE / 2} y={svgHeight - 4} textAnchor="middle" fill="hsl(45, 90%, 55%)" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">x₁</text>
        <text x={10} y={PADDING + GRID_SIZE / 2} textAnchor="middle" fill="hsl(45, 90%, 55%)" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600" transform={`rotate(-90, 10, ${PADDING + GRID_SIZE / 2})`}>x₂</text>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(150, 70%, 45%)" }} />
          <span className="text-xs font-mono text-muted-foreground">Classe 1 (ativo)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(0, 70%, 50%)" }} />
          <span className="text-xs font-mono text-muted-foreground">Classe 0 (inativo)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 rounded" style={{ backgroundColor: "hsl(187, 80%, 50%)" }} />
          <span className="text-xs font-mono text-muted-foreground">
            {boundaryLines.length > 1 ? "Fronteiras" : "Fronteira"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DecisionBoundaryChart;
