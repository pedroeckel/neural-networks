import { useState } from "react";
import { Check, Code2, Copy, Play, TerminalSquare } from "lucide-react";

type LogMode = "full" | "summary";

const jsFullRunnableSnippet = `const format = (n, digits = 2) => Number(n).toFixed(digits);

function perceptron(X, y, lr = 0.1, epochs = 50) {
  let w = new Array(X[0].length).fill(0);
  let b = 0;
  const history = [];

  console.log("=== INICIO DO TREINAMENTO ===");
  for (let e = 0; e < epochs; e++) {
    let errors = 0;
    let absoluteError = 0;
    console.log("\\nEPOCA " + (e + 1));

    for (let i = 0; i < X.length; i++) {
      const xi = X[i];
      const d = y[i];
      const prevW = [...w];
      const prevB = b;
      const net = xi.reduce((s, x, j) => s + x * w[j], 0) + b;
      const yPred = net >= 0 ? 1 : 0;
      const error = d - yPred;
      const deltaW = xi.map((x) => lr * error * x);
      const deltaB = lr * error;

      if (error !== 0) {
        w = w.map((wj, j) => wj + deltaW[j]);
        b += deltaB;
        errors++;
      }

      absoluteError += Math.abs(error);
      console.log(
        "[A" + (i + 1) + "] x=(" + xi.join(",") + ") d=" + d +
        " y*=" + format(net, 3) +
        " y=" + yPred +
        " e=" + error +
        " DeltaW=(" + deltaW.map((v) => format(v, 3)).join(",") + ")" +
        " DeltaB=" + format(deltaB, 3) +
        " | w:(" + prevW.map((v) => format(v)).join(",") + ") -> (" + w.map((v) => format(v)).join(",") + ")" +
        " b:" + format(prevB) + " -> " + format(b)
      );
    }

    const hits = X.length - errors;
    console.log(
      "Resumo epoca " + (e + 1) + ": erros=" + errors +
      " | acertos=" + hits +
      " | erro absoluto acumulado=" + format(absoluteError, 3)
    );
    history.push({ epoch: e + 1, errors, hits, absoluteError, w: [...w], b });

    if (errors === 0) {
      console.log("Convergencia atingida na epoca " + (e + 1) + ".");
      break;
    }

    if (e === epochs - 1) {
      console.log("Parada por limite maximo de epocas.");
    }
  }

  return { w, b, history };
}

const X = [[0,0],[0,1],[1,0],[1,1]];
const y = [0, 0, 0, 1];
const { w, b, history } = perceptron(X, y);
const predict = (x) => (x.reduce((s, xi, j) => s + xi * w[j], 0) + b >= 0 ? 1 : 0);

console.log("\\n=== RESULTADO FINAL ===");
console.log("Pesos finais:", w.map((v) => format(v)).join(", "));
console.log("Bias final:", format(b));
console.log(
  "Historico de epocas:",
  history.map((h) => "E" + h.epoch + "[erros=" + h.errors + ",acertos=" + h.hits + "]").join(" | ")
);
console.log("Predicoes:", X.map(predict).join(", "));
console.log("Detalhe das predicoes:");
X.forEach((x, i) => {
  const net = x.reduce((s, xi, j) => s + xi * w[j], 0) + b;
  const pred = predict(x);
  const error = y[i] - pred;
  console.log(
    "[A" + (i + 1) + "] x=(" + x.join(",") + ") d=" + y[i] +
    " y*=" + format(net, 3) +
    " y=" + pred +
    " e=" + error
  );
});`;

const jsSummaryRunnableSnippet = `const format = (n, digits = 2) => Number(n).toFixed(digits);

function perceptron(X, y, lr = 0.1, epochs = 50) {
  let w = new Array(X[0].length).fill(0);
  let b = 0;
  const history = [];

  console.log("=== INICIO DO TREINAMENTO (RESUMIDO) ===");
  for (let e = 0; e < epochs; e++) {
    let errors = 0;
    let absoluteError = 0;

    for (let i = 0; i < X.length; i++) {
      const xi = X[i];
      const d = y[i];
      const net = xi.reduce((s, x, j) => s + x * w[j], 0) + b;
      const yPred = net >= 0 ? 1 : 0;
      const error = d - yPred;
      const deltaW = xi.map((x) => lr * error * x);
      const deltaB = lr * error;

      if (error !== 0) {
        w = w.map((wj, j) => wj + deltaW[j]);
        b += deltaB;
        errors++;
      }

      absoluteError += Math.abs(error);
    }

    const hits = X.length - errors;
    history.push({ epoch: e + 1, errors, hits, absoluteError, w: [...w], b });
    console.log(
      "EPOCA " + (e + 1) +
      " | erros=" + errors +
      " | acertos=" + hits +
      " | erro absoluto=" + format(absoluteError, 3) +
      " | w=(" + w.map((v) => format(v)).join(",") + ")" +
      " | b=" + format(b)
    );

    if (errors === 0) {
      console.log("Convergencia atingida na epoca " + (e + 1) + ".");
      break;
    }

    if (e === epochs - 1) {
      console.log("Parada por limite maximo de epocas.");
    }
  }

  return { w, b, history };
}

const X = [[0,0],[0,1],[1,0],[1,1]];
const y = [0, 0, 0, 1];
const { w, b, history } = perceptron(X, y);
const predict = (x) => (x.reduce((s, xi, j) => s + xi * w[j], 0) + b >= 0 ? 1 : 0);

console.log("\\n=== RESULTADO FINAL ===");
console.log("Pesos finais:", w.map((v) => format(v)).join(", "));
console.log("Bias final:", format(b));
console.log(
  "Historico de epocas:",
  history.map((h) => "E" + h.epoch + "[erros=" + h.errors + ",acertos=" + h.hits + "]").join(" | ")
);
console.log("Predicoes:", X.map(predict).join(", "));`;

const tsFullSnippet = `type TrainSummary = {
  epoch: number;
  errors: number;
  hits: number;
  absoluteError: number;
  w: number[];
  b: number;
};

const format = (n: number, digits = 2) => Number(n).toFixed(digits);

function perceptron(
  X: number[][],
  y: number[],
  lr = 0.1,
  epochs = 50
): { w: number[]; b: number; history: TrainSummary[] } {
  let w = new Array<number>(X[0].length).fill(0);
  let b = 0;
  const history: TrainSummary[] = [];

  console.log("=== INICIO DO TREINAMENTO ===");
  for (let e = 0; e < epochs; e++) {
    let errors = 0;
    let absoluteError = 0;
    console.log("\\nEPOCA " + (e + 1));

    for (let i = 0; i < X.length; i++) {
      const xi = X[i];
      const d = y[i];
      const prevW = [...w];
      const prevB = b;
      const net = xi.reduce((s, x, j) => s + x * w[j], 0) + b;
      const yPred = net >= 0 ? 1 : 0;
      const error = d - yPred;
      const deltaW = xi.map((x) => lr * error * x);
      const deltaB = lr * error;

      if (error !== 0) {
        w = w.map((wj, j) => wj + deltaW[j]);
        b += deltaB;
        errors++;
      }

      absoluteError += Math.abs(error);
      console.log(
        "[A" + (i + 1) + "] x=(" + xi.join(",") + ") d=" + d +
        " y*=" + format(net, 3) +
        " y=" + yPred +
        " e=" + error +
        " DeltaW=(" + deltaW.map((v) => format(v, 3)).join(",") + ")" +
        " DeltaB=" + format(deltaB, 3) +
        " | w:(" + prevW.map((v) => format(v)).join(",") + ") -> (" + w.map((v) => format(v)).join(",") + ")" +
        " b:" + format(prevB) + " -> " + format(b)
      );
    }

    const hits = X.length - errors;
    console.log(
      "Resumo epoca " + (e + 1) + ": erros=" + errors +
      " | acertos=" + hits +
      " | erro absoluto acumulado=" + format(absoluteError, 3)
    );
    history.push({ epoch: e + 1, errors, hits, absoluteError, w: [...w], b });

    if (errors === 0) {
      console.log("Convergencia atingida na epoca " + (e + 1) + ".");
      break;
    }

    if (e === epochs - 1) {
      console.log("Parada por limite maximo de epocas.");
    }
  }

  return { w, b, history };
}

const X: number[][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
const y: number[] = [0, 0, 0, 1];
const { w, b, history } = perceptron(X, y);
const predict = (x: number[]) =>
  (x.reduce((s, xi, j) => s + xi * w[j], 0) + b >= 0 ? 1 : 0);

console.log("\\n=== RESULTADO FINAL ===");
console.log("Pesos finais:", w.map((v) => format(v)).join(", "));
console.log("Bias final:", format(b));
console.log(
  "Historico de epocas:",
  history.map((h) => "E" + h.epoch + "[erros=" + h.errors + ",acertos=" + h.hits + "]").join(" | ")
);
console.log("Predicoes:", X.map(predict).join(", "));
console.log("Detalhe das predicoes:");
X.forEach((x, i) => {
  const net = x.reduce((s, xi, j) => s + xi * w[j], 0) + b;
  const pred = predict(x);
  const error = y[i] - pred;
  console.log(
    "[A" + (i + 1) + "] x=(" + x.join(",") + ") d=" + y[i] +
    " y*=" + format(net, 3) +
    " y=" + pred +
    " e=" + error
  );
});`;

const tsSummarySnippet = `type TrainSummary = {
  epoch: number;
  errors: number;
  hits: number;
  absoluteError: number;
  w: number[];
  b: number;
};

const format = (n: number, digits = 2) => Number(n).toFixed(digits);

function perceptron(
  X: number[][],
  y: number[],
  lr = 0.1,
  epochs = 50
): { w: number[]; b: number; history: TrainSummary[] } {
  let w = new Array<number>(X[0].length).fill(0);
  let b = 0;
  const history: TrainSummary[] = [];

  console.log("=== INICIO DO TREINAMENTO (RESUMIDO) ===");
  for (let e = 0; e < epochs; e++) {
    let errors = 0;
    let absoluteError = 0;

    for (let i = 0; i < X.length; i++) {
      const xi = X[i];
      const d = y[i];
      const net = xi.reduce((s, x, j) => s + x * w[j], 0) + b;
      const yPred = net >= 0 ? 1 : 0;
      const error = d - yPred;
      const deltaW = xi.map((x) => lr * error * x);
      const deltaB = lr * error;

      if (error !== 0) {
        w = w.map((wj, j) => wj + deltaW[j]);
        b += deltaB;
        errors++;
      }

      absoluteError += Math.abs(error);
    }

    const hits = X.length - errors;
    history.push({ epoch: e + 1, errors, hits, absoluteError, w: [...w], b });
    console.log(
      "EPOCA " + (e + 1) +
      " | erros=" + errors +
      " | acertos=" + hits +
      " | erro absoluto=" + format(absoluteError, 3) +
      " | w=(" + w.map((v) => format(v)).join(",") + ")" +
      " | b=" + format(b)
    );

    if (errors === 0) {
      console.log("Convergencia atingida na epoca " + (e + 1) + ".");
      break;
    }

    if (e === epochs - 1) {
      console.log("Parada por limite maximo de epocas.");
    }
  }

  return { w, b, history };
}

const X: number[][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
const y: number[] = [0, 0, 0, 1];
const { w, b, history } = perceptron(X, y);
const predict = (x: number[]) =>
  (x.reduce((s, xi, j) => s + xi * w[j], 0) + b >= 0 ? 1 : 0);

console.log("\\n=== RESULTADO FINAL ===");
console.log("Pesos finais:", w.map((v) => format(v)).join(", "));
console.log("Bias final:", format(b));
console.log(
  "Historico de epocas:",
  history.map((h) => "E" + h.epoch + "[erros=" + h.errors + ",acertos=" + h.hits + "]").join(" | ")
);
console.log("Predicoes:", X.map(predict).join(", "));`;

const pyFullSnippet = `import numpy as np


def perceptron(X, y, lr=0.1, epochs=50):
    w = np.zeros(X.shape[1], dtype=float)
    b = 0.0
    history = []

    print("=== INICIO DO TREINAMENTO ===")
    for epoch in range(epochs):
        errors = 0
        absolute_error = 0.0
        print(f"\\nEPOCA {epoch + 1}")

        for i, (xi, d) in enumerate(zip(X, y), start=1):
            prev_w = w.copy()
            prev_b = b
            net = float(np.dot(xi, w) + b)
            y_pred = 1 if net >= 0 else 0
            error = d - y_pred
            delta_w = lr * error * xi
            delta_b = lr * error

            if error != 0:
                w += delta_w
                b += delta_b
                errors += 1

            absolute_error += abs(error)
            print(
                f"[A{i}] x={tuple(xi)} d={d} y*={net:.3f} y={y_pred} e={error} "
                f"DeltaW={tuple(np.round(delta_w, 3))} DeltaB={delta_b:.3f} "
                f"| w:{tuple(np.round(prev_w, 2))} -> {tuple(np.round(w, 2))} "
                f"b:{prev_b:.2f} -> {b:.2f}"
            )

        hits = len(X) - errors
        print(
            f"Resumo epoca {epoch + 1}: erros={errors} | acertos={hits} "
            f"| erro absoluto acumulado={absolute_error:.3f}"
        )
        history.append((epoch + 1, errors, hits, absolute_error, w.copy(), b))

        if errors == 0:
            print(f"Convergencia atingida na epoca {epoch + 1}.")
            break

    return w, b, history


X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([0, 0, 0, 1], dtype=int)
w, b, history = perceptron(X, y)

print("\\n=== RESULTADO FINAL ===")
print("Pesos finais:", np.round(w, 2))
print("Bias final:", round(float(b), 2))
print("Historico de epocas:", [(h[0], h[1], h[2]) for h in history])`;

const pySummarySnippet = `import numpy as np


def perceptron(X, y, lr=0.1, epochs=50):
    w = np.zeros(X.shape[1], dtype=float)
    b = 0.0
    history = []

    print("=== INICIO DO TREINAMENTO (RESUMIDO) ===")
    for epoch in range(epochs):
        errors = 0
        absolute_error = 0.0

        for xi, d in zip(X, y):
            net = float(np.dot(xi, w) + b)
            y_pred = 1 if net >= 0 else 0
            error = d - y_pred
            delta_w = lr * error * xi
            delta_b = lr * error

            if error != 0:
                w += delta_w
                b += delta_b
                errors += 1

            absolute_error += abs(error)

        hits = len(X) - errors
        history.append((epoch + 1, errors, hits, absolute_error, w.copy(), b))
        print(
            f"EPOCA {epoch + 1} | erros={errors} | acertos={hits} "
            f"| erro absoluto={absolute_error:.3f} | w={tuple(np.round(w, 2))} | b={b:.2f}"
        )

        if errors == 0:
            print(f"Convergencia atingida na epoca {epoch + 1}.")
            break

    return w, b, history


X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([0, 0, 0, 1], dtype=int)
w, b, history = perceptron(X, y)

print("\\n=== RESULTADO FINAL ===")
print("Pesos finais:", np.round(w, 2))
print("Bias final:", round(float(b), 2))
print("Historico de epocas:", [(h[0], h[1], h[2]) for h in history])`;

const javaFullSnippet = `public class PerceptronFullLog {
    static String fmt(double v) {
        return String.format("%.2f", v);
    }

    public static void main(String[] args) {
        double[][] X = {{0,0}, {0,1}, {1,0}, {1,1}};
        int[] y = {0, 0, 0, 1};

        double[] w = {0, 0};
        double b = 0;
        double lr = 0.1;
        int epochs = 50;

        System.out.println("=== INICIO DO TREINAMENTO ===");
        for (int epoch = 1; epoch <= epochs; epoch++) {
            int errors = 0;
            double absoluteError = 0;
            System.out.println("\\nEPOCA " + epoch);

            for (int i = 0; i < X.length; i++) {
                double[] xi = X[i];
                int d = y[i];
                double prevW1 = w[0], prevW2 = w[1], prevB = b;
                double net = xi[0] * w[0] + xi[1] * w[1] + b;
                int yPred = net >= 0 ? 1 : 0;
                int error = d - yPred;
                double deltaW1 = lr * error * xi[0];
                double deltaW2 = lr * error * xi[1];
                double deltaB = lr * error;

                if (error != 0) {
                    w[0] += deltaW1;
                    w[1] += deltaW2;
                    b += deltaB;
                    errors++;
                }

                absoluteError += Math.abs(error);
                System.out.println(
                    "[A" + (i + 1) + "] x=(" + (int) xi[0] + "," + (int) xi[1] + ")" +
                    " d=" + d + " y*=" + String.format("%.3f", net) +
                    " y=" + yPred + " e=" + error +
                    " DeltaW=(" + String.format("%.3f", deltaW1) + "," + String.format("%.3f", deltaW2) + ")" +
                    " DeltaB=" + String.format("%.3f", deltaB) +
                    " | w:(" + fmt(prevW1) + "," + fmt(prevW2) + ") -> (" + fmt(w[0]) + "," + fmt(w[1]) + ")" +
                    " b:" + fmt(prevB) + " -> " + fmt(b)
                );
            }

            int hits = X.length - errors;
            System.out.println("Resumo epoca " + epoch + ": erros=" + errors + " | acertos=" + hits +
                               " | erro absoluto acumulado=" + String.format("%.3f", absoluteError));

            if (errors == 0) {
                System.out.println("Convergencia atingida na epoca " + epoch + ".");
                break;
            }
        }

        System.out.println("\\n=== RESULTADO FINAL ===");
        System.out.println("Pesos finais: " + fmt(w[0]) + ", " + fmt(w[1]));
        System.out.println("Bias final: " + fmt(b));
    }
}`;

const javaSummarySnippet = `public class PerceptronSummaryLog {
    static String fmt(double v) {
        return String.format("%.2f", v);
    }

    public static void main(String[] args) {
        double[][] X = {{0,0}, {0,1}, {1,0}, {1,1}};
        int[] y = {0, 0, 0, 1};

        double[] w = {0, 0};
        double b = 0;
        double lr = 0.1;
        int epochs = 50;

        System.out.println("=== INICIO DO TREINAMENTO (RESUMIDO) ===");
        for (int epoch = 1; epoch <= epochs; epoch++) {
            int errors = 0;
            double absoluteError = 0;

            for (int i = 0; i < X.length; i++) {
                double[] xi = X[i];
                int d = y[i];
                double net = xi[0] * w[0] + xi[1] * w[1] + b;
                int yPred = net >= 0 ? 1 : 0;
                int error = d - yPred;

                if (error != 0) {
                    w[0] += lr * error * xi[0];
                    w[1] += lr * error * xi[1];
                    b += lr * error;
                    errors++;
                }

                absoluteError += Math.abs(error);
            }

            int hits = X.length - errors;
            System.out.println("EPOCA " + epoch + " | erros=" + errors + " | acertos=" + hits +
                               " | erro absoluto=" + String.format("%.3f", absoluteError) +
                               " | w=(" + fmt(w[0]) + "," + fmt(w[1]) + ")" +
                               " | b=" + fmt(b));

            if (errors == 0) {
                System.out.println("Convergencia atingida na epoca " + epoch + ".");
                break;
            }
        }

        System.out.println("\\n=== RESULTADO FINAL ===");
        System.out.println("Pesos finais: " + fmt(w[0]) + ", " + fmt(w[1]));
        System.out.println("Bias final: " + fmt(b));
    }
}`;

const cppFullSnippet = `#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<double>> X = {{0, 0}, {0, 1}, {1, 0}, {1, 1}};
    vector<int> y = {0, 0, 0, 1};

    vector<double> w(2, 0.0);
    double b = 0.0;
    const double lr = 0.1;
    const int epochs = 50;

    cout << "=== INICIO DO TREINAMENTO ===\\n";
    for (int epoch = 1; epoch <= epochs; epoch++) {
        int errors = 0;
        double absoluteError = 0.0;
        cout << "\\nEPOCA " << epoch << "\\n";

        for (size_t i = 0; i < X.size(); i++) {
            auto xi = X[i];
            int d = y[i];
            double prevW1 = w[0], prevW2 = w[1], prevB = b;
            double net = xi[0] * w[0] + xi[1] * w[1] + b;
            int yPred = net >= 0.0 ? 1 : 0;
            int error = d - yPred;
            double deltaW1 = lr * error * xi[0];
            double deltaW2 = lr * error * xi[1];
            double deltaB = lr * error;

            if (error != 0) {
                w[0] += deltaW1;
                w[1] += deltaW2;
                b += deltaB;
                errors++;
            }

            absoluteError += abs(error);
            cout << "[A" << (i + 1) << "] x=(" << xi[0] << "," << xi[1] << ")"
                 << " d=" << d << " y*=" << fixed << setprecision(3) << net
                 << " y=" << yPred << " e=" << error
                 << " DeltaW=(" << deltaW1 << "," << deltaW2 << ")"
                 << " DeltaB=" << deltaB
                 << " | w:(" << setprecision(2) << prevW1 << "," << prevW2 << ") -> ("
                 << w[0] << "," << w[1] << ") b:" << prevB << " -> " << b << "\\n";
        }

        int hits = static_cast<int>(X.size()) - errors;
        cout << "Resumo epoca " << epoch << ": erros=" << errors
             << " | acertos=" << hits
             << " | erro absoluto acumulado=" << fixed << setprecision(3) << absoluteError << "\\n";

        if (errors == 0) {
            cout << "Convergencia atingida na epoca " << epoch << ".\\n";
            break;
        }
    }

    cout << "\\n=== RESULTADO FINAL ===\\n";
    cout << "Pesos finais: " << fixed << setprecision(2) << w[0] << ", " << w[1] << "\\n";
    cout << "Bias final: " << fixed << setprecision(2) << b << "\\n";
    return 0;
}`;

const cppSummarySnippet = `#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<double>> X = {{0, 0}, {0, 1}, {1, 0}, {1, 1}};
    vector<int> y = {0, 0, 0, 1};

    vector<double> w(2, 0.0);
    double b = 0.0;
    const double lr = 0.1;
    const int epochs = 50;

    cout << "=== INICIO DO TREINAMENTO (RESUMIDO) ===\\n";
    for (int epoch = 1; epoch <= epochs; epoch++) {
        int errors = 0;
        double absoluteError = 0.0;

        for (size_t i = 0; i < X.size(); i++) {
            auto xi = X[i];
            int d = y[i];
            double net = xi[0] * w[0] + xi[1] * w[1] + b;
            int yPred = net >= 0.0 ? 1 : 0;
            int error = d - yPred;

            if (error != 0) {
                w[0] += lr * error * xi[0];
                w[1] += lr * error * xi[1];
                b += lr * error;
                errors++;
            }

            absoluteError += abs(error);
        }

        int hits = static_cast<int>(X.size()) - errors;
        cout << "EPOCA " << epoch
             << " | erros=" << errors
             << " | acertos=" << hits
             << " | erro absoluto=" << fixed << setprecision(3) << absoluteError
             << " | w=(" << setprecision(2) << w[0] << "," << w[1] << ")"
             << " | b=" << b << "\\n";

        if (errors == 0) {
            cout << "Convergencia atingida na epoca " << epoch << ".\\n";
            break;
        }
    }

    cout << "\\n=== RESULTADO FINAL ===\\n";
    cout << "Pesos finais: " << fixed << setprecision(2) << w[0] << ", " << w[1] << "\\n";
    cout << "Bias final: " << fixed << setprecision(2) << b << "\\n";
    return 0;
}`;

const rustFullSnippet = `fn format(v: f64, digits: usize) -> String {
    format!("{:.1$}", v, digits)
}

fn main() {
    let x = vec![vec![0.0, 0.0], vec![0.0, 1.0], vec![1.0, 0.0], vec![1.0, 1.0]];
    let y = vec![0, 0, 0, 1];

    let mut w = vec![0.0, 0.0];
    let mut b = 0.0;
    let lr = 0.1;
    let epochs = 50;

    println!("=== INICIO DO TREINAMENTO ===");
    for epoch in 1..=epochs {
        let mut errors = 0;
        let mut absolute_error = 0.0;
        println!("\\nEPOCA {}", epoch);

        for (i, xi) in x.iter().enumerate() {
            let d = y[i];
            let prev_w = w.clone();
            let prev_b = b;
            let net = xi[0] * w[0] + xi[1] * w[1] + b;
            let y_pred = if net >= 0.0 { 1 } else { 0 };
            let error = d - y_pred;
            let delta_w1 = lr * error as f64 * xi[0];
            let delta_w2 = lr * error as f64 * xi[1];
            let delta_b = lr * error as f64;

            if error != 0 {
                w[0] += delta_w1;
                w[1] += delta_w2;
                b += delta_b;
                errors += 1;
            }

            absolute_error += (error as f64).abs();
            println!(
                "[A{}] x=({:.0},{:.0}) d={} y*={} y={} e={} DeltaW=({},{}) DeltaB={} | w:({},{}) -> ({},{}) b:{} -> {}",
                i + 1,
                xi[0],
                xi[1],
                d,
                format(net, 3),
                y_pred,
                error,
                format(delta_w1, 3),
                format(delta_w2, 3),
                format(delta_b, 3),
                format(prev_w[0], 2),
                format(prev_w[1], 2),
                format(w[0], 2),
                format(w[1], 2),
                format(prev_b, 2),
                format(b, 2),
            );
        }

        let hits = x.len() as i32 - errors;
        println!(
            "Resumo epoca {}: erros={} | acertos={} | erro absoluto acumulado={}",
            epoch,
            errors,
            hits,
            format(absolute_error, 3)
        );

        if errors == 0 {
            println!("Convergencia atingida na epoca {}.", epoch);
            break;
        }
    }

    println!("\\n=== RESULTADO FINAL ===");
    println!("Pesos finais: {}, {}", format(w[0], 2), format(w[1], 2));
    println!("Bias final: {}", format(b, 2));
}`;

const rustSummarySnippet = `fn format(v: f64, digits: usize) -> String {
    format!("{:.1$}", v, digits)
}

fn main() {
    let x = vec![vec![0.0, 0.0], vec![0.0, 1.0], vec![1.0, 0.0], vec![1.0, 1.0]];
    let y = vec![0, 0, 0, 1];

    let mut w = vec![0.0, 0.0];
    let mut b = 0.0;
    let lr = 0.1;
    let epochs = 50;

    println!("=== INICIO DO TREINAMENTO (RESUMIDO) ===");
    for epoch in 1..=epochs {
        let mut errors = 0;
        let mut absolute_error = 0.0;

        for (i, xi) in x.iter().enumerate() {
            let d = y[i];
            let net = xi[0] * w[0] + xi[1] * w[1] + b;
            let y_pred = if net >= 0.0 { 1 } else { 0 };
            let error = d - y_pred;

            if error != 0 {
                w[0] += lr * error as f64 * xi[0];
                w[1] += lr * error as f64 * xi[1];
                b += lr * error as f64;
                errors += 1;
            }

            absolute_error += (error as f64).abs();
        }

        let hits = x.len() as i32 - errors;
        println!(
            "EPOCA {} | erros={} | acertos={} | erro absoluto={} | w=({}, {}) | b={}",
            epoch,
            errors,
            hits,
            format(absolute_error, 3),
            format(w[0], 2),
            format(w[1], 2),
            format(b, 2)
        );

        if errors == 0 {
            println!("Convergencia atingida na epoca {}.", epoch);
            break;
        }
    }

    println!("\\n=== RESULTADO FINAL ===");
    println!("Pesos finais: {}, {}", format(w[0], 2), format(w[1], 2));
    println!("Bias final: {}", format(b, 2));
}`;

const codeSnippetsByMode: Record<LogMode, Record<string, string>> = {
  full: {
    Python: pyFullSnippet,
    JavaScript: jsFullRunnableSnippet,
    TypeScript: tsFullSnippet,
    Java: javaFullSnippet,
    "C++": cppFullSnippet,
    Rust: rustFullSnippet,
  },
  summary: {
    Python: pySummarySnippet,
    JavaScript: jsSummaryRunnableSnippet,
    TypeScript: tsSummarySnippet,
    Java: javaSummarySnippet,
    "C++": cppSummarySnippet,
    Rust: rustSummarySnippet,
  },
};

const runnableSnippetsByMode: Record<LogMode, Record<string, string>> = {
  full: {
    JavaScript: jsFullRunnableSnippet,
    TypeScript: jsFullRunnableSnippet,
  },
  summary: {
    JavaScript: jsSummaryRunnableSnippet,
    TypeScript: jsSummaryRunnableSnippet,
  },
};

const languages = Object.keys(codeSnippetsByMode.full);
const logModes: LogMode[] = ["full", "summary"];

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
  const [logMode, setLogMode] = useState<LogMode>("full");
  const [copied, setCopied] = useState(false);
  const [runOutput, setRunOutput] = useState("");
  const [runStatus, setRunStatus] = useState<"idle" | "success" | "error">("idle");

  const codeSnippets = codeSnippetsByMode[logMode];
  const runnableSnippets = runnableSnippetsByMode[logMode];
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

  const resetRunState = () => {
    setCopied(false);
    setRunStatus("idle");
    setRunOutput("");
  };

  const handleLanguageChange = (lang: string) => {
    setActiveLang(lang);
    resetRunState();
  };

  const handleLogModeChange = (mode: LogMode) => {
    setLogMode(mode);
    resetRunState();
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

      <div className="px-5 pt-3 flex flex-wrap items-center gap-2">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Modo de log</p>
        {logModes.map((mode) => (
          <button
            key={mode}
            onClick={() => handleLogModeChange(mode)}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
              logMode === mode
                ? "bg-emerald-600 text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {mode === "full" ? "Log completo" : "Log resumido"}
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
          <p className="text-xs text-muted-foreground">
            {logMode === "full"
              ? "Modo completo: mostra cada amostra com y*, erro, DeltaW/DeltaB e transicao dos pesos."
              : "Modo resumido: mostra resumo por epoca (erros, acertos, erro absoluto e pesos atualizados)."}
          </p>

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
