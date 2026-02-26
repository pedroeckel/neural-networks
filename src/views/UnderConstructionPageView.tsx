import { Brain, Construction } from "lucide-react";
import MainMenu from "@/components/MainMenu";

interface UnderConstructionPageProps {
  modelName: string;
}

const UnderConstructionPage = ({ modelName }: UnderConstructionPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center glow-primary">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                Redes Neurais Artificiais
              </h1>
              <p className="text-xs text-muted-foreground">
                Navegue entre os modelos disponíveis
              </p>
            </div>
          </div>
          <MainMenu />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Construction className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{modelName}</h2>
          <p className="text-muted-foreground">
            Esta página está em construção.
          </p>
          <p className="text-sm text-muted-foreground">
            O conteúdo deste modelo será disponibilizado em breve.
          </p>
        </div>
      </main>
    </div>
  );
};

export default UnderConstructionPage;
