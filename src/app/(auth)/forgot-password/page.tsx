"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword, type ForgotPasswordState } from "@/actions/forgot-password";

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPassword, initialState);

  return (
    <div className="auth-form">
      <h2 className="auth-form-title">Recuperar senha</h2>
      <p className="auth-form-subtitle">
        Insira seu e-mail e enviaremos um link para redefinir sua senha.
      </p>

      {state.error && (
        <div className="auth-alert auth-alert-error">
          <AlertCircle size={16} />
          <span>{state.error}</span>
        </div>
      )}

      {state.success ? (
        <div className="auth-success-box">
          <CheckCircle size={32} className="auth-success-icon" />
          <h3 className="auth-success-title">E-mail enviado!</h3>
          <p className="auth-success-desc">
            Verifique sua caixa de entrada e clique no link para redefinir sua senha.
          </p>
          <Link href="/login">
            <Button variant="outline" size="md">
              <ArrowLeft size={16} />
              Voltar ao login
            </Button>
          </Link>
        </div>
      ) : (
        <form action={formAction} className="auth-fields">
          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="seu@email.com"
            icon={<Mail size={18} />}
            required
            autoComplete="email"
            autoFocus
          />
          <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">
            Enviar link de recuperação
          </Button>
        </form>
      )}

      <p className="auth-switch">
        <Link href="/login" className="auth-link">
          <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "middle" }} />
          {" "}Voltar ao login
        </Link>
      </p>

      <style jsx>{`
        .auth-form { width: 100%; }
        .auth-form-title {
          font-family: var(--font-display);
          font-size: var(--text-2xl);
          margin-bottom: 0.25rem;
        }
        .auth-form-subtitle {
          font-size: var(--text-sm);
          color: var(--color-warm-gray);
          margin-bottom: var(--spacing-2xl);
        }
        .auth-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          margin-bottom: var(--spacing-lg);
        }
        .auth-alert-error {
          background-color: var(--color-error-light);
          color: var(--color-error);
        }
        .auth-fields {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }
        .auth-success-box {
          text-align: center;
          padding: var(--spacing-2xl);
          border: 1px solid var(--color-success-light);
          border-radius: var(--radius-xl);
          background: var(--color-success-light);
        }
        .auth-success-icon {
          color: var(--color-success);
          margin-bottom: var(--spacing-md);
        }
        .auth-success-title {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          margin-bottom: var(--spacing-sm);
        }
        .auth-success-desc {
          font-size: var(--text-sm);
          color: var(--color-warm-gray);
          margin-bottom: var(--spacing-lg);
        }
        .auth-link {
          font-size: var(--text-sm);
          color: var(--color-rose-gold);
          text-decoration: none;
          font-weight: 500;
        }
        .auth-link:hover { color: var(--color-rose-gold-dark); }
        .auth-switch {
          text-align: center;
          margin-top: var(--spacing-xl);
          font-size: var(--text-sm);
        }
      `}</style>
    </div>
  );
}
