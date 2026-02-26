import { useMemo, useState } from "react";
import { BrainCircuit, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface FundamentalsExerciseBase {
  id: string;
  title: string;
  prompt: string;
  explanation: string;
}

interface FundamentalsMcqExercise extends FundamentalsExerciseBase {
  kind: "mcq";
  options: Array<{ id: string; label: string }>;
  correctOptionId: string;
}

interface FundamentalsNumericExercise extends FundamentalsExerciseBase {
  kind: "numeric";
  correctValue: number;
  tolerance: number;
  step?: string;
  placeholder?: string;
}

type FundamentalsExercise = FundamentalsMcqExercise | FundamentalsNumericExercise;

interface ExercisesSectionProps {
  inputs: number[];
  weights: number[];
  bias: number;
  theta: number;
  activationFn: string;
  weightedSum: number;
  output: number;
}

const format = (value: number, digits = 2) => value.toFixed(digits);

const activationLabels: Record<string, string> = {
  limiar: "Limiar",
  step: "Step",
  sigmoid: "Sigmoid",
  tanh: "Tanh",
  relu: "ReLU",
  gaussian: "Gaussiana",
};

const getOutputTolerance = (activationFn: string) => {
  if (activationFn === "limiar" || activationFn === "step") return 0.0001;
  return 0.02;
};

const getOutputExplanation = (activationFn: string, weightedSum: number, theta: number, output: number) => {
  if (activationFn === "limiar") {
    if (weightedSum > theta) {
      return `Como y* > θ (${format(weightedSum, 4)} > ${format(theta, 2)}), a saída é y = 1.`;
    }
    if (weightedSum < -theta) {
      return `Como y* < -θ (${format(weightedSum, 4)} < -${format(theta, 2)}), a saída é y = -1.`;
    }
    return "Como y* está em [-θ, θ], a saída é y = 0.";
  }

  if (activationFn === "step") {
    return weightedSum >= 0 ? "Na Step, y* ≥ 0 gera y = 1." : "Na Step, y* < 0 gera y = 0.";
  }

  if (activationFn === "sigmoid") return `Na Sigmoid, y ≈ ${format(output, 4)}.`;
  if (activationFn === "tanh") return `Na Tanh, y ≈ ${format(output, 4)}.`;
  if (activationFn === "relu") return weightedSum > 0 ? `Na ReLU, y ≈ ${format(output, 4)}.` : "Na ReLU, y = 0.";

  return `Na Gaussiana, y ≈ ${format(output, 4)}.`;
};

const ExercisesSection = ({
  inputs,
  weights,
  bias,
  theta,
  activationFn,
  weightedSum,
  output,
}: ExercisesSectionProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});

  const [x1, x2] = inputs;
  const [w1, w2] = weights;

  const fundamentals = useMemo<FundamentalsExercise[]>(
    () => [
      {
        id: "f-1",
        kind: "mcq",
        title: "Separabilidade linear",
        prompt: "O Perceptron simples resolve naturalmente qual tipo de problema?",
        options: [
          { id: "a", label: "Classes linearmente separáveis" },
          { id: "b", label: "Problemas não lineares sem transformação" },
          { id: "c", label: "Regressão contínua geral" },
        ],
        correctOptionId: "a",
        explanation: "Perceptron de camada única aprende fronteiras lineares.",
      },
      {
        id: "f-2",
        kind: "numeric",
        title: "Cálculo de y* usando o simulador",
        prompt: `Com os valores atuais x=(${format(x1, 2)}, ${format(x2, 2)}), w=(${format(w1, 2)}, ${format(w2, 2)}), b=${format(bias, 2)}, calcule y* = Σ(xᵢ·wᵢ)+b.`,
        correctValue: weightedSum,
        tolerance: 0.02,
        step: "0.01",
        placeholder: "Ex.: 0.35",
        explanation: `y* = (${format(x1, 2)}·${format(w1, 2)}) + (${format(x2, 2)}·${format(w2, 2)}) + ${format(bias, 2)} = ${format(weightedSum, 4)}.`,
      },
      {
        id: "f-3",
        kind: "numeric",
        title: "Saída da ativação atual",
        prompt: `Com y*=${format(weightedSum, 4)} e função ${activationLabels[activationFn] ?? activationFn}${activationFn === "limiar" ? ` (θ=${format(theta, 2)})` : ""}, qual é a saída y?`,
        correctValue: output,
        tolerance: getOutputTolerance(activationFn),
        step: activationFn === "limiar" || activationFn === "step" ? "1" : "0.01",
        placeholder: "Digite y",
        explanation: getOutputExplanation(activationFn, weightedSum, theta, output),
      },
    ],
    [x1, x2, w1, w2, bias, weightedSum, activationFn, theta, output]
  );

  const correct = Object.values(results).filter(Boolean).length;
  const progress = Math.round((correct / fundamentals.length) * 100);

  const setAnswer = (exerciseId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: value }));
    setResults((prev) => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
  };

  const verifyExercise = (exercise: FundamentalsExercise) => {
    const raw = answers[exercise.id];
    if (!raw || !raw.trim()) return;

    let isCorrect = false;
    if (exercise.kind === "mcq") {
      isCorrect = raw === exercise.correctOptionId;
    } else {
      const value = Number(raw.replace(",", "."));
      if (!Number.isNaN(value)) {
        isCorrect = Math.abs(value - exercise.correctValue) <= exercise.tolerance;
      }
    }

    setResults((prev) => ({ ...prev, [exercise.id]: isCorrect }));
  };

  const reset = () => {
    setAnswers({});
    setResults({});
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-primary glow-text font-mono tracking-wider uppercase">
              Exercícios de Fundamentos
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Baseados nos valores atuais da simulação.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={reset}>
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-foreground">Progresso</span>
          <span className="text-foreground">
            {correct}/{fundamentals.length} corretos
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="space-y-3">
        {fundamentals.map((exercise, index) => {
          const answer = answers[exercise.id] ?? "";
          const result = results[exercise.id];
          const checked = result !== undefined;

          return (
            <div key={exercise.id} className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  {index + 1}. {exercise.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{exercise.prompt}</p>
              </div>

              {exercise.kind === "mcq" ? (
                <div className="space-y-2">
                  {exercise.options.map((option) => {
                    const selected = answer === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setAnswer(exercise.id, option.id)}
                        className={`w-full text-left rounded-md border px-3 py-2 text-xs transition-colors ${
                          selected
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-card text-muted-foreground hover:bg-secondary/70"
                        }`}
                      >
                        <span className="font-semibold uppercase mr-2">{option.id})</span>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <Input
                  type="number"
                  step={exercise.step ?? "0.01"}
                  placeholder={exercise.placeholder ?? "Digite sua resposta"}
                  value={answer}
                  onChange={(event) => setAnswer(exercise.id, event.target.value)}
                  className="max-w-xs"
                />
              )}

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => verifyExercise(exercise)} disabled={!answer.trim()}>
                  Verificar
                </Button>
              </div>

              {checked && (
                <div
                  className={`rounded-md border px-3 py-2 text-xs ${
                    result
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border-destructive/40 bg-destructive/10 text-red-200"
                  }`}
                >
                  <div className="flex items-center gap-1 font-semibold">
                    {result ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {result ? "Resposta correta" : "Resposta incorreta"}
                  </div>
                  <p className="mt-1">{exercise.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExercisesSection;
