"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const forgotSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export type ForgotPasswordState = {
  error?: string;
  success?: boolean;
};

export async function forgotPassword(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = forgotSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: "Erro ao enviar e-mail. Tente novamente." };
  }

  return { success: true };
}
