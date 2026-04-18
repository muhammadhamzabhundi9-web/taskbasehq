import { useState, useEffect } from "react";

const SITE = {
  name: "TaskBase HQ",
  domain: "taskbasehq.com",
  email: "support@taskbasehq.com",
  whatsapp: "+923232108023",
  whatsappDisplay: "+92 323 2108023",
  twitter: "@TaskBaseHQ",
  payMonthly: "https://taskbasehq.lemonsqueezy.com/checkout/buy/e3bcb0d3-4e69-4b92-bb7a-a5a139784321",
  payYearly: "https://taskbasehq.lemonsqueezy.com/checkout/buy/1266b901-deed-4b89-a979-d388aed4a492",
};

const PLANS = {
  free: { price: 0, label: "Free", period: "7 Days", features: ["All 30+ AI tools", "50 generations/day", "720p exports", "Email support", "7 days full access"] },
  monthly: { price: 9.99, label: "$9.99", period: "/month", features: ["All 30+ AI tools", "Unlimited generations", "4K HD exports", "Commercial license", "Priority support", "API access", "New tools monthly"] },
  yearly: { price: 79.99, label: "$79.99", period: "/year", features: ["Everything in Monthly", "Unlimited generations", "4K HD exports", "Commercial license", "Priority support", "API access", "Early access to new tools", "Team sharing (up to 3)"] },
};

const CATEGORIES = [
  { id: "all", label: "All", icon: "⚡" },{ id: "trending", label: "Trending", icon: "🔥" },
  { id: "image", label: "Image", icon: "🎨" },{ id: "video", label: "Video", icon: "🎬" },
  { id: "writing", label: "Writing", icon: "✍️" },{ id: "voice", label: "Voice", icon: "🎙️" },
  { id: "code", label: "Code", icon: "💻" },{ id: "business", label: "Business", icon: "📊" },
  { id: "social", label: "Social", icon: "📱" },{ id: "productivity", label: "Productivity", icon: "🚀" },
];

const TOOLS = [
  { id:1, name:"AI Image Generator", desc:"Create stunning images from text prompts. Photorealistic, anime, 3D art — any style. Better than Midjourney at a fraction of cost.", category:"image", icon:"🖼️", marketPrice:30, features:["Unlimited generations","4K resolution","100+ styles","Commercial license","Inpainting"], badge:"🔥 #1 Most Used", trending:true, users:"23K+", rating:4.9 },
  { id:2, name:"AI Video Creator", desc:"Turn text into professional videos. AI generates scenes, characters, voiceover — perfect for YouTube, TikTok, ads.", category:"video", icon:"🎥", marketPrice:76, features:["Text to video","AI characters","Auto voiceover","4K export","Green screen"], badge:"🚀 Viral Maker", trending:true, users:"18K+", rating:4.8 },
  { id:3, name:"AI Video Editor", desc:"Edit videos with text commands. Auto-cut highlights, remove silence, add effects, transitions, captions — zero editing skills needed.", category:"video", icon:"🎬", marketPrice:49, features:["Auto highlights","Silence removal","AI transitions","Auto captions","Color grading"], badge:"🎬 Pro Editor", trending:true, users:"31K+", rating:4.9 },
  { id:4, name:"AI Voiceover Generator", desc:"Generate professional voiceovers in 50+ languages. Natural-sounding AI voices for videos, podcasts, presentations and more.", category:"voice", icon:"🗣️", marketPrice:22, features:["50+ languages","Natural voices","Emotion control","Studio quality","Commercial license"], badge:"🎯 Game Changer", trending:true, users:"15K+", rating:4.8 },
  { id:5, name:"AI Content Writer", desc:"Write blog posts, articles, ad copy — anything. SEO optimized, plagiarism-free, 10x faster.", category:"writing", icon:"📝", marketPrice:49, features:["Blog & articles","Ad copy","SEO optimization","Plagiarism-free","30+ types"], badge:"✍️ Bestseller", trending:true, users:"27K+", rating:4.7 },
  { id:6, name:"Background Remover", desc:"Remove backgrounds instantly. Perfect for product photos, profiles, e-commerce. Bulk process 100s of images.", category:"image", icon:"✂️", marketPrice:15, features:["1-click removal","Bulk processing","Custom BGs","HD export","API access"], badge:"⚡ Instant", trending:true, users:"42K+", rating:4.9 },
  { id:7, name:"AI Music Generator", desc:"Create royalty-free music for videos, podcasts, reels. Any genre, mood. Own everything you create.", category:"voice", icon:"🎵", marketPrice:25, features:["All genres","Royalty-free","Custom duration","Stems separation","Sound effects"], badge:"🎵 Creator Pick", users:"12K+", rating:4.7 },
  { id:8, name:"AI Code Assistant", desc:"Write, debug, generate code in 50+ languages. Full project scaffolding. Better than Copilot.", category:"code", icon:"⌨️", marketPrice:19, features:["50+ languages","Full project gen","Debug & fix","Code review","Unit tests"], badge:"💻 Dev Fav", users:"14K+", rating:4.9 },
  { id:9, name:"AI Video Subtitles", desc:"Auto-generate subtitles in 100+ languages. Translate any video. Burn-in or export SRT.", category:"video", icon:"💬", marketPrice:20, features:["100+ languages","Auto transcription","Subtitle styling","SRT export","Batch"], badge:"🌍 Go Global", users:"19K+", rating:4.8 },
  { id:10, name:"AI Photo Enhancer", desc:"Turn blurry photos crystal-clear. Upscale 4x, restore old photos, colorize B&W, fix faces.", category:"image", icon:"✨", marketPrice:15, features:["4x upscaling","Face restoration","Colorize B&W","Noise removal","Batch"], badge:"📸 Must Have", users:"20K+", rating:4.8 },
  { id:11, name:"AI Logo & Brand Kit", desc:"Generate professional logos, brand identity — colors, fonts, business cards, social media kit.", category:"business", icon:"💎", marketPrice:50, features:["Logo generator","Brand guidelines","Business cards","Social kit","Unlimited revisions"], badge:"🏆 Top Rated", users:"16K+", rating:4.8 },
  { id:12, name:"AI Social Manager", desc:"Generate posts, captions, hashtags for all platforms. Schedule content, analyze, grow 10x.", category:"social", icon:"📱", marketPrice:29, features:["Multi-platform","Auto scheduling","AI captions","Analytics","Competitor tracking"], badge:"📱 All-in-One", users:"22K+", rating:4.7 },
  { id:13, name:"AI Presentations", desc:"Describe topic, get stunning slideshow. Auto-design, animations, charts. Export PowerPoint.", category:"business", icon:"📊", marketPrice:25, features:["Auto slide design","Charts","50+ templates","Speaker notes","PPT/PDF export"], badge:"📊 Office Must", users:"11K+", rating:4.6 },
  { id:14, name:"AI Resume Builder", desc:"ATS-optimized resumes that get interviews. AI writes bullets, formats perfectly.", category:"writing", icon:"💼", marketPrice:12, features:["ATS optimized","AI bullets","25+ templates","Cover letters","LinkedIn optimizer"], badge:"💼 Land Jobs", users:"35K+", rating:4.8 },
  { id:15, name:"AI Photo Editor", desc:"Edit photos with text commands. Remove objects, change backgrounds, adjust lighting — magic.", category:"image", icon:"🎨", marketPrice:20, features:["Text editing","Object removal","BG removal","Style transfer","Batch"], badge:"🪄 Magic Edit", users:"17K+", rating:4.7 },
  { id:16, name:"AI Grammar & Rewriter", desc:"Fix grammar, rewrite for any tone — professional, casual, academic. Plagiarism check.", category:"writing", icon:"🔤", marketPrice:20, features:["Grammar fix","Tone adjust","Plagiarism check","Readability","Multi-lang"], badge:"✅ Write Better", users:"24K+", rating:4.7 },
  { id:17, name:"AI Translator Pro", desc:"Translate text, documents, websites in 130+ languages. Preserves meaning and context.", category:"writing", icon:"🌐", marketPrice:15, features:["130+ languages","Context-aware","Documents","Websites","Bulk translate"], badge:"🌍 130+ Lang", users:"19K+", rating:4.6 },
  { id:18, name:"AI Thumbnail Maker", desc:"Click-worthy YouTube thumbnails, social banners, covers. AI picks best layouts and text.", category:"social", icon:"📺", marketPrice:12, features:["YouTube sized","Social sizes","AI layout","Brand templates","A/B test"], badge:"📈 Get Clicks", users:"21K+", rating:4.7 },
  { id:19, name:"AI Email Writer", desc:"Professional emails in seconds. Cold outreach, follow-ups, responses — perfect tone.", category:"productivity", icon:"📧", marketPrice:15, features:["Smart templates","Tone control","Follow-ups","Subject lines","Multi-lang"], badge:"📧 Save Hours", users:"18K+", rating:4.6 },
  { id:20, name:"AI Website Builder", desc:"Describe your website, AI builds it. Landing pages, portfolios, e-commerce — responsive.", category:"code", icon:"🌐", marketPrice:30, features:["AI builder","Responsive","SEO built-in","E-commerce","Custom domains"], badge:"🔥 No-Code", users:"9K+", rating:4.7 },
  { id:21, name:"AI Meme & Reel Maker", desc:"Create viral memes, reels, TikTok content. Trending templates, auto-captions.", category:"social", icon:"😂", marketPrice:10, features:["Trending templates","Auto captions","Viral formats","Direct sharing","Branding"], badge:"😂 Go Viral", users:"28K+", rating:4.8 },
  { id:22, name:"AI Podcast Editor", desc:"Remove fillers, enhance audio, generate show notes, transcripts, clips — automatic.", category:"voice", icon:"🎧", marketPrice:25, features:["Filler removal","Audio enhance","Transcripts","Clip generator","Show notes"], badge:"🎙️ Podcast Pro", users:"7K+", rating:4.7 },
  { id:23, name:"AI Invoice & Finance", desc:"Professional invoices, expense tracking, auto-categorize transactions. Business finance simplified.", category:"business", icon:"🧾", marketPrice:18, features:["Invoices","Expense tracking","Auto categorize","Tax summaries","Client portal"], badge:"💰 Finance", users:"8K+", rating:4.6 },
  { id:24, name:"AI PDF Tool", desc:"Chat with PDFs, extract data, summarize, merge, split, fill forms — complete toolkit.", category:"productivity", icon:"📄", marketPrice:15, features:["Chat with PDF","Data extraction","Summarize","Merge/split","Form fill"], badge:"📄 Doc Master", users:"16K+", rating:4.7 },
  { id:25, name:"AI Meeting Notes", desc:"Record meetings, get perfect notes, action items, follow-up emails. Never miss details.", category:"productivity", icon:"📋", marketPrice:20, features:["Auto recording","Smart summaries","Action items","Follow-ups","Search"], badge:"📋 Never Forget", users:"10K+", rating:4.7 },
  { id:26, name:"AI Spreadsheets", desc:"Write formulas in plain English, analyze data, create charts, clean messy data.", category:"business", icon:"📈", marketPrice:15, features:["Formula writer","Data analysis","Auto charts","Data cleaning","Pivot tables"], badge:"📉 Data Pro", users:"13K+", rating:4.6 },
  { id:27, name:"AI SEO & Hashtags", desc:"Trending hashtags, SEO optimization, keyword research, competitor analysis. Grow 10x.", category:"social", icon:"#️⃣", marketPrice:12, features:["Trending hashtags","SEO audits","Keywords","Competitors","Rank tracker"], badge:"📈 Rank Higher", users:"15K+", rating:4.6 },
  { id:28, name:"AI Task Manager", desc:"AI auto-prioritizes tasks, suggests deadlines, tracks progress, sends reminders.", category:"productivity", icon:"✅", marketPrice:12, features:["AI priority","Smart deadlines","Progress tracking","Team boards","Integrations"], badge:"✅ Organize", users:"11K+", rating:4.6 },
  { id:29, name:"AI Video Editor", desc:"Edit videos with text commands. Auto-cut highlights, remove silence, effects — no skills needed.", category:"video", icon:"🎬", marketPrice:30, features:["Auto highlights","Silence removal","AI transitions","Color grading","Multi-track"], badge:"🎬 Auto Edit", users:"14K+", rating:4.7 },
  { id:30, name:"AI Docs Generator", desc:"Auto-generate API docs, READMEs, code comments, changelogs from your codebase.", category:"code", icon:"📖", marketPrice:12, features:["API docs","README builder","Code comments","Changelog","OpenAPI"], badge:"📖 Auto Docs", users:"6K+", rating:4.6 },
];

const REVIEWS = [
  { name:"Sarah K.", role:"Freelance Designer, USA", text:"I replaced Midjourney, Canva Pro, and Runway with this. Saving $150+/month. Tools are just as good.", avatar:"👩‍🎨", stars:5, hl:true },
  { name:"Ahmed R.", role:"YouTuber — 500K Subs", text:"Thumbnails, subtitles, BG removal, video editing — I use 6 tools daily. My team can't believe this costs $9.99.", avatar:"🎬", stars:5, hl:true },
  { name:"Mike T.", role:"Startup Founder, UK", text:"Cancelled 8 subscriptions. Whole team uses TaskBase now. Business tools alone are worth 10x.", avatar:"👨‍💻", stars:5, hl:true },
  { name:"Priya S.", role:"Marketing Manager", text:"Social media content went from 3 days to 30 minutes. AI captions, hashtags, scheduling — just works.", avatar:"📱", stars:5 },
  { name:"James L.", role:"E-commerce Owner", text:"Product photos, ad copy, invoicing — everything for my store in one place.", avatar:"🛒", stars:5 },
  { name:"Fatima H.", role:"Podcast Host", text:"Voice cloning, music intros, auto transcripts — production quality tripled overnight.", avatar:"🎙️", stars:5 },
  { name:"David C.", role:"Developer", text:"Code assistant is better than Copilot. Plus image gen and writing tools? Unreal.", avatar:"💻", stars:5 },
  { name:"Lisa M.", role:"Real Estate Agent", text:"Photo enhancer for listings, writer for descriptions, video for tours. Clients think I hired an agency.", avatar:"🏠", stars:5 },
];

const FAQ = [
  { q:"What do I get?", a:"Unlimited access to ALL 30+ AI tools. One subscription covers everything. No hidden costs." },
  { q:"Is free trial really free?", a:"100% free for 7 days. Full access. No credit card required. Only pay if you continue." },
  { q:"How is this so cheap?", a:"We bundle 30+ tools on optimized infrastructure. Others charge $20-80/month per tool. You save $2,000+/month." },
  { q:"Can I cancel anytime?", a:"Yes. One-click cancel. No contracts, no hidden fees. Cancel during trial = pay nothing." },
  { q:"Do I own what I create?", a:"Yes — 100% ownership with commercial license. Use for clients, business, reselling." },
  { q:"Works on mobile?", a:"Yes! Any browser. Install as PWA app on home screen — works like native app, even offline." },
  { q:"How do I get help?", a:"Raise a support ticket, email, or WhatsApp us. We reply within 2 working days." },
  { q:"New tools added?", a:"2-3 new tools every month, all included free in your subscription." },
];

const TICKET_CATS = [
  { id:"billing", label:"💳 Billing", desc:"Payments, refunds, invoices" },
  { id:"technical", label:"🔧 Technical", desc:"Tool errors, bugs" },
  { id:"account", label:"👤 Account", desc:"Login, password, profile" },
  { id:"feature", label:"💡 Feature", desc:"Suggestions & ideas" },
  { id:"other", label:"📩 General", desc:"Anything else" },
];

const PRIORITIES = [
  { id:"low", label:"Low", color:"#10b981", desc:"General question" },
  { id:"medium", label:"Medium", color:"#f59e0b", desc:"Need help soon" },
  { id:"high", label:"High", color:"#ef4444", desc:"Can't use tools" },
];

const PAGES = { HOME:"home", TOOLS:"tools", PRICING:"pricing", FAQ:"faq", SUPPORT:"support", TERMS:"terms", PRIVACY:"privacy", REFUND:"refund" };

const T = {
  bg:"#060810", card:"rgba(255,255,255,0.024)", border:"rgba(255,255,255,0.055)",
  accent:"#3b82f6", accentGlow:"rgba(59,130,246,0.12)", cyan:"#06b6d4",
  green:"#10b981", orange:"#f59e0b", red:"#ef4444",
  text:"#f1f5f9", muted:"#94a3b8", dim:"#475569",
  font:"'Outfit',-apple-system,system-ui,sans-serif",
};

const bs = (bg,sh) => ({ background:bg, border:"none", color:"#fff", borderRadius:12, fontWeight:800, cursor:"pointer", fontFamily:T.font, boxShadow:sh||"none", transition:"all 0.2s", letterSpacing:0.2 });

function Stars({n=5}){return <span style={{color:"#fbbf24",fontSize:12}}>{"★".repeat(n)}</span>;}
function Pill({children,color}){return <span style={{background:`${color||T.accent}15`,color:color||T.accent,padding:"3px 9px",borderRadius:6,fontSize:10,fontWeight:700,whiteSpace:"nowrap",display:"inline-block"}}>{children}</span>;}
function genTicketId(){const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let r="TB-";for(let i=0;i<6;i++)r+=c[Math.floor(Math.random()*c.length)];return r;}

function Nav({page,go,setInstall}){
  const[open,setOpen]=useState(false);
  const links=[{id:PAGES.HOME,label:"Home"},{id:PAGES.TOOLS,label:"All Tools"},{id:PAGES.PRICING,label:"Pricing"},{id:PAGES.FAQ,label:"FAQ"},{id:PAGES.SUPPORT,label:"Support"}];
  return(
    <nav style={{position:"sticky",top:0,zIndex:300,background:"rgba(6,8,16,0.92)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:960,margin:"0 auto",padding:"0 16px",height:54}}>
        <div onClick={()=>go(PAGES.HOME)} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
          <div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${T.accent},${T.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#fff"}}>TB</div>
          <div><div style={{color:"#fff",fontSize:14,fontWeight:900,letterSpacing:-0.3,lineHeight:1}}>TaskBase HQ</div><div style={{color:T.cyan,fontSize:8,fontWeight:700,letterSpacing:1.5}}>30+ AI TOOLS • ONE PRICE</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button onClick={()=>go(PAGES.PRICING)} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 4px 14px ${T.accentGlow}`),padding:"7px 16px",fontSize:12}}>Start Free Trial</button>
          <button onClick={()=>setOpen(!open)} style={{background:"rgba(255,255,255,0.05)",border:"none",color:T.muted,width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:15}}>{open?"✕":"☰"}</button>
        </div>
      </div>
      {open&&<div style={{position:"absolute",top:54,left:0,right:0,background:"rgba(6,8,16,0.98)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`,padding:"6px 12px"}}>
        {links.map(l=><button key={l.id} onClick={()=>{go(l.id);setOpen(false);}} style={{display:"block",width:"100%",textAlign:"left",background:page===l.id?`${T.accent}12`:"transparent",border:"none",color:page===l.id?T.accent:T.text,padding:"11px 14px",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>{l.label}</button>)}
        <button onClick={()=>{setInstall(true);setOpen(false);}} style={{display:"block",width:"100%",textAlign:"left",background:"transparent",border:"none",color:T.cyan,padding:"11px 14px",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>📲 Install App</button>
      </div>}
    </nav>
  );
}

function ToolCard({tool,onClick}){
  const[h,setH]=useState(false);
  return(
    <div onClick={()=>onClick(tool)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:h?"rgba(255,255,255,0.04)":T.card,border:`1px solid ${h?T.accent+"30":T.border}`,borderRadius:16,padding:"18px 16px",cursor:"pointer",transition:"all 0.3s cubic-bezier(0.16,1,0.3,1)",transform:h?"translateY(-4px)":"",boxShadow:h?`0 16px 40px rgba(0,0,0,0.3),0 0 20px ${T.accentGlow}`:"none"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:30}}>{tool.icon}</span>
          <div><h3 style={{color:"#fff",fontSize:15,fontWeight:800,margin:0,lineHeight:1.2}}>{tool.name}</h3>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}><Stars/><span style={{color:T.dim,fontSize:10}}>{tool.rating}</span><span style={{color:T.dim,fontSize:10}}>•</span><span style={{color:T.dim,fontSize:10}}>{tool.users} users</span></div></div>
        </div>
        <Pill color={tool.trending?T.orange:T.accent}>{tool.badge}</Pill>
      </div>
      <p style={{color:T.muted,fontSize:12.5,lineHeight:1.55,margin:"0 0 14px"}}>{tool.desc}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
        {tool.features.slice(0,3).map((f,i)=><span key={i} style={{background:"rgba(255,255,255,0.04)",color:"#cbd5e1",padding:"4px 9px",borderRadius:20,fontSize:10,fontWeight:500}}>✓ {f}</span>)}
        {tool.features.length>3&&<span style={{color:T.dim,fontSize:10,padding:"4px 2px"}}>+{tool.features.length-3}</span>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.04)"}}>
        <div><span style={{color:T.red,fontSize:13,textDecoration:"line-through",fontWeight:600}}>${tool.marketPrice}/mo</span><span style={{color:T.dim,fontSize:11,marginLeft:6}}>elsewhere</span></div>
        <div style={{background:`${T.green}15`,color:T.green,padding:"5px 12px",borderRadius:8,fontSize:11,fontWeight:800}}>✓ INCLUDED</div>
      </div>
    </div>
  );
}

function ToolModal({tool,onClose,go}){
  if(!tool)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:`linear-gradient(180deg,#111827 0%,${T.bg} 100%)`,borderRadius:"22px 22px 0 0",width:"100%",maxWidth:460,maxHeight:"82vh",overflowY:"auto",padding:"20px 18px 30px",animation:"modalUp 0.3s cubic-bezier(0.16,1,0.3,1)"}}>
        <div style={{width:36,height:4,background:"#334155",borderRadius:2,margin:"0 auto 18px"}}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}><span style={{fontSize:44}}>{tool.icon}</span><div><Pill color={tool.trending?T.orange:T.accent}>{tool.badge}</Pill><h2 style={{color:"#fff",fontSize:20,fontWeight:900,margin:"6px 0 0"}}>{tool.name}</h2></div></div>
        <div style={{display:"flex",gap:12,margin:"10px 0 14px"}}><Stars/><span style={{color:T.muted,fontSize:12}}>{tool.rating} • {tool.users} users</span></div>
        <p style={{color:T.muted,fontSize:14,lineHeight:1.65,margin:"0 0 20px"}}>{tool.desc}</p>
        <div style={{marginBottom:20}}><div style={{color:T.text,fontSize:13,fontWeight:700,marginBottom:10}}>All Features:</div>
        {tool.features.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<tool.features.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}><span style={{width:22,height:22,borderRadius:6,background:`${T.green}15`,color:T.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>✓</span><span style={{color:"#cbd5e1",fontSize:13.5}}>{f}</span></div>)}</div>
        <div style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.12)",borderRadius:12,padding:"14px 16px",textAlign:"center",marginBottom:18}}>
          <div style={{color:T.dim,fontSize:11}}>Separately</div><div style={{color:T.red,fontSize:30,fontWeight:900,textDecoration:"line-through"}}>${tool.marketPrice}/mo</div>
          <div style={{color:T.dim,fontSize:11,margin:"6px 0 2px"}}>With TaskBase HQ</div><div style={{color:T.green,fontSize:18,fontWeight:900}}>$0 extra — Included</div>
        </div>
        <button onClick={()=>{onClose();go(PAGES.PRICING);}} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 8px 25px ${T.accentGlow}`),width:"100%",padding:15,fontSize:15}}>Start 7-Day Free Trial →</button>
        <div style={{textAlign:"center",marginTop:10,color:T.dim,fontSize:11}}>No credit card • Cancel anytime</div>
      </div>
    </div>
  );
}

function HomePage({go}){
  const[sel,setSel]=useState(null);
  const totalMkt=TOOLS.reduce((s,t)=>s+t.marketPrice,0);
  const show=[...TOOLS.filter(t=>t.trending),...TOOLS.filter(t=>!t.trending)].slice(0,8);
  return(<div>
    <section style={{padding:"44px 16px 36px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-120,left:"50%",transform:"translateX(-50%)",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,${T.accentGlow} 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"relative",maxWidth:580,margin:"0 auto"}}>
        <Pill color={T.green}>🎉 7-Day Free Trial — No Credit Card</Pill>
        <h1 style={{color:"#fff",fontSize:"clamp(30px,7vw,48px)",fontWeight:900,lineHeight:1.1,margin:"18px 0 16px",letterSpacing:-1.5}}>30+ Premium AI Tools.<br/><span style={{background:`linear-gradient(135deg,${T.accent},${T.cyan})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>One Simple Price.</span></h1>
        <p style={{color:T.muted,fontSize:"clamp(14px,3.5vw,18px)",lineHeight:1.6,margin:"0 auto 6px",maxWidth:460}}>Image generator, video creator, voiceover AI, content writer — tools that cost <strong style={{color:T.red,textDecoration:"line-through"}}>${totalMkt}+/mo</strong> separately.</p>
        <p style={{color:T.green,fontSize:"clamp(16px,4vw,22px)",fontWeight:900,margin:"0 0 26px"}}>All for just $9.99/month.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:30}}>
          <button onClick={()=>go(PAGES.PRICING)} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 8px 30px ${T.accentGlow}`),padding:"15px 32px",fontSize:16}}>🚀 Start Free Trial</button>
          <button onClick={()=>go(PAGES.TOOLS)} style={{...bs("rgba(255,255,255,0.06)"),border:`1px solid ${T.border}`,padding:"15px 28px",fontSize:15,fontWeight:700}}>See All Tools →</button>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"clamp(16px,4vw,32px)",flexWrap:"wrap"}}>
          {[{v:"30+",l:"AI Tools"},{v:"50K+",l:"Users"},{v:"97%",l:"Savings"},{v:"4.8★",l:"Rating"}].map((s,i)=><div key={i}><div style={{color:T.accent,fontSize:22,fontWeight:900}}>{s.v}</div><div style={{color:T.dim,fontSize:10,fontWeight:600}}>{s.l}</div></div>)}
        </div>
      </div>
    </section>
    <div style={{background:"rgba(255,255,255,0.02)",borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,padding:"12px 16px",textAlign:"center"}}><span style={{color:T.dim,fontSize:12}}>Trusted by creators, freelancers, agencies & businesses worldwide</span></div>
    <section style={{padding:"30px 14px",maxWidth:960,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><div><h2 style={{color:"#fff",fontSize:22,fontWeight:900,margin:0}}>🔥 Most Popular Tools</h2><p style={{color:T.muted,fontSize:13,margin:"4px 0 0"}}>What users love most</p></div><button onClick={()=>go(PAGES.TOOLS)} style={{...bs("rgba(255,255,255,0.05)"),border:`1px solid ${T.border}`,padding:"8px 16px",fontSize:12}}>All 30+ →</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>{show.map(t=><ToolCard key={t.id} tool={t} onClick={setSel}/>)}</div>
      <div style={{textAlign:"center",marginTop:20}}><button onClick={()=>go(PAGES.TOOLS)} style={{...bs(`${T.accent}15`),border:`1px solid ${T.accent}30`,padding:"12px 28px",fontSize:14,color:T.accent}}>View All 30+ AI Tools →</button></div>
    </section>
    <section style={{padding:"30px 14px",maxWidth:960,margin:"0 auto"}}>
      <h2 style={{color:"#fff",fontSize:22,fontWeight:900,textAlign:"center",margin:"0 0 24px"}}>Why 50,000+ People Choose TaskBase HQ</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {[{icon:"💸",title:"Save $2,000+/Month",desc:"Replace 15+ subscriptions with one simple price."},{icon:"⚡",title:"Unlimited Everything",desc:"No caps, no limits. Generate as much as you want."},{icon:"🆕",title:"New Tools Monthly",desc:"2-3 new tools every month. All free with your plan."},{icon:"📱",title:"Works Everywhere",desc:"Desktop, mobile, tablet. Install as app. Works offline."},{icon:"🔒",title:"7-Day Free Trial",desc:"Full access, no credit card. Cancel in one click."},{icon:"🏆",title:"Commercial License",desc:"Everything you create is yours. Use for anything."}].map((v,i)=>
        <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}><div style={{fontSize:28,marginBottom:10}}>{v.icon}</div><div style={{color:"#fff",fontSize:14,fontWeight:800,marginBottom:6}}>{v.title}</div><div style={{color:T.muted,fontSize:12,lineHeight:1.5}}>{v.desc}</div></div>)}
      </div>
    </section>
    <section style={{padding:"30px 14px",maxWidth:960,margin:"0 auto"}}>
      <h2 style={{color:"#fff",fontSize:22,fontWeight:900,textAlign:"center",margin:"0 0 24px"}}>💬 What Users Say</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {REVIEWS.map((r,i)=><div key={i} style={{background:r.hl?`${T.accent}06`:T.card,border:`1px solid ${r.hl?T.accent+"18":T.border}`,borderRadius:14,padding:16}}><Stars n={r.stars}/><p style={{color:T.text,fontSize:13,lineHeight:1.6,margin:"10px 0 14px",fontStyle:"italic"}}>"{r.text}"</p><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>{r.avatar}</span><div><div style={{color:"#fff",fontSize:12,fontWeight:700}}>{r.name}</div><div style={{color:T.dim,fontSize:11}}>{r.role}</div></div></div></div>)}
      </div>
    </section>
    <section style={{padding:"30px 14px",maxWidth:500,margin:"0 auto"}}>
      <h2 style={{color:"#fff",fontSize:20,fontWeight:900,textAlign:"center",margin:"0 0 18px"}}>💡 The Math Speaks</h2>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px 16px"}}>
        {[{n:"Midjourney",p:"$30"},{n:"Runway",p:"$76"},{n:"ElevenLabs",p:"$22"},{n:"Jasper",p:"$49"},{n:"Copilot",p:"$19"},{n:"Canva Pro",p:"$15"},{n:"Descript",p:"$24"},{n:"Buffer",p:"$15"}].map((c,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{color:T.muted,fontSize:13}}>{c.n}</span><span style={{color:T.red,fontSize:13,fontWeight:700,textDecoration:"line-through"}}>{c.p}/mo</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0 0",borderTop:`2px solid ${T.accent}25`,marginTop:8}}><span style={{color:"#fff",fontSize:14,fontWeight:900}}>TaskBase HQ (All + more)</span><span style={{color:T.green,fontSize:16,fontWeight:900}}>$9.99/mo</span></div>
      </div>
    </section>
    <section style={{margin:"24px 14px 30px",padding:"32px 20px",textAlign:"center",background:`${T.accent}08`,border:`1px solid ${T.accent}18`,borderRadius:20}}>
      <h2 style={{color:"#fff",fontSize:24,fontWeight:900,margin:"0 0 8px"}}>Ready to Save $2,000+/Month?</h2>
      <p style={{color:T.muted,fontSize:14,margin:"0 0 18px"}}>7-day free trial. No credit card. Cancel anytime.</p>
      <button onClick={()=>go(PAGES.PRICING)} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 8px 30px ${T.accentGlow}`),padding:"15px 36px",fontSize:16}}>🚀 Start Free Trial — $0 Today</button>
    </section>
    <ToolModal tool={sel} onClose={()=>setSel(null)} go={go}/>
  </div>);
}

function ToolsPage({go}){
  const[cat,setCat]=useState("all");const[search,setSearch]=useState("");const[sel,setSel]=useState(null);
  const filtered=TOOLS.filter(t=>{const mc=cat==="all"||t.category===cat||(cat==="trending"&&t.trending);const ms=!search||t.name.toLowerCase().includes(search.toLowerCase())||t.desc.toLowerCase().includes(search.toLowerCase());return mc&&ms;});
  return(<div style={{maxWidth:960,margin:"0 auto",padding:"24px 14px"}}>
    <h1 style={{color:"#fff",fontSize:26,fontWeight:900,margin:"0 0 4px"}}>All AI Tools</h1>
    <p style={{color:T.muted,fontSize:14,margin:"0 0 18px"}}>30+ premium tools — all included</p>
    <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.03)",border:`1px solid ${T.border}`,borderRadius:11,padding:"0 14px",marginBottom:14}}>
      <span style={{color:T.dim}}>🔍</span><input type="text" placeholder="Search tools..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:14,padding:"11px 0",fontFamily:T.font}}/>{search&&<span onClick={()=>setSearch("")} style={{color:T.dim,cursor:"pointer"}}>✕</span>}
    </div>
    <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:16,paddingBottom:4}}>
      {CATEGORIES.map(c=><button key={c.id} onClick={()=>setCat(c.id)} style={{display:"flex",alignItems:"center",gap:4,padding:"7px 12px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:T.font,background:cat===c.id?`linear-gradient(135deg,${T.accent},${T.cyan})`:"rgba(255,255,255,0.03)",color:cat===c.id?"#fff":T.muted,fontSize:12,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}><span style={{fontSize:12}}>{c.icon}</span>{c.label}</button>)}
    </div>
    <div style={{color:T.dim,fontSize:12,marginBottom:10}}>{filtered.length} tools</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>{filtered.map(t=><ToolCard key={t.id} tool={t} onClick={setSel}/>)}</div>
    {filtered.length===0&&<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:48,marginBottom:12}}>🔍</div><div style={{color:T.muted}}>No tools found.</div></div>}
    <ToolModal tool={sel} onClose={()=>setSel(null)} go={go}/>
  </div>);
}

function PricingPage(){
  const[plan,setPlan]=useState("monthly");const totalMkt=TOOLS.reduce((s,t)=>s+t.marketPrice,0);
  return(<div style={{maxWidth:680,margin:"0 auto",padding:"32px 14px",textAlign:"center"}}>
    <Pill color={T.green}>🎉 7-Day Free Trial — No Credit Card</Pill>
    <h1 style={{color:"#fff",fontSize:30,fontWeight:900,margin:"16px 0 8px"}}>Pick Your Plan</h1>
    <p style={{color:T.muted,fontSize:15,margin:"0 0 28px"}}>All 30+ tools. Cancel anytime.</p>
    <div style={{display:"inline-flex",background:"rgba(255,255,255,0.03)",borderRadius:12,padding:4,gap:4,marginBottom:28}}>
      {["monthly","yearly"].map(k=><button key={k} onClick={()=>setPlan(k)} style={{background:plan===k?`linear-gradient(135deg,${T.accent},${T.cyan})`:"transparent",border:"none",color:plan===k?"#fff":T.muted,padding:"10px 24px",borderRadius:10,cursor:"pointer",fontFamily:T.font,fontSize:14,fontWeight:700,position:"relative"}}>{k==="monthly"?"Monthly":"Yearly"}{k==="yearly"&&<span style={{position:"absolute",top:-8,right:-8,background:T.green,color:"#fff",fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4}}>-33%</span>}</button>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,marginBottom:30,textAlign:"left"}}>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"24px 20px"}}>
        <div style={{color:T.muted,fontSize:12,fontWeight:700,marginBottom:4}}>FREE TRIAL</div>
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}><span style={{color:"#fff",fontSize:40,fontWeight:900}}>$0</span><span style={{color:T.muted,fontSize:14}}>for 7 days</span></div>
        <p style={{color:T.muted,fontSize:12,margin:"0 0 18px"}}>Full access — no card needed</p>
        {PLANS.free.features.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}><span style={{color:T.green,fontSize:11}}>✓</span><span style={{color:T.muted,fontSize:12.5}}>{f}</span></div>)}
        <button onClick={()=>window.open(SITE.payMonthly,'_blank')} style={{...bs("rgba(255,255,255,0.06)"),border:`1px solid ${T.border}`,width:"100%",padding:13,fontSize:14,marginTop:16}}>Start Free Trial</button>
      </div>
      <div style={{background:`${T.accent}08`,border:`2px solid ${T.accent}30`,borderRadius:18,padding:"24px 20px",position:"relative"}}>
        <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${T.accent},${T.cyan})`,color:"#fff",fontSize:10,fontWeight:800,padding:"4px 14px",borderRadius:20}}>⭐ RECOMMENDED</div>
        <div style={{color:T.accent,fontSize:12,fontWeight:700,marginBottom:4,marginTop:4}}>{plan==="yearly"?"YEARLY":"MONTHLY"}</div>
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}><span style={{color:"#fff",fontSize:40,fontWeight:900}}>{PLANS[plan].label}</span><span style={{color:T.muted,fontSize:14}}>{PLANS[plan].period}</span></div>
        {plan==="yearly"&&<div style={{color:T.green,fontSize:12,fontWeight:700,marginBottom:4}}>= $6.67/month</div>}
        <p style={{color:T.muted,fontSize:12,margin:"0 0 18px"}}>Full unlimited access</p>
        {PLANS[plan].features.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}><span style={{color:T.green,fontSize:11}}>✓</span><span style={{color:T.text,fontSize:12.5}}>{f}</span></div>)}
        <button onClick={()=>window.open(plan==="monthly"?SITE.payMonthly:SITE.payYearly,'_blank')} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 8px 25px ${T.accentGlow}`),width:"100%",padding:14,fontSize:15,marginTop:16}}>🚀 Start Free → Then {PLANS[plan].label}{PLANS[plan].period}</button>
        <div style={{textAlign:"center",marginTop:8}}><span style={{color:T.dim,fontSize:10}}>🔒 Cancel anytime • 30-day refund</span></div>
      </div>
    </div>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"20px 16px",textAlign:"left"}}>
      <div style={{color:"#fff",fontSize:15,fontWeight:800,marginBottom:14,textAlign:"center"}}>💡 Buying Separately vs TaskBase HQ</div>
      {[{n:"Midjourney",p:"$30"},{n:"Runway",p:"$76"},{n:"ElevenLabs",p:"$22"},{n:"Jasper",p:"$49"},{n:"Copilot",p:"$19"},{n:"Canva Pro",p:"$15"},{n:"Descript",p:"$24"},{n:"Buffer",p:"$15"}].map((c,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{color:T.muted,fontSize:13}}>{c.n}</span><span style={{color:T.red,fontSize:13,fontWeight:700,textDecoration:"line-through"}}>{c.p}/mo</span></div>)}
      <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0 0",borderTop:`2px solid ${T.accent}25`,marginTop:8}}><span style={{color:"#fff",fontSize:14,fontWeight:900}}>TaskBase HQ</span><span style={{color:T.green,fontSize:16,fontWeight:900}}>$9.99/mo</span></div>
    </div>
  </div>);
}

function FAQPage(){
  const[open,setOpen]=useState(null);
  return(<div style={{maxWidth:600,margin:"0 auto",padding:"32px 14px"}}>
    <h1 style={{color:"#fff",fontSize:26,fontWeight:900,textAlign:"center",margin:"0 0 6px"}}>Frequently Asked Questions</h1>
    <p style={{color:T.muted,fontSize:14,textAlign:"center",margin:"0 0 24px"}}>Got questions? We got answers.</p>
    {FAQ.map((f,i)=><div key={i} onClick={()=>setOpen(open===i?null:i)} style={{background:T.card,border:`1px solid ${open===i?T.accent+"25":T.border}`,borderRadius:12,padding:"14px 16px",marginBottom:8,cursor:"pointer"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:"#fff",fontSize:14,fontWeight:700,paddingRight:10}}>{f.q}</span><span style={{color:T.accent,fontSize:18,flexShrink:0,transition:"transform 0.2s",transform:open===i?"rotate(45deg)":""}}>+</span></div>
      {open===i&&<p style={{color:T.muted,fontSize:13,lineHeight:1.7,margin:"10px 0 0"}}>{f.a}</p>}
    </div>)}
  </div>);
}

function SupportPage(){
  const[tab,setTab]=useState("contact");
  const[tCat,setTCat]=useState("");const[tPri,setTPri]=useState("medium");
  const[tName,setTName]=useState("");const[tEmail,setTEmail]=useState("");const[tSubj,setTSubj]=useState("");const[tMsg,setTMsg]=useState("");
  const[tDone,setTDone]=useState(false);const[ticketId,setTicketId]=useState("");
  const[cName,setCName]=useState("");const[cEmail,setCEmail]=useState("");const[cMsg,setCMsg]=useState("");const[cSent,setCSent]=useState(false);
  const inp={width:"100%",background:"rgba(255,255,255,0.03)",border:`1px solid ${T.border}`,borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:14,fontFamily:T.font,outline:"none",boxSizing:"border-box"};
  const submitTicket=()=>{setTicketId(genTicketId());setTDone(true);};

  return(<div style={{maxWidth:640,margin:"0 auto",padding:"32px 14px"}}>
    <h1 style={{color:"#fff",fontSize:26,fontWeight:900,textAlign:"center",margin:"0 0 6px"}}>Help & Support</h1>
    <p style={{color:T.muted,fontSize:14,textAlign:"center",margin:"0 0 4px"}}>We're here to help you succeed with TaskBase HQ.</p>
    <p style={{color:T.orange,fontSize:13,fontWeight:700,textAlign:"center",margin:"0 0 24px"}}>⏱️ We reply within 2 working days</p>

    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:24}}>
      {[
        {icon:"📧",title:"Email",detail:SITE.email,link:`mailto:${SITE.email}`},
        {icon:"💬",title:"WhatsApp",detail:SITE.whatsappDisplay,link:`https://wa.me/${SITE.whatsapp.replace('+','')}`},
        {icon:"📞",title:"Phone",detail:SITE.whatsappDisplay,link:`tel:${SITE.whatsapp}`},
        {icon:"🐦",title:"Twitter / X",detail:SITE.twitter,link:`https://twitter.com/${SITE.twitter.replace('@','')}`},
      ].map((c,i)=><a key={i} href={c.link} target="_blank" rel="noopener noreferrer" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 12px",textDecoration:"none",textAlign:"center",display:"block"}}><div style={{fontSize:24,marginBottom:5}}>{c.icon}</div><div style={{color:"#fff",fontSize:13,fontWeight:700}}>{c.title}</div><div style={{color:T.dim,fontSize:11,marginTop:2}}>{c.detail}</div></a>)}
    </div>

    <div style={{display:"flex",background:"rgba(255,255,255,0.03)",borderRadius:12,padding:4,marginBottom:20,gap:4}}>
      {[{id:"contact",label:"📩 Message"},{id:"ticket",label:"🎫 Raise Ticket"},{id:"track",label:"🔍 Track"}].map(t=>
        <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:tab===t.id?`linear-gradient(135deg,${T.accent},${T.cyan})`:"transparent",border:"none",color:tab===t.id?"#fff":T.muted,padding:"10px 8px",borderRadius:10,cursor:"pointer",fontFamily:T.font,fontSize:12,fontWeight:700}}>{t.label}</button>)}
    </div>

    {tab==="contact"&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"22px 18px"}}>
      <h3 style={{color:"#fff",fontSize:16,fontWeight:800,margin:"0 0 4px"}}>📩 Quick Message</h3>
      <p style={{color:T.dim,fontSize:12,margin:"0 0 16px"}}>For quick questions. Reply within 2 working days.</p>
      {cSent?<div style={{textAlign:"center",padding:"24px 0"}}><div style={{fontSize:44,marginBottom:10}}>✅</div><div style={{color:T.green,fontSize:17,fontWeight:800}}>Sent!</div><div style={{color:T.muted,fontSize:13,marginTop:6}}>We'll reply within 2 working days.</div></div>:<>
        <div style={{marginBottom:12}}><label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Name</label><input type="text" value={cName} onChange={e=>setCName(e.target.value)} placeholder="Your name" style={inp}/></div>
        <div style={{marginBottom:12}}><label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Email</label><input type="email" value={cEmail} onChange={e=>setCEmail(e.target.value)} placeholder="you@email.com" style={inp}/></div>
        <div style={{marginBottom:14}}><label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Message</label><textarea value={cMsg} onChange={e=>setCMsg(e.target.value)} rows={4} placeholder="How can we help?" style={{...inp,resize:"vertical"}}/></div>
        <button onClick={()=>setCSent(true)} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 6px 20px ${T.accentGlow}`),width:"100%",padding:14,fontSize:14}}>Send Message →</button>
      </>}
    </div>}

    {tab==="ticket"&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"22px 18px"}}>
      <h3 style={{color:"#fff",fontSize:16,fontWeight:800,margin:"0 0 4px"}}>🎫 Raise Support Ticket</h3>
      <p style={{color:T.dim,fontSize:12,margin:"0 0 16px"}}>Get a ticket ID to track progress. Reply within 2 working days.</p>
      {tDone?<div style={{textAlign:"center",padding:"20px 0"}}>
        <div style={{fontSize:44,marginBottom:10}}>🎫</div>
        <div style={{color:T.green,fontSize:18,fontWeight:800}}>Ticket Created!</div>
        <div style={{background:`${T.accent}10`,border:`2px dashed ${T.accent}40`,borderRadius:12,padding:"16px 20px",margin:"16px auto",display:"inline-block"}}>
          <div style={{color:T.dim,fontSize:11,marginBottom:4}}>Your Ticket ID</div>
          <div style={{color:T.accent,fontSize:28,fontWeight:900,letterSpacing:2}}>{ticketId}</div>
        </div>
        <p style={{color:T.muted,fontSize:13,marginTop:10}}>📧 Confirmation sent to your email.<br/>We respond within <strong style={{color:T.orange}}>2 working days</strong>.</p>
        <p style={{color:T.dim,fontSize:11,marginTop:8}}>Save your ticket ID to track status.</p>
        <button onClick={()=>{setTDone(false);setTCat("");setTPri("medium");setTName("");setTEmail("");setTSubj("");setTMsg("");}} style={{...bs("rgba(255,255,255,0.06)"),border:`1px solid ${T.border}`,padding:"10px 20px",fontSize:13,marginTop:14}}>New Ticket</button>
      </div>:<>
        <div style={{marginBottom:14}}>
          <label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:8}}>Category</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {TICKET_CATS.map(c=><div key={c.id} onClick={()=>setTCat(c.id)} style={{background:tCat===c.id?`${T.accent}12`:"rgba(255,255,255,0.02)",border:`1px solid ${tCat===c.id?T.accent+"40":T.border}`,borderRadius:10,padding:"10px 12px",cursor:"pointer"}}><div style={{color:tCat===c.id?T.accent:T.text,fontSize:12,fontWeight:700}}>{c.label}</div><div style={{color:T.dim,fontSize:10,marginTop:2}}>{c.desc}</div></div>)}
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:8}}>Priority</label>
          <div style={{display:"flex",gap:6}}>
            {PRIORITIES.map(p=><div key={p.id} onClick={()=>setTPri(p.id)} style={{flex:1,background:tPri===p.id?`${p.color}12`:"rgba(255,255,255,0.02)",border:`1px solid ${tPri===p.id?p.color+"40":T.border}`,borderRadius:10,padding:"10px 8px",cursor:"pointer",textAlign:"center"}}><div style={{color:tPri===p.id?p.color:T.text,fontSize:12,fontWeight:700}}>{p.label}</div><div style={{color:T.dim,fontSize:9,marginTop:2}}>{p.desc}</div></div>)}
          </div>
        </div>
        <div style={{marginBottom:12}}><label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Name</label><input type="text" value={tName} onChange={e=>setTName(e.target.value)} placeholder="Full name" style={inp}/></div>
        <div style={{marginBottom:12}}><label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Email</label><input type="email" value={tEmail} onChange={e=>setTEmail(e.target.value)} placeholder="you@email.com" style={inp}/></div>
        <div style={{marginBottom:12}}><label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Subject</label><input type="text" value={tSubj} onChange={e=>setTSubj(e.target.value)} placeholder="Brief description" style={inp}/></div>
        <div style={{marginBottom:14}}><label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Description</label><textarea value={tMsg} onChange={e=>setTMsg(e.target.value)} rows={5} placeholder="Describe your issue in detail..." style={{...inp,resize:"vertical"}}/></div>
        <button onClick={submitTicket} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 6px 20px ${T.accentGlow}`),width:"100%",padding:14,fontSize:14}}>🎫 Submit Ticket</button>
      </>}
    </div>}

    {tab==="track"&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"22px 18px"}}>
      <h3 style={{color:"#fff",fontSize:16,fontWeight:800,margin:"0 0 4px"}}>🔍 Track Ticket</h3>
      <p style={{color:T.dim,fontSize:12,margin:"0 0 16px"}}>Enter ticket ID to check status.</p>
      <input type="text" placeholder="TB-XXXXXX" style={{...inp,textAlign:"center",fontSize:16,fontWeight:700,letterSpacing:2,padding:"14px",marginBottom:14}}/>
      <button style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 6px 20px ${T.accentGlow}`),width:"100%",padding:14,fontSize:14}}>🔍 Check Status</button>
      <div style={{marginTop:20,padding:16,background:"rgba(255,255,255,0.02)",borderRadius:12,border:`1px solid ${T.border}`}}>
        <div style={{color:T.dim,fontSize:12,textAlign:"center",marginBottom:12}}>Status Legend</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
          {[{l:"Open",c:T.accent},{l:"In Progress",c:T.orange},{l:"Resolved",c:T.green},{l:"Closed",c:T.dim}].map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:"50%",background:s.c}}/><span style={{color:T.muted,fontSize:11}}>{s.l}</span></div>)}
        </div>
      </div>
    </div>}

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:20}}>
      <div style={{background:`${T.green}08`,border:`1px solid ${T.green}20`,borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:22}}>📡</div><div style={{color:T.green,fontSize:12,fontWeight:700,margin:"4px 0"}}>Offline Support</div><div style={{color:T.dim,fontSize:11}}>Install PWA — works offline</div></div>
      <div style={{background:`${T.orange}08`,border:`1px solid ${T.orange}20`,borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:22}}>⏱️</div><div style={{color:T.orange,fontSize:12,fontWeight:700,margin:"4px 0"}}>Response Time</div><div style={{color:T.dim,fontSize:11}}>Within 2 working days</div></div>
    </div>
  </div>);
}

function InstallBanner({onClose}){
  const[step,setStep]=useState(0);
  const isIOS=typeof navigator!=="undefined"&&/iPhone|iPad|iPod/.test(navigator.userAgent||"");
  const steps=isIOS?[{i:"🌐",t:"Safari"},{i:"⬆️",t:"Share"},{i:"➕",t:"Add Home"},{i:"✅",t:"Done!"}]:[{i:"🌐",t:"Chrome"},{i:"⋮",t:"⋮ Menu"},{i:"📲",t:"Install"},{i:"✅",t:"Done!"}];
  return(<div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:400,background:`linear-gradient(180deg,#111827,${T.bg})`,borderTop:`2px solid ${T.accent}`,padding:"16px 14px 20px",boxShadow:"0 -10px 40px rgba(0,0,0,0.5)",animation:"modalUp 0.3s cubic-bezier(0.16,1,0.3,1)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:34,height:34,borderRadius:9,background:`linear-gradient(135deg,${T.accent},${T.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff"}}>TB</div><div><div style={{color:"#fff",fontWeight:800,fontSize:13}}>📲 Install TaskBase HQ</div><div style={{color:T.muted,fontSize:10}}>Home screen access</div></div></div>
      <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"none",color:T.muted,width:26,height:26,borderRadius:"50%",cursor:"pointer",fontSize:12}}>✕</button>
    </div>
    <div style={{display:"flex",gap:5}}>{steps.map((s,i)=><div key={i} onClick={()=>setStep(i)} style={{flex:1,padding:"8px 4px",borderRadius:8,cursor:"pointer",background:step===i?`${T.accent}15`:"rgba(255,255,255,0.02)",border:`1px solid ${step===i?T.accent+"30":"transparent"}`,textAlign:"center"}}><div style={{fontSize:18,marginBottom:2}}>{s.i}</div><div style={{color:step===i?T.accent:T.dim,fontSize:9,fontWeight:700}}>{s.t}</div></div>)}</div>
  </div>);
}

function TermsPage(){
  return(<div style={{maxWidth:700,margin:"0 auto",padding:"32px 14px"}}>
    <h1 style={{color:"#fff",fontSize:26,fontWeight:900,margin:"0 0 20px"}}>Terms of Service</h1>
    <div style={{color:T.muted,fontSize:13,lineHeight:1.8}}>
      <p><strong style={{color:T.text}}>Last updated:</strong> April 2026</p>
      <p>Welcome to TaskBase HQ ({SITE.domain}). By using our platform, you agree to the following terms.</p>
      <h3 style={{color:T.text,marginTop:20}}>1. Service Description</h3>
      <p>TaskBase HQ provides subscription-based access to a suite of AI-powered productivity tools including content writing, code assistance, document processing, data analysis, and business productivity tools.</p>
      <h3 style={{color:T.text,marginTop:20}}>2. Subscription Plans</h3>
      <p>We offer Monthly ($9.99/month) and Yearly ($79.99/year) subscription plans. Both plans include a 7-day free trial. You can cancel your subscription at any time from your account dashboard.</p>
      <h3 style={{color:T.text,marginTop:20}}>3. Free Trial</h3>
      <p>New users receive a 7-day free trial with full access to all tools. No payment is required during the trial period. If you do not cancel before the trial ends, your selected plan will be charged automatically.</p>
      <h3 style={{color:T.text,marginTop:20}}>4. User Accounts</h3>
      <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. One account per person.</p>
      <h3 style={{color:T.text,marginTop:20}}>5. Acceptable Use</h3>
      <p>You agree not to use our tools for illegal activities, spam, harassment, or any purpose that violates applicable laws. We reserve the right to suspend accounts that violate these terms.</p>
      <h3 style={{color:T.text,marginTop:20}}>6. Intellectual Property</h3>
      <p>Content you create using our tools belongs to you. You receive a full commercial license for all generated content. TaskBase HQ retains ownership of the platform, tools, and underlying technology.</p>
      <h3 style={{color:T.text,marginTop:20}}>7. Limitation of Liability</h3>
      <p>TaskBase HQ is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
      <h3 style={{color:T.text,marginTop:20}}>8. Changes to Terms</h3>
      <p>We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
      <h3 style={{color:T.text,marginTop:20}}>9. Contact</h3>
      <p>Questions? Email us at {SITE.email} or WhatsApp {SITE.whatsappDisplay}.</p>
    </div>
  </div>);
}

function PrivacyPage(){
  return(<div style={{maxWidth:700,margin:"0 auto",padding:"32px 14px"}}>
    <h1 style={{color:"#fff",fontSize:26,fontWeight:900,margin:"0 0 20px"}}>Privacy Policy</h1>
    <div style={{color:T.muted,fontSize:13,lineHeight:1.8}}>
      <p><strong style={{color:T.text}}>Last updated:</strong> April 2026</p>
      <p>TaskBase HQ ({SITE.domain}) is committed to protecting your privacy. This policy explains how we collect, use, and protect your information.</p>
      <h3 style={{color:T.text,marginTop:20}}>1. Information We Collect</h3>
      <p>We collect information you provide when creating an account: name, email address, and payment information. We also collect usage data such as which tools you use and how often.</p>
      <h3 style={{color:T.text,marginTop:20}}>2. How We Use Your Information</h3>
      <p>We use your information to: provide and improve our services, process payments, send important account notifications, and provide customer support.</p>
      <h3 style={{color:T.text,marginTop:20}}>3. Payment Information</h3>
      <p>Payment processing is handled by our payment partner (Paddle). We do not store your credit card information on our servers. All payment data is encrypted and processed securely.</p>
      <h3 style={{color:T.text,marginTop:20}}>4. Data Security</h3>
      <p>We implement industry-standard security measures to protect your data. This includes SSL encryption, secure servers, and regular security audits.</p>
      <h3 style={{color:T.text,marginTop:20}}>5. Cookies</h3>
      <p>We use essential cookies to maintain your session and preferences. We do not use tracking cookies for advertising purposes.</p>
      <h3 style={{color:T.text,marginTop:20}}>6. Third-Party Services</h3>
      <p>We use third-party AI APIs to power our tools. Your input data is processed by these services but is not stored or used for training purposes.</p>
      <h3 style={{color:T.text,marginTop:20}}>7. Your Rights</h3>
      <p>You can request access to, correction of, or deletion of your personal data at any time by contacting us. You can also export your data or close your account.</p>
      <h3 style={{color:T.text,marginTop:20}}>8. Contact</h3>
      <p>For privacy concerns, email us at {SITE.email} or WhatsApp {SITE.whatsappDisplay}.</p>
    </div>
  </div>);
}

function RefundPage(){
  return(<div style={{maxWidth:700,margin:"0 auto",padding:"32px 14px"}}>
    <h1 style={{color:"#fff",fontSize:26,fontWeight:900,margin:"0 0 20px"}}>Refund Policy</h1>
    <div style={{color:T.muted,fontSize:13,lineHeight:1.8}}>
      <p><strong style={{color:T.text}}>Last updated:</strong> April 2026</p>
      <p>We want you to be completely satisfied with TaskBase HQ. If you're not, here's our refund policy.</p>
      <h3 style={{color:T.text,marginTop:20}}>1. 7-Day Free Trial</h3>
      <p>All plans include a 7-day free trial. During the trial, you have full access to all tools at no cost. If you cancel before the trial ends, you will not be charged anything.</p>
      <h3 style={{color:T.text,marginTop:20}}>2. 30-Day Money-Back Guarantee</h3>
      <p>If you are not satisfied with your subscription after the trial period, you can request a full refund within 30 days of your first payment. No questions asked.</p>
      <h3 style={{color:T.text,marginTop:20}}>3. How to Request a Refund</h3>
      <p>To request a refund, simply email us at {SITE.email} or message us on WhatsApp at {SITE.whatsappDisplay}. Include your account email and reason for the refund (optional). We will process your refund within 5-10 business days.</p>
      <h3 style={{color:T.text,marginTop:20}}>4. After 30 Days</h3>
      <p>Refunds are not available after 30 days from your payment date. However, you can cancel your subscription at any time to prevent future charges.</p>
      <h3 style={{color:T.text,marginTop:20}}>5. Cancellation</h3>
      <p>You can cancel your subscription at any time from your account dashboard. After cancellation, you will continue to have access until the end of your current billing period.</p>
      <h3 style={{color:T.text,marginTop:20}}>6. Contact</h3>
      <p>For refund requests or questions, email {SITE.email} or WhatsApp {SITE.whatsappDisplay}. We reply within 2 working days.</p>
    </div>
  </div>);
}

function Footer({go}){
  return(<footer style={{borderTop:`1px solid ${T.border}`,padding:"28px 14px 20px",maxWidth:960,margin:"0 auto"}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:20,marginBottom:20}}>
      <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${T.accent},${T.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#fff"}}>TB</div><span style={{color:"#fff",fontSize:13,fontWeight:800}}>TaskBase HQ</span></div><p style={{color:T.dim,fontSize:11,lineHeight:1.5}}>30+ AI tools. One price.</p></div>
      <div><div style={{color:T.muted,fontSize:10,fontWeight:700,marginBottom:8,letterSpacing:1}}>PRODUCT</div>{[{l:"All Tools",p:PAGES.TOOLS},{l:"Pricing",p:PAGES.PRICING},{l:"FAQ",p:PAGES.FAQ},{l:"Support",p:PAGES.SUPPORT}].map((x,i)=><div key={i} onClick={()=>go(x.p)} style={{color:T.dim,fontSize:12,padding:"3px 0",cursor:"pointer"}}>{x.l}</div>)}</div>
      <div><div style={{color:T.muted,fontSize:10,fontWeight:700,marginBottom:8,letterSpacing:1}}>LEGAL</div>{[{l:"Terms of Service",p:PAGES.TERMS},{l:"Privacy Policy",p:PAGES.PRIVACY},{l:"Refund Policy",p:PAGES.REFUND}].map((x,i)=><div key={i} onClick={()=>go(x.p)} style={{color:T.dim,fontSize:12,padding:"3px 0",cursor:"pointer"}}>{x.l}</div>)}</div>
      <div><div style={{color:T.muted,fontSize:10,fontWeight:700,marginBottom:8,letterSpacing:1}}>CONTACT</div><div style={{color:T.dim,fontSize:11,lineHeight:2.2}}>📧 {SITE.email}<br/>💬 {SITE.whatsappDisplay}<br/>📞 {SITE.whatsappDisplay}</div></div>
    </div>
    <div style={{textAlign:"center",color:T.dim,fontSize:10,borderTop:`1px solid ${T.border}`,paddingTop:14}}>© 2026 {SITE.name} ({SITE.domain}). All rights reserved. | <span onClick={()=>go(PAGES.PRIVACY)} style={{cursor:"pointer"}}>Privacy</span> | <span onClick={()=>go(PAGES.TERMS)} style={{cursor:"pointer"}}>Terms</span> | <span onClick={()=>go(PAGES.REFUND)} style={{cursor:"pointer"}}>Refund</span></div>
  </footer>);
}

export default function TaskBaseHQ(){
  const[page,setPage]=useState(PAGES.HOME);const[showInstall,setShowInstall]=useState(false);
  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[page]);
  useEffect(()=>{const t=setTimeout(()=>setShowInstall(true),6000);return()=>clearTimeout(t);},[]);
  const go=(p)=>{setPage(p);setShowInstall(false);};
  return(<div style={{minHeight:"100vh",background:T.bg,fontFamily:T.font,color:T.text,paddingBottom:showInstall?120:0}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;}::-webkit-scrollbar{display:none;}body{margin:0;background:${T.bg};}input::placeholder,textarea::placeholder{color:#4a5568!important;}@keyframes modalUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    <Nav page={page} go={go} setInstall={setShowInstall}/>
    {page===PAGES.HOME&&<HomePage go={go}/>}
    {page===PAGES.TOOLS&&<ToolsPage go={go}/>}
    {page===PAGES.PRICING&&<PricingPage/>}
    {page===PAGES.FAQ&&<FAQPage/>}
    {page===PAGES.SUPPORT&&<SupportPage/>}
    {page===PAGES.TERMS&&<TermsPage/>}
    {page===PAGES.PRIVACY&&<PrivacyPage/>}
    {page===PAGES.REFUND&&<RefundPage/>}
    <Footer go={go}/>
    {showInstall&&<InstallBanner onClose={()=>setShowInstall(false)}/>}
  </div>);
}
