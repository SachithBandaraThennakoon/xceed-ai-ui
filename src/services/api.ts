const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function sendMessage(
  message: string,
  sessionId?: string
) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      session_id: sessionId,
    }),
  });

  if (!res.ok) throw new Error("Chat failed");
  return res.json();
}

export async function generateProposal(sessionId: string) {
  const res = await fetch(
    `${API_BASE}/generate-proposal?session_id=${sessionId}`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error("Proposal failed");
  return res.json();
}

export async function sendProposalEmail(
  sessionId: string,
  email: string
) {
  const res = await fetch(`${API_BASE}/send-proposal-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      email,
    }),
  });

  if (!res.ok) throw new Error("Email failed");
  return res.json();
}
