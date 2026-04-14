import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════
   AI TOOLS STORE — Complete PWA Website
   ══════════════════════════════════════════ */

const PLANS = {
  monthly: { price: 9.99, label: "/month", period: "Monthly", save: null },
  yearly: { price: 79.99, label: "/year", period: "Yearly", save: "Save 33%" },
  lifetime: { price: 149.99, label: "one-time", period: "Lifetime", save: "Best Value" },
};

const FREE_TRIAL_DAYS = 7;

const CATEGORIES = [
  { id: "all", label: "All Tools", icon: "⚡" },
  { id: "image", label: "Image AI", icon: "🎨" },
  { id: "video", label: "Video AI", icon: "🎬" },
  { id: "writing", label: "Writing", icon: "✍️" },
  { id: "voice", label: "Voice & Audio", icon: "🎙️" },
  { id: "code", label: "Dev Tools", icon: "💻" },
  { id: "business", label: "Business", icon: "📊" },
  { id: "social", label: "Social Media", icon: "📱" },
  { id: "productivity", label: "Productivity", icon: "🚀" },
];

const TOOLS = [
  // IMAGE
  { id: 1, name: "AI Image Generator", desc: "Create stunning images from text prompts. Photorealistic, anime, digital art — any style you want.", category: "image", icon: "🖼️", marketPrice: 299, features: ["Unlimited generations", "4K resolution", "100+ art styles", "Commercial license"], badge: "🔥 #1 Popular" },
  { id: 2, name: "Background Remover", desc: "Remove backgrounds from any image in 1 click. Bulk process hundreds of images at once.", category: "image", icon: "✂️", marketPrice: 99, features: ["1-click removal", "Bulk processing", "HD export", "API access"], badge: "⚡ Instant" },
  { id: 3, name: "Photo Enhancer & Upscaler", desc: "Make blurry photos crystal clear. Upscale to 4K. Restore old damaged photos like magic.", category: "image", icon: "✨", marketPrice: 129, features: ["4x upscaling", "Photo restoration", "Colorize B&W", "Face enhancement"], badge: "📸 Must Have" },
  { id: 4, name: "AI Logo & Brand Kit", desc: "Generate professional logos, brand colors, business cards, letterheads — complete brand identity.", category: "image", icon: "💎", marketPrice: 349, features: ["Logo generator", "Brand color palette", "Business card design", "Social media kit"], badge: "🏆 Top Rated" },
  { id: 5, name: "AI Photo Editor", desc: "Edit photos with text commands. Remove objects, change backgrounds, adjust lighting — all with AI.", category: "image", icon: "🎨", marketPrice: 199, features: ["Object removal", "Background swap", "AI retouching", "Batch editing"], badge: "🎯 Smart Edit" },

  // VIDEO
  { id: 6, name: "Text to Video Creator", desc: "Type a script, get a professional video. AI generates scenes, animations, and voiceover.", category: "video", icon: "🎥", marketPrice: 399, features: ["Script to video", "AI animations", "Auto voiceover", "1080p export"], badge: "🚀 Trending" },
  { id: 7, name: "AI Face Swap & Deepfake", desc: "Swap faces in videos realistically. Create fun content, memes, and creative projects.", category: "video", icon: "🎭", marketPrice: 249, features: ["Realistic face swap", "Video & photo", "Real-time preview", "HD quality"], badge: "🔥 Viral Tool" },
  { id: 8, name: "Video Subtitle & Translator", desc: "Auto-generate subtitles in 100+ languages. Translate any video. Hardcode or export SRT.", category: "video", icon: "💬", marketPrice: 149, features: ["100+ languages", "Auto transcription", "SRT/VTT export", "Hardcoded subs"], badge: "🌍 Global" },
  { id: 9, name: "AI Video Editor", desc: "Edit videos with AI. Auto-cut highlights, remove silence, add effects, transitions — all automatic.", category: "video", icon: "🎬", marketPrice: 299, features: ["Auto highlights", "Silence removal", "AI transitions", "Color grading"], badge: "⚡ Auto Edit" },
  { id: 10, name: "AI Thumbnail Maker", desc: "Create click-worthy YouTube thumbnails in seconds. AI picks the best face, text, and layout.", category: "video", icon: "📺", marketPrice: 79, features: ["YouTube optimized", "Face detection", "Text overlay", "A/B testing"], badge: "📈 Get Clicks" },

  // WRITING
  { id: 11, name: "AI Content Writer", desc: "Write blog posts, articles, emails, ad copy — anything. SEO optimized. 10x faster writing.", category: "writing", icon: "📝", marketPrice: 149, features: ["Blog & articles", "Ad copy", "Email writer", "SEO optimizer"], badge: "✍️ Bestseller" },
  { id: 12, name: "AI Resume & Cover Letter", desc: "Build ATS-optimized resumes. AI writes your experience perfectly. Land 3x more interviews.", category: "writing", icon: "💼", marketPrice: 79, features: ["ATS optimized", "AI bullet points", "20+ templates", "Cover letters"], badge: "💼 Job Hunter" },
  { id: 13, name: "AI Translator Pro", desc: "Translate any text, document, or website to 130+ languages. Preserves tone and context.", category: "writing", icon: "🌐", marketPrice: 99, features: ["130+ languages", "Document translation", "Tone preservation", "Bulk translate"], badge: "🌍 130+ Lang" },
  { id: 14, name: "AI Grammar & Rewriter", desc: "Fix grammar, rewrite for clarity, change tone — make any text professional and polished.", category: "writing", icon: "🔤", marketPrice: 119, features: ["Grammar check", "Tone adjuster", "Plagiarism check", "Style rewriter"], badge: "✅ Polish Text" },

  // VOICE & AUDIO
  { id: 15, name: "AI Voice Cloner", desc: "Clone any voice from a 30-second sample. Ultra-realistic text-to-speech in 50+ languages.", category: "voice", icon: "🗣️", marketPrice: 249, features: ["Voice cloning", "50+ languages", "Emotion control", "Studio quality"], badge: "🎯 Hot Deal" },
  { id: 16, name: "AI Music Generator", desc: "Create royalty-free music, beats, and sound effects. Any genre, any mood, any length.", category: "voice", icon: "🎵", marketPrice: 279, features: ["All genres", "Royalty-free", "Custom length", "Sound effects"], badge: "🎵 Creator Pick" },
  { id: 17, name: "Podcast AI Editor", desc: "Remove filler words, enhance audio quality, auto-generate show notes and transcripts.", category: "voice", icon: "🎧", marketPrice: 199, features: ["Filler removal", "Audio enhance", "Auto transcripts", "Show notes"], badge: "🎙️ Podcast Pro" },

  // DEV TOOLS
  { id: 18, name: "AI Code Assistant", desc: "Write, debug, and review code in any language. Generate entire projects. Better than Copilot.", category: "code", icon: "⌨️", marketPrice: 199, features: ["All languages", "Debug & fix", "Project generator", "Code review"], badge: "💻 Dev Fav" },
  { id: 19, name: "AI Website Builder", desc: "Describe your website, AI builds it. Landing pages, portfolios, e-commerce — fully responsive.", category: "code", icon: "🌐", marketPrice: 299, features: ["Drag & drop", "Responsive design", "SEO built-in", "Custom domains"], badge: "🔥 No-Code" },
  { id: 20, name: "AI API & Docs Writer", desc: "Auto-generate API documentation, README files, and technical docs from your codebase.", category: "code", icon: "📄", marketPrice: 99, features: ["API docs", "README generator", "Code comments", "Changelog"], badge: "📖 Auto Docs" },

  // BUSINESS
  { id: 21, name: "AI Presentation Maker", desc: "Create stunning presentations in seconds. Auto-design, charts, animations. Export to PowerPoint.", category: "business", icon: "📊", marketPrice: 199, features: ["Auto slide design", "Charts & graphs", "50+ templates", "Export PPT/PDF"], badge: "📊 Office Must" },
  { id: 22, name: "AI Spreadsheet Assistant", desc: "Write formulas, analyze data, create charts, clean messy data — all with simple text commands.", category: "business", icon: "📈", marketPrice: 149, features: ["Formula writer", "Data analysis", "Chart creation", "Data cleaning"], badge: "📉 Data Pro" },
  { id: 23, name: "AI Invoice & Accounting", desc: "Generate professional invoices, track expenses, auto-categorize transactions with AI.", category: "business", icon: "🧾", marketPrice: 129, features: ["Invoice generator", "Expense tracker", "Auto categorize", "Tax reports"], badge: "💰 Finance" },

  // SOCIAL MEDIA
  { id: 24, name: "AI Social Media Manager", desc: "Generate posts, schedule content, analyze performance for all platforms from one dashboard.", category: "social", icon: "📱", marketPrice: 199, features: ["Multi-platform", "Auto scheduling", "AI captions", "Analytics"], badge: "📱 All-in-One" },
  { id: 25, name: "AI Hashtag & SEO Tool", desc: "Find trending hashtags, optimize captions for reach, analyze competitors — grow 10x faster.", category: "social", icon: "#️⃣", marketPrice: 79, features: ["Trending hashtags", "Caption optimizer", "Competitor analysis", "Growth insights"], badge: "📈 Grow Fast" },
  { id: 26, name: "AI Meme & Reel Maker", desc: "Create viral memes, Instagram reels, TikTok videos with AI. Auto-captions and trending audio.", category: "social", icon: "😂", marketPrice: 99, features: ["Meme generator", "Reel templates", "Auto captions", "Trending audio"], badge: "😂 Go Viral" },

  // PRODUCTIVITY
  { id: 27, name: "AI Email Assistant", desc: "Write, reply, summarize emails in seconds. Professional tone, perfect grammar, every time.", category: "productivity", icon: "📧", marketPrice: 99, features: ["Smart replies", "Email drafts", "Tone adjuster", "Meeting scheduler"], badge: "📧 Save Hours" },
  { id: 28, name: "AI Meeting Notes", desc: "Record meetings, get AI summaries, action items, and follow-up emails — automatically.", category: "productivity", icon: "📋", marketPrice: 149, features: ["Auto recording", "AI summaries", "Action items", "Follow-up emails"], badge: "📋 Never Forget" },
  { id: 29, name: "AI PDF & Document Tool", desc: "Chat with PDFs, extract data, merge, convert, fill forms — complete document toolkit.", category: "productivity", icon: "📄", marketPrice: 99, features: ["Chat with PDF", "Data extraction", "Merge & split", "Form filler"], badge: "📄 Doc Master" },
  { id: 30, name: "AI Task & Project Manager", desc: "AI auto-prioritizes tasks, suggests deadlines, tracks progress, and sends reminders.", category: "productivity", icon: "✅", marketPrice: 149, features: ["AI prioritization", "Auto deadlines", "Progress tracking", "Smart reminders"], badge: "✅ Get Organized" },
];

const TESTIMONIALS = [
  { name: "Sarah K.", role: "Freelance Designer", text: "I was paying $300+ for separate AI tools. Now I get everything for $9.99/mo. This is insane value!", avatar: "👩‍🎨", rating: 5 },
  { name: "Ahmed R.", role: "YouTuber, 500K subs", text: "The video tools alone saved me hours every week. Thumbnails, subtitles, editing — all AI powered.", avatar: "🎬", rating: 5 },
  { name: "Mike T.", role: "Startup Founder", text: "Replaced 8 different subscriptions with one. My team uses the writing, code, and presentation tools daily.", avatar: "👨‍💻", rating: 5 },
  { name: "Priya S.", role: "Marketing Manager", text: "Social media content that used to take days now takes minutes. The ROI is unbelievable.", avatar: "📱", rating: 5 },
  { name: "James L.", role: "E-commerce Owner", text: "Product photos, ad copy, invoices — everything I need to run my store. Best $9.99 I spend.", avatar: "🛒", rating: 5 },
  { name: "Fatima H.", role: "Content Creator", text: "Voice cloning and music generator are game changers. I create professional audio content from home.", avatar: "🎙️", rating: 5 },
];

const FAQ_DATA = [
  { q: "What do I get with my subscription?", a: "You get unlimited access to ALL 30+ AI tools in our store. Image generation, video creation, writing, voice cloning, coding, business tools — everything. One subscription, zero limits." },
  { q: "Is there a free trial?", a: `Yes! You get a ${FREE_TRIAL_DAYS}-day free trial with full access to every tool. No credit card required to start. Cancel anytime.` },
  { q: "Can I cancel anytime?", a: "Absolutely. Cancel with one click from your dashboard. No questions asked, no hidden fees. If you cancel during the free trial, you won't be charged anything." },
  { q: "How does this compare to individual AI tools?", a: "Most AI tools charge $20-$400/month EACH. Our platform bundles 30+ premium tools for just $9.99/month. You save over $2,000/month compared to buying them separately." },
  { q: "Do I own the content I create?", a: "Yes, 100%. Everything you create with our tools is yours. Full commercial license included. Use it for clients, businesses, social media — anything you want." },
  { q: "What's the Lifetime plan?", a: "Pay once ($149.99), use forever. No monthly payments, no renewals. You get lifetime access to all current tools AND all future tools we add." },
  { q: "Do you offer refunds?", a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, email us and we'll refund you — no questions asked." },
  { q: "Can I use this on mobile?", a: "Yes! Our platform works on any device. Plus, you can install it as an app on your phone — tap the install button and it works like a native app, even offline." },
];

const PAGES = { HOME: "home", TOOLS: "tools", PRICING: "pricing", FAQ: "faq", SUPPORT: "support" };

/* ─── STYLES ─── */
const C = {
  bg: "#05070e",
  card: "rgba(255,255,255,0.03)",
  cardBorder: "rgba(255,255,255,0.07)",
  accent: "#00d4ff",
  accent2: "#6366f1",
  green: "#10b981",
  red: "#ef4444",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  glow: "0 0 30px rgba(0,212,255,0.15)",
};

const font = `'Outfit', 'DM Sans', system-ui, sans-serif`;

/* ─── COMPONENTS ─── */

function Nav({ page, setPage, showInstall, setShowInstall }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { id: PAGES.HOME, label: "Home", icon: "🏠" },
    { id: PAGES.TOOLS, label: "Tools", icon: "⚡" },
    { id: PAGES.PRICING, label: "Pricing", icon: "💰" },
    { id: PAGES.FAQ, label: "FAQ", icon: "❓" },
    { id: PAGES.SUPPORT, label: "Support", icon: "💬" },
  ];

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "rgba(5,7,14,0.9)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.cardBorder}`, padding: "0 16px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 56, maxWidth: 900, margin: "0 auto" }}>
          <div onClick={() => setPage(PAGES.HOME)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 900, color: "#fff",
              boxShadow: `0 4px 15px rgba(0,212,255,0.25)`
            }}>AI</div>
            <div>
              <div style={{ color: "#fff", fontSize: 15, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2 }}>AI Tools Hub</div>
              <div style={{ color: C.accent, fontSize: 9, fontWeight: 700, letterSpacing: 1.5 }}>30+ PREMIUM TOOLS</div>
            </div>
          </div>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {links.map(l => (
              <button key={l.id} onClick={() => { setPage(l.id); setMenuOpen(false); }}
                style={{
                  background: page === l.id ? "rgba(0,212,255,0.12)" : "transparent",
                  border: "none", color: page === l.id ? C.accent : C.textMuted,
                  padding: "6px 10px", borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                  cursor: "pointer", fontFamily: font, display: "none",
                  ...(typeof window !== 'undefined' && window.innerWidth > 600 ? { display: "block" } : {})
                }}>{l.label}</button>
            ))}
            <button onClick={() => setShowInstall(true)} style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
              border: "none", color: "#fff", padding: "7px 14px", borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font,
              boxShadow: `0 4px 15px rgba(0,212,255,0.2)`,
              marginLeft: 4
            }}>📲 Install App</button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: "rgba(255,255,255,0.06)", border: "none",
              color: C.textMuted, width: 34, height: 34, borderRadius: 8,
              cursor: "pointer", fontSize: 16, marginLeft: 4
            }}>{menuOpen ? "✕" : "☰"}</button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            position: "absolute", top: 56, left: 0, right: 0,
            background: "rgba(5,7,14,0.98)", backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${C.cardBorder}`, padding: "8px 12px",
            animation: "fadeSlide 0.2s ease"
          }}>
            {links.map(l => (
              <button key={l.id} onClick={() => { setPage(l.id); setMenuOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  background: page === l.id ? "rgba(0,212,255,0.1)" : "transparent",
                  border: "none", color: page === l.id ? C.accent : C.text,
                  padding: "12px 14px", borderRadius: 10, fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: font, textAlign: "left"
                }}><span>{l.icon}</span>{l.label}</button>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

function Badge({ text, color }) {
  return (
    <span style={{
      background: `${color || C.accent}18`, color: color || C.accent,
      padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700
    }}>{text}</span>
  );
}

function Stars({ n = 5 }) {
  return <span style={{ color: "#fbbf24", fontSize: 12, letterSpacing: 1 }}>{"★".repeat(n)}</span>;
}

/* ─── HERO SECTION ─── */
function Hero({ setPage }) {
  const totalMarketValue = TOOLS.reduce((s, t) => s + t.marketPrice, 0);

  return (
    <section style={{ padding: "40px 16px 30px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)`,
        pointerEvents: "none"
      }} />

      <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
          padding: "6px 14px", borderRadius: 20, marginBottom: 20
        }}>
          <span style={{ fontSize: 12 }}>🎉</span>
          <span style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>{FREE_TRIAL_DAYS}-DAY FREE TRIAL — No Credit Card Needed</span>
        </div>

        <h1 style={{
          color: "#fff", fontSize: "clamp(28px, 6vw, 44px)", fontWeight: 900,
          lineHeight: 1.15, margin: "0 0 16px", letterSpacing: -1
        }}>
          Every AI Tool You Need.<br />
          <span style={{
            background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>One Subscription.</span>
        </h1>

        <p style={{ color: C.textMuted, fontSize: "clamp(14px, 3vw, 17px)", lineHeight: 1.6, margin: "0 auto 24px", maxWidth: 480 }}>
          30+ premium AI tools for images, videos, writing, voice, code & more. Others charge <strong style={{ color: C.red, textDecoration: "line-through" }}>${totalMarketValue.toLocaleString()}/mo</strong> for these tools separately. You pay just <strong style={{ color: C.green }}>$9.99/mo</strong>.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          <button onClick={() => setPage(PAGES.PRICING)} style={{
            background: `linear-gradient(135deg, ${C.accent}, #0066ff)`,
            border: "none", color: "#fff", padding: "14px 28px", borderRadius: 12,
            fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: font,
            boxShadow: `0 8px 30px rgba(0,212,255,0.3)`, letterSpacing: 0.3
          }}>🚀 Start Free Trial</button>
          <button onClick={() => setPage(PAGES.TOOLS)} style={{
            background: "rgba(255,255,255,0.06)", border: `1px solid ${C.cardBorder}`,
            color: C.text, padding: "14px 28px", borderRadius: 12,
            fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font
          }}>Explore Tools →</button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "AI Tools", value: "30+" },
            { label: "Happy Users", value: "50K+" },
            { label: "You Save", value: "97%" },
            { label: "Uptime", value: "99.9%" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ color: C.accent, fontSize: 22, fontWeight: 900 }}>{s.value}</div>
              <div style={{ color: C.textDim, fontSize: 11, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TOOL CARD ─── */
function ToolCard({ tool, onClick }) {
  return (
    <div onClick={() => onClick(tool)} style={{
      background: C.card, border: `1px solid ${C.cardBorder}`,
      borderRadius: 14, padding: "16px", cursor: "pointer",
      transition: "all 0.25s ease", position: "relative"
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "rgba(0,212,255,0.25)"; e.currentTarget.style.boxShadow = "0 12px 35px rgba(0,0,0,0.3)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = C.cardBorder; e.currentTarget.style.boxShadow = ""; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 28 }}>{tool.icon}</span>
        <Badge text={tool.badge} />
      </div>
      <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 800, margin: "0 0 6px" }}>{tool.name}</h3>
      <p style={{ color: C.textMuted, fontSize: 12.5, lineHeight: 1.5, margin: "0 0 12px" }}>{tool.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
        {tool.features.slice(0, 2).map((f, i) => (
          <span key={i} style={{
            background: "rgba(255,255,255,0.05)", color: "#cbd5e1",
            padding: "3px 8px", borderRadius: 20, fontSize: 10, fontWeight: 500
          }}>✓ {f}</span>
        ))}
        {tool.features.length > 2 && (
          <span style={{ color: C.textDim, fontSize: 10, padding: "3px 4px" }}>+{tool.features.length - 2} more</span>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ color: C.textDim, fontSize: 12, textDecoration: "line-through" }}>${tool.marketPrice}/mo elsewhere</span>
        </div>
        <div style={{
          background: `${C.green}18`, color: C.green, padding: "4px 10px",
          borderRadius: 6, fontSize: 11, fontWeight: 800
        }}>INCLUDED FREE</div>
      </div>
    </div>
  );
}

/* ─── TOOL MODAL ─── */
function ToolModal({ tool, onClose, setPage }) {
  if (!tool) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end",
      justifyContent: "center", animation: "fadeIn 0.2s"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: `linear-gradient(180deg, #131835 0%, ${C.bg} 100%)`,
        borderRadius: "22px 22px 0 0", width: "100%", maxWidth: 480,
        maxHeight: "80vh", overflowY: "auto", padding: "20px 18px 28px",
        animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)"
      }}>
        <div style={{ width: 36, height: 4, background: "#334155", borderRadius: 2, margin: "0 auto 18px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <span style={{ fontSize: 40 }}>{tool.icon}</span>
          <div>
            <Badge text={tool.badge} />
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, margin: "4px 0 0" }}>{tool.name}</h2>
          </div>
        </div>
        <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, margin: "0 0 18px" }}>{tool.desc}</p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Everything Included:</div>
          {tool.features.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 0",
              borderBottom: i < tool.features.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none"
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 6, background: `${C.green}18`,
                color: C.green, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, flexShrink: 0
              }}>✓</span>
              <span style={{ color: "#cbd5e1", fontSize: 13.5 }}>{f}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
          borderRadius: 12, padding: 14, textAlign: "center", marginBottom: 18
        }}>
          <div style={{ color: C.textDim, fontSize: 12 }}>If you buy this tool separately</div>
          <div style={{ color: C.red, fontSize: 28, fontWeight: 900, textDecoration: "line-through" }}>${tool.marketPrice}/mo</div>
          <div style={{ color: C.textDim, fontSize: 12, margin: "6px 0 2px" }}>With AI Tools Hub subscription</div>
          <div style={{ color: C.green, fontSize: 16, fontWeight: 800 }}>✅ INCLUDED — $0 extra</div>
        </div>

        <button onClick={() => { onClose(); setPage(PAGES.PRICING); }} style={{
          width: "100%", padding: 15, border: "none", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accent}, #0066ff)`,
          color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
          fontFamily: font, boxShadow: `0 8px 25px rgba(0,212,255,0.3)`
        }}>🚀 Get All 30+ Tools — Start Free Trial</button>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <span style={{ color: C.textDim, fontSize: 11 }}>🔒 {FREE_TRIAL_DAYS}-day free trial • Cancel anytime • 30-day refund</span>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGES ─── */

function HomePage({ setPage }) {
  const [selTool, setSelTool] = useState(null);
  const featured = TOOLS.slice(0, 6);

  return (
    <div>
      <Hero setPage={setPage} />

      {/* Featured Tools */}
      <section style={{ padding: "20px 14px 30px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, margin: 0 }}>⚡ Featured Tools</h2>
          <button onClick={() => setPage(PAGES.TOOLS)} style={{
            background: "transparent", border: `1px solid ${C.cardBorder}`,
            color: C.accent, padding: "6px 14px", borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font
          }}>View All 30+ →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {featured.map(t => <ToolCard key={t.id} tool={t} onClick={setSelTool} />)}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "30px 14px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, textAlign: "center", margin: "0 0 24px" }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {[
            { step: "1", icon: "📲", title: "Sign Up Free", desc: `Start your ${FREE_TRIAL_DAYS}-day free trial. No credit card needed.` },
            { step: "2", icon: "⚡", title: "Access All Tools", desc: "Instantly unlock 30+ AI tools. Use any tool, any time." },
            { step: "3", icon: "🎯", title: "Create & Save", desc: "Generate images, videos, content — download or share." },
            { step: "4", icon: "💰", title: "Save Thousands", desc: "Pay $9.99/mo instead of $2,000+ for separate tools." },
          ].map((s, i) => (
            <div key={i} style={{
              background: C.card, border: `1px solid ${C.cardBorder}`,
              borderRadius: 14, padding: 18, textAlign: "center"
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
              <div style={{
                display: "inline-flex", width: 24, height: 24, borderRadius: "50%",
                background: `${C.accent}20`, color: C.accent, fontSize: 12, fontWeight: 800,
                alignItems: "center", justifyContent: "center", marginBottom: 8
              }}>{s.step}</div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{s.title}</div>
              <div style={{ color: C.textMuted, fontSize: 12, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "30px 14px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, textAlign: "center", margin: "0 0 24px" }}>💬 What Our Users Say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              background: C.card, border: `1px solid ${C.cardBorder}`,
              borderRadius: 14, padding: 16
            }}>
              <Stars />
              <p style={{ color: C.text, fontSize: 13, lineHeight: 1.6, margin: "10px 0 14px", fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{t.avatar}</span>
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                  <div style={{ color: C.textDim, fontSize: 11 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        margin: "20px 14px 30px", padding: "30px 20px", textAlign: "center",
        background: `linear-gradient(135deg, rgba(0,212,255,0.08), rgba(99,102,241,0.08))`,
        border: `1px solid rgba(0,212,255,0.15)`, borderRadius: 18
      }}>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 10px" }}>Ready to Save $2,000+/Month?</h2>
        <p style={{ color: C.textMuted, fontSize: 14, margin: "0 0 20px" }}>Join 50,000+ creators, freelancers, and businesses using AI Tools Hub.</p>
        <button onClick={() => setPage(PAGES.PRICING)} style={{
          background: `linear-gradient(135deg, ${C.accent}, #0066ff)`, border: "none",
          color: "#fff", padding: "14px 32px", borderRadius: 12, fontSize: 15,
          fontWeight: 800, cursor: "pointer", fontFamily: font,
          boxShadow: `0 8px 30px rgba(0,212,255,0.3)`
        }}>🚀 Start {FREE_TRIAL_DAYS}-Day Free Trial</button>
      </section>

      <ToolModal tool={selTool} onClose={() => setSelTool(null)} setPage={setPage} />
    </div>
  );
}

function ToolsPage({ setPage }) {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [selTool, setSelTool] = useState(null);

  const filtered = TOOLS.filter(t => {
    const matchCat = cat === "all" || t.category === cat;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 14px" }}>
      <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 900, margin: "0 0 6px" }}>⚡ All AI Tools</h1>
      <p style={{ color: C.textMuted, fontSize: 14, margin: "0 0 18px" }}>30+ premium tools — all included in your subscription.</p>

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "rgba(255,255,255,0.04)", border: `1px solid ${C.cardBorder}`,
        borderRadius: 11, padding: "0 14px", marginBottom: 14
      }}>
        <span style={{ color: C.textDim }}>🔍</span>
        <input type="text" placeholder="Search tools..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "#fff", fontSize: 14, padding: "11px 0", fontFamily: font
          }} />
        {search && <span onClick={() => setSearch("")} style={{ color: C.textDim, cursor: "pointer" }}>✕</span>}
      </div>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 18, paddingBottom: 4 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "7px 13px",
            borderRadius: 9, border: "none", cursor: "pointer", fontFamily: font,
            background: cat === c.id ? `linear-gradient(135deg, ${C.accent}, ${C.accent2})` : "rgba(255,255,255,0.04)",
            color: cat === c.id ? "#fff" : C.textMuted, fontSize: 12, fontWeight: 700,
            whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s"
          }}><span style={{ fontSize: 13 }}>{c.icon}</span>{c.label}</button>
        ))}
      </div>

      <div style={{ color: C.textDim, fontSize: 12, marginBottom: 12 }}>{filtered.length} tools found</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {filtered.map(t => <ToolCard key={t.id} tool={t} onClick={setSelTool} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ color: C.textMuted }}>No tools found. Try a different search.</div>
        </div>
      )}

      <ToolModal tool={selTool} onClose={() => setSelTool(null)} setPage={setPage} />
    </div>
  );
}

function PricingPage() {
  const [plan, setPlan] = useState("monthly");
  const totalMarket = TOOLS.reduce((s, t) => s + t.marketPrice, 0);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "30px 14px", textAlign: "center" }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: `${C.green}15`, border: `1px solid ${C.green}30`,
        padding: "5px 14px", borderRadius: 20, marginBottom: 16
      }}>
        <span style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>🎉 {FREE_TRIAL_DAYS}-Day Free Trial — No Credit Card</span>
      </div>

      <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, margin: "0 0 10px" }}>Simple, Transparent Pricing</h1>
      <p style={{ color: C.textMuted, fontSize: 15, margin: "0 0 28px" }}>
        All 30+ tools. One price. Cancel anytime.
      </p>

      {/* Plan Toggle */}
      <div style={{
        display: "inline-flex", background: "rgba(255,255,255,0.04)",
        borderRadius: 12, padding: 4, marginBottom: 28, gap: 4
      }}>
        {Object.entries(PLANS).map(([key, p]) => (
          <button key={key} onClick={() => setPlan(key)} style={{
            background: plan === key ? `linear-gradient(135deg, ${C.accent}, ${C.accent2})` : "transparent",
            border: "none", color: plan === key ? "#fff" : C.textMuted,
            padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontFamily: font,
            fontSize: 13, fontWeight: 700, position: "relative"
          }}>
            {p.period}
            {p.save && (
              <span style={{
                position: "absolute", top: -8, right: -4, background: C.green,
                color: "#fff", fontSize: 8, fontWeight: 800, padding: "2px 5px",
                borderRadius: 4
              }}>{p.save}</span>
            )}
          </button>
        ))}
      </div>

      {/* Price Card */}
      <div style={{
        background: `linear-gradient(135deg, rgba(0,212,255,0.06), rgba(99,102,241,0.06))`,
        border: `2px solid rgba(0,212,255,0.2)`, borderRadius: 20,
        padding: "32px 24px", maxWidth: 400, margin: "0 auto 28px",
        boxShadow: C.glow
      }}>
        <div style={{ color: C.accent, fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 12 }}>ALL-ACCESS PASS</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 4 }}>
          <span style={{ color: "#fff", fontSize: 52, fontWeight: 900, letterSpacing: -2 }}>${PLANS[plan].price}</span>
          <span style={{ color: C.textMuted, fontSize: 16 }}>{PLANS[plan].label}</span>
        </div>
        <div style={{ color: C.textDim, fontSize: 13, textDecoration: "line-through", marginBottom: 6 }}>
          Market value: ${totalMarket.toLocaleString()}/mo
        </div>
        <div style={{ color: C.green, fontSize: 14, fontWeight: 800, marginBottom: 22 }}>
          You save ${(totalMarket - PLANS[plan].price).toLocaleString()}{plan === "monthly" ? "/mo" : ""}
        </div>

        <button style={{
          width: "100%", padding: 15, border: "none", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accent}, #0066ff)`,
          color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer",
          fontFamily: font, boxShadow: `0 8px 25px rgba(0,212,255,0.3)`,
          marginBottom: 14
        }}>🚀 Start {FREE_TRIAL_DAYS}-Day Free Trial</button>

        <div style={{ fontSize: 11, color: C.textDim }}>🔒 Secure Payment • Cancel Anytime • 30-Day Refund</div>
      </div>

      {/* What's included */}
      <div style={{
        background: C.card, border: `1px solid ${C.cardBorder}`,
        borderRadius: 16, padding: "20px 18px", textAlign: "left",
        maxWidth: 500, margin: "0 auto"
      }}>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Everything Included:</div>
        {[
          "30+ Premium AI Tools",
          "Unlimited Usage — No Limits",
          "4K/HD Quality Exports",
          "Commercial License for All Content",
          "Priority Customer Support",
          "New Tools Added Monthly — Free",
          "Works on Desktop, Mobile, Tablet",
          "Install as App (PWA) — Works Offline",
          "API Access for Developers",
          "Team Collaboration Features",
        ].map((f, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
            borderBottom: i < 9 ? "1px solid rgba(255,255,255,0.04)" : "none"
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: 5, background: `${C.green}18`,
              color: C.green, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, flexShrink: 0
            }}>✓</span>
            <span style={{ color: C.text, fontSize: 13 }}>{f}</span>
          </div>
        ))}
      </div>

      {/* Comparison */}
      <div style={{
        background: C.card, border: `1px solid ${C.cardBorder}`,
        borderRadius: 16, padding: "20px 16px", maxWidth: 500,
        margin: "24px auto 0", textAlign: "left"
      }}>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 800, marginBottom: 14 }}>💡 Cost Comparison</div>
        {[
          { name: "Midjourney", price: "$30/mo" },
          { name: "ChatGPT Plus", price: "$20/mo" },
          { name: "Runway (Video)", price: "$76/mo" },
          { name: "ElevenLabs (Voice)", price: "$22/mo" },
          { name: "Jasper (Writing)", price: "$49/mo" },
          { name: "GitHub Copilot", price: "$19/mo" },
          { name: "Canva Pro", price: "$15/mo" },
        ].map((c, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", padding: "8px 0",
            borderBottom: i < 6 ? "1px solid rgba(255,255,255,0.04)" : "none"
          }}>
            <span style={{ color: C.textMuted, fontSize: 13 }}>{c.name}</span>
            <span style={{ color: C.red, fontSize: 13, fontWeight: 700, textDecoration: "line-through" }}>{c.price}</span>
          </div>
        ))}
        <div style={{
          display: "flex", justifyContent: "space-between", padding: "12px 0 0",
          borderTop: `2px solid ${C.accent}30`, marginTop: 8
        }}>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>AI Tools Hub (ALL of above + more)</span>
          <span style={{ color: C.green, fontSize: 14, fontWeight: 900 }}>$9.99/mo</span>
        </div>
      </div>
    </div>
  );
}

function FAQPage() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "30px 14px" }}>
      <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 900, margin: "0 0 6px", textAlign: "center" }}>❓ Frequently Asked Questions</h1>
      <p style={{ color: C.textMuted, fontSize: 14, textAlign: "center", margin: "0 0 24px" }}>Everything you need to know about AI Tools Hub.</p>
      {FAQ_DATA.map((f, i) => (
        <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{
          background: C.card, border: `1px solid ${open === i ? "rgba(0,212,255,0.2)" : C.cardBorder}`,
          borderRadius: 12, padding: "14px 16px", marginBottom: 8, cursor: "pointer",
          transition: "all 0.2s"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{f.q}</span>
            <span style={{ color: C.accent, fontSize: 18, transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "" }}>+</span>
          </div>
          {open === i && (
            <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7, margin: "10px 0 0", animation: "fadeIn 0.2s" }}>{f.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "30px 14px" }}>
      <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 900, margin: "0 0 6px", textAlign: "center" }}>💬 Support & Contact</h1>
      <p style={{ color: C.textMuted, fontSize: 14, textAlign: "center", margin: "0 0 28px" }}>We're here to help. Reach out anytime.</p>

      {/* Contact Options */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginBottom: 28 }}>
        {[
          { icon: "📧", label: "Email Us", detail: "support@aitoolshub.com", action: "mailto:support@aitoolshub.com" },
          { icon: "💬", label: "WhatsApp", detail: "Quick Response", action: "https://wa.me/1234567890" },
          { icon: "📱", label: "Live Chat", detail: "Online Now", action: "#" },
          { icon: "🐦", label: "Twitter/X", detail: "@AIToolsHub", action: "https://twitter.com" },
        ].map((c, i) => (
          <a key={i} href={c.action} target="_blank" rel="noopener noreferrer" style={{
            background: C.card, border: `1px solid ${C.cardBorder}`,
            borderRadius: 12, padding: 16, textAlign: "center",
            textDecoration: "none", display: "block", transition: "all 0.2s"
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{c.label}</div>
            <div style={{ color: C.textDim, fontSize: 11 }}>{c.detail}</div>
          </a>
        ))}
      </div>

      {/* Contact Form */}
      <div style={{
        background: C.card, border: `1px solid ${C.cardBorder}`,
        borderRadius: 16, padding: "22px 18px"
      }}>
        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 800, margin: "0 0 16px" }}>📩 Send us a Message</h3>
        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
            <div style={{ color: C.green, fontSize: 16, fontWeight: 800 }}>Message Sent!</div>
            <div style={{ color: C.textMuted, fontSize: 13, marginTop: 6 }}>We'll get back to you within 24 hours.</div>
          </div>
        ) : (
          <>
            {[
              { label: "Your Name", val: name, set: setName, type: "text", placeholder: "John Doe" },
              { label: "Email", val: email, set: setEmail, type: "email", placeholder: "john@example.com" },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label style={{ color: C.textMuted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 5 }}>{f.label}</label>
                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.cardBorder}`,
                    borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14,
                    fontFamily: font, outline: "none", boxSizing: "border-box"
                  }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: C.textMuted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 5 }}>Message</label>
              <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} placeholder="How can we help you?"
                style={{
                  width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.cardBorder}`,
                  borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14,
                  fontFamily: font, outline: "none", resize: "vertical", boxSizing: "border-box"
                }} />
            </div>
            <button onClick={() => setSent(true)} style={{
              width: "100%", padding: 14, border: "none", borderRadius: 12,
              background: `linear-gradient(135deg, ${C.accent}, #0066ff)`,
              color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer",
              fontFamily: font, boxShadow: `0 6px 20px rgba(0,212,255,0.25)`
            }}>Send Message →</button>
          </>
        )}
      </div>

      {/* Offline Notice */}
      <div style={{
        background: `${C.green}10`, border: `1px solid ${C.green}25`,
        borderRadius: 12, padding: 14, marginTop: 20, textAlign: "center"
      }}>
        <span style={{ fontSize: 16 }}>📡</span>
        <div style={{ color: C.green, fontSize: 13, fontWeight: 700, marginTop: 4 }}>Offline Support</div>
        <div style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>Install our app (PWA) and access tools even without internet. Your saved projects sync when you're back online.</div>
      </div>
    </div>
  );
}

/* ─── PWA INSTALL BANNER ─── */
function InstallBanner({ onDismiss }) {
  const [step, setStep] = useState(0);
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  const isIOS = /iPhone|iPad|iPod/.test(ua);

  const steps = isIOS
    ? [
        { icon: "🌐", title: "Step 1", text: "Open this site in Safari browser" },
        { icon: "⬆️", title: "Step 2", text: "Tap the Share button (bottom bar)" },
        { icon: "➕", title: "Step 3", text: "Tap 'Add to Home Screen'" },
        { icon: "✅", title: "Done!", text: "App icon will appear on your home screen" },
      ]
    : [
        { icon: "🌐", title: "Step 1", text: "Open this site in Chrome browser" },
        { icon: "⋮", title: "Step 2", text: "Tap ⋮ menu (top right corner)" },
        { icon: "📲", title: "Step 3", text: "Tap 'Install App' or 'Add to Home Screen'" },
        { icon: "✅", title: "Done!", text: "App icon will appear on your home screen" },
      ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 600,
      background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
      borderTop: `2px solid ${C.accent}`,
      padding: "18px 14px 22px", maxWidth: 480, margin: "0 auto",
      boxShadow: `0 -10px 40px rgba(0,0,0,0.5)`,
      animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: "#fff"
          }}>AI</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>📲 Install as App</div>
            <div style={{ color: C.textMuted, fontSize: 11 }}>Add to home screen — works like a real app!</div>
          </div>
        </div>
        <button onClick={onDismiss} style={{
          background: "rgba(255,255,255,0.08)", border: "none", color: C.textMuted,
          width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 14
        }}>✕</button>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {steps.map((s, i) => (
          <div key={i} onClick={() => setStep(i)} style={{
            flex: 1, padding: "10px 6px", borderRadius: 10, cursor: "pointer",
            background: step === i ? `${C.accent}18` : "rgba(255,255,255,0.03)",
            border: `1px solid ${step === i ? C.accent + "40" : "transparent"}`,
            textAlign: "center", transition: "all 0.2s"
          }}>
            <div style={{ fontSize: 20, marginBottom: 3 }}>{s.icon}</div>
            <div style={{ color: step === i ? C.accent : C.textDim, fontSize: 9, fontWeight: 700, marginBottom: 2 }}>{s.title}</div>
            <div style={{ color: step === i ? C.text : C.textDim, fontSize: 9, lineHeight: 1.3 }}>{s.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FOOTER ─── */
function Footer({ setPage }) {
  return (
    <footer style={{
      borderTop: `1px solid ${C.cardBorder}`, padding: "28px 14px 20px",
      maxWidth: 900, margin: "0 auto"
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 20, marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 900, color: "#fff"
            }}>AI</div>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>AI Tools Hub</span>
          </div>
          <p style={{ color: C.textDim, fontSize: 11, lineHeight: 1.5 }}>30+ premium AI tools. One subscription. Insane value.</p>
        </div>
        <div>
          <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>QUICK LINKS</div>
          {[
            { label: "All Tools", p: PAGES.TOOLS },
            { label: "Pricing", p: PAGES.PRICING },
            { label: "FAQ", p: PAGES.FAQ },
            { label: "Support", p: PAGES.SUPPORT },
          ].map((l, i) => (
            <div key={i} onClick={() => setPage(l.p)} style={{ color: C.textDim, fontSize: 12, padding: "3px 0", cursor: "pointer" }}>{l.label}</div>
          ))}
        </div>
        <div>
          <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>CONTACT</div>
          <div style={{ color: C.textDim, fontSize: 12, lineHeight: 2 }}>
            📧 support@aitoolshub.com<br />
            💬 WhatsApp Support<br />
            🐦 @AIToolsHub
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", color: C.textDim, fontSize: 11, borderTop: `1px solid ${C.cardBorder}`, paddingTop: 16 }}>
        © 2026 AI Tools Hub. All rights reserved. | Privacy Policy | Terms of Service
      </div>
    </footer>
  );
}

/* ═══════════════ MAIN APP ═══════════════ */
export default function AIToolsHub() {
  const [page, setPage] = useState(PAGES.HOME);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  // Show install banner after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowInstall(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const goTo = (p) => { setPage(p); setShowInstall(false); };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: font,
      color: C.text, paddingBottom: showInstall ? 130 : 0,
      maxWidth: "100%", overflowX: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        body { margin: 0; background: ${C.bg}; }
        input::placeholder, textarea::placeholder { color: #4a5568; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(-8px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <Nav page={page} setPage={goTo} showInstall={showInstall} setShowInstall={setShowInstall} />

      {page === PAGES.HOME && <HomePage setPage={goTo} />}
      {page === PAGES.TOOLS && <ToolsPage setPage={goTo} />}
      {page === PAGES.PRICING && <PricingPage />}
      {page === PAGES.FAQ && <FAQPage />}
      {page === PAGES.SUPPORT && <SupportPage />}

      <Footer setPage={goTo} />

      {showInstall && <InstallBanner onDismiss={() => setShowInstall(false)} />}
    </div>
  );
}
