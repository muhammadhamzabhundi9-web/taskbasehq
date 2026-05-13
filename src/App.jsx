import { useState, useEffect } from "react";
const SITE = {
  name: "TaskBase HQ",
  domain: "taskbasehq.com",
  email: "support@taskbasehq.com",
  whatsapp: "+923232108023",
  whatsappDisplay: "+92 323 2108023",
  twitter: "@TaskBaseHQ",
  payMonthly: "https://hamzabhundi.gumroad.com/l/taskbasehq?option=IpupbMoZ-KNWGiKs67cG-w%3D%3D",
  payYearly: "https://hamzabhundi.gumroad.com/l/taskbasehq-pro-yearly",
  payProPlus: "https://hamzabhundi.gumroad.com/l/taskbasehq?option=lGeudA1dCJAMMdqKQunQkg%3D%3D",
  payProPlusYearly: "https://hamzabhundi.gumroad.com/l/taskbasehq-proplus-yearly",
  payProMax: "https://hamzabhundi.gumroad.com/l/taskbasehq?option=3w82fLuEcR_BH27136rMIQ%3D%3D",
  payProMaxYearly: "https://hamzabhundi.gumroad.com/l/taskbasehq-promax-yearly",
  buyCredits100: "https://hamzabhundi.gumroad.com/l/taskbasehq-credits-100",
  buyCredits500: "https://hamzabhundi.gumroad.com/l/taskbasehq-credits-500",
  buyCredits1500: "https://hamzabhundi.gumroad.com/l/taskbasehq-credits-1500",
};
const PLANS = {
  free: { price: 0, label: "$0", period: "", features: ["All 46+ AI tools", "50 free credits", "Standard quality", "Email support", "No credit card"] },
  monthly: { price: 9.99, label: "$9.99", period: "/month", features: ["500 credits/month", "46+ AI tools access", "Standard image quality (1MP)", "Vision AI Chat (1 file per message)", "Pro Library — save all generations", "PDF/Word/Excel export (no watermark)", "Email support"] },
  yearly: { price: 79.99, label: "$79.99", period: "/year", features: ["500 credits/month", "Save 33% vs monthly ($6.67/mo)", "All Pro Monthly features", "No watermark on any export", "Pro Library", "Email support"] },
  proplus: { price: 19.99, label: "$19.99", period: "/month", features: ["1,500 credits/month (3x more)", "🎨 HD Image Quality (4MP — 2x sharper)", "🤖 Vision AI: 5 files per message", "💼 Commercial license", "📞 WhatsApp support", "All Pro features"] },
  proplusyearly: { price: 199.99, label: "$199.99", period: "/year", features: ["1,500 credits/month", "Save 17% vs monthly", "🎨 HD Image Quality (2x sharper)", "🤖 5 files per Vision AI message", "💼 Commercial license", "📞 WhatsApp support"] },
  promax: { price: 39.99, label: "$39.99", period: "/month", features: ["5,000 credits/month (10x more)", "🚀 4K Ultra Image Quality (16MP)", "🤖 Vision AI: Unlimited files", "📞 24/7 WhatsApp priority support", "🎯 1-on-1 setup call (Zoom)", "All Pro Plus features"] },
  promaxyearly: { price: 399.99, label: "$399.99", period: "/year", features: ["5,000 credits/month", "Save 17% vs monthly", "🚀 4K Ultra Image Quality", "🤖 Unlimited Vision AI files", "📞 24/7 WhatsApp priority", "🎯 1-on-1 setup call"] },
};
const CATEGORIES = [
  { id: "all", label: "All", icon: "⚡" },
  { id: "trending", label: "Trending", icon: "🔥" },
  { id: "image", label: "Image", icon: "🎨" },
  { id: "voice", label: "Voice", icon: "🎙️" },
  { id: "writing", label: "Writing", icon: "✍️" },
  { id: "code", label: "Code", icon: "💻" },
  { id: "business", label: "Business", icon: "📊" },
  { id: "social", label: "Social", icon: "📱" },
  { id: "productivity", label: "Productivity", icon: "🚀" },
  { id: "video", label: "Video (Soon)", icon: "🎬" },
];
const TOOLS = [
  // 🔥 TOP TRENDING — UPAR (sellable)
  { id:0, name:"TaskBase Vision AI", desc:"ChatGPT-style AI agent. Upload files, analyze images, create Excel/PDF/code, edit docs — in any language.", category:"productivity", icon:"🤖", marketPrice:20, features:["File upload (PDF/Excel/Image)","Create Excel & CSV","Analyze any image","Multi-language","Voice input"], badge:"🔥 Most Powerful", trending:true, users:"50K+", rating:5.0, isVisionAI:true },
  { id:1, name:"AI Image Generator", desc:"Create stunning images from text. Photorealistic, anime, 3D — any style. Better than Midjourney.", category:"image", icon:"🖼️", marketPrice:30, features:["Unlimited generations","4K resolution","100+ styles","Commercial license","Inpainting"], badge:"🔥 #1 Most Used", trending:true, users:"23K+", rating:4.9 },
  { id:2, name:"AI Voiceover Generator", desc:"Pro voiceovers in 50+ languages. Natural AI voices for videos, podcasts, presentations.", category:"voice", icon:"🗣️", marketPrice:22, features:["50+ languages","Natural voices","Emotion control","Studio quality","Commercial"], badge:"🎯 Game Changer", trending:true, users:"15K+", rating:4.8 },
  { id:3, name:"Background Remover & Replacer", desc:"Remove or replace background with AI. Just upload, optionally describe new BG.", category:"image", icon:"✂️", marketPrice:15, features:["1-click removal","BG replacement","HD export","Custom BGs","AI relighting"], badge:"⚡ Instant", trending:true, users:"42K+", rating:4.9 },
  { id:4, name:"AI Photo Enhancer", desc:"Turn blurry photos crystal-clear. Upscale 4x, restore old photos, fix faces.", category:"image", icon:"✨", marketPrice:15, features:["4x upscaling","Face restoration","Detail enhance","Noise removal","HD output"], badge:"📸 Must Have", trending:true, users:"20K+", rating:4.8 },
  { id:5, name:"AI Selfie to Headshot", desc:"Upload selfie, get professional LinkedIn-ready headshots. Replaces $300 photoshoots.", category:"image", icon:"🤳", marketPrice:30, features:["Pro headshots","20+ styles","HD download","LinkedIn ready","Commercial"], badge:"💼 Career Boost", trending:true, users:"25K+", rating:4.9 },
  { id:6, name:"AI Avatar Creator", desc:"Photorealistic AI avatars from text. Perfect for profiles, marketing.", category:"image", icon:"👤", marketPrice:20, features:["Photorealistic","100+ styles","Custom poses","HD download","Commercial"], badge:"👤 Go Digital", trending:true, users:"11K+", rating:4.7 },
  { id:7, name:"AI Logo & Brand Kit", desc:"Pro logos, brand identity — colors, fonts, business cards.", category:"business", icon:"💎", marketPrice:50, features:["Logo generator","Brand guidelines","Business cards","Social kit","Unlimited revisions"], badge:"🏆 Top Rated", trending:true, users:"16K+", rating:4.8 },
  { id:8, name:"AI Product Photography", desc:"Turn phone photos into pro studio shots. Perfect for Amazon, Shopify sellers.", category:"image", icon:"📸", marketPrice:39, features:["Studio quality","Multiple angles","Custom backgrounds","Bulk processing","E-commerce ready"], badge:"📸 Sell More", trending:true, users:"14K+", rating:4.8 },
  { id:9, name:"AI Photo Editor", desc:"Edit photos with text. Remove objects, change BGs, adjust lighting.", category:"image", icon:"🎨", marketPrice:20, features:["Text editing","Object removal","BG change","Style transfer","Batch"], badge:"🪄 Magic Edit", trending:true, users:"17K+", rating:4.7 },
  { id:10, name:"AI Thumbnail Maker", desc:"Click-worthy YouTube thumbnails, social banners. AI picks best layouts.", category:"social", icon:"📺", marketPrice:12, features:["YouTube sized","Social sizes","AI layout","Brand templates","A/B test"], badge:"📈 Get Clicks", trending:true, users:"21K+", rating:4.7 },
  
  // 📝 WRITING TOOLS
  { id:11, name:"AI Content Writer", desc:"Blog posts, articles, ad copy. SEO optimized, plagiarism-free, 10x faster.", category:"writing", icon:"📝", marketPrice:49, features:["Blog & articles","Ad copy","SEO optimization","Plagiarism-free","30+ types"], badge:"✍️ Bestseller", trending:true, users:"27K+", rating:4.9 },
  { id:12, name:"AI Translator Pro", desc:"Translate text, documents, websites in 130+ languages. Context preserved.", category:"writing", icon:"🌐", marketPrice:15, features:["130+ languages","Context-aware","Documents","Websites","Bulk translate"], badge:"🌍 130+ Lang", trending:true, users:"19K+", rating:4.8 },
  { id:13, name:"AI Grammar & Rewriter", desc:"Fix grammar, rewrite for any tone. Plagiarism check included.", category:"writing", icon:"🔤", marketPrice:20, features:["Grammar fix","Tone adjust","Plagiarism check","Readability","Multi-lang"], badge:"✅ Write Better", users:"24K+", rating:4.7 },
  { id:14, name:"AI Email Writer", desc:"Pro emails in seconds. Cold outreach, follow-ups, responses.", category:"productivity", icon:"📧", marketPrice:15, features:["Smart templates","Tone control","Follow-ups","Subject lines","Multi-lang"], badge:"📧 Save Hours", users:"18K+", rating:4.6 },
  { id:15, name:"AI Resume Builder", desc:"ATS-optimized resumes that get interviews.", category:"writing", icon:"💼", marketPrice:12, features:["ATS optimized","AI bullets","25+ templates","Cover letters","LinkedIn optimizer"], badge:"💼 Land Jobs", trending:true, users:"35K+", rating:4.8 },
  { id:16, name:"AI Cover Letter", desc:"Job-winning cover letters tailored to any position.", category:"writing", icon:"📩", marketPrice:10, features:["Job-specific","ATS optimized","Multiple tones","Quick edit","Templates"], badge:"📩 Hired Faster", users:"12K+", rating:4.7 },
  { id:17, name:"AI Document Writer", desc:"Reports, proposals, SOPs — professional documents.", category:"business", icon:"📄", marketPrice:18, features:["Reports","Proposals","SOPs","Policies","Multi-format"], badge:"📄 Pro Docs", users:"9K+", rating:4.6 },
  { id:18, name:"AI Script Writer", desc:"YouTube, TikTok, podcast scripts that engage.", category:"social", icon:"🎤", marketPrice:15, features:["Video scripts","Podcast outlines","Hooks","Story arcs","CTAs"], badge:"🎬 Viral Scripts", users:"13K+", rating:4.7 },
  { id:19, name:"AI Press Release", desc:"Professional press releases for media coverage.", category:"business", icon:"📰", marketPrice:25, features:["Media-ready","SEO optimized","Quote generator","Distribution-ready","Multi-format"], badge:"📰 PR Ready", users:"6K+", rating:4.5 },
  { id:20, name:"AI Brand Name Generator", desc:"Unique memorable brand names + taglines.", category:"business", icon:"💡", marketPrice:10, features:["Brand names","Taglines","Domain check","Personality","Top 10 picks"], badge:"💡 Name It", users:"8K+", rating:4.6 },
  
  // 💻 CODE TOOLS
  { id:21, name:"AI Code Assistant", desc:"Write, debug, generate code in 50+ languages. Better than Copilot.", category:"code", icon:"⌨️", marketPrice:19, features:["50+ languages","Full project gen","Debug & fix","Code review","Unit tests"], badge:"💻 Dev Fav", trending:true, users:"14K+", rating:4.9 },
  { id:22, name:"AI Docs Generator", desc:"Auto-generate API docs, READMEs, code comments.", category:"code", icon:"📖", marketPrice:12, features:["API docs","README builder","Code comments","Changelog","OpenAPI"], badge:"📖 Auto Docs", users:"6K+", rating:4.6 },
  { id:23, name:"AI Website Builder", desc:"Describe your website, AI builds it. Landing pages, portfolios.", category:"code", icon:"🌐", marketPrice:30, features:["AI builder","Responsive","SEO built-in","Templates","Custom code"], badge:"🔥 No-Code", users:"9K+", rating:4.7 },
  
  // 📊 BUSINESS TOOLS
  { id:24, name:"AI Business Plan", desc:"Investor-ready business plans in minutes.", category:"business", icon:"📑", marketPrice:50, features:["Executive summary","Market analysis","Financial projections","Pitch deck","SWOT"], badge:"📑 Investor Ready", users:"5K+", rating:4.7 },
  { id:25, name:"AI Invoice & Finance", desc:"Pro invoices, expense tracking, auto-categorize transactions.", category:"business", icon:"🧾", marketPrice:18, features:["Invoices","Expense tracking","Auto categorize","Tax summaries","Client portal"], badge:"💰 Finance", users:"8K+", rating:4.6 },
  { id:26, name:"AI Presentations", desc:"Stunning slideshow content. Auto-design, charts, speaker notes.", category:"business", icon:"📊", marketPrice:25, features:["Slide content","Charts","50+ templates","Speaker notes","Outline export"], badge:"📊 Office Must", users:"11K+", rating:4.6 },
  { id:27, name:"AI Spreadsheets", desc:"Plain English formulas, analyze data, create charts.", category:"business", icon:"📈", marketPrice:15, features:["Formula writer","Data analysis","Auto charts","Data cleaning","Pivot tables"], badge:"📉 Data Pro", users:"13K+", rating:4.6 },
  { id:28, name:"AI Legal Draft", desc:"Contracts, NDAs, legal templates ready to use.", category:"business", icon:"⚖️", marketPrice:30, features:["Contracts","NDAs","Terms","Privacy","Templates"], badge:"⚖️ Legal Ready", users:"7K+", rating:4.5 },
  { id:29, name:"AI Data Analyzer", desc:"Analyze data & find actionable insights instantly.", category:"business", icon:"📊", marketPrice:20, features:["Data insights","Trends","Forecasts","Anomalies","Recommendations"], badge:"📊 Data Power", users:"6K+", rating:4.6 },
  { id:30, name:"AI SWOT Analysis", desc:"Strategic business analysis in seconds.", category:"business", icon:"🔎", marketPrice:15, features:["SWOT","Strategic analysis","Recommendations","Action items","Multiple scenarios"], badge:"🔎 Strategy", users:"4K+", rating:4.5 },
  { id:31, name:"AI Job Description", desc:"Attract top talent with compelling job posts.", category:"business", icon:"👔", marketPrice:12, features:["JD generator","Skills checklist","Salary suggestions","DEI optimized","ATS friendly"], badge:"👔 Hire Better", users:"5K+", rating:4.6 },
  
  // 📱 SOCIAL TOOLS
  { id:32, name:"AI Social Manager", desc:"Posts, captions, hashtags for all platforms.", category:"social", icon:"📱", marketPrice:29, features:["Multi-platform","Auto scheduling","AI captions","Analytics","Competitor tracking"], badge:"📱 All-in-One", users:"22K+", rating:4.7 },
  { id:33, name:"AI SEO & Hashtags", desc:"Trending hashtags, SEO, keyword research.", category:"social", icon:"#️⃣", marketPrice:12, features:["Trending hashtags","SEO audits","Keywords","Competitors","Rank tracker"], badge:"📈 Rank Higher", users:"15K+", rating:4.8 },
  { id:34, name:"AI Ad Creator", desc:"High-converting ads for Facebook, Google, Instagram.", category:"social", icon:"📢", marketPrice:35, features:["FB/IG/Google ads","Ad copy","Visual concepts","A/B variations","ROI focused"], badge:"💰 Convert More", users:"8K+", rating:4.7 },
  { id:35, name:"AI Email Campaign", desc:"Complete email sequences that convert.", category:"social", icon:"📨", marketPrice:20, features:["Email sequences","Welcome flows","Nurture campaigns","Re-engagement","Templates"], badge:"📨 Convert", users:"7K+", rating:4.6 },
  { id:36, name:"AI Cold Call Script", desc:"Sales call scripts that convert prospects.", category:"social", icon:"📞", marketPrice:15, features:["Cold call scripts","Objection handlers","Discovery questions","Closing scripts","Industry-specific"], badge:"📞 Sales Pro", users:"5K+", rating:4.5 },
  
  // 🚀 PRODUCTIVITY TOOLS
  { id:37, name:"AI Chat Assistant", desc:"Smart AI chatbot like ChatGPT. Answers anything.", category:"productivity", icon:"💬", marketPrice:20, features:["Multi-turn chat","Code help","Research","Brainstorming","Always available"], badge:"🤖 24/7 Smart", trending:true, users:"40K+", rating:4.9 },
  { id:38, name:"AI PDF Tool", desc:"Chat with PDFs, extract data, summarize.", category:"productivity", icon:"📄", marketPrice:15, features:["Chat with PDF","Data extraction","Summarize","Q&A","Multi-doc"], badge:"📄 Doc Master", users:"16K+", rating:4.7 },
  { id:39, name:"AI Meeting Notes", desc:"Perfect notes, action items, follow-up emails.", category:"productivity", icon:"📋", marketPrice:20, features:["Smart summaries","Action items","Follow-ups","Search","Key points"], badge:"📋 Never Forget", users:"10K+", rating:4.7 },
  { id:40, name:"AI Task Manager", desc:"AI auto-prioritizes tasks, suggests deadlines.", category:"productivity", icon:"✅", marketPrice:12, features:["AI priority","Smart deadlines","Progress tracking","Team boards","Integrations"], badge:"✅ Organize", users:"11K+", rating:4.6 },
  { id:41, name:"AI Productivity Coach", desc:"Personalized productivity systems & habits.", category:"productivity", icon:"⚡", marketPrice:15, features:["Habit tracking","Time blocking","Focus tips","Goal setting","Personalized"], badge:"⚡ Boost 10x", users:"7K+", rating:4.6 },
  { id:42, name:"AI Negotiation Coach", desc:"Win salary, contract & business negotiations.", category:"productivity", icon:"🤝", marketPrice:20, features:["Negotiation scripts","Salary tactics","Contract help","Counter-offers","Psychology"], badge:"🤝 Win More", users:"4K+", rating:4.6 },
  { id:43, name:"AI Research Agent", desc:"Deep research reports with citations.", category:"productivity", icon:"🔬", marketPrice:25, features:["Web research","Citations","Reports","Analysis","Multi-source"], badge:"🔬 Deep Research", users:"6K+", rating:4.7 },
  { id:44, name:"AI Product Description", desc:"E-commerce copy that converts buyers.", category:"social", icon:"🛒", marketPrice:15, features:["Product copy","SEO optimized","Multiple lengths","Bullet points","CTA"], badge:"🛒 Sell More", users:"9K+", rating:4.6 },
  { id:45, name:"AI Study Guide", desc:"Turn any topic into study materials.", category:"productivity", icon:"📚", marketPrice:10, features:["Study guides","Practice questions","Cheat sheets","Study plans","Memory aids"], badge:"📚 Learn Fast", users:"8K+", rating:4.7 },
  
  // ⏳ COMING SOON (11 tools)
  { id:46, name:"AI Video Creator", desc:"Turn text into pro videos. AI generates scenes, characters, voiceover.", category:"video", icon:"🎥", marketPrice:76, features:["Text to video","AI characters","Auto voiceover","4K export","Green screen"], badge:"⏳ Coming Soon", comingSoon:true, users:"18K+", rating:4.8 },
  { id:47, name:"AI Video Editor", desc:"Edit videos with text. Auto-cut highlights, remove silence.", category:"video", icon:"🎬", marketPrice:49, features:["Auto highlights","Silence removal","AI transitions","Auto captions","Color grading"], badge:"⏳ Coming Soon", comingSoon:true, users:"31K+", rating:4.9 },
  { id:48, name:"AI Video Subtitles", desc:"Auto-generate subtitles in 100+ languages.", category:"video", icon:"💬", marketPrice:20, features:["100+ languages","Auto transcription","Subtitle styling","SRT export","Batch"], badge:"⏳ Coming Soon", comingSoon:true, users:"19K+", rating:4.8 },
  { id:49, name:"AI Talking Avatar", desc:"Photo + script → photo bolne lage video. Replaces HeyGen.", category:"video", icon:"🎬", marketPrice:30, features:["Photo to video","100+ languages","Custom scripts","Lip sync","Commercial"], badge:"⏳ Coming Soon", comingSoon:true, users:"17K+", rating:4.8 },
  { id:50, name:"AI Voice Cloner", desc:"Clone any voice with 3 seconds of audio.", category:"voice", icon:"🎤", marketPrice:49, features:["3-sec cloning","Custom voices","100+ languages","Real-time","Commercial use"], badge:"⏳ Coming Soon", comingSoon:true, users:"9K+", rating:4.9 },
  { id:51, name:"AI Music Generator", desc:"Royalty-free music for videos, podcasts, reels.", category:"voice", icon:"🎵", marketPrice:25, features:["All genres","Royalty-free","Custom duration","Stems","Sound effects"], badge:"⏳ Coming Soon", comingSoon:true, users:"12K+", rating:4.7 },
  { id:52, name:"AI Song Generator", desc:"Lyrics → full song with vocals. Replaces Suno AI.", category:"voice", icon:"🎤", marketPrice:10, features:["Full song","AI vocals","All genres","Custom lyrics","Commercial"], badge:"⏳ Coming Soon", comingSoon:true, users:"22K+", rating:4.8 },
  { id:53, name:"AI Podcast Editor", desc:"Remove fillers, enhance audio, generate show notes.", category:"voice", icon:"🎧", marketPrice:25, features:["Filler removal","Audio enhance","Transcripts","Clip generator","Show notes"], badge:"⏳ Coming Soon", comingSoon:true, users:"7K+", rating:4.7 },
  { id:54, name:"AI Face Swap", desc:"Swap faces in photos and videos instantly.", category:"image", icon:"🎭", marketPrice:25, features:["Photo face swap","Video face swap","Batch","HD quality","Real-time"], badge:"⏳ Coming Soon", comingSoon:true, users:"33K+", rating:4.8 },
  { id:55, name:"AI Try-On Clothes", desc:"See yourself in any outfit before buying.", category:"image", icon:"👗", marketPrice:20, features:["Virtual try-on","Any clothing","Realistic fit","Multiple angles","E-commerce ready"], badge:"⏳ Coming Soon", comingSoon:true, users:"19K+", rating:4.8 },
  { id:56, name:"AI Meme & Reel Maker", desc:"Viral memes, reels, TikTok content with auto-captions.", category:"video", icon:"😂", marketPrice:10, features:["Trending templates","Auto captions","Viral formats","Direct sharing","Branding"], badge:"⏳ Coming Soon", comingSoon:true, users:"28K+", rating:4.8 },
];
const REVIEWS = [];
const FAQ = [
  { q:"What do I get?", a:"Unlimited access to ALL 46+ AI tools — image generator, video creator, voice cloner, content writer, code assistant, and more. One subscription, no hidden costs." },
  { q:"How do free credits work?", a:"You get 50 free credits on signup — no credit card needed. Each AI generation uses 1 credit. When credits run out, upgrade for unlimited access to all tools." },
  { q:"Is the image/video/voice quality good?", a:"Yes! We use top-tier AI models — Stability AI for images, ElevenLabs for voice, and premium video AI. Quality matches or beats $30-50/mo competitors." },
  { q:"How is this so cheap?", a:"We bundle 46+ tools on optimized infrastructure. Others charge $20-80/month per tool. With TaskBase HQ you save $2,000+/month." },
  { q:"Can I cancel anytime? What about refunds?", a:"Yes — cancel anytime from Gumroad with one click. We offer a 30-day money-back guarantee for genuine technical issues, provided you have used less than 50 credits after purchase. We give 50 free credits to test before purchase, so you know what you are buying. Read our full Refund Policy for details." },
  { q:"Do I own what I create?", a:"Yes — 100% ownership with commercial license. Use for clients, business, reselling — anything you want." },
  { q:"Works on mobile?", a:"Yes! Works on any browser on phone or desktop. Mobile app (Play Store & App Store) coming soon!" },
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
  const[isLoggedIn,setIsLoggedIn]=useState(typeof window!=='undefined'?!!localStorage.getItem('tb_user_plan'):false);
  useEffect(()=>{
    const check=()=>setIsLoggedIn(!!localStorage.getItem('tb_user_plan'));
    check();
    window.addEventListener('storage',check);
    const interval=setInterval(check,1000);
    return()=>{window.removeEventListener('storage',check);clearInterval(interval);};
  },[]);
  const[open,setOpen]=useState(false);
  const links=[{id:PAGES.HOME,label:"Home"},{id:PAGES.TOOLS,label:"All Tools"},{id:PAGES.PRICING,label:"Pricing"},{id:PAGES.FAQ,label:"FAQ"},{id:PAGES.SUPPORT,label:"Support"}];
  return(
    <nav style={{position:"sticky",top:0,zIndex:300,background:"rgba(6,8,16,0.92)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:960,margin:"0 auto",padding:"0 16px",height:54}}>
        <div onClick={()=>go(PAGES.HOME)} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
          <div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${T.accent},${T.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#fff"}}>TB</div>
          <div><div style={{color:"#fff",fontSize:14,fontWeight:900,letterSpacing:-0.3,lineHeight:1}}>TaskBase HQ</div><div style={{color:T.cyan,fontSize:8,fontWeight:700,letterSpacing:1.5}}>46+ AI TOOLS • ONE PRICE</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {isLoggedIn ? (
            <button onClick={()=>window.location.href="/dashboard.html"} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 4px 14px ${T.accentGlow}`),padding:"7px 16px",fontSize:12}}>📊 Dashboard</button>
          ) : (
            <>
              <button onClick={()=>window.location.href="/login.html"} style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${T.border}`,color:T.text,padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Login</button>
              <button onClick={()=>go(PAGES.PRICING)} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 4px 14px ${T.accentGlow}`),padding:"7px 16px",fontSize:12}}>Start Free</button>
            </>
          )}
          <button onClick={()=>setOpen(!open)} style={{background:"rgba(255,255,255,0.05)",border:"none",color:T.muted,width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:15}}>{open?"✕":"☰"}</button>
        </div>
      </div>
      {open&&<div style={{position:"absolute",top:54,left:0,right:0,background:"rgba(6,8,16,0.98)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`,padding:"6px 12px"}}>
        {links.map(l=><button key={l.id} onClick={()=>{go(l.id);setOpen(false);}} style={{display:"block",width:"100%",textAlign:"left",background:page===l.id?`${T.accent}12`:"transparent",border:"none",color:page===l.id?T.accent:T.text,padding:"11px 14px",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>{l.label}</button>)}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px"}}>
          <span style={{color:T.muted,fontSize:14,fontWeight:600}}>📱 Mobile App</span>
          <span style={{background:"rgba(245,158,11,0.1)",color:"#f59e0b",fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:6}}>COMING SOON</span>
        </div>
        <button onClick={()=>window.location.href="/blog/"} style={{display:"block",width:"100%",textAlign:"left",background:"transparent",border:"none",color:T.muted,padding:"11px 14px",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>📝 Blog</button>
        <div style={{borderTop:`1px solid ${T.border}`,margin:"4px 0"}}/>
        {isLoggedIn ? (
          <button onClick={()=>{window.location.href="/dashboard.html";}} style={{display:"block",width:"100%",textAlign:"left",background:`${T.accent}12`,border:"none",color:T.accent,padding:"11px 14px",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>📊 Open Dashboard</button>
        ) : (
          <button onClick={()=>{window.location.href="/login.html";}} style={{display:"block",width:"100%",textAlign:"left",background:`${T.accent}12`,border:"none",color:T.accent,padding:"11px 14px",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>🔑 Login / Sign Up</button>
        )}
      </div>}
    </nav>
  );
}
function ToolCard({tool,onClick}){
  const[h,setH]=useState(false);
  const isComingSoon=tool.comingSoon;
  return(
    <div onClick={()=>onClick(tool)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:h?"rgba(255,255,255,0.04)":T.card,border:`1px solid ${isComingSoon?T.orange+"25":(h?T.accent+"30":T.border)}`,borderRadius:16,padding:"18px 16px",cursor:"pointer",transition:"all 0.3s cubic-bezier(0.16,1,0.3,1)",transform:h?"translateY(-4px)":"",boxShadow:h?`0 16px 40px rgba(0,0,0,0.3),0 0 20px ${T.accentGlow}`:"none",opacity:isComingSoon?0.85:1,position:"relative"}}>
      {isComingSoon&&<div style={{position:"absolute",top:8,right:8,background:`${T.orange}20`,color:T.orange,fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:6,letterSpacing:0.5}}>⏳ COMING SOON</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:30}}>{tool.icon}</span>
          <div><h3 style={{color:"#fff",fontSize:15,fontWeight:800,margin:0,lineHeight:1.2}}>{tool.name}</h3>
          </div>
        </div>
        {!tool.comingSoon&&<Pill color={tool.trending?T.orange:T.accent}>{tool.badge}</Pill>}
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
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}><span style={{fontSize:44}}>{tool.icon}</span><div>{!tool.comingSoon&&<Pill color={tool.trending?T.orange:T.accent}>{tool.badge}</Pill>}<h2 style={{color:"#fff",fontSize:20,fontWeight:900,margin:"6px 0 0"}}>{tool.name}</h2></div></div>
        
        <p style={{color:T.muted,fontSize:14,lineHeight:1.65,margin:"0 0 20px"}}>{tool.desc}</p>
        <div style={{marginBottom:20}}><div style={{color:T.text,fontSize:13,fontWeight:700,marginBottom:10}}>All Features:</div>
        {tool.features.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<tool.features.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}><span style={{width:22,height:22,borderRadius:6,background:`${T.green}15`,color:T.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>✓</span><span style={{color:"#cbd5e1",fontSize:13.5}}>{f}</span></div>)}</div>
        <div style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.12)",borderRadius:12,padding:"14px 16px",textAlign:"center",marginBottom:18}}>
          <div style={{color:T.dim,fontSize:11}}>Separately</div><div style={{color:T.red,fontSize:30,fontWeight:900,textDecoration:"line-through"}}>${tool.marketPrice}/mo</div>
          <div style={{color:T.dim,fontSize:11,margin:"6px 0 2px"}}>With TaskBase HQ</div><div style={{color:T.green,fontSize:18,fontWeight:900}}>$0 extra — Included</div>
        </div>
        {tool.comingSoon?<button disabled style={{...bs(`${T.orange}30`),width:"100%",padding:15,fontSize:15,color:T.orange,cursor:"not-allowed",opacity:0.8}}>⏳ Coming Soon — Notify Me</button>:tool.isVisionAI?<a href="/dashboard.html" style={{...bs(`linear-gradient(135deg,#06b6d4,${T.accent})`,`0 8px 25px rgba(6,182,212,0.3)`),...{display:"block",padding:15,fontSize:15,textAlign:"center",textDecoration:"none",color:"#fff",borderRadius:10,fontWeight:800}}}>🤖 Open Vision AI →</a>:<button onClick={()=>{
          const isLogged=!!localStorage.getItem('tb_user_plan');
          onClose();
          if(isLogged) window.location.href="/dashboard.html";
          else go(PAGES.PRICING);
        }} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 8px 25px ${T.accentGlow}`),width:"100%",padding:15,fontSize:15}}>{(typeof window!=='undefined'&&!!localStorage.getItem('tb_user_plan'))?'🚀 Open in Dashboard →':'Get 50 Free Credits →'}</button>}
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
        <Pill color={T.green}>🎉 50 Free Credits — No Credit Card</Pill>
        <h1 style={{color:"#fff",fontSize:"clamp(30px,7vw,48px)",fontWeight:900,lineHeight:1.1,margin:"18px 0 16px",letterSpacing:-1.5}}>46+ Premium AI Tools.<br/><span style={{background:`linear-gradient(135deg,${T.accent},${T.cyan})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>One Simple Price.</span></h1>
        <p style={{color:T.muted,fontSize:"clamp(14px,3.5vw,18px)",lineHeight:1.6,margin:"0 auto 6px",maxWidth:460}}>AI image generator, video creator, voice cloner, content writer, code assistant — tools that cost <strong style={{color:T.red,textDecoration:"line-through"}}>${totalMkt}+/mo</strong> separately.</p>
        <p style={{color:T.green,fontSize:"clamp(16px,4vw,22px)",fontWeight:900,margin:"0 0 26px"}}>All for just $9.99/month.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:30}}>
          <button onClick={()=>{
          const lg=!!localStorage.getItem('tb_user_plan');
          if(lg) window.location.href="/dashboard.html";
          else go(PAGES.PRICING);
        }} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 8px 30px ${T.accentGlow}`),padding:"15px 32px",fontSize:16}}>{(typeof window!=='undefined'&&!!localStorage.getItem('tb_user_plan'))?'📊 Open Dashboard':'🚀 Start Free — 50 Credits'}</button>
          <button onClick={()=>go(PAGES.TOOLS)} style={{...bs("rgba(255,255,255,0.06)"),border:`1px solid ${T.border}`,padding:"15px 28px",fontSize:15,fontWeight:700}}>See All Tools →</button>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"clamp(16px,4vw,32px)",flexWrap:"wrap"}}>
          {[{v:"46+",l:"AI Tools"},{v:"$9.99",l:"Per Month"},{v:"50",l:"Free Credits"},{v:"30-day",l:"Guarantee"}].map((s,i)=><div key={i}><div style={{color:T.accent,fontSize:22,fontWeight:900}}>{s.v}</div><div style={{color:T.dim,fontSize:10,fontWeight:600}}>{s.l}</div></div>)}
        </div>
      </div>
    </section>
    <div style={{background:"rgba(255,255,255,0.02)",borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,padding:"12px 16px",textAlign:"center"}}><span style={{color:T.dim,fontSize:12}}>Replaces Midjourney, ElevenLabs, Runway, Jasper, Copilot & more</span></div>
    <section style={{padding:"30px 14px",maxWidth:960,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><div><h2 style={{color:"#fff",fontSize:22,fontWeight:900,margin:0}}>🔥 Most Popular Tools</h2><p style={{color:T.muted,fontSize:13,margin:"4px 0 0"}}>What users love most</p></div><button onClick={()=>go(PAGES.TOOLS)} style={{...bs("rgba(255,255,255,0.05)"),border:`1px solid ${T.border}`,padding:"8px 16px",fontSize:12}}>All 45+ →</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>{show.map(t=><ToolCard key={t.id} tool={t} onClick={setSel}/>)}</div>
      <div style={{textAlign:"center",marginTop:20}}><button onClick={()=>go(PAGES.TOOLS)} style={{...bs(`${T.accent}15`),border:`1px solid ${T.accent}30`,padding:"12px 28px",fontSize:14,color:T.accent}}>View All 46+ AI Tools →</button></div>
    </section>
    <section style={{padding:"30px 14px",maxWidth:960,margin:"0 auto"}}>
      <h2 style={{color:"#fff",fontSize:22,fontWeight:900,textAlign:"center",margin:"0 0 24px"}}>Why TaskBase HQ is Different</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {[{icon:"💸",title:"Save $2,000+/Month",desc:"Replace 15+ subscriptions with one simple price."},{icon:"⚡",title:"Unlimited Generations",desc:"Credits used per generation. 50 free credits on signup."},{icon:"🆕",title:"New Tools Monthly",desc:"2-3 new tools every month. All free with your plan."},{icon:"📱",title:"Works Everywhere",desc:"Desktop, mobile, tablet. Mobile app coming soon!"},{icon:"🔒",title:"50 Free Credits",desc:"Start free with 50 credits. No credit card needed."},{icon:"🏆",title:"Commercial License",desc:"Everything you create is yours. Use for anything."}].map((v,i)=>
        <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}><div style={{fontSize:28,marginBottom:10}}>{v.icon}</div><div style={{color:"#fff",fontSize:14,fontWeight:800,marginBottom:6}}>{v.title}</div><div style={{color:T.muted,fontSize:12,lineHeight:1.5}}>{v.desc}</div></div>)}
      </div>
    </section>
    <section style={{padding:"30px 14px",maxWidth:960,margin:"0 auto"}}>
      <h2 style={{color:"#fff",fontSize:22,fontWeight:900,textAlign:"center",margin:"0 0 24px"}}>💬 What People Are Saying</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {[
          {avatar:"👩‍💻",name:"Sarah K.",role:"Freelance Designer",stars:5,text:"Cancelled Midjourney and ElevenLabs the same week. TaskBase has both — plus 44 more tools. I save $52/month."},
          {avatar:"👨‍💼",name:"Ahmad R.",role:"Marketing Manager",stars:5,text:"Vision AI Chat alone is worth it. I upload client briefs and it writes the whole strategy. Insane for $9.99."},
          {avatar:"🎬",name:"Mike T.",role:"YouTuber",stars:5,text:"Thumbnails, voiceovers, scripts — all from one tab. My workflow went from 3 hours to 30 minutes per video."},
          {avatar:"🛍️",name:"James L.",role:"Shopify Store Owner",stars:5,text:"Background remover + product photos in one place. Used to pay $30/month just for this. Now it's included."},
          {avatar:"📱",name:"Priya S.",role:"Social Media Manager",stars:5,text:"I make 30 days of social content in one afternoon. Image gen + caption writer + scheduler. Game changer."},
          {avatar:"💻",name:"David C.",role:"Freelance Developer",stars:5,text:"Code assistant is as good as Copilot. But I also get image generation and voice tools. No brainer subscription."},
        ].map((r,i)=>(
          <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:16}}>
            <div style={{color:"#f59e0b",fontSize:12,marginBottom:8}}>★★★★★</div>
            <p style={{color:T.text,fontSize:13,lineHeight:1.6,margin:"0 0 14px",fontStyle:"italic"}}>"{r.text}"</p>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:22}}>{r.avatar}</span>
              <div>
                <div style={{color:"#fff",fontSize:12,fontWeight:700}}>{r.name}</div>
                <div style={{color:T.dim,fontSize:11}}>{r.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    <section style={{padding:"30px 14px",maxWidth:500,margin:"0 auto"}}>
      <h2 style={{color:"#fff",fontSize:20,fontWeight:900,textAlign:"center",margin:"0 0 18px"}}>💡 The Math Speaks</h2>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px 16px"}}>
        {[{n:"Midjourney",p:"$30"},{n:"ElevenLabs",p:"$22"},{n:"Runway",p:"$76"},{n:"Jasper",p:"$49"},{n:"Copilot",p:"$19"},{n:"Grammarly",p:"$12"},{n:"Buffer",p:"$15"},{n:"SEMrush",p:"$130"}].map((c,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{color:T.muted,fontSize:13}}>{c.n}</span><span style={{color:T.red,fontSize:13,fontWeight:700,textDecoration:"line-through"}}>{c.p}/mo</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0 0",borderTop:`2px solid ${T.accent}25`,marginTop:8}}><span style={{color:"#fff",fontSize:14,fontWeight:900}}>TaskBase HQ (All + more)</span><span style={{color:T.green,fontSize:16,fontWeight:900}}>$9.99/mo</span></div>
      </div>
    </section>
    <section style={{margin:"24px 14px 30px",padding:"32px 20px",textAlign:"center",background:`${T.accent}08`,border:`1px solid ${T.accent}18`,borderRadius:20}}>
      <h2 style={{color:"#fff",fontSize:24,fontWeight:900,margin:"0 0 8px"}}>🚀 Just Launched — Try Free Today</h2>
      <p style={{color:T.muted,fontSize:14,margin:"0 0 18px"}}>50 free credits. No credit card. Cancel anytime.</p>
      <button onClick={()=>{
        const lg=!!localStorage.getItem('tb_user_plan');
        if(lg) window.location.href="/dashboard.html";
        else go(PAGES.PRICING);
      }} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 8px 30px ${T.accentGlow}`),padding:"15px 36px",fontSize:16}}>{(typeof window!=='undefined'&&!!localStorage.getItem('tb_user_plan'))?'📊 Open Dashboard':'🚀 Start Free — 50 Credits'}</button>
    </section>
    <ToolModal tool={sel} onClose={()=>setSel(null)} go={go}/>
  </div>);
}
function ToolsPage({go}){
  const[cat,setCat]=useState("all");const[search,setSearch]=useState("");const[sel,setSel]=useState(null);
  const filtered=TOOLS.filter(t=>{const mc=cat==="all"||t.category===cat||(cat==="trending"&&t.trending);const ms=!search||t.name.toLowerCase().includes(search.toLowerCase())||t.desc.toLowerCase().includes(search.toLowerCase());return mc&&ms;});
  return(<div style={{maxWidth:960,margin:"0 auto",padding:"24px 14px"}}>
    <h1 style={{color:"#fff",fontSize:26,fontWeight:900,margin:"0 0 4px"}}>All AI Tools</h1>
    <p style={{color:T.muted,fontSize:14,margin:"0 0 18px"}}>46+ premium tools — image, video, voice, writing, code & more</p>
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
  const[plan,setPlan]=useState("monthly");
  return(<div style={{maxWidth:680,margin:"0 auto",padding:"32px 14px",textAlign:"center"}}>
    <Pill color={T.green}>🎉 50 Free Credits — No Credit Card</Pill>
    <h1 style={{color:"#fff",fontSize:30,fontWeight:900,margin:"16px 0 8px"}}>Pick Your Plan</h1>
    <p style={{color:T.muted,fontSize:15,margin:"0 0 28px"}}>All 46+ tools. Cancel anytime.</p>
    <div style={{display:"inline-flex",background:"rgba(255,255,255,0.03)",borderRadius:12,padding:4,gap:4,marginBottom:28}}>
      {["monthly","yearly","proplus","proplusyearly","promax","promaxyearly"].map(k=><button key={k} onClick={()=>setPlan(k)} style={{background:plan===k?`linear-gradient(135deg,${T.accent},${T.cyan})`:"transparent",border:"none",color:plan===k?"#fff":T.muted,padding:"8px 14px",borderRadius:10,cursor:"pointer",fontFamily:T.font,fontSize:12,fontWeight:700,position:"relative"}}>
  {k==="monthly"?"Pro /mo":k==="yearly"?"Pro /yr":k==="proplus"?"Plus /mo":k==="proplusyearly"?"Plus /yr":k==="promax"?"Max /mo":"Max /yr"}
  {(k==="yearly"||k==="proplusyearly"||k==="promaxyearly")&&<span style={{position:"absolute",top:-8,right:-8,background:T.green,color:"#fff",fontSize:7,fontWeight:800,padding:"2px 5px",borderRadius:4}}>SAVE</span>}
  {k==="proplus"&&<span style={{position:"absolute",top:-8,right:-8,background:T.orange,color:"#fff",fontSize:7,fontWeight:800,padding:"2px 5px",borderRadius:4}}>NEW</span>}
  {k==="promax"&&<span style={{position:"absolute",top:-8,right:-8,background:"#a855f7",color:"#fff",fontSize:7,fontWeight:800,padding:"2px 5px",borderRadius:4}}>PRO</span>}
</button>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,marginBottom:30,textAlign:"left"}}>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"24px 20px"}}>
        <div style={{color:T.muted,fontSize:12,fontWeight:700,marginBottom:4}}>FREE</div>
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}><span style={{color:"#fff",fontSize:40,fontWeight:900}}>$0</span><span style={{color:T.muted,fontSize:14}}>to start</span></div>
        <p style={{color:T.muted,fontSize:12,margin:"0 0 18px"}}>50 credits — no card needed</p>
        {PLANS.free.features.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}><span style={{color:T.green,fontSize:11}}>✓</span><span style={{color:T.muted,fontSize:12.5}}>{f}</span></div>)}
        {(typeof window==='undefined'||!localStorage.getItem('tb_user_plan')) && <button onClick={()=>window.location.href='/login.html'} style={{...bs("rgba(255,255,255,0.06)"),border:`1px solid ${T.border}`,width:"100%",padding:13,fontSize:14,marginTop:16}}>Get 50 Free Credits</button>}
      </div>
      <div style={{background:`${T.accent}08`,border:`2px solid ${T.accent}30`,borderRadius:18,padding:"24px 20px",position:"relative"}}>
        <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${T.accent},${T.cyan})`,color:"#fff",fontSize:10,fontWeight:800,padding:"4px 14px",borderRadius:20}}>⭐ RECOMMENDED</div>
        <div style={{color:T.accent,fontSize:12,fontWeight:700,marginBottom:4,marginTop:4}}>{plan==="yearly"||plan==="proplusyearly"||plan==="promaxyearly"?"YEARLY":"MONTHLY"}</div>
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}><span style={{color:"#fff",fontSize:40,fontWeight:900}}>{PLANS[plan].label}</span><span style={{color:T.muted,fontSize:14}}>{PLANS[plan].period}</span></div>
        {plan==="yearly"&&<div style={{color:T.green,fontSize:12,fontWeight:700,marginBottom:4}}>= $6.67/month — Save $40/year</div>}
        {plan==="proplus"&&<div style={{color:T.orange,fontSize:12,fontWeight:700,marginBottom:4}}>1,500 credits/month — 3x Pro</div>}
        {plan==="proplusyearly"&&<div style={{color:T.green,fontSize:12,fontWeight:700,marginBottom:4}}>= $16.67/month — Save $40/year</div>}
        {plan==="promax"&&<div style={{color:"#a855f7",fontSize:12,fontWeight:700,marginBottom:4}}>5,000 credits/month — 10x Pro</div>}
        {plan==="promaxyearly"&&<div style={{color:T.green,fontSize:12,fontWeight:700,marginBottom:4}}>= $33.33/month — Save $80/year</div>}
        <p style={{color:T.muted,fontSize:12,margin:"0 0 18px"}}>Full access to all 46+ AI tools</p>
        {PLANS[plan].features.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}><span style={{color:T.green,fontSize:11}}>✓</span><span style={{color:T.text,fontSize:12.5}}>{f}</span></div>)}
        <button onClick={()=>{
  const urls={monthly:SITE.payMonthly,yearly:SITE.payYearly,proplus:SITE.payProPlus,proplusyearly:SITE.payProPlusYearly,promax:SITE.payProMax,promaxyearly:SITE.payProMaxYearly};
  const link=urls[plan];
  // Check if logged in via localStorage
  const isLoggedIn=!!localStorage.getItem('tb_user_plan');
  if(!isLoggedIn){
    sessionStorage.setItem('tb_after_login',link);
    alert('Please login or signup first — then your plan will activate automatically!');
    window.location.href='/login.html';
    return;
  }
  window.open(link,'_blank');
}} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 8px 25px ${T.accentGlow}`),width:"100%",padding:14,fontSize:15,marginTop:16}}>🚀 Get {PLANS[plan].label}{PLANS[plan].period}</button>
        <div style={{textAlign:"center",marginTop:8}}><span style={{color:T.dim,fontSize:10}}>🔒 Cancel anytime • 30-day refund (terms apply)</span></div>
      </div>
    </div>

    {/* ══ CREDIT TOP-UPS ══ */}
    <div style={{marginTop:20,background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px 16px"}}>
      <h3 style={{color:"#fff",fontSize:15,fontWeight:900,margin:"0 0 4px",textAlign:"center"}}>💰 Need More Credits?</h3>
      <p style={{color:T.muted,fontSize:12,textAlign:"center",margin:"0 0 4px"}}>Buy extra anytime — never expire. Pro plan required.</p>
      <div style={{background:`${T.orange}10`,border:`1px solid ${T.orange}25`,borderRadius:8,padding:"8px 12px",margin:"8px 0 12px",textAlign:"center"}}>
        <span style={{color:T.orange,fontSize:11,fontWeight:700}}>⚠️ Must have active Pro/Plus/Max plan to use credits</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {[
          {cr:100,price:"$2.99",link:SITE.buyCredits100,color:"#10b981",label:"Starter"},
          {cr:500,price:"$9.99",link:SITE.buyCredits500,color:T.accent,label:"Popular",best:true},
          {cr:1500,price:"$24.99",link:SITE.buyCredits1500,color:"#a855f7",label:"Power"},
        ].map((p,i)=>(
          <div key={i} style={{background:`${p.color}08`,border:`1px solid ${p.best?p.color+"50":p.color+"20"}`,borderRadius:12,padding:"14px 8px",textAlign:"center",position:"relative"}}>
            {p.best&&<div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",background:p.color,color:"#fff",fontSize:8,fontWeight:800,padding:"2px 8px",borderRadius:10,whiteSpace:"nowrap"}}>⭐ BEST VALUE</div>}
            <div style={{color:p.color,fontSize:20,fontWeight:900,marginTop:p.best?4:0}}>{p.price}</div>
            <div style={{color:"#fff",fontSize:12,fontWeight:700,margin:"2px 0"}}>{p.label}</div>
            <div style={{color:T.dim,fontSize:10,marginBottom:10}}>{p.cr} credits</div>
            <button onClick={()=>{
              const isLoggedIn=!!window.firebase_user_plan;
              const isPaid=['pro','proplus','promax'].includes(window.firebase_user_plan||'');
              if(!isLoggedIn){alert("Please login first, then subscribe to Pro plan to purchase credits.");return;}
              if(!isPaid){alert("⚠️ Pro plan required!\n\nPlease subscribe to a Pro plan first, then you can purchase extra credits.");go(PAGES.PRICING);return;}
              window.open(p.link,'_blank');
            }} style={{display:"block",width:"100%",background:`${p.color}15`,border:`1px solid ${p.color}30`,color:p.color,padding:"8px 4px",borderRadius:8,fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:T.font}}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>

    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"20px 16px",textAlign:"left"}}>
      <div style={{color:"#fff",fontSize:15,fontWeight:800,marginBottom:14,textAlign:"center"}}>💡 Buying Separately vs TaskBase HQ</div>
      {[{n:"Midjourney",p:"$30"},{n:"ElevenLabs",p:"$22"},{n:"Runway",p:"$76"},{n:"Jasper",p:"$49"},{n:"Copilot",p:"$19"},{n:"Grammarly",p:"$12"},{n:"Buffer",p:"$15"},{n:"SEMrush",p:"$130"}].map((c,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{color:T.muted,fontSize:13}}>{c.n}</span><span style={{color:T.red,fontSize:13,fontWeight:700,textDecoration:"line-through"}}>{c.p}/mo</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0 0",borderTop:`2px solid ${T.accent}25`,marginTop:8}}><span style={{color:"#fff",fontSize:14,fontWeight:900}}>TaskBase HQ</span><span style={{color:T.green,fontSize:16,fontWeight:900}}>{PLANS[plan].label}{PLANS[plan].period.includes('year')?'/yr':'/mo'}</span></div>
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
  const submitTicket=async()=>{
    if(!tCat||!tName.trim()||!tEmail.trim()||!tSubj.trim()||!tMsg.trim()){
      alert("Please fill all fields including category");
      return;
    }
    const id=genTicketId();
    // Save to Firestore via API
    try{
      await fetch('/api/ticket', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          action:'create',
          id, category:tCat, priority:tPri,
          name:tName, email:tEmail, subject:tSubj, message:tMsg
        })
      });
    }catch(e){console.log('Ticket save error:',e);}
    const adminMsg = "NEW SUPPORT TICKET\n\nTicket ID: "+id+"\nCategory: "+tCat+"\nPriority: "+tPri+"\n\nFrom: "+tName+"\nEmail: "+tEmail+"\n\nSubject: "+tSubj+"\n\nDescription:\n"+tMsg+"\n\n---\nReply directly to this email to respond to the customer.";
    const customerMsg = "Hi "+tName+",\n\nThank you for contacting TaskBase HQ Support.\n\nYour ticket has been received and assigned the following ID:\n\nTicket ID: "+id+"\nSubject: "+tSubj+"\nPriority: "+tPri+"\n\nWe will respond within 2 working days. You can track your ticket status at taskbasehq.com (Support > Track Ticket).\n\nIf you have any urgent issues, please WhatsApp us at +92 323 210 8023.\n\nThank you for your patience!\n\nTaskBase HQ Support Team\nsupport@taskbasehq.com\nhttps://taskbasehq.com";
    try{
      // Email to ADMIN
      const adminRes = await fetch("https://api.emailjs.com/api/v1.0/email/send",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          service_id:"service_8zans7l",
          template_id:"template_a95p4nn",
          user_id:"c5f49E_C8hbfbmXUE",
          template_params:{
            to_email:"muhammadhamzabhundi9@gmail.com",
            to_name:"Hamza (Admin)",
            from_name:tName,
            reply_to:tEmail,
            subject:"🎫 Ticket "+id+" | "+tCat.toUpperCase()+" | "+tPri.toUpperCase()+" | "+tSubj,
            message:adminMsg
          }
        })
      });
      console.log("Admin email status:", adminRes.status);
      // Email to CUSTOMER
      const custRes = await fetch("https://api.emailjs.com/api/v1.0/email/send",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          service_id:"service_8zans7l",
          template_id:"template_a95p4nn",
          user_id:"c5f49E_C8hbfbmXUE",
          template_params:{
            to_email:tEmail,
            to_name:tName,
            from_name:"TaskBase HQ Support",
            reply_to:"support@taskbasehq.com",
            subject:"✅ Ticket "+id+" Received - We're On It!",
            message:customerMsg
          }
        })
      });
      console.log("Customer email status:", custRes.status);
    }catch(err){
      console.error("Email send failed:",err);
      // Still show success - admin will see it later
    }
    // Save ticket locally for tracking
    try{
      const tickets = JSON.parse(localStorage.getItem('tb_tickets')||'[]');
      tickets.push({id,cat:tCat,pri:tPri,subj:tSubj,date:new Date().toISOString(),status:'submitted'});
      localStorage.setItem('tb_tickets', JSON.stringify(tickets));
    }catch(e){}
    setTicketId(id);setTDone(true);
  };
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
      <p style={{color:T.dim,fontSize:12,margin:"0 0 16px"}}>Get a ticket ID to track progress.</p>
      {tDone?<div style={{textAlign:"center",padding:"20px 0"}}>
        <div style={{fontSize:44,marginBottom:10}}>🎫</div>
        <div style={{color:T.green,fontSize:18,fontWeight:800}}>Ticket Created!</div>
        <div style={{background:`${T.accent}10`,border:`2px dashed ${T.accent}40`,borderRadius:12,padding:"16px 20px",margin:"16px auto",display:"inline-block"}}>
          <div style={{color:T.dim,fontSize:11,marginBottom:4}}>Your Ticket ID</div>
          <div style={{color:T.accent,fontSize:28,fontWeight:900,letterSpacing:2}}>{ticketId}</div>
        </div>
        <p style={{color:T.muted,fontSize:13,marginTop:10}}>📧 Confirmation sent to your email.<br/>We respond within <strong style={{color:T.orange}}>2 working days</strong>.</p>
        <button onClick={()=>{setTDone(false);setTCat("");setTPri("medium");setTName("");setTEmail("");setTSubj("");setTMsg("");}} style={{...bs("rgba(255,255,255,0.06)"),border:`1px solid ${T.border}`,padding:"10px 20px",fontSize:13,marginTop:14}}>New Ticket</button>
      </div>:<>
        <div style={{marginBottom:14}}>
          <label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:8}}>Category</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {TICKET_CATS.map(c=><div key={c.id} onClick={()=>setTCat(c.id)} style={{background:tCat===c.id?`${T.accent}12`:"rgba(255,255,255,0.02)",border:`1px solid ${tCat===c.id?T.accent+"40":T.border}`,borderRadius:10,padding:"10px 12px",cursor:"pointer"}}><div style={{color:tCat===c.id?T.accent:T.text,fontSize:12,fontWeight:700}}>{c.label}</div><div style={{color:T.dim,fontSize:10,marginTop:2}}>{c.desc}</div></div>)}
          </div>
        </div>
        {/* MCQ Quick Issues */}
        {tCat&&<div style={{marginBottom:14}}>
          <label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:8}}>Quick Select — Does your issue match?</label>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {(tCat==="technical"?["Tool not generating output","Error message appearing","Slow response","File upload not working","Image quality issue"]:tCat==="billing"?["Charged but account not upgraded","Credits not added","Refund request","Wrong plan charged"]:tCat==="account"?["Can't login","Email not verified","Credits missing","Plan not showing"]:["General question","Feature request","Partnership inquiry"]).map((q,i)=>(
              <div key={i} onClick={()=>{setTSubj(q);setTMsg(tMsg||q+" — please provide more details:\n\n");}} style={{background:tSubj===q?`${T.accent}10`:"rgba(255,255,255,0.02)",border:`1px solid ${tSubj===q?T.accent+"30":T.border}`,borderRadius:8,padding:"9px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${tSubj===q?T.accent:T.dim}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{tSubj===q&&<div style={{width:8,height:8,borderRadius:"50%",background:T.accent}}/>}</div>
                <span style={{color:tSubj===q?T.accent:T.text,fontSize:12}}>{q}</span>
              </div>
            ))}
          </div>
        </div>}
        <div style={{marginBottom:14}}>
          <label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:8}}>Priority</label>
          <div style={{display:"flex",gap:6}}>
            {PRIORITIES.map(p=><div key={p.id} onClick={()=>setTPri(p.id)} style={{flex:1,background:tPri===p.id?`${p.color}12`:"rgba(255,255,255,0.02)",border:`1px solid ${tPri===p.id?p.color+"40":T.border}`,borderRadius:10,padding:"10px 8px",cursor:"pointer",textAlign:"center"}}><div style={{color:tPri===p.id?p.color:T.text,fontSize:12,fontWeight:700}}>{p.label}</div><div style={{color:T.dim,fontSize:9,marginTop:2}}>{p.desc}</div></div>)}
          </div>
        </div>
        <div style={{marginBottom:12}}><label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Name</label><input type="text" value={tName} onChange={e=>setTName(e.target.value)} placeholder="Full name" style={inp}/></div>
        <div style={{marginBottom:12}}><label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Email</label><input type="email" value={tEmail} onChange={e=>setTEmail(e.target.value)} placeholder="you@email.com" style={inp}/></div>
        <div style={{marginBottom:12}}><label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Subject</label><input type="text" value={tSubj} onChange={e=>setTSubj(e.target.value)} placeholder="Brief description" style={inp}/></div>
        <div style={{marginBottom:14}}><label style={{color:T.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Description</label><textarea value={tMsg} onChange={e=>setTMsg(e.target.value)} rows={5} placeholder="Describe your issue..." style={{...inp,resize:"vertical"}}/></div>
        <button onClick={submitTicket} style={{...bs(`linear-gradient(135deg,${T.accent},${T.cyan})`,`0 6px 20px ${T.accentGlow}`),width:"100%",padding:14,fontSize:14}}>🎫 Submit Ticket</button>
      </>}
    </div>}
    {tab==="track"&&<TrackTicket inp={inp} bs={bs} T={T} accentGlow={T.accentGlow}/>}
  </div>);
}
function TrackTicket({inp,bs,T}){
  const[tid,setTid]=useState("");
  const[result,setResult]=useState(null);
  const check=async()=>{
    if(!tid.trim()){alert("Please enter your ticket ID");return;}
    const cleanId = tid.trim().toUpperCase();
    setResult({loading:true});
    try{
      const r = await fetch('/api/ticket?id='+encodeURIComponent(cleanId));
      if(r.ok){
        const data = await r.json();
        if(data.ticket){
          const days = Math.floor((Date.now()-new Date(data.ticket.createdAt).getTime())/(1000*60*60*24));
          setResult({
            id:data.ticket.id, status:data.ticket.status, subj:data.ticket.subject,
            cat:data.ticket.category, pri:data.ticket.priority, days,
            adminReply:data.ticket.adminReply||null,
            resolvedAt:data.ticket.resolvedAt,
            msg:data.ticket.status==='resolved'?'✅ Ticket resolved! Check your email for our response.':days===0?"✅ Ticket received today. We respond within 2 working days.":days<2?"⏳ Your ticket is being reviewed.":days<=3?"🔄 Your ticket is being processed.":"📧 Please check your email or contact support@taskbasehq.com"
          });
        }else{
          setResult({notFound:true,id:cleanId,msg:"Ticket not found. Please check your ticket ID. If you just submitted, wait 30 seconds and try again."});
        }
      }else{
        setResult({notFound:true,id:cleanId,msg:"Could not check status. Please email support@taskbasehq.com with your ticket ID."});
      }
    }catch(e){
      setResult({notFound:true,id:cleanId,msg:"Network error. Please email support@taskbasehq.com"});
    }
  };
  return(<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"22px 18px"}}>
    <h3 style={{color:"#fff",fontSize:16,fontWeight:800,margin:"0 0 4px"}}>🔍 Track Ticket</h3>
    <p style={{color:T.dim,fontSize:12,margin:"0 0 16px"}}>Enter your ticket ID to check status.</p>
    <input type="text" value={tid} onChange={e=>setTid(e.target.value)} placeholder="TB-XXXXXX" style={{...inp,textAlign:"center",fontSize:16,fontWeight:700,letterSpacing:2,padding:"14px",marginBottom:14}}/>
    <button onClick={check} style={{...bs(`linear-gradient(135deg,#3b82f6,#06b6d4)`,`0 6px 20px rgba(59,130,246,0.3)`),width:"100%",padding:14,fontSize:14,border:"none",cursor:"pointer",borderRadius:10,color:"#fff",fontFamily:"inherit",fontWeight:800}}>🔍 Check Status</button>
    {result&&result.loading&&<div style={{marginTop:16,padding:"20px",textAlign:"center",color:"#94a3b8",fontSize:13}}>⏳ Checking...</div>}
    {result&&!result.notFound&&!result.loading&&<div style={{marginTop:16,background:result.status==='resolved'?"rgba(16,185,129,0.08)":"rgba(59,130,246,0.06)",border:"1px solid "+(result.status==='resolved'?"rgba(16,185,129,0.25)":"rgba(59,130,246,0.2)"),borderRadius:12,padding:"16px 14px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
        <span style={{fontSize:20}}>🎫</span>
        <span style={{color:"#fff",fontWeight:800,fontSize:14}}>{result.id}</span>
        <span style={{background:"rgba(16,185,129,0.15)",color:"#10b981",fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:20}}>{result.status==="resolved"?"✅ RESOLVED":"⏳ IN PROGRESS"}</span>
      </div>
      {result.subj&&<div style={{color:"#fff",fontSize:13,fontWeight:600,marginBottom:6}}>{result.subj}</div>}
      <div style={{display:"flex",gap:12,marginBottom:8,fontSize:11,color:"#475569"}}>
        {result.cat&&<span>📂 {result.cat}</span>}
        {result.pri&&<span>⚡ {result.pri}</span>}
        {result.days!==undefined&&<span>📅 {result.days===0?"Today":result.days+" days ago"}</span>}
      </div>
      <p style={{color:"#94a3b8",fontSize:12,lineHeight:1.6,margin:0}}>{result.msg}</p>
      {result.adminReply&&<div style={{marginTop:12,padding:"12px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:8}}>
        <div style={{color:"#10b981",fontSize:11,fontWeight:700,marginBottom:6}}>💬 SUPPORT REPLY:</div>
        <div style={{color:"#fff",fontSize:12,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{result.adminReply}</div>
      </div>}
    </div>}
    {result&&result.notFound&&<div style={{marginTop:16,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:12,padding:"16px 14px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:20}}>⚠️</span><span style={{color:"#f59e0b",fontWeight:800,fontSize:13}}>Ticket Not Found</span></div>
      <p style={{color:"#94a3b8",fontSize:12,lineHeight:1.6,margin:0}}>{result.msg}</p>
      {result.adminReply&&<div style={{marginTop:12,padding:"12px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:8}}>
        <div style={{color:"#10b981",fontSize:11,fontWeight:700,marginBottom:6}}>💬 SUPPORT REPLY:</div>
        <div style={{color:"#fff",fontSize:12,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{result.adminReply}</div>
      </div>}
    </div>}
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
      <p>TaskBase HQ provides subscription-based access to 46+ AI tools including image generation, video creation, voice cloning, content writing, code assistance, and more.</p>
      <h3 style={{color:T.text,marginTop:20}}>2. Subscription Plans</h3>
      <p>Pro Monthly ($9.99/mo), Pro Yearly ($79.99/yr), Pro Plus ($19.99/mo), Pro Max ($39.99/mo). New users get 50 free credits. Cancel anytime.</p>
      <h3 style={{color:T.text,marginTop:20}}>3. Free Credits</h3>
      <p>New users receive 50 free credits with full access to all tools. No credit card required.</p>
      <h3 style={{color:T.text,marginTop:20}}>4. User Accounts</h3>
      <p>Provide accurate information. Maintain account security. One account per person.</p>
      <h3 style={{color:T.text,marginTop:20}}>5. Acceptable Use</h3>
      <p>No illegal activities, spam, or harassment. We may suspend violating accounts.</p>
      <h3 style={{color:T.text,marginTop:20}}>6. Intellectual Property</h3>
      <p>Content you create is yours with full commercial license.</p>
      <h3 style={{color:T.text,marginTop:20}}>7. Contact</h3>
      <p>Email {SITE.email} or WhatsApp {SITE.whatsappDisplay}.</p>
    </div>
  </div>);
}
function PrivacyPage(){
  return(<div style={{maxWidth:700,margin:"0 auto",padding:"32px 14px"}}>
    <h1 style={{color:"#fff",fontSize:26,fontWeight:900,margin:"0 0 20px"}}>Privacy Policy</h1>
    <div style={{color:T.muted,fontSize:13,lineHeight:1.8}}>
      <p><strong style={{color:T.text}}>Last updated:</strong> April 2026</p>
      <p>TaskBase HQ ({SITE.domain}) protects your privacy. This policy explains data collection and use.</p>
      <h3 style={{color:T.text,marginTop:20}}>1. Information We Collect</h3>
      <p>Name, email, payment info (via Gumroad), usage data.</p>
      <h3 style={{color:T.text,marginTop:20}}>2. How We Use It</h3>
      <p>To provide services, process payments, send notifications, support.</p>
      <h3 style={{color:T.text,marginTop:20}}>3. Payment</h3>
      <p>Processed by Gumroad. We don't store credit card data.</p>
      <h3 style={{color:T.text,marginTop:20}}>4. Security</h3>
      <p>SSL encryption, secure servers, regular audits.</p>
      <h3 style={{color:T.text,marginTop:20}}>5. Your Rights</h3>
      <p>Access, correct, or delete your data anytime.</p>
      <h3 style={{color:T.text,marginTop:20}}>6. Contact</h3>
      <p>Email {SITE.email} or WhatsApp {SITE.whatsappDisplay}.</p>
    </div>
  </div>);
}
function RefundPage(){
  return(<div style={{maxWidth:700,margin:"0 auto",padding:"32px 14px"}}>
    <h1 style={{color:"#fff",fontSize:26,fontWeight:900,margin:"0 0 20px"}}>Refund Policy</h1>
    <div style={{color:T.muted,fontSize:13,lineHeight:1.8}}>
      <p><strong style={{color:T.text}}>Last updated:</strong> April 2026</p>
      <p>We want you to be completely satisfied with TaskBase HQ. Please read our refund policy carefully before purchase.</p>
      
      <h3 style={{color:T.text,marginTop:20}}>1. Try Before You Buy — 50 Free Credits</h3>
      <p>Every new account gets <strong style={{color:T.green}}>50 free credits</strong>. No credit card required. Use them to test all our AI tools (text, image, voice generators) before subscribing. This is your chance to evaluate quality and fit.</p>
      
      <h3 style={{color:T.text,marginTop:20}}>2. 30-Day Money-Back Guarantee</h3>
      <p>If you experience genuine technical issues that we cannot resolve, you may request a refund within 30 days of your first payment.</p>
      
      <h3 style={{color:T.text,marginTop:20}}>3. Refund Eligibility</h3>
      <p style={{color:T.green,fontWeight:700,marginTop:10}}>✅ ELIGIBLE for refund:</p>
      <ul style={{paddingLeft:20,color:T.muted}}>
        <li>Within 30 days of purchase</li>
        <li>Less than 50 credits used after purchase</li>
        <li>Technical issues we could not resolve</li>
        <li>Service unavailable for 24+ hours</li>
      </ul>
      <p style={{color:T.red,fontWeight:700,marginTop:14}}>❌ NOT ELIGIBLE for refund:</p>
      <ul style={{paddingLeft:20,color:T.muted}}>
        <li>More than 50 credits already consumed after purchase</li>
        <li>Request made after 30 days from purchase date</li>
        <li>Account terms or fair use policy violation</li>
        <li>Dispute or chargeback already initiated with payment provider</li>
      </ul>
      <p style={{marginTop:14,fontSize:12,fontStyle:"italic"}}>This policy exists to protect us from misuse. Genuine customers with real issues will always be supported.</p>
      
      <h3 style={{color:T.text,marginTop:20}}>4. How to Request a Refund</h3>
      <p>Email <strong style={{color:T.text}}>{SITE.email}</strong> or WhatsApp <strong style={{color:T.text}}>{SITE.whatsappDisplay}</strong> with:</p>
      <ul style={{paddingLeft:20,color:T.muted}}>
        <li>Your account email</li>
        <li>Order/transaction ID from Gumroad</li>
        <li>Reason for refund request</li>
      </ul>
      <p>We respond within <strong style={{color:T.orange}}>2 working days</strong>. Approved refunds are processed within 5-10 business days.</p>
      
      <h3 style={{color:T.text,marginTop:20}}>5. Cancellation (No Refund)</h3>
      <p>You can cancel your subscription anytime from your Gumroad account. Cancellation prevents future charges. You retain access until your current billing period ends.</p>
      
      <h3 style={{color:T.text,marginTop:20}}>6. AI Generation Costs</h3>
      <p>Each AI generation has an API cost we pay to providers (Stability AI, ElevenLabs, Google). Once credits are consumed, the API cost cannot be recovered. This is why refunds require unused credits.</p>
      
      <h3 style={{color:T.text,marginTop:20}}>7. Contact</h3>
      <p>For refund questions: {SITE.email} or WhatsApp {SITE.whatsappDisplay}.</p>
    </div>
  </div>);
}
function Footer({go}){
  return(<footer style={{borderTop:`1px solid ${T.border}`,padding:"28px 14px 20px",maxWidth:960,margin:"0 auto"}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:20,marginBottom:20}}>
      <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${T.accent},${T.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#fff"}}>TB</div><span style={{color:"#fff",fontSize:13,fontWeight:800}}>TaskBase HQ</span></div><p style={{color:T.dim,fontSize:11,lineHeight:1.5}}>46+ AI tools. One price.</p></div>
      <div><div style={{color:T.muted,fontSize:10,fontWeight:700,marginBottom:8,letterSpacing:1}}>PRODUCT</div>{[{l:"All Tools",p:PAGES.TOOLS},{l:"Pricing",p:PAGES.PRICING},{l:"FAQ",p:PAGES.FAQ},{l:"Support",p:PAGES.SUPPORT}].map((x,i)=><div key={i} onClick={()=>go(x.p)} style={{color:T.dim,fontSize:12,padding:"3px 0",cursor:"pointer"}}>{x.l}</div>)}</div>
      <div><div style={{color:T.muted,fontSize:10,fontWeight:700,marginBottom:8,letterSpacing:1}}>LEGAL</div>{[{l:"Terms",p:PAGES.TERMS},{l:"Privacy",p:PAGES.PRIVACY},{l:"Refund",p:PAGES.REFUND}].map((x,i)=><div key={i} onClick={()=>go(x.p)} style={{color:T.dim,fontSize:12,padding:"3px 0",cursor:"pointer"}}>{x.l}</div>)}</div>
      <div><div style={{color:T.muted,fontSize:10,fontWeight:700,marginBottom:8,letterSpacing:1}}>CONTACT</div><div style={{color:T.dim,fontSize:11,lineHeight:2.2}}>📧 {SITE.email}<br/>💬 {SITE.whatsappDisplay}</div></div>
    </div>
    <div style={{textAlign:"center",color:T.dim,fontSize:10,borderTop:`1px solid ${T.border}`,paddingTop:14}}>© 2026 {SITE.name} ({SITE.domain}). All rights reserved.</div>
  </footer>);
}
export default function TaskBaseHQ(){
  const getInitPage=()=>{const h=window.location.hash.replace('#','');return h&&Object.values(PAGES).includes(h)?h:PAGES.HOME;};
  const[page,setPage]=useState(getInitPage());const[showInstall,setShowInstall]=useState(false);
  useEffect(()=>{window.scrollTo({top:0,behavior:'smooth'});},[page]);
  useEffect(()=>{if(page!==PAGES.HOME)window.location.hash=page;else history.pushState('','',window.location.pathname);},[page]);
  useEffect(()=>{const fn=()=>{const h=window.location.hash.replace('#','');if(h&&Object.values(PAGES).includes(h))setPage(h);};window.addEventListener('hashchange',fn);return()=>window.removeEventListener('hashchange',fn);},[]);
  const go=(p)=>{setPage(p);};
  // Set global user plan from localStorage (set after login)
  useEffect(()=>{
    const plan=localStorage.getItem('tb_user_plan')||'';
    window.firebase_user_plan=plan;
    localStorage.setItem('tb_user_plan',plan);
  },[]);
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
    {/* InstallBanner removed - mobile app coming soon */}
  </div>);
}
