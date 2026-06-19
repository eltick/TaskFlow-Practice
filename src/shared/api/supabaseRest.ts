const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

const readResponse = async <T,>(response: Response) => {
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
};

export const supabaseRest = async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase не настроен");
  }

  const headers = new Headers(options.headers);
  headers.set("apikey", supabaseKey);
  headers.set("Content-Type", "application/json");
  headers.set("Prefer", headers.get("Prefer") ?? "return=representation");

  if (supabaseKey.startsWith("eyJ")) {
    headers.set("Authorization", `Bearer ${supabaseKey}`);
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Запрос к Supabase не выполнен");
  }

  return readResponse<T>(response);
};
