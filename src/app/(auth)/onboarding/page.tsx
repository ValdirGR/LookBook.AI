"use client";

import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Store,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/logo";
import { completeOnboarding, type OnboardingState } from "@/actions/onboarding";

const SEGMENTS = [
  { value: "streetwear", label: "Streetwear", emoji: "🔥" },
  { value: "luxury", label: "Luxo", emoji: "💎" },
  { value: "casual", label: "Casual", emoji: "👕" },
  { value: "sportswear", label: "Sportswear", emoji: "🏃" },
  { value: "sustainable", label: "Sustentável", emoji: "🌿" },
  { value: "bridal", label: "Noivas", emoji: "💍" },
  { value: "kids", label: "Infantil", emoji: "🧸" },
  { value: "plus_size", label: "Plus Size", emoji: "✨" },
  { value: "other", label: "Outro", emoji: "🎨" },
];

const ROLES = [
  { value: "designer", label: "Designer de Moda", icon: "✏️" },
  { value: "photographer", label: "Fotógrafo", icon: "📷" },
  { value: "brand_owner", label: "Dono de Marca", icon: "👔" },
  { value: "agency", label: "Agência", icon: "🏢" },
  { value: "freelancer", label: "Freelancer", icon: "💻" },
  { value: "other", label: "Outro", icon: "🌟" },
];

const initialState: OnboardingState = {};

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [brandName, setBrandName] = useState("");
  const [segment, setSegment] = useState("");
  const [role, setRole] = useState("");
  const [state, formAction, isPending] = useActionState(completeOnboarding, initialState);

  const canProceed = [
    brandName.length >= 2,
    segment !== "",
    role !== "",
  ];

  const steps = [
    { title: "Sua marca", icon: <Store size={20} />, description: "Como se chama sua marca?" },
    { title: "Segmento", icon: <Sparkles size={20} />, description: "Qual o segmento principal?" },
    { title: "Seu perfil", icon: <User size={20} />, description: "Qual seu papel?" },
  ];

  return (
    <div className="onboarding">
      <div className="onboarding-inner">
        <div className="onboarding-header">
          <Logo size="md" />
          <p className="onboarding-welcome">Vamos configurar sua conta</p>
        </div>

        {/* Progress */}
        <div className="onboarding-progress">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={`onboarding-step-indicator ${i <= step ? "active" : ""} ${i < step ? "completed" : ""}`}
            >
              <div className="onboarding-step-dot">
                {i < step ? <CheckCircle size={14} /> : <span>{i + 1}</span>}
              </div>
              <span className="onboarding-step-label">{s.title}</span>
            </div>
          ))}
        </div>

        {state.error && (
          <div className="onboarding-alert">
            <AlertCircle size={16} />
            <span>{state.error}</span>
          </div>
        )}

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="onboarding-step-content"
          >
            <h2 className="onboarding-title">{steps[step].description}</h2>

            {step === 0 && (
              <div className="onboarding-field">
                <Input
                  label="Nome da marca"
                  name="brandName"
                  type="text"
                  placeholder="Ex: Studio Moderno"
                  icon={<Store size={18} />}
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            {step === 1 && (
              <div className="onboarding-grid">
                {SEGMENTS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    className={`onboarding-option ${segment === s.value ? "selected" : ""}`}
                    onClick={() => setSegment(s.value)}
                  >
                    <span className="onboarding-option-emoji">{s.emoji}</span>
                    <span className="onboarding-option-label">{s.label}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="onboarding-grid onboarding-grid-roles">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    className={`onboarding-option ${role === r.value ? "selected" : ""}`}
                    onClick={() => setRole(r.value)}
                  >
                    <span className="onboarding-option-emoji">{r.icon}</span>
                    <span className="onboarding-option-label">{r.label}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="onboarding-actions">
          {step > 0 && (
            <Button
              variant="ghost"
              size="md"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>
          )}

          <div className="onboarding-actions-right">
            {step < 2 ? (
              <Button
                variant="primary"
                size="lg"
                disabled={!canProceed[step]}
                onClick={() => setStep(step + 1)}
              >
                Próximo
                <ArrowRight size={16} />
              </Button>
            ) : (
              <form action={formAction}>
                <input type="hidden" name="brandName" value={brandName} />
                <input type="hidden" name="brandSegment" value={segment} />
                <input type="hidden" name="role" value={role} />
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  loading={isPending}
                  disabled={!canProceed[2]}
                >
                  <Sparkles size={16} />
                  Começar a criar
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .onboarding {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-cream);
          padding: var(--spacing-xl);
        }
        :global(.dark) .onboarding {
          background-color: #0F0E0D;
        }
        .onboarding-inner {
          width: 100%;
          max-width: 560px;
        }
        .onboarding-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-md);
        }
        .onboarding-welcome {
          font-size: var(--text-sm);
          color: var(--color-warm-gray);
        }
        .onboarding-progress {
          display: flex;
          justify-content: center;
          gap: var(--spacing-2xl);
          margin-bottom: var(--spacing-3xl);
        }
        .onboarding-step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.375rem;
        }
        .onboarding-step-dot {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: 2px solid var(--color-light-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--color-warm-gray);
          transition: all var(--duration-normal);
        }
        .onboarding-step-indicator.active .onboarding-step-dot {
          border-color: var(--color-rose-gold);
          color: var(--color-rose-gold);
          background: rgba(201, 169, 110, 0.08);
        }
        .onboarding-step-indicator.completed .onboarding-step-dot {
          border-color: var(--color-success);
          color: var(--color-success);
          background: var(--color-success-light);
        }
        .onboarding-step-label {
          font-size: var(--text-xs);
          font-weight: 500;
          color: var(--color-warm-gray);
        }
        .onboarding-step-indicator.active .onboarding-step-label {
          color: var(--color-charcoal);
        }
        :global(.dark) .onboarding-step-indicator.active .onboarding-step-label {
          color: var(--color-cream);
        }
        .onboarding-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          margin-bottom: var(--spacing-lg);
          background-color: var(--color-error-light);
          color: var(--color-error);
        }
        .onboarding-step-content {
          min-height: 280px;
        }
        .onboarding-title {
          font-family: var(--font-display);
          font-size: var(--text-2xl);
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }
        .onboarding-field {
          max-width: 400px;
          margin: 0 auto;
        }
        .onboarding-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .onboarding-grid-roles {
          grid-template-columns: repeat(3, 1fr);
        }
        .onboarding-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: var(--spacing-lg) var(--spacing-md);
          border: 1.5px solid var(--color-light-gray);
          border-radius: var(--radius-xl);
          background: none;
          cursor: pointer;
          transition: all var(--duration-normal) var(--ease-out-expo);
          font-family: var(--font-body);
        }
        .onboarding-option:hover {
          border-color: var(--color-rose-gold-light);
          background: rgba(201, 169, 110, 0.04);
        }
        .onboarding-option.selected {
          border-color: var(--color-rose-gold);
          background: rgba(201, 169, 110, 0.08);
          box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.1);
        }
        .onboarding-option-emoji {
          font-size: 1.5rem;
        }
        .onboarding-option-label {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-charcoal);
        }
        :global(.dark) .onboarding-option-label {
          color: var(--color-cream);
        }
        .onboarding-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--spacing-2xl);
          padding-top: var(--spacing-xl);
          border-top: 1px solid var(--color-light-gray);
        }
        .onboarding-actions-right {
          margin-left: auto;
        }
        @media (max-width: 640px) {
          .onboarding-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
