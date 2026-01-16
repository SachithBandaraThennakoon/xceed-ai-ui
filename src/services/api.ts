const API_URL = "http://127.0.0.1:8000";

export async function sendMessage(
  message: string,
  sessionId?: string
) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      session_id: sessionId ?? null,
    }),
  });

  if (!res.ok) {
    throw new Error("Backend error");
  }

  return res.json();
}

export async function generateProposal(sessionId: string) {
  const res = await fetch(
    `${API_URL}/generate-proposal?session_id=${sessionId}`,
    { method: "POST" }
  );

  return res.json();
}
