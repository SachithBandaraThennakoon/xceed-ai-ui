export type ChatMessage = {
  role: "client" | "assistant" | "system" | "agent";
  content: string;
};
