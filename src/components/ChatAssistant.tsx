import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import mascotImg from "@/assets/holaweb-mascot.png";

type Message = { role: "user" | "assistant"; content: string };

interface ActionButton {
  type: "navigate" | "link";
  url: string;
  label: string;
}

function parseActions(text: string): { clean: string; actions: ActionButton[] } {
  const actions: ActionButton[] = [];
  const clean = text.replace(
    /\[ACTION:(navigate|link):([^\]]+):([^\]]+)\]/g,
    (_, type, url, label) => {
      actions.push({ type: type as "navigate" | "link", url, label });
      return "";
    }
  );
  return { clean: clean.trim(), actions };
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/holaweb-chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: Message[];
  onDelta: (t: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Something went wrong" }));
    throw new Error(err.error || "Failed to connect");
  }
  if (!resp.body) throw new Error("No stream");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const c = JSON.parse(json).choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch { buf = line + "\n" + buf; break; }
    }
  }
  onDone();
}

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let soFar = "";
    const upsert = (chunk: string) => {
      soFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant")
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: soFar } : m);
        return [...prev, { role: "assistant", content: soFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsert,
        onDone: () => setIsLoading(false),
      });
    } catch (e: any) {
      upsert(e.message || "Sorry, something went wrong. Please try again!");
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleAction = (action: ActionButton) => {
    if (action.type === "navigate") {
      navigate(action.url);
      setIsOpen(false);
    } else {
      window.open(action.url, "_blank", "noopener,noreferrer");
    }
  };



  return (
    <>
      {/* Floating mascot button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Mascot button with label */}
            <motion.button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-3 rounded-full bg-white border-2 border-primary/30 shadow-xl pr-5 pl-1 py-1 hover:border-primary/60 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ y: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={mascotImg}
                  alt="Ola - Holaweb Assistant"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="font-subheading text-sm font-semibold whitespace-nowrap">
                <span className="text-black">Hola, Chat with</span> <span className="text-primary">Ola!</span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-2rem)] bg-card border border-primary/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 flex-shrink-0 bg-white">
                <img src={mascotImg} alt="Ola" className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-subheading text-sm font-semibold text-foreground">Ola</h3>
                <p className="text-xs text-muted-foreground">Holaweb Assistant</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border border-primary/20 bg-white">
                    <img src={mascotImg} alt="Ola" className="w-full h-full object-cover object-top" />
                  </div>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    Hey there! 👋 I'm <span className="text-primary font-semibold">Ola</span>, your guide to everything Holaweb. Ask me anything!
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["What does Holaweb do?", "Show me your services", "How can I get started?"].map(q => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="text-xs px-3 py-1.5 rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors font-body"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => {
                const { clean, actions } = msg.role === "assistant" ? parseActions(msg.content) : { clean: msg.content, actions: [] };
                return (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] ${msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2.5"
                      : "bg-muted/50 text-foreground rounded-2xl rounded-bl-sm px-4 py-2.5"
                    }`}>
                      <div className="text-sm font-body prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0 max-w-none [&_p]:text-inherit [&_li]:text-inherit [&_strong]:text-inherit">
                        <ReactMarkdown>{clean}</ReactMarkdown>
                      </div>
                      {actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-border/30">
                          {actions.map((a, j) => (
                            <button
                              key={j}
                              onClick={() => handleAction(a)}
                              className="inline-flex items-center gap-1 text-xs font-subheading font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              {a.label}
                              {a.type === "link" && <ExternalLink className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="px-4 py-3 border-t border-border flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about Holaweb..."
                className="flex-1 h-10 px-4 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
