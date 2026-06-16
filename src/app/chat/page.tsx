"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "俺は元自衛隊×パーソナルトレーナーの鬼教官だ。体力試験・ダイエット・トレーニングについて何でも聞け。遠慮はいらない。",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "通信エラーが発生した。もう一度試せ。" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "腕立てが10回しかできません",
    "3km走のタイムを縮めるには？",
    "消防士の試験に向けて何から始めればいい？",
    "体重を1ヶ月で5kg落としたい",
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#ffffff", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ヘッダー */}
      <div style={{ backgroundColor: "#111", borderBottom: "1px solid #222", padding: "1rem 1.5rem" }}>
        <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.15em", margin: "0 0 2px" }}>AI COACH</p>
        <h1 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 2px" }}>鬼教官に相談する</h1>
        <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>元自衛隊×パーソナルトレーナーが直接アドバイス</p>
      </div>

      {/* メッセージ一覧 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1rem", maxWidth: "720px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "1rem", display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && (
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#14532d", border: "1px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", marginRight: "8px", flexShrink: 0 }}>
                🪖
              </div>
            )}
            <div style={{
              maxWidth: "75%",
              backgroundColor: msg.role === "user" ? "#14532d" : "#111",
              border: `1px solid ${msg.role === "user" ? "#22c55e" : "#222"}`,
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              padding: "12px 16px",
              fontSize: "14px",
              lineHeight: "1.7",
              color: msg.role === "user" ? "#e8f0e4" : "#ccc",
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#14532d", border: "1px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
              🪖
            </div>
            <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "16px 16px 16px 4px", padding: "12px 16px", color: "#888", fontSize: "14px" }}>
              考え中...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* サジェスト */}
      {messages.length === 1 && (
        <div style={{ padding: "0 1rem 1rem", maxWidth: "720px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          <p style={{ color: "#555", fontSize: "12px", margin: "0 0 8px" }}>よくある相談</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {suggestions.map((s) => (
              <button key={s} onClick={() => setInput(s)}
                style={{ padding: "6px 12px", backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "20px", color: "#888", fontSize: "12px", cursor: "pointer" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 入力エリア */}
      <div style={{ backgroundColor: "#111", borderTop: "1px solid #222", padding: "1rem", position: "sticky", bottom: 0 }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", gap: "8px" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="悩みや質問を入力せよ..."
            rows={1}
            style={{
              flex: 1, backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px",
              padding: "10px 14px", color: "#fff", fontSize: "14px", resize: "none",
              outline: "none", lineHeight: "1.5"
            }}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}
            style={{
              backgroundColor: loading || !input.trim() ? "#1a1a1a" : "#22c55e",
              color: loading || !input.trim() ? "#555" : "#000",
              border: "none", borderRadius: "8px", padding: "10px 16px",
              fontSize: "14px", fontWeight: "700", cursor: loading || !input.trim() ? "not-allowed" : "pointer"
            }}>
            送信
          </button>
        </div>
        <p style={{ color: "#444", fontSize: "11px", textAlign: "center", margin: "8px 0 0" }}>Enterで送信 / Shift+Enterで改行</p>
      </div>
    </div>
  );
}