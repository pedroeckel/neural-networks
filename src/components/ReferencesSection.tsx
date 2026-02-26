import { BookMarked } from "lucide-react";

const references = [
  {
    id: "siqueira-2021",
    content: (
      <>
        Siqueira, P.H., "Metaheurísticas e Aplicações". Disponível em: {"<"}
        <a
          href="https://paulohscwb.github.io/metaheuristicas/"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-4"
        >
          https://paulohscwb.github.io/metaheuristicas/
        </a>
        {">"}, Janeiro de 2021.
      </>
    ),
  },
  {
    id: "fausett-1994",
    content: "FAUSETT, L. Fundamentals of Neural Networks. Prentice Hall, 1994.",
  },
  {
    id: "haykin-1994",
    content: "HAYKIN, S. Neural Networks – A Compreensive Foundation. Macmillan College Publishing, 1994.",
  },
  {
    id: "silva-2010",
    content:
      "SILVA, I.N.; SPATTI, D.H.; FLAUZINO, R.A. Redes Neurais Artificiais para engenharia e ciências aplicadas. Artliber, 2010.",
  },
  {
    id: "tafner-1996",
    content:
      "TAFNER, M.A.; XEREZ, M.; RODRÍGUEZ FILHO, I.W. Redes Neurais Artificiais: introdução e princípios da neurocomputação. FURB, 1996.",
  },
];

const ReferencesSection = () => {
  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <BookMarked className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-primary glow-text font-mono tracking-wider uppercase">
          Referências
        </h3>
      </div>

      <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
        {references.map((reference) => (
          <li key={reference.id}>{reference.content}</li>
        ))}
      </ol>
    </section>
  );
};

export default ReferencesSection;
