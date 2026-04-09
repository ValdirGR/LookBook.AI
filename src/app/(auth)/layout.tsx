import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-left-content">
          <Logo size="lg" />
          <h1 className="auth-headline">
            Lookbooks editoriais<br />
            <span className="text-gradient">gerados por IA</span>
          </h1>
          <p className="auth-subheadline">
            Transforme suas peças de moda em fotos editoriais profissionais em
            minutos, não semanas.
          </p>
        </div>
        <div className="auth-left-bg" aria-hidden="true" />
      </div>
      <div className="auth-right">
        <main className="auth-form-container">
          {children}
        </main>
      </div>
    </div>
  );
}
