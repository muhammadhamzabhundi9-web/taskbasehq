import { useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   TASKBASE HQ — AI TOOLS DASHBOARD
   Powered by Google Gemini API (FREE)
   ═══════════════════════════════════════════════════ */

const API_URL = "/api/generate";

const T = {
  bg: "#060810", bg2: "#0a0e1a", card: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.06)", accent: "#3b82f6", cyan: "#06b6d4",
  green: "#10b981", orange: "#f59e0b", red: "#ef4444",
  text: "#f1f5f9", muted: "#94a3b8", dim: "#475569",
  font: "'Outfit', -apple-system, system-ui, sans-serif",
};

const TOOLS = [
  { id: "chat", name: "AI Chat Assistant", icon: "🤖", desc: "Chat with advanced AI — ask anything, get instant answers", color: "#3b82f6",
    prompt: (input) => input, placeholder: "Ask me anything..." },
  { id: "writer", name: "AI Content Writer", icon: "📝", desc: "Blog posts, articles, ad copy — SEO optimized", color: "#10b981",
    prompt: (input) => `You are an expert content writer. Write a well-structured, engaging, SEO-optimized article/content about: ${input}. Use headers, subheaders, and make it comprehensive. Write at least 500 words.`, placeholder: "Topic: e.g., 'Benefits of AI in healthcare'" },
  { id: "code", name: "AI Code Generator", icon: "💻", desc: "Write, debug, explain code in 50+ languages", color: "#8b5cf6",
    prompt: (input) => `You are an expert programmer. ${input}. Provide clean, well-commented code with explanations. If debugging, explain the issue and provide the fix.`, placeholder: "e.g., 'Write a Python script to scrape websites'" },
  { id: "translator", name: "AI Translator Pro", icon: "🌐", desc: "Translate text to 130+ languages with context", color: "#06b6d4",
    prompt: (input) => `You are a professional translator. Translate the following text accurately while preserving tone, context, and meaning. If the target language is not specified, translate to English. Text: ${input}`, placeholder: "e.g., 'Translate to Spanish: Hello, how are you?'" },
  { id: "email", name: "AI Outreach Writer", icon: "📧", desc: "Cold emails, follow-ups that actually get replies", color: "#f59e0b",
    prompt: (input) => `You are an expert email copywriter known for high reply rates. Write a professional, compelling email based on this request: ${input}. Include subject line. Make it concise, personalized, and action-oriented. Provide 2 variations.`, placeholder: "e.g., 'Cold email to pitch web design services to restaurants'" },
  { id: "social", name: "AI Social Media Kit", icon: "📱", desc: "Posts + captions + hashtags for all platforms", color: "#ec4899",
    prompt: (input) => `You are a social media marketing expert. Create a complete social media content package for: ${input}. Include: 1) Instagram post caption with hashtags 2) Twitter/X post 3) LinkedIn post 4) Facebook post 5) TikTok/Reel script idea. Make each platform-specific and engaging.`, placeholder: "e.g., 'Promote a new coffee shop opening'" },
  { id: "seo", name: "AI SEO & Keywords", icon: "🔍", desc: "Keywords, meta tags, SEO audit for any topic", color: "#14b8a6",
    prompt: (input) => `You are an SEO expert. Provide a complete SEO analysis and strategy for: ${input}. Include: 1) Top 20 target keywords (with search intent) 2) Meta title and description 3) Content outline optimized for SEO 4) On-page SEO tips 5) Content gap opportunities.`, placeholder: "e.g., 'SEO strategy for an online fitness coaching website'" },
  { id: "research", name: "AI Research Agent", icon: "🔬", desc: "Deep research reports on any topic with insights", color: "#6366f1",
    prompt: (input) => `You are a senior research analyst. Write a comprehensive, well-structured research report on: ${input}. Include: Executive Summary, Key Findings, Detailed Analysis, Data & Statistics (use realistic estimates where needed), Recommendations, and Conclusion. Make it professional and data-driven.`, placeholder: "e.g., 'Market research on AI SaaS tools in 2026'" },
  { id: "resume", name: "AI Resume Builder", icon: "💼", desc: "ATS-optimized resumes that land interviews", color: "#f97316",
    prompt: (input) => `You are a professional resume writer and career coach. Create an ATS-optimized resume based on this information: ${input}. Format it professionally with: Contact Info, Professional Summary, Work Experience (with bullet points using action verbs and metrics), Skills, Education. Make it pass ATS scanners.`, placeholder: "e.g., 'Software developer, 3 years experience, Python, React, worked at startup'" },
  { id: "document", name: "AI Document Writer", icon: "📄", desc: "Reports, proposals, SOPs — any professional document", color: "#0ea5e9",
    prompt: (input) => `You are a professional document writer. Create a well-structured, professional document based on: ${input}. Use proper formatting with headers, sections, and professional language. Make it comprehensive and ready to use.`, placeholder: "e.g., 'Write a business proposal for a mobile app development project'" },
  { id: "data", name: "AI Data Analyzer", icon: "📊", desc: "Analyze data, find patterns, create insights", color: "#a855f7",
    prompt: (input) => `You are a data analyst expert. Analyze the following data or topic and provide insights: ${input}. Include: Key Metrics, Trends, Patterns, Visualizations (describe charts/graphs needed), Actionable Recommendations. Be specific and data-driven.`, placeholder: "e.g., 'Analyze e-commerce sales trends for Q1 2026'" },
  { id: "product", name: "AI Product Description", icon: "🛒", desc: "E-commerce product descriptions that sell", color: "#ef4444",
    prompt: (input) => `You are an expert e-commerce copywriter. Write compelling, conversion-optimized product descriptions for: ${input}. Include: Catchy headline, Key benefits (not just features), Emotional triggers, SEO-friendly content, Call to action. Write 3 variations: short (50 words), medium (150 words), and long (300 words).`, placeholder: "e.g., 'Wireless noise-cancelling headphones with 40hr battery'" },
  { id: "presentation", name: "AI Presentation Maker", icon: "📊", desc: "Slide content + speaker notes + structure", color: "#84cc16",
    prompt: (input) => `You are a presentation design expert. Create a complete presentation outline for: ${input}. For each slide include: Slide Title, Key Points (3-4 bullet points), Speaker Notes, Suggested Visual/Chart. Create 10-15 slides. Make it engaging and professional.`, placeholder: "e.g., 'Investor pitch deck for an AI startup'" },
  { id: "legal", name: "AI Legal Draft", icon: "⚖️", desc: "Contracts, NDAs, terms — basic legal documents", color: "#78716c",
    prompt: (input) => `You are a legal document assistant. Draft a basic legal document based on: ${input}. Include all standard clauses and sections. Add a disclaimer that this is a template and should be reviewed by a qualified attorney. Make it professional and comprehensive.`, placeholder: "e.g., 'Freelance contract for web development services'" },
  { id: "invoice", name: "AI Invoice Generator", icon: "🧾", desc: "Professional invoices in seconds", color: "#22c55e",
    prompt: (input) => `You are an accounting assistant. Create a detailed, professional invoice based on: ${input}. Include: Invoice number, Date, From/To details, Line items with quantities and rates, Subtotal, Tax, Total, Payment terms, Bank details placeholder. Format it clearly.`, placeholder: "e.g., 'Invoice for 3 logo designs at $200 each, client: ABC Corp'" },
];

async function callGemini(prompt) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text || "No response generated.";
}

function ToolCard({ tool, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
      borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
      background: active ? `${tool.color}15` : "transparent",
      border: `1px solid ${active ? tool.color + "40" : "transparent"}`,
    }}>
      <span style={{ fontSize: 22 }}>{tool.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: active ? "#fff" : T.muted, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.name}</div>
        <div style={{ color: T.dim, fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.desc}</div>
      </div>
    </div>
  );
}

function OutputBox({ text, loading }) {
  if (loading) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 12, animation: "spin 1s linear infinite" }}>⚡</div>
      <div style={{ color: T.accent, fontSize: 14, fontWeight: 700 }}>AI is thinking...</div>
      <div style={{ color: T.dim, fontSize: 12, marginTop: 4 }}>This may take a few seconds</div>
    </div>
  );
  if (!text) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>✨</div>
      <div style={{ color: T.dim, fontSize: 14 }}>Your AI-generated content will appear here</div>
    </div>
  );
  return (
    <div style={{ padding: "20px", whiteSpace: "pre-wrap", color: T.text, fontSize: 14, lineHeight: 1.8, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {text}
    </div>
  );
}

export default function Dashboard() {
  const [activeTool, setActiveTool] = useState(TOOLS[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  const handleGenerate = useCallback(async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput("");
    try {
      const prompt = activeTool.prompt(input.trim());
      const result = await callGemini(prompt);
      setOutput(result);
      setUsageCount(c => c + 1);
      setHistory(h => [{ tool: activeTool.name, input: input.trim(), output: result, time: new Date().toLocaleTimeString() }, ...h.slice(0, 19)]);
    } catch (err) {
      setOutput(`Error: ${err.message}. Please try again.`);
    }
    setLoading(false);
  }, [input, activeTool, loading]);

  const copyOutput = () => {
    navigator.clipboard?.writeText(output);
  };

  const selectTool = (tool) => {
    setActiveTool(tool);
    setInput("");
    setOutput("");
    setSidebarOpen(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, fontFamily: T.font, color: T.text, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; background: ${T.bg}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
        textarea::placeholder, input::placeholder { color: #4a5568 !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40 }} />}

      {/* Sidebar */}
      <div style={{
        width: 280, background: T.bg2, borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0,
        position: sidebarOpen ? "fixed" : "relative",
        left: sidebarOpen ? 0 : undefined,
        top: 0, bottom: 0, zIndex: 50,
        transform: !sidebarOpen && typeof window !== "undefined" && window.innerWidth < 768 ? "translateX(-100%)" : "translateX(0)",
        transition: "transform 0.3s ease"
      }}>
        {/* Logo */}
        <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${T.accent}, ${T.cyan})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 900, color: "#fff"
            }}>TB</div>
            <div>
              <div style={{ color: "#fff", fontSize: 15, fontWeight: 900 }}>TaskBase HQ</div>
              <div style={{ color: T.cyan, fontSize: 9, fontWeight: 700, letterSpacing: 1.5 }}>AI TOOLS PLATFORM</div>
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginTop: 12,
            background: `${T.green}12`, border: `1px solid ${T.green}30`,
            padding: "6px 10px", borderRadius: 8
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
            <span style={{ color: T.green, fontSize: 11, fontWeight: 700 }}>FREE TRIAL ACTIVE</span>
            <span style={{ color: T.dim, fontSize: 10, marginLeft: "auto" }}>{usageCount} uses</span>
          </div>
        </div>

        {/* Tools list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
          <div style={{ color: T.dim, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: "8px 8px 6px", marginTop: 4 }}>AI TOOLS ({TOOLS.length})</div>
          {TOOLS.map(tool => (
            <ToolCard key={tool.id} tool={tool} active={activeTool.id === tool.id} onClick={() => selectTool(tool)} />
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="https://wa.me/923232108023" target="_blank" rel="noopener noreferrer" style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              background: "#25D36612", border: "1px solid #25D36625", borderRadius: 8,
              padding: "8px", textDecoration: "none", color: "#25D366", fontSize: 11, fontWeight: 700
            }}>💬 Support</a>
            <a href="mailto:support@taskbasehq.com" style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              background: `${T.accent}12`, border: `1px solid ${T.accent}25`, borderRadius: 8,
              padding: "8px", textDecoration: "none", color: T.accent, fontSize: 11, fontWeight: 700
            }}>📧 Email</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
          borderBottom: `1px solid ${T.border}`, background: T.bg2
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: "rgba(255,255,255,0.05)", border: "none", color: T.muted,
            width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>☰</button>
          <span style={{ fontSize: 24 }}>{activeTool.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>{activeTool.name}</div>
            <div style={{ color: T.dim, fontSize: 11 }}>{activeTool.desc}</div>
          </div>
          <div style={{
            background: `${activeTool.color}15`, border: `1px solid ${activeTool.color}30`,
            padding: "4px 10px", borderRadius: 6
          }}>
            <span style={{ color: activeTool.color, fontSize: 11, fontWeight: 700 }}>⚡ Powered by AI</span>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Input Section */}
          <div style={{ padding: "16px 16px 0" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
              placeholder={activeTool.placeholder}
              rows={4}
              style={{
                width: "100%", background: "rgba(255,255,255,0.03)",
                border: `1px solid ${T.border}`, borderRadius: 12,
                padding: "14px 16px", color: "#fff", fontSize: 14,
                fontFamily: T.font, outline: "none", resize: "vertical",
                boxSizing: "border-box", lineHeight: 1.6
              }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <button onClick={handleGenerate} disabled={loading || !input.trim()} style={{
                background: loading ? T.dim : `linear-gradient(135deg, ${activeTool.color}, ${T.cyan})`,
                border: "none", color: "#fff", padding: "11px 24px", borderRadius: 10,
                fontSize: 14, fontWeight: 800, cursor: loading ? "wait" : "pointer",
                fontFamily: T.font, boxShadow: loading ? "none" : `0 4px 15px ${activeTool.color}30`,
                opacity: !input.trim() ? 0.5 : 1
              }}>
                {loading ? "⏳ Generating..." : "⚡ Generate"}
              </button>
              {output && (
                <>
                  <button onClick={copyOutput} style={{
                    background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`,
                    color: T.muted, padding: "11px 18px", borderRadius: 10,
                    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.font
                  }}>📋 Copy</button>
                  <button onClick={() => { setInput(""); setOutput(""); }} style={{
                    background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`,
                    color: T.muted, padding: "11px 18px", borderRadius: 10,
                    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.font
                  }}>🗑️ Clear</button>
                </>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div style={{
            flex: 1, margin: "12px 16px 16px", background: "rgba(255,255,255,0.02)",
            border: `1px solid ${T.border}`, borderRadius: 14, overflowY: "auto",
            position: "relative"
          }}>
            {output && (
              <div style={{
                position: "sticky", top: 0, padding: "8px 16px",
                background: `${T.bg}ee`, borderBottom: `1px solid ${T.border}`,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ color: T.dim, fontSize: 11, fontWeight: 600 }}>📄 AI OUTPUT</span>
                <span style={{ color: T.dim, fontSize: 11 }}>{output.length} chars</span>
              </div>
            )}
            <OutputBox text={output} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
