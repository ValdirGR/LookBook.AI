"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Como Funciona", href: "/#como-funciona" },
  { label: "Showcase", href: "/#showcase" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="navbar">
      <nav className="navbar-inner" aria-label="Navegação principal">
        <Link href="/" className="navbar-logo" aria-label="LookBook AI - Home">
          <Logo size="md" />
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="navbar-link">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              Começar Grátis
            </Button>
          </Link>
        </div>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="navbar-mobile animate-slide-down">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="navbar-mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="navbar-mobile-actions">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="md" className="w-full">
                Entrar
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo size="md" />
          <p className="footer-tagline">
            Transforme peças de moda em lookbooks editoriais com Inteligência
            Artificial.
          </p>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <h4 className="footer-col-title">Produto</h4>
            <Link href="/#como-funciona" className="footer-link">
              Como Funciona
            </Link>
            <Link href="/pricing" className="footer-link">
              Pricing
            </Link>
            <Link href="/#showcase" className="footer-link">
              Showcase
            </Link>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Empresa</h4>
            <Link href="/about" className="footer-link">
              Sobre
            </Link>
            <Link href="/blog" className="footer-link">
              Blog
            </Link>
            <Link href="/contact" className="footer-link">
              Contato
            </Link>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Legal</h4>
            <Link href="/terms" className="footer-link">
              Termos de Uso
            </Link>
            <Link href="/privacy" className="footer-link">
              Privacidade
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} LookBook AI. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
