import { useState } from "react";
import { Check, Code2, Copy, Play, TerminalSquare } from "lucide-react";

const codeSnippets: Record<string, string> = {
  Python: `import numpy as np

def perceptron(X, y, lr=1, epochs=100):
    w = np.zeros(X.shape[1])
    b = 0
    for _ in range(epochs):
        errors = 0
        for xi, d in zip(X, y):
            y_pred = 1 if np.dot(xi, w) + b >= 0 else 0
            if y_pred != d:
                w += lr * d * xi
                b += lr * d
                errors += 1
        if errors == 0:
            break
    return w, b

# Exemplo: porta AND
X = np.array([[0,0],[0,1],[1,0],[1,1]])
y = np.array([0, 0, 0, 1])
w, b = perceptron(X, y)
print(f"Pesos: {w}, Bias: {b}")`,

  JavaScript: `function perceptron(X, y, lr = 0.1, epochs = 50) {
  let w = new Array(X[0].length).fill(0);
  let b = 0;

  for (let e = 0; e < epochs; e++) {
    let errors = 0;
    for (let i = 0; i < X.length; i++) {
      const sum = X[i].reduce((s, x, j) => s + x * w[j], 0) + b;
      const yPred = sum >= 0 ? 1 : 0;
      const error = y[i] - yPred;
      if (error !== 0) {
        w = w.map((wj, j) => wj + lr * error * X[i][j]);
        b += lr * error;
        errors++;
      }
    }
    if (errors === 0) break;
  }
  return { w, b };
}

const X = [[0,0],[0,1],[1,0],[1,1]];
const y = [0, 0, 0, 1];
const { w, b } = perceptron(X, y);
const predict = (x) => (x.reduce((s, xi, j) => s + xi * w[j], 0) + b >= 0 ? 1 : 0);

console.log("Pesos:", w.map((v) => v.toFixed(2)).join(", "));
console.log("Bias:", b.toFixed(2));
console.log("Predicoes:", X.map(predict).join(", "));`,

  TypeScript: `function perceptron(
  X: number[][], y: number[],
  lr = 0.1, epochs = 50
): { w: number[]; b: number } {
  let w = new Array(X[0].length).fill(0);
  let b = 0;

  for (let e = 0; e < epochs; e++) {
    let errors = 0;
    for (let i = 0; i < X.length; i++) {
      const sum = X[i].reduce((s, x, j) => s + x * w[j], 0) + b;
      const yPred = sum >= 0 ? 1 : 0;
      const error = y[i] - yPred;
      if (error !== 0) {
        w = w.map((wj, j) => wj + lr * error * X[i][j]);
        b += lr * error;
        errors++;
      }
    }
    if (errors === 0) break;
  }
  return { w, b };
}

const X = [[0,0],[0,1],[1,0],[1,1]];
const y = [0, 0, 0, 1];
const { w, b } = perceptron(X, y);
const predict = (x: number[]) =>
  (x.reduce((s, xi, j) => s + xi * w[j], 0) + b >= 0 ? 1 : 0);

console.log("Pesos:", w.map((v) => v.toFixed(2)).join(", "));
console.log("Bias:", b.toFixed(2));
console.log("Predicoes:", X.map(predict).join(", "));`,

  Java: `public class Perceptron {
    double[] w;
    double b;

    public void train(double[][] X, int[] y, double lr, int epochs) {
        w = new double[X[0].length];
        b = 0;
        for (int e = 0; e < epochs; e++) {
            int errors = 0;
            for (int i = 0; i < X.length; i++) {
                double sum = b;
                for (int j = 0; j < w.length; j++)
                    sum += X[i][j] * w[j];
                int yPred = sum >= 0 ? 1 : 0;
                if (yPred != y[i]) {
                    for (int j = 0; j < w.length; j++)
                        w[j] += lr * y[i] * X[i][j];
                    b += lr * y[i];
                    errors++;
                }
            }
            if (errors == 0) break;
        }
    }

    public static void main(String[] args) {
        Perceptron p = new Perceptron();
        double[][] X = {{0,0},{0,1},{1,0},{1,1}};
        int[] y = {0, 0, 0, 1};
        p.train(X, y, 1, 100);
    }
}`,

  "C++": `#include <iostream>
#include <vector>
using namespace std;

struct Perceptron {
    vector<double> w;
    double b = 0;

    void train(vector<vector<double>>& X, vector<int>& y,
               double lr = 1, int epochs = 100) {
        w.assign(X[0].size(), 0);
        for (int e = 0; e < epochs; e++) {
            int errors = 0;
            for (size_t i = 0; i < X.size(); i++) {
                double sum = b;
                for (size_t j = 0; j < w.size(); j++)
                    sum += X[i][j] * w[j];
                int yPred = sum >= 0 ? 1 : 0;
                if (yPred != y[i]) {
                    for (size_t j = 0; j < w.size(); j++)
                        w[j] += lr * y[i] * X[i][j];
                    b += lr * y[i];
                    errors++;
                }
            }
            if (errors == 0) break;
        }
    }
};

int main() {
    vector<vector<double>> X = {{0,0},{0,1},{1,0},{1,1}};
    vector<int> y = {0, 0, 0, 1};
    Perceptron p;
    p.train(X, y);
    return 0;
}`,

  Rust: `fn perceptron(x: &[Vec<f64>], y: &[i32], lr: f64, epochs: usize)
    -> (Vec<f64>, f64) {
    let mut w = vec![0.0; x[0].len()];
    let mut b = 0.0;

    for _ in 0..epochs {
        let mut errors = 0;
        for (i, xi) in x.iter().enumerate() {
            let sum: f64 = xi.iter().zip(&w)
                .map(|(x, w)| x * w).sum::<f64>() + b;
            let y_pred = if sum >= 0.0 { 1 } else { 0 };
            if y_pred != y[i] {
                for (j, xj) in xi.iter().enumerate() {
                    w[j] += lr * y[i] as f64 * xj;
                }
                b += lr * y[i] as f64;
                errors += 1;
            }
        }
        if errors == 0 { break; }
    }
    (w, b)
}

fn main() {
    let x = vec![vec![0.,0.],vec![0.,1.],vec![1.,0.],vec![1.,1.]];
    let y = vec![0, 0, 0, 1];
    let (w, b) = perceptron(&x, &y, 1.0, 100);
    println!("Pesos: {:?}, Bias: {}", w, b);
}`,
};

const runnableSnippets: Record<string, string> = {
  JavaScript: `function perceptron(X, y, lr = 0.1, epochs = 50) {
  let w = new Array(X[0].length).fill(0);
  let b = 0;

  for (let e = 0; e < epochs; e++) {
    let errors = 0;
    for (let i = 0; i < X.length; i++) {
      const sum = X[i].reduce((s, x, j) => s + x * w[j], 0) + b;
      const yPred = sum >= 0 ? 1 : 0;
      const error = y[i] - yPred;
      if (error !== 0) {
        w = w.map((wj, j) => wj + lr * error * X[i][j]);
        b += lr * error;
        errors++;
      }
    }
    if (errors === 0) break;
  }
  return { w, b };
}

const X = [[0,0],[0,1],[1,0],[1,1]];
const y = [0, 0, 0, 1];
const { w, b } = perceptron(X, y);
const predict = (x) => (x.reduce((s, xi, j) => s + xi * w[j], 0) + b >= 0 ? 1 : 0);

console.log("Pesos:", w.map((v) => v.toFixed(2)).join(", "));
console.log("Bias:", b.toFixed(2));
console.log("Predicoes:", X.map(predict).join(", "));`,
  TypeScript: `function perceptron(X, y, lr = 0.1, epochs = 50) {
  let w = new Array(X[0].length).fill(0);
  let b = 0;

  for (let e = 0; e < epochs; e++) {
    let errors = 0;
    for (let i = 0; i < X.length; i++) {
      const sum = X[i].reduce((s, x, j) => s + x * w[j], 0) + b;
      const yPred = sum >= 0 ? 1 : 0;
      const error = y[i] - yPred;
      if (error !== 0) {
        w = w.map((wj, j) => wj + lr * error * X[i][j]);
        b += lr * error;
        errors++;
      }
    }
    if (errors === 0) break;
  }
  return { w, b };
}

const X = [[0,0],[0,1],[1,0],[1,1]];
const y = [0, 0, 0, 1];
const { w, b } = perceptron(X, y);
const predict = (x) => (x.reduce((s, xi, j) => s + xi * w[j], 0) + b >= 0 ? 1 : 0);

console.log("Pesos:", w.map((v) => v.toFixed(2)).join(", "));
console.log("Bias:", b.toFixed(2));
console.log("Predicoes:", X.map(predict).join(", "));`,
};

const languages = Object.keys(codeSnippets);

const formatLogArg = (value: unknown) => {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const CodeExamples = () => {
  const [activeLang, setActiveLang] = useState("JavaScript");
  const [copied, setCopied] = useState(false);
  const [runOutput, setRunOutput] = useState("");
  const [runStatus, setRunStatus] = useState<"idle" | "success" | "error">("idle");

  const isRunnable = Boolean(runnableSnippets[activeLang]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeSnippets[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    if (!isRunnable) return;

    const logs: string[] = [];
    const mockConsole = {
      log: (...args: unknown[]) => logs.push(args.map(formatLogArg).join(" ")),
      error: (...args: unknown[]) => logs.push(`[erro] ${args.map(formatLogArg).join(" ")}`),
      warn: (...args: unknown[]) => logs.push(`[aviso] ${args.map(formatLogArg).join(" ")}`),
    };

    try {
      const source = runnableSnippets[activeLang];
      const runner = new Function("console", source);
      runner(mockConsole);
      setRunStatus("success");
      setRunOutput(logs.length ? logs.join("\n") : "(sem saída)");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setRunStatus("error");
      setRunOutput(`${logs.join("\n")}${logs.length ? "\n" : ""}Erro ao executar: ${message}`);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setActiveLang(lang);
    setCopied(false);
    setRunStatus("idle");
    setRunOutput("");
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <Code2 className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-primary glow-text font-mono tracking-wider uppercase">
          Implementação em Código
        </h3>
      </div>

      <div className="px-5 flex flex-wrap gap-1.5">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-all ${
              activeLang === lang
                ? "bg-primary text-primary-foreground glow-primary"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="px-5 pt-3 flex items-center justify-end gap-2">
        {isRunnable && (
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors bg-emerald-600 text-white border border-emerald-400/40 hover:bg-emerald-500"
          >
            <Play className="w-3.5 h-3.5" />
            Executar
          </button>
        )}

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-secondary/80 hover:bg-secondary text-xs font-mono text-secondary-foreground transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-primary" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copiar
            </>
          )}
        </button>
      </div>

      <div className="mt-3">
        <pre className="overflow-x-auto p-5 pt-4 bg-secondary/30 text-sm font-mono text-foreground leading-relaxed">
          <code>{codeSnippets[activeLang]}</code>
        </pre>
      </div>

      {isRunnable && (
        <div className="border-t border-border px-5 py-4 bg-secondary/10 space-y-2">
          <div className="flex items-center gap-2">
            <TerminalSquare className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold font-mono tracking-wider uppercase text-primary">
              Print / Saída
            </p>
          </div>

          {runStatus === "idle" ? (
            <p className="text-xs text-muted-foreground">
              Clique em &quot;Executar&quot; para rodar o exemplo e ver o print aqui.
            </p>
          ) : (
            <pre
              className={`rounded-md p-3 text-xs font-mono overflow-x-auto ${
                runStatus === "error"
                  ? "bg-destructive/15 text-destructive"
                  : "bg-card text-foreground border border-border"
              }`}
            >
              <code>{runOutput}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeExamples;
