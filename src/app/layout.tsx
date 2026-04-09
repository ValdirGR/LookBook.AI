import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LookBook AI — Lookbooks Editoriais com IA",
    template: "%s | LookBook AI",
  },
  description:
    "Transforme peças de moda em lookbooks editoriais profissionais usando Inteligência Artificial. Geração automática de fotos editoriais para moda feminina.",
  keywords: [
    "lookbook",
    "moda",
    "inteligência artificial",
    "editorial",
    "fashion",
    "AI",
    "geração de imagens",
  ],
  authors: [{ name: "LookBook AI" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "LookBook AI",
    title: "LookBook AI — Lookbooks Editoriais com IA",
    description:
      "Transforme peças de moda em lookbooks editoriais profissionais usando Inteligência Artificial.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LookBook AI — Lookbooks Editoriais com IA",
    description:
      "Transforme peças de moda em lookbooks editoriais profissionais usando IA.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0E0D" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: "var(--font-body)",
                borderRadius: "var(--radius-lg)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
