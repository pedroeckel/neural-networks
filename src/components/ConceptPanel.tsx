import { useState } from "react";
import { ChevronDown, ChevronUp, Brain, Calculator, GitBranch, LineChart } from "lucide-react";

const sections = [
  {
    title: "O que você está simulando nesta página?",
    icon: Brain,
    content: `Este simulador mostra um neurônio do tipo Perceptron em tempo real.

Você controla **entradas (x₁, x₂)**, **pesos (w₁, w₂)**, **bias (b)**, **limiar (θ)** e a **função de ativação** para ver o efeito imediato na saída.

Além do diagrama do neurônio, a página também exibe o **cálculo passo a passo**, a **fronteira de decisão**, o **algoritmo de treinamento**, a **prática por iteração**, os **códigos executáveis** e os **exercícios de fundamentos**.`
  },
  {
    title: "Um pouco da história do Perceptron",
    icon: Brain,
    content: `Criado na década de 1950 por **Frank Rosenblatt**, ele foi o primeiro modelo capaz de aprender com exemplos e ajustar seus próprios pesos, uma ideia revolucionária para a época. Sua estrutura imitava o funcionamento básico de um neurônio: entradas, pesos, uma soma e uma decisão.

Parece pouco, mas esse conceito deu origem a tudo que conhecemos hoje como **aprendizado de máquina**.`,
  },
  {
    title: "Como o cálculo é feito?",
    icon: Calculator,
    content: `A inferência do neurônio segue este fluxo:

1. **Multiplicação**: cada entrada é ponderada pelo seu peso.
   → x₁·w₁, x₂·w₂, ...

2. **Soma ponderada**: soma dos termos com o bias.
   → y* = Σ(xᵢ·wᵢ) + b

3. **Ativação**: a função escolhida transforma y* na saída final.
   → y = f(y*)

O parâmetro **θ** é usado especificamente na função **Limiar**.`,
  },
  {
    title: "O que são épocas de treinamento?",
    icon: Calculator,
    content: `No treinamento do Perceptron, uma **época** é uma passagem completa por todas as amostras do conjunto de treino.

Exemplo: se você tem 4 padrões de entrada, então 1 época = 4 atualizações (uma por padrão).

Ao final de cada época, avaliamos se ainda houve erro:
- se **não houve erro**, o modelo convergiu;
- se **houve erro**, iniciamos uma nova época com os pesos já ajustados.

Esse ciclo continua até convergir ou atingir o número máximo de épocas.`,
  },
  {
    title: "Funções de ativação disponíveis",
    icon: GitBranch,
    content: `**Limiar (θ)**: saída ternária. y=1 se y*>θ, y=0 se −θ≤y*≤θ, y=−1 se y*<−θ.

**Step (Degrau)**: saída binária clássica. y=1 se y*≥0, senão y=0.

**Sigmoid**: valor contínuo entre 0 e 1. Fórmula: 1/(1+e⁻ˣ).

**Tanh**: valor contínuo entre −1 e 1. Fórmula: tanh(x).

**ReLU**: 0 para negativos e valor linear para positivos. Fórmula: max(0, x).

**Gaussiana**: pico em 1 quando y*=0 e decai para 0. Fórmula: e^(−x²).`,
  },
  {
    title: "Como ler a fronteira de decisão?",
    icon: LineChart,
    content: `A linha da fronteira representa os pontos onde a soma líquida é nula:
→ w₁x₁ + w₂x₂ + b = 0

No gráfico, os pontos são convertidos para classes (0/1) conforme a ativação:

**Sigmoid/Gaussiana**: classe 1 quando saída ≥ 0.5.
**Tanh**: classe 1 quando saída ≥ 0.
**Demais funções**: classe 1 quando saída > 0.

Assim, você compara diretamente como cada função altera a separação dos mesmos dados.`,
  },
];

const ConceptPanel = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {sections.map((section, i) => {
        const Icon = section.icon;
        const isOpen = openIndex === i;
        return (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden transition-all">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/50 transition-colors"
            >
              <Icon className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-medium text-foreground flex-1">{section.title}</span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-1 text-sm text-secondary-foreground leading-relaxed whitespace-pre-line">
                {section.content.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                  j % 2 === 1 ? (
                    <span key={j} className="font-semibold text-foreground">{part}</span>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ConceptPanel;
