import { useMemo } from "react";

interface Props {
  inputs: number[];
  weights: number[];
  bias: number;
  weightedSum: number;
  output: number;
  activationFn: string;
}

const PerceptronVisualization = ({ inputs, weights, bias, weightedSum, output, activationFn }: Props) => {
  const nodePositions = useMemo(() => {
    const inputNodes = Array.from({ length: inputs.length }, (_, i) => ({
      x: 80,
      y: 120 + i * 140,
      label: `x${i + 1}`,
    }));
    const sumNode = { x: 380, y: 190 };
    const activationNode = { x: 540, y: 190 };
    const outputNode = { x: 700, y: 190 };
    const biasNode = { x: 240, y: 40 };
    return { inputNodes, sumNode, activationNode, outputNode, biasNode };
  }, [inputs.length]);

  const { inputNodes, sumNode, activationNode, outputNode, biasNode } = nodePositions;

  const getWeightColor = (w: number) => {
    const intensity = Math.min(Math.abs(w), 2) / 2;
    if (w >= 0) return `hsl(187, 80%, ${30 + intensity * 30}%)`;
    return `hsl(0, 70%, ${35 + intensity * 25}%)`;
  };

  const getWeightWidth = (w: number) => {
    return 1.5 + Math.min(Math.abs(w), 2) * 2;
  };

  return (
    <svg viewBox="0 0 780 380" className="w-full h-full" style={{ maxHeight: "400px" }}>
      <defs>
        <filter id="glow-cyan">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-yellow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-green">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="hsl(215, 15%, 35%)" />
        </marker>
      </defs>

      {/* Connection lines: inputs to sum */}
      {inputNodes.map((node, i) => (
        <g key={`conn-${i}`}>
          <line
            x1={node.x + 28}
            y1={node.y}
            x2={sumNode.x - 28}
            y2={sumNode.y}
            stroke={getWeightColor(weights[i])}
            strokeWidth={getWeightWidth(weights[i])}
            strokeOpacity={0.7}
            markerEnd="url(#arrowhead)"
          />
          {/* Weight label */}
          <rect
            x={(node.x + sumNode.x) / 2 - 28}
            y={(node.y + sumNode.y) / 2 - 14}
            width={56}
            height={22}
            rx={6}
            fill="hsl(220, 18%, 12%)"
            stroke={getWeightColor(weights[i])}
            strokeWidth={1}
          />
          <text
            x={(node.x + sumNode.x) / 2}
            y={(node.y + sumNode.y) / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={getWeightColor(weights[i])}
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            w{i + 1}={weights[i].toFixed(2)}
          </text>
        </g>
      ))}

      {/* Bias connection */}
      <line
        x1={biasNode.x}
        y1={biasNode.y + 24}
        x2={sumNode.x}
        y2={sumNode.y - 28}
        stroke="hsl(280, 60%, 55%)"
        strokeWidth={2}
        strokeDasharray="6 3"
        strokeOpacity={0.7}
      />

      {/* Sum to activation */}
      <line
        x1={sumNode.x + 28}
        y1={sumNode.y}
        x2={activationNode.x - 28}
        y2={activationNode.y}
        stroke="hsl(215, 15%, 35%)"
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
      />

      {/* Activation to output */}
      <line
        x1={activationNode.x + 28}
        y1={activationNode.y}
        x2={outputNode.x - 28}
        y2={outputNode.y}
        stroke="hsl(215, 15%, 35%)"
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
      />

      {/* Input nodes */}
      {inputNodes.map((node, i) => (
        <g key={`input-${i}`} filter="url(#glow-yellow)">
          <circle cx={node.x} cy={node.y} r={26} fill="hsl(220, 18%, 10%)" stroke="hsl(45, 90%, 55%)" strokeWidth={2} />
          <text x={node.x} y={node.y - 6} textAnchor="middle" dominantBaseline="middle" fill="hsl(45, 90%, 55%)" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            {node.label}
          </text>
          <text x={node.x} y={node.y + 10} textAnchor="middle" dominantBaseline="middle" fill="hsl(45, 90%, 75%)" fontSize="13" fontFamily="JetBrains Mono" fontWeight="700">
            {inputs[i].toFixed(1)}
          </text>
        </g>
      ))}

      {/* Bias node */}
      <g filter="url(#glow-cyan)">
        <circle cx={biasNode.x} cy={biasNode.y} r={22} fill="hsl(220, 18%, 10%)" stroke="hsl(280, 60%, 60%)" strokeWidth={2} />
        <text x={biasNode.x} y={biasNode.y - 5} textAnchor="middle" dominantBaseline="middle" fill="hsl(280, 60%, 70%)" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
          bias
        </text>
        <text x={biasNode.x} y={biasNode.y + 9} textAnchor="middle" dominantBaseline="middle" fill="hsl(280, 60%, 80%)" fontSize="12" fontFamily="JetBrains Mono" fontWeight="700">
          {bias.toFixed(2)}
        </text>
      </g>

      {/* Sum node (Σ) */}
      <g filter="url(#glow-cyan)">
        <circle cx={sumNode.x} cy={sumNode.y} r={28} fill="hsl(220, 18%, 10%)" stroke="hsl(187, 80%, 45%)" strokeWidth={2} />
        <text x={sumNode.x} y={sumNode.y - 6} textAnchor="middle" dominantBaseline="middle" fill="hsl(187, 80%, 60%)" fontSize="18" fontWeight="700">
          Σ
        </text>
        <text x={sumNode.x} y={sumNode.y + 12} textAnchor="middle" dominantBaseline="middle" fill="hsl(187, 80%, 70%)" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
          {weightedSum.toFixed(2)}
        </text>
      </g>

      {/* Activation node */}
      <g filter="url(#glow-cyan)">
        <circle cx={activationNode.x} cy={activationNode.y} r={28} fill="hsl(220, 18%, 10%)" stroke="hsl(187, 80%, 45%)" strokeWidth={2} />
        <text x={activationNode.x} y={activationNode.y - 6} textAnchor="middle" dominantBaseline="middle" fill="hsl(187, 80%, 60%)" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
          f(x)
        </text>
        <text x={activationNode.x} y={activationNode.y + 10} textAnchor="middle" dominantBaseline="middle" fill="hsl(187, 80%, 40%)" fontSize="8" fontFamily="JetBrains Mono">
          {activationFn}
        </text>
      </g>

      {/* Output node */}
      <g filter="url(#glow-green)">
        <circle cx={outputNode.x} cy={outputNode.y} r={28} fill="hsl(220, 18%, 10%)" stroke="hsl(150, 70%, 50%)" strokeWidth={2.5} />
        <text x={outputNode.x} y={outputNode.y - 6} textAnchor="middle" dominantBaseline="middle" fill="hsl(150, 70%, 55%)" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
          saída
        </text>
        <text x={outputNode.x} y={outputNode.y + 12} textAnchor="middle" dominantBaseline="middle" fill="hsl(150, 70%, 70%)" fontSize="14" fontFamily="JetBrains Mono" fontWeight="700">
          {output.toFixed(2)}
        </text>
      </g>

      {/* Labels */}
      <text x={80} y={340} textAnchor="middle" fill="hsl(215, 15%, 40%)" fontSize="11" fontFamily="Inter" fontWeight="500">
        Entradas
      </text>
      <text x={380} y={280} textAnchor="middle" fill="hsl(215, 15%, 40%)" fontSize="11" fontFamily="Inter" fontWeight="500">
        Soma
      </text>
      <text x={540} y={280} textAnchor="middle" fill="hsl(215, 15%, 40%)" fontSize="11" fontFamily="Inter" fontWeight="500">
        Ativação
      </text>
      <text x={700} y={280} textAnchor="middle" fill="hsl(215, 15%, 40%)" fontSize="11" fontFamily="Inter" fontWeight="500">
        Saída
      </text>
    </svg>
  );
};

export default PerceptronVisualization;
