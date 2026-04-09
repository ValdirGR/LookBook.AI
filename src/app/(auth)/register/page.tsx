"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register, loginWithGoogle, type AuthState } from "@/actions/auth";

const initialState: AuthState = {};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(register, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/login?registered=true");
    }
  }, [state.success, router]);

  return (
    <div className="auth-form">
      <h2 className="auth-form-title">Crie sua conta</h2>
      <p className="auth-form-subtitle">
        Comece a criar lookbooks editoriais profissionais com IA.
        10 créditos grátis para começar.
      </p>

      {state.error && (
        <div className="auth-alert auth-alert-error">
          <AlertCircle size={16} />
          <span>{state.error}</span>
        </div>
      )}

      {state.success && (
        <div className="auth-alert auth-alert-success">
          <CheckCircle size={16} />
          <span>Conta criada! Verifique seu e-mail para confirmar.</span>
        </div>
      )}

      <form action={formAction} className="auth-fields">
        <Input
          label="Nome completo"
          name="fullName"
          type="text"
          placeholder="Seu nome"
          icon={<User size={18} />}
          required
          autoComplete="name"
        />
        <Input
          label="E-mail"
          name="email"
          type="email"
          placeholder="seu@email.com"
          icon={<Mail size={18} />}
          required
          autoComplete="email"
        />
        <Input
          label="Senha"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Mínimo 8 caracteres"
          icon={<Lock size={18} />}
          hint="Use letras, números e caracteres especiais"
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn btn-ghost btn-icon"
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              style={{ width: 28, height: 28, padding: 0 }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          required
          minLength={8}
          autoComplete="new-password"
        />

        <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">
          Criar conta grátis
        </Button>
      </form>

      <div className="auth-divider">
        <span>ou</span>
      </div>

      <form action={loginWithGoogle}>
        <Button type="submit" variant="outline" size="lg" className="w-full">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          Continuar com Google
        </Button>
      </form>

      <p className="auth-switch">
        Já tem uma conta?{" "}
        <Link href="/login" className="auth-link">
          Entrar
        </Link>
      </p>

      <p className="auth-terms">
        Ao criar sua conta, você concorda com os{" "}
        <Link href="/terms" className="auth-link">Termos de Uso</Link>{" "}
        e a{" "}
        <Link href="/privacy" className="auth-link">Política de Privacidade</Link>.
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
        .auth-alert-success {
          background-color: var(--color-success-light);
          color: var(--color-success);
        }
        .auth-fields {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }
        .auth-link {
          font-size: var(--text-sm);
          color: var(--color-rose-gold);
          text-decoration: none;
          font-weight: 500;
          transition: color var(--duration-fast);
        }
        .auth-link:hover { color: var(--color-rose-gold-dark); }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin: var(--spacing-xl) 0;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background-color: var(--color-light-gray);
        }
        .auth-divider span {
          font-size: var(--text-sm);
          color: var(--color-warm-gray);
        }
        .auth-switch {
          text-align: center;
          margin-top: var(--spacing-xl);
          font-size: var(--text-sm);
          color: var(--color-warm-gray);
        }
        .auth-terms {
          text-align: center;
          margin-top: var(--spacing-md);
          font-size: var(--text-xs);
          color: var(--color-warm-gray-light);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
