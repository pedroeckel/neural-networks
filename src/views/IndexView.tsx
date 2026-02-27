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
import ReferencesSection from "@/components/ReferencesSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-4">
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

      <main className="mx-auto w-full max-w-[1400px] space-y-6 px-4 py-6 sm:px-6">
        <ConceptPanel />

        {/* Main layout */}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* Controls */}
          <aside className="min-w-0">
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
          <div className="min-w-0 space-y-6">
            <Tabs defaultValue="simulation" className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-6">
              <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-semibold text-primary font-mono tracking-[0.24em] uppercase">
                    Painel Interativo
                  </p>
                  <h2 className="text-lg font-semibold text-foreground">
                    Ajuste os parâmetros na esquerda e acompanhe o resultado à direita
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Altere entradas, pesos, bias e ativação para observar a simulação do neurônio ou a mudança da fronteira de decisão.
                  </p>
                </div>

                <TabsList className="grid h-auto w-full grid-cols-1 sm:grid-cols-2 lg:max-w-[430px]">
                  <TabsTrigger value="simulation" className="w-full px-4 py-2 text-xs font-mono uppercase tracking-wide">
                    Simulação do Neurônio
                  </TabsTrigger>
                  <TabsTrigger value="boundary" className="w-full px-4 py-2 text-xs font-mono uppercase tracking-wide">
                    Fronteira de Decisão
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="simulation" className="space-y-6 pt-6">
                <div className="rounded-xl border border-border bg-background/40 p-6">
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
              </TabsContent>

              <TabsContent value="boundary" className="pt-6">
                <DecisionBoundaryChart
                  weights={weights}
                  bias={bias}
                  theta={theta}
                  activationFn={activationFn}
                />
              </TabsContent>
            </Tabs>
            <AlgorithmSteps activationFn={activationFn} theta={theta} />
            <IterationPracticeSection activationFn={activationFn} />
            <CodeExamples activationFn={activationFn} />
            <ExercisesSection
              inputs={inputs}
              weights={weights}
              bias={bias}
              theta={theta}
              activationFn={activationFn}
              weightedSum={weightedSum}
              output={output}
            />
            <ReferencesSection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
