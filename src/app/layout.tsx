import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Providers from "./providers";
import "../index.css";

export const metadata: Metadata = {
  title: "Redes Neurais Artificiais",
  description: "Visualização interativa de modelos de redes neurais artificiais.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
