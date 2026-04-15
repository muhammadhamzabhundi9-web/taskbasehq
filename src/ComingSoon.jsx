import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   TASKBASE HQ — COMING SOON (DRAFT MODE)
   Replace App.jsx with full site when ready to launch
   ═══════════════════════════════════════════════════ */

const SITE = {
  name: "TaskBase HQ",
  domain: "taskbasehq.com",
  email: "support@taskbasehq.com",
  whatsapp: "+923232108023",
  whatsappDisplay: "+92 323 2108023",
  twitter: "@TaskBaseHQ",
};

// SET YOUR LAUNCH DATE HERE (change when ready)
const LAUNCH_DATE = new Date("2025-05-01T00:00:00");

const T = {
  bg: "#060810",
  accent: "#3b82f6",
  cyan: "#06b6d4",
  green: "#10b981",
  text: "#f1f5f9",
  muted: "#94a3b8",
  dim: "#475569",
  font: "'Outfit', -apple-system, system-ui, sans-serif",
};

function useCountdown(target) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

export default function ComingSoon() {
  const countdown = useCountdown(LAUNCH_DATE.getTime());
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailList, setEmailList] = useState([]);

  const handleSubmit = () => {
    if (email && email.includes("@")) {
      setEmailList([...emailList, email]);
      setSubmitted(true);
      setEmail("");
      // In production, this would send to a backend/email service
      // For now it stores locally
      try {
        const existing = JSON.parse(localStorage.getItem("tb_waitlist") || "[]");
        existing.push({ email, date: new Date().toISOString() });
        localStorage.setItem("tb_waitlist", JSON.stringify(existing));
      } catch(e) {}
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: T.bg, fontFamily: T.font,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "20px 16px", position: "relative",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; background: ${T.bg}; }
        input::placeholder { color: #4a5568 !important; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.1); } 50% { box-shadow: 0 0 40px rgba(59,130,246,0.25); } }
      `}</style>

      {/* Background Effects */}
      <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Main Content */}
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center", position: "relative" }}>

        {/* Logo */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: `linear-gradient(135deg, ${T.accent}, ${T.cyan})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 900, color: "#fff",
            boxShadow: `0 8px 30px rgba(59,130,246,0.3)`,
            animation: "float 3s ease-in-out infinite"
          }}>TB</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>TaskBase HQ</div>
            <div style={{ color: T.cyan, fontSize: 10, fontWeight: 700, letterSpacing: 2 }}>AI TOOLS PLATFORM</div>
          </div>
        </div>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: `${T.accent}12`, border: `1px solid ${T.accent}25`,
          padding: "6px 16px", borderRadius: 20, marginBottom: 24
        }}>
          <span style={{ animation: "pulse 2s infinite", fontSize: 8, color: T.green }}>●</span>
          <span style={{ color: T.accent, fontSize: 12, fontWeight: 700 }}>LAUNCHING SOON</span>
        </div>

        {/* Heading */}
        <h1 style={{
          color: "#fff", fontSize: "clamp(32px, 8vw, 52px)", fontWeight: 900,
          lineHeight: 1.1, margin: "0 0 16px", letterSpacing: -2
        }}>
          Something{" "}
          <span style={{
            background: `linear-gradient(135deg, ${T.accent}, ${T.cyan})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Amazing</span>
          <br />Is Coming.
        </h1>

        <p style={{
          color: T.muted, fontSize: "clamp(15px, 3.5vw, 18px)", lineHeight: 1.6,
          margin: "0 auto 32px", maxWidth: 440
        }}>
          30+ Premium AI Tools — Image Generator, Video Creator, Voice Cloner, Content Writer & more.
          <strong style={{ color: T.green }}> All for $9.99/month.</strong>
        </p>

        {/* Countdown */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "clamp(8px, 3vw, 16px)",
          marginBottom: 36
        }}>
          {[
            { val: countdown.days, label: "Days" },
            { val: countdown.hours, label: "Hours" },
            { val: countdown.mins, label: "Minutes" },
            { val: countdown.secs, label: "Seconds" },
          ].map((t, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "16px 12px", minWidth: "clamp(60px, 15vw, 80px)",
              animation: "glow 4s infinite",
              animationDelay: `${i * 0.5}s`
            }}>
              <div style={{
                color: "#fff", fontSize: "clamp(24px, 6vw, 36px)", fontWeight: 900,
                lineHeight: 1, letterSpacing: -1
              }}>{String(t.val).padStart(2, "0")}</div>
              <div style={{ color: T.dim, fontSize: 10, fontWeight: 600, marginTop: 6, letterSpacing: 1 }}>{t.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Email Signup */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16, padding: "24px 20px", marginBottom: 28,
          animation: "glow 4s infinite"
        }}>
          {submitted ? (
            <div>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
              <div style={{ color: T.green, fontSize: 18, fontWeight: 800 }}>You're on the list!</div>
              <p style={{ color: T.muted, fontSize: 13, marginTop: 8 }}>We'll notify you when TaskBase HQ launches. Get ready for something incredible.</p>
              <button onClick={() => setSubmitted(false)} style={{
                background: "transparent", border: `1px solid ${T.accent}30`, color: T.accent,
                padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontFamily: T.font,
                fontSize: 12, fontWeight: 600, marginTop: 12
              }}>Add another email</button>
            </div>
          ) : (
            <>
              <div style={{ color: "#fff", fontSize: 16, fontWeight: 800, marginBottom: 4 }}>🔔 Get Notified on Launch</div>
              <p style={{ color: T.dim, fontSize: 12, marginBottom: 16 }}>Be the first to get access. Early subscribers get an exclusive discount.</p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="Enter your email..."
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14,
                    fontFamily: T.font, outline: "none", boxSizing: "border-box"
                  }}
                />
                <button onClick={handleSubmit} style={{
                  background: `linear-gradient(135deg, ${T.accent}, ${T.cyan})`,
                  border: "none", color: "#fff", padding: "13px 24px", borderRadius: 10,
                  fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: T.font,
                  boxShadow: `0 6px 20px rgba(59,130,246,0.25)`, whiteSpace: "nowrap"
                }}>Notify Me</button>
              </div>
            </>
          )}
        </div>

        {/* What's Coming */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ color: T.dim, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, marginBottom: 14 }}>WHAT'S COMING</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
            {[
              "🖼️ AI Images", "🎥 AI Videos", "🗣️ Voice Cloner", "📝 Content Writer",
              "✂️ BG Remover", "💻 Code Assistant", "📊 Presentations", "📱 Social Media",
              "🎵 Music Gen", "📄 PDF Tools", "🎭 Face Swap", "⌨️ Website Builder"
            ].map((t, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                padding: "6px 12px", borderRadius: 8, color: T.muted, fontSize: 11, fontWeight: 600
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Contact / WhatsApp */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap",
          marginBottom: 24
        }}>
          <a href={`https://wa.me/${SITE.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#25D36615", border: "1px solid #25D36630",
              padding: "10px 20px", borderRadius: 10, textDecoration: "none",
              color: "#25D366", fontSize: 13, fontWeight: 700
            }}>
            💬 WhatsApp Us
          </a>
          <a href={`mailto:${SITE.email}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `${T.accent}12`, border: `1px solid ${T.accent}25`,
              padding: "10px 20px", borderRadius: 10, textDecoration: "none",
              color: T.accent, fontSize: 13, fontWeight: 700
            }}>
            📧 {SITE.email}
          </a>
          <a href={`tel:${SITE.whatsapp}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `${T.cyan}12`, border: `1px solid ${T.cyan}25`,
              padding: "10px 20px", borderRadius: 10, textDecoration: "none",
              color: T.cyan, fontSize: 13, fontWeight: 700
            }}>
            📞 {SITE.whatsappDisplay}
          </a>
        </div>

        {/* Social Proof */}
        <div style={{
          background: "rgba(255,255,255,0.02)", borderRadius: 12,
          padding: "14px 20px", display: "inline-flex", gap: 20
        }}>
          {[
            { v: "30+", l: "AI Tools" },
            { v: "$9.99", l: "/month" },
            { v: "7 Days", l: "Free Trial" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ color: T.accent, fontSize: 18, fontWeight: 900 }}>{s.v}</div>
              <div style={{ color: T.dim, fontSize: 9, fontWeight: 600 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, color: T.dim, fontSize: 11 }}>
          © 2026 TaskBase HQ ({SITE.domain}). All rights reserved.
        </div>
      </div>
    </div>
  );
}
