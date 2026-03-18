import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** URL local sem servidor = connection refused. Não criar client para evitar tentativas de conexão. */
const isLocalUnreachable =
  typeof supabaseUrl === "string" &&
  (supabaseUrl.includes("127.0.0.1") || supabaseUrl.includes("localhost"));

/** Client só é criado se env estiver configurado e URL não for local (evita ERR_CONNECTION_REFUSED). */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey && !isLocalUnreachable
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : null;

/** Retorna o client ou lança com mensagem clara. Use nas páginas que dependem de Supabase. */
export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      isLocalUnreachable
        ? "Supabase em URL local (127.0.0.1/localhost) não está acessível. Use a URL do projeto na nuvem em .env.local ou inicie o Supabase local."
        : "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local"
    );
  }
  return supabase;
}
