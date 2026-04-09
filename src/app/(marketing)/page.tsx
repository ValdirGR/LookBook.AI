"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Image, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

import "./marketing.css";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          <span className="hero-badge">
            <Sparkles size={14} />
            Powered by AI
          </span>
          <h1 className="hero-title">
            Lookbooks editoriais
            <br />
            <span className="text-gradient">em minutos, não semanas</span>
          </h1>
          <p className="hero-subtitle">
            Transforme suas peças de moda em fotos editoriais profissionais
            usando Inteligência Artificial. Upload da peça → escolha o estilo
            → receba o lookbook pronto.
          </p>
          <div className="hero-actions">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Começar Grátis
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/#como-funciona">
              <Button variant="outline" size="lg">
                Ver como funciona
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="hero-mockup">
            <div className="hero-mockup-before">
              <div className="hero-mockup-label">Peça original</div>
              <div className="hero-mockup-placeholder">
                <Image size={48} className="hero-mockup-icon" />
              </div>
            </div>
            <div className="hero-mockup-arrow">
              <Sparkles size={20} />
            </div>
            <div className="hero-mockup-after">
              <div className="hero-mockup-label">Lookbook editorial</div>
              <div className="hero-mockup-placeholder hero-mockup-result">
                <Image size={48} className="hero-mockup-icon" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: <Image size={28} />,
      title: "Upload da peça",
      description:
        "Faça upload da foto da sua peça de roupa. Nossa IA identifica tipo, cor e textura automaticamente.",
    },
    {
      icon: <Sparkles size={28} />,
      title: "Escolha o estilo",
      description:
        "Selecione o mood editorial, tipo de modelo e cenário. Ou deixe nossa IA decidir a melhor composição.",
    },
    {
      icon: <Zap size={28} />,
      title: "Receba o lookbook",
      description:
        "Em segundos, receba 3 variações editoriais em alta resolução. Baixe individual ou em ZIP.",
    },
  ];

  return (
    <section id="como-funciona" className="how-it-works">
      <div className="how-inner">
        <motion.div
          className="how-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="how-title">
            Como <span className="text-gradient">funciona</span>
          </h2>
          <p className="how-subtitle">
            Três passos para transformar suas peças em lookbooks editoriais
            profissionais.
          </p>
        </motion.div>

        <div className="how-steps">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="how-step"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="how-step-number">{String(i + 1).padStart(2, "0")}</div>
              <div className="how-step-icon">{step.icon}</div>
              <h3 className="how-step-title">{step.title}</h3>
              <p className="how-step-desc">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
