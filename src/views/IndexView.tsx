"use client";

import { useState, useMemo } from "react";
import { Brain } from "lucide-react";
import PerceptronVisualization from "@/components/PerceptronVisualization";
import ControlPanel from "@/components/ControlPanel";
import CalculationSteps from "@/components/CalculationSteps";
import ConceptPanel from "@/components/ConceptPanel";
import DecisionBoundaryChart from "@/components/DecisionBoundaryChart";
import AlgorithmSteps from "@/components/AlgorithmSteps";
import CodeExamples from "@/components/CodeExamples";
import MainMenu from "@/components/MainMenu";
import ExercisesSection from "@/components/ExercisesSection";
import IterationPracticeSection from "@/components/IterationPracticeSection";

const makeActivationFunctions = (theta: number): Record<string, (x: number) => number> => ({
  limiar: (x) => (x > theta ? 1 : x < -theta ? -1 : 0),
  step: (x) => (x >= 0 ? 1 : 0),
  sigmoid: (x) => 1 / (1 + Math.exp(-x)),
  tanh: (x) => Math.tanh(x),
  relu: (x) => Math.max(0, x),
  gaussian: (x) => Math.exp(-(x * x)),
});

const Index = () => {
  const [inputs, setInputs] = useState([1.0, 0.5]);
  const [weights, setWeights] = useState([0.7, -0.4]);
  const [bias, setBias] = useState(0.1);
  const [activationFn, setActivationFn] = useState("limiar");
  const [theta, setTheta] = useState(0.5);

  const activationFunctions = useMemo(() => makeActivationFunctions(theta), [theta]);

  const weightedSum = useMemo(
    () => inputs.reduce((sum, x, i) => sum + x * weights[i], 0) + bias,
    [inputs, weights, bias]
  );

  const output = useMemo(
    () => activationFunctions[activationFn](weightedSum),
    [weightedSum, activationFn, activationFunctions]
  );

  const handleInputChange = (index: number, value: number) => {
    setInputs((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const handleWeightChange = (index: number, value: number) => {
    setWeights((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center glow-primary">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">
                  Redes Neurais Artificiais
                </h1>
                <p className="text-xs text-muted-foreground">
                  Módulo atual: Perceptron
                </p>
              </div>
            </div>
          </div>
          <MainMenu />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <ConceptPanel />

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Controls */}
          <aside>
            <ControlPanel
              inputs={inputs}
              weights={weights}
              bias={bias}
              theta={theta}
              activationFn={activationFn}
              onInputChange={handleInputChange}
              onWeightChange={handleWeightChange}
              onBiasChange={setBias}
              onThetaChange={setTheta}
              onActivationChange={setActivationFn}
            />
          </aside>

          {/* Visualization + Steps */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <PerceptronVisualization
                inputs={inputs}
                weights={weights}
                bias={bias}
                weightedSum={weightedSum}
                output={output}
                activationFn={activationFn}
              />
            </div>
            <CalculationSteps
              inputs={inputs}
              weights={weights}
              bias={bias}
              theta={theta}
              weightedSum={weightedSum}
              output={output}
              activationFn={activationFn}
            />
            <DecisionBoundaryChart
              weights={weights}
              bias={bias}
              theta={theta}
              activationFn={activationFn}
            />
            <AlgorithmSteps />
            <IterationPracticeSection />
            <CodeExamples />
            <ExercisesSection
              inputs={inputs}
              weights={weights}
              bias={bias}
              theta={theta}
              activationFn={activationFn}
              weightedSum={weightedSum}
              output={output}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
