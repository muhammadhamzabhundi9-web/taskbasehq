const API_URL='/api/generate';
const IMAGE_API='/api/generate-image';
const VOICE_API='/api/generate-voice';
const T=[
{id:"chat",free:true,name:"AI Chat Assistant",icon:"🤖",desc:"Chat with advanced AI — ask anything",color:"#3b82f6",label:"What do you want to know?",ph:"Ask me anything...",tpl:["Explain quantum computing simply","Compare Python vs JavaScript","Give me 10 startup ideas","Write a poem about technology"],pr:i=>i,type:"text"},
{id:"image",name:"AI Image Generator",icon:"🖼️",desc:"Text to image — Midjourney-quality",color:"#ec4899",label:"Describe the image",ph:"e.g., 'A cyberpunk city at sunset, neon lights, cinematic'",tpl:["Cyberpunk city sunset","Anime warrior portrait","Product photo on white background","3D render of futuristic car"],type:"image",cost:10},
{id:"avatar",name:"AI Avatar Creator",icon:"👤",desc:"Photorealistic AI avatars from text",color:"#a855f7",label:"Describe the avatar",ph:"e.g., 'Professional businesswoman avatar, friendly smile, modern background'",tpl:["Professional headshot avatar","Anime-style character","3D cartoon avatar","Cyberpunk warrior portrait"],type:"image",cost:10,promptPrefix:"Photorealistic professional avatar portrait, high quality, detailed: "},
{id:"logo",name:"AI Logo & Brand Kit",icon:"💎",desc:"Pro logos and brand identity",color:"#f59e0b",label:"Describe your brand/logo",ph:"e.g., 'Tech startup logo, blue and cyan, modern minimalist'",tpl:["Tech startup logo modern","Coffee shop vintage logo","Fitness brand bold logo","Fashion brand elegant logo"],type:"image",cost:10,promptPrefix:"Professional logo design, vector style, clean modern, white background: "},
{id:"headshot",name:"AI Selfie to Headshot",icon:"🤳",desc:"Pro LinkedIn-ready headshots",color:"#06b6d4",label:"Describe the headshot",ph:"e.g., 'Professional headshot, business attire, office background'",tpl:["LinkedIn professional headshot","Corporate executive portrait","Creative professional photo","Tech founder headshot"],type:"image",cost:10,promptPrefix:"Professional LinkedIn headshot photograph, business attire, studio lighting, sharp focus, high quality: "},
{id:"product",name:"AI Product Photography",icon:"📸",desc:"Pro studio shots from descriptions",color:"#10b981",label:"Describe the product",ph:"e.g., 'Wireless headphones on white background, studio lighting'",tpl:["Product on white background","Lifestyle product photo","E-commerce shot","Luxury product showcase"],type:"image",cost:10,promptPrefix:"Professional product photography, studio lighting, commercial quality, sharp details: "},
{id:"thumbnail",name:"AI Thumbnail Maker",icon:"📺",desc:"YouTube thumbnails that get clicks",color:"#ef4444",label:"Describe the thumbnail",ph:"e.g., 'YouTube thumbnail for tech review video, bold text, vibrant'",tpl:["YouTube tech review","Tutorial video thumbnail","Vlog thumbnail bright","Gaming thumbnail dramatic"],type:"image",cost:10,promptPrefix:"YouTube thumbnail design, eye-catching, vibrant colors, bold composition, 16:9 aspect ratio: "},
{id:"bgremove",name:"Background Remover & Replacer",icon:"✂️",desc:"Remove or replace background from any image",color:"#14b8a6",label:"Optional: describe new background (or leave empty to remove)",ph:"e.g., 'beach sunset' to replace BG, or leave empty to just remove",tpl:["Just remove background","Beach sunset","Office workspace","Studio white background"],type:"upload",api:"/api/remove-background",cost:10,optionalPrompt:true},
{id:"enhance",name:"AI Photo Enhancer",icon:"✨",desc:"Upscale 4x, sharpen, restore old photos",color:"#0ea5e9",label:"Just upload — no input needed",ph:"",tpl:[],type:"upload",api:"/api/upscale-image",cost:10,uploadOnly:true,extraPrompt:"high quality, sharp details, professional"},
{id:"photoedit",name:"AI Photo Editor",icon:"🎨",desc:"Edit images with text — change objects, BGs",color:"#8b5cf6",label:"Upload image + describe edit",ph:"e.g., 'Replace background with beach scene'",tpl:["Replace background","Change clothing color","Remove person","Add sunset sky"],type:"upload",api:"/api/edit-image",cost:10,needsPrompt:true},
{id:"voiceover",name:"AI Voiceover Generator",icon:"🗣️",desc:"Pro voiceovers in 50+ languages",color:"#8b5cf6",label:"Text for voiceover",ph:"Type the script you want voiced...",tpl:["Welcome to my channel","Product launch announcement","Educational explainer","News intro"],type:"voice",cost:10},
{id:"writer",textUpload:true,free:true,name:"AI Content Writer",icon:"📝",desc:"Blog posts, articles, ad copy — SEO optimized",color:"#10b981",label:"What to write about?",ph:"Topic: e.g., 'Benefits of AI in healthcare'",tpl:["Blog post about AI trends 2026","Product launch announcement","LinkedIn article on leadership","Landing page copy for SaaS"],pr:i=>`You are an expert SEO content writer. Write a comprehensive, engaging article about: ${i}\n\nUse markdown: # headers, bullet points, strong conclusion. Min 600 words. Include meta description at end.`,type:"text"},
{id:"code",name:"AI Code Generator",icon:"💻",desc:"Write, debug, explain code in 50+ languages",color:"#8b5cf6",label:"What code do you need?",ph:"e.g., 'Write a Python REST API with Flask'",tpl:["Python REST API with Flask","React login component","Node.js file upload server","SQL database queries"],pr:i=>`You are a senior software engineer. ${i}\n\nProvide: clean production-ready code, detailed comments, error handling, example usage. Use proper markdown code blocks.`,type:"text",exportFormats:["txt"]},
{id:"translator",textUpload:true,free:true,name:"AI Translator Pro",icon:"🌐",desc:"Translate to 130+ languages with context",color:"#06b6d4",label:"What to translate?",ph:"e.g., 'Translate to Spanish: Good morning'",tpl:["Translate to Spanish","Translate to French","Translate to Arabic","Translate to Urdu"],pr:i=>`You are a professional translator. Translate preserving tone and cultural context. If no target language specified, translate to English. Text: ${i}`,type:"text"},
{id:"email",textUpload:true,name:"AI Email Writer",icon:"📧",desc:"Cold emails & follow-ups that get replies",color:"#f59e0b",label:"Describe the email needed",ph:"e.g., 'Cold email to pitch web design to restaurants'",tpl:["Cold outreach to clients","Follow-up after no response","Partnership proposal","Job application email"],pr:i=>`You are an elite email copywriter. Write for: ${i}\n\n**VERSION 1 - Direct:**\nSubject:\nBody:\nCTA:\n\n**VERSION 2 - Value-First:**\nSubject:\nBody:\nCTA:\n\n**FOLLOW-UP (Day 3):**\nSubject:\nBody:`,type:"text"},
{id:"social",name:"AI Social Media Kit",icon:"📱",desc:"Posts + captions + hashtags for all platforms",color:"#ec4899",label:"What are you promoting?",ph:"e.g., 'Promote a new coffee shop opening'",tpl:["Product launch post","Behind-the-scenes","Customer testimonial","Educational tip"],pr:i=>`You are a social media expert. Create full content kit for: ${i}\n\n**📸 INSTAGRAM:** Caption + 30 hashtags\n**🐦 TWITTER/X:** Tweet + Thread (5 tweets)\n**💼 LINKEDIN:** Professional post\n**📘 FACEBOOK:** Engagement post\n**🎵 TIKTOK:** Script + hook idea`,type:"text"},
{id:"seo",name:"AI SEO & Keywords",icon:"🔍",desc:"Complete SEO strategy with keywords",color:"#14b8a6",label:"What needs SEO?",ph:"e.g., 'SEO for online fitness coaching website'",tpl:["E-commerce SEO","Local business SEO","Blog SEO strategy","YouTube SEO"],pr:i=>`You are an SEO expert. Complete strategy for: ${i}\n\n**🎯 TOP 20 KEYWORDS:**\n| Keyword | Volume Est. | Difficulty | Intent |\n\n**📝 META TAGS:** Title + Description\n**📋 CONTENT OUTLINE:** H1-H3\n**🔗 ON-PAGE SEO CHECKLIST**\n**📈 CONTENT GAPS**`,type:"text"},
{id:"research",name:"AI Research Agent",icon:"🔬",desc:"Deep research reports with insights",color:"#6366f1",label:"What to research?",ph:"e.g., 'Market research on AI SaaS tools 2026'",tpl:["Market size analysis","Competitor research","Industry trends","Feasibility study"],pr:i=>`You are a McKinsey research analyst. Comprehensive report on: ${i}\n\n**📊 EXECUTIVE SUMMARY**\n**🔍 KEY FINDINGS**\n**📈 DETAILED ANALYSIS** with data\n**📉 STATISTICS** in tables\n**💡 RECOMMENDATIONS**\n**🔮 FUTURE OUTLOOK**`,type:"text"},
{id:"resume",textUpload:true,exportFormats:["pdf","docx","txt"],name:"AI Resume Builder",icon:"💼",desc:"ATS-optimized resumes that land interviews",color:"#f97316",label:"Describe your experience",ph:"e.g., 'Software developer, 5yr, Python, React'",tpl:["Software Engineer","Marketing Manager","Fresh graduate","Career change"],pr:i=>`You are a professional resume writer. ATS-optimized resume for: ${i}\n\n**[NAME]**\n[City] | [Email] | [Phone]\n\n**PROFESSIONAL SUMMARY**\n(3 lines, keyword-rich)\n\n**WORK EXPERIENCE**\n**[Title] — [Company]** *[Dates]*\n• Action verb + metrics bullets\n\n**SKILLS** | **EDUCATION** | **CERTIFICATIONS**`,type:"text",exportFormats:["pdf","docx","txt"]},
{id:"document",textUpload:true,exportFormats:["pdf","docx","txt"],name:"AI Document Writer",icon:"📄",desc:"Reports, proposals, SOPs — professional docs",color:"#0ea5e9",label:"What document do you need?",ph:"e.g., 'Business proposal for app development'",tpl:["Business proposal","Project report","SOP document","Company policy"],pr:i=>`You are a professional business writer. Create comprehensive document for: ${i}\n\nUse: proper title, sections, executive summary, detailed body, conclusion and next steps. Min 800 words.`,type:"text",exportFormats:["pdf","docx","txt"]},
{id:"data",exportFormats:["pdf","xlsx","txt"],name:"AI Data Analyzer",icon:"📊",desc:"Analyze data & find actionable insights",color:"#a855f7",label:"What data to analyze?",ph:"e.g., 'Sales: Q1=$50K Q2=$65K Q3=$45K Q4=$80K'",tpl:["Sales trend analysis","Customer behavior","Financial review","Survey results"],pr:i=>`You are a senior data analyst. Analyze: ${i}\n\n**📊 KEY METRICS** table\n**📈 TRENDS** (3-5 key patterns)\n**📉 RECOMMENDED CHARTS** (describe 3)\n**⚠️ ANOMALIES**\n**💡 RECOMMENDATIONS**\n**🔮 FORECAST**`,type:"text",exportFormats:["xlsx","csv","pdf","txt"]},
{id:"product",name:"AI Product Description",icon:"🛒",desc:"E-commerce copy that converts",color:"#ef4444",label:"Describe your product",ph:"e.g., 'Wireless headphones, 40hr battery, premium'",tpl:["Electronics","Fashion/clothing","Food/beverage","Software product"],pr:i=>`You are a conversion copywriter. Product descriptions for: ${i}\n\n**📱 SHORT (50 words)**\n**📝 MEDIUM (150 words)**\n**📖 LONG (300 words)** with hook, benefits, social proof, CTA\n**🔍 SEO KEYWORDS (10)**\n**📱 AD COPY** (Facebook/Instagram)`,type:"text"},
{id:"presentation",exportFormats:["pdf","docx","txt"],name:"AI Presentation Maker",icon:"🎯",desc:"Slide decks with speaker notes",color:"#84cc16",label:"What's the presentation about?",ph:"e.g., 'Investor pitch for AI fitness app'",tpl:["Investor pitch deck","Sales presentation","Training workshop","Business review"],pr:i=>`You are a presentation expert. Create 12 slides for: ${i}\n\nEach slide:\n**SLIDE [N]: [TITLE]**\n📊 Visual suggestion\n**Points:** 3 bullets\n🎤 **Speaker Notes:** what to say`,type:"text",exportFormats:["pdf","txt"]},
{id:"legal",textUpload:true,exportFormats:["pdf","docx","txt"],name:"AI Legal Draft",icon:"⚖️",desc:"Contracts, NDAs, legal templates",color:"#78716c",label:"What legal document?",ph:"e.g., 'Freelance contract, $5000 project, 6 weeks'",tpl:["Freelance contract","NDA agreement","Terms of service","Privacy policy"],pr:i=>`You are a legal document specialist. Draft for: ${i}\n\nInclude: numbered clauses, definitions, obligations, payment terms, termination, dispute resolution.\n\n⚠️ DISCLAIMER: Template only. Review with qualified attorney.`,type:"text",exportFormats:["pdf","docx","txt"]},
{id:"invoice",exportFormats:["pdf","xlsx","txt"],name:"AI Invoice Generator",icon:"🧾",desc:"Professional invoices ready to send",color:"#22c55e",label:"Invoice details?",ph:"e.g., '3 logos at $200 each for ABC Corp'",tpl:["Freelance services","Product sales","Consulting hours","Monthly retainer"],pr:i=>`You are a professional accountant. Create invoice for: ${i}\n\n**INVOICE #** INV-${Date.now().toString().slice(-6)}\n**Date:** ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}\n\nFROM: [Your details]\nBILL TO: [Client]\n\n| # | Description | Qty | Rate | Amount |\n\nSubtotal, Tax, TOTAL DUE, Payment Terms`,type:"text",exportFormats:["pdf","xlsx","txt"]},
{id:"grammar",textUpload:true,name:"AI Grammar & Rewriter",icon:"🔤",desc:"Fix grammar, rewrite for any tone",color:"#0891b2",label:"What needs fixing?",ph:"e.g., 'Fix: Dear sir i want to apply for job...'",tpl:["Fix my email grammar","Rewrite formally","Make it casual","Simplify complex text"],pr:i=>`You are an expert editor. For: "${i}"\n\n**✅ CORRECTED VERSION:**\n**🎯 PROFESSIONAL VERSION:**\n**💬 CASUAL VERSION:**\n**📝 IMPROVEMENTS MADE:**`,type:"text"},
{id:"adcopy",name:"AI Ad Copy Generator",icon:"📢",desc:"High-converting Facebook, Google, Instagram ads",color:"#ea580c",label:"What are you advertising?",ph:"e.g., 'Online course for digital marketing, $197'",tpl:["Facebook ad","Google search ad","Instagram story ad","LinkedIn B2B ad"],pr:i=>`You are a performance marketing expert. Create ads for: ${i}\n\n**📘 FACEBOOK AD 1:**\nHeadline:\nText:\nCTA:\n\n**📘 FACEBOOK AD 2:**\nHeadline:\nText:\n\n**🔍 GOOGLE SEARCH AD:**\nHeadline 1, 2, 3:\nDescription:`,type:"text"},
{id:"businessplan",textUpload:true,exportFormats:["pdf","docx","txt"],name:"AI Business Plan",icon:"📑",desc:"Complete business plans for investors",color:"#4f46e5",label:"Describe your business idea",ph:"e.g., 'Online tutoring platform for high school students'",tpl:["Startup plan","Restaurant plan","E-commerce plan","SaaS plan"],pr:i=>`You are a business consultant. Write business plan for: ${i}\n\n**1. EXECUTIVE SUMMARY**\n**2. MARKET ANALYSIS**\n**3. PRODUCTS/SERVICES**\n**4. MARKETING STRATEGY**\n**5. FINANCIAL PROJECTIONS**\n| Year | Revenue | Expenses | Profit |\n**6. FUNDING REQUIREMENTS**`,type:"text",exportFormats:["pdf","docx","txt"]},
{id:"coverletter",textUpload:true,exportFormats:["pdf","docx","txt"],name:"AI Cover Letter",icon:"📩",desc:"Job-winning cover letters for any position",color:"#0284c7",label:"Job + your background",ph:"e.g., 'Applying for Senior Developer at Google, 5yr Python'",tpl:["Software Engineer","Marketing Manager","Fresh graduate","Career change"],pr:i=>`You are a career coach. Write cover letter for: ${i}\n\nFormat: hook opening, 2-3 achievement paragraphs with metrics, why this company, strong CTA closing. Professional tone.`,type:"text",exportFormats:["pdf","docx","txt"]},
{id:"scriptwriter",name:"AI Script Writer",icon:"🎤",desc:"YouTube, TikTok, podcast scripts that engage",color:"#9333ea",label:"What's the video about?",ph:"e.g., '5-minute YouTube: How to start freelancing'",tpl:["YouTube tutorial","TikTok script","Podcast outline","Sales video"],pr:i=>`You are a viral content creator. Write script for: ${i}\n\n**[HOOK - First 3 seconds]:**\n**[INTRO - 15 seconds]:**\n**[MAIN CONTENT]:** (sections)\n**[CTA - Last 30 seconds]:**\n**⏱️ DURATION:**\n**🎨 B-ROLL IDEAS:**`,type:"text"},
{id:"pressrelease",textUpload:true,exportFormats:["pdf","docx","txt"],name:"AI Press Release",icon:"📰",desc:"Professional press releases for media",color:"#1d4ed8",label:"What's the announcement?",ph:"e.g., 'Launching AI tools platform'",tpl:["Product launch","Partnership news","Funding announcement","Award"],pr:i=>`You are a PR expert. Write press release for: ${i}\n\n**FOR IMMEDIATE RELEASE**\n**[HEADLINE]**\n**[SUBHEADLINE]**\n\n[Opening paragraph: who, what, when, where, why]\n[Body + quote from founder]\n[Company boilerplate]\n\n**MEDIA CONTACT:**\n###`,type:"text",exportFormats:["pdf","docx","txt"]},
{id:"brandname",name:"AI Brand Name Generator",icon:"💡",desc:"Unique memorable brand names + taglines",color:"#92400e",label:"Describe your brand/business",ph:"e.g., 'AI productivity app for remote teams, modern'",tpl:["Tech startup name","Food business name","Fashion brand","Consulting firm"],pr:i=>`You are a brand naming expert. Generate for: ${i}\n\n**🏆 TOP 10 NAMES:**\n| Name | Meaning | Why It Works |\n\n**🎯 TOP PICK + WHY:**\n**📝 TAGLINES (3):**\n**🎨 BRAND PERSONALITY:**`,type:"text"},
{id:"coldcall",name:"AI Cold Call Script",icon:"📞",desc:"Sales call scripts that convert",color:"#b91c1c",label:"What are you selling?",ph:"e.g., 'CRM software to small businesses, $99/mo'",tpl:["SaaS pitch","Consulting pitch","Real estate call","Insurance script"],pr:i=>`You are a top sales trainer. Cold call script for: ${i}\n\n**📞 OPENING (10 sec):**\n**🎯 VALUE PROP (30 sec):**\n**❓ DISCOVERY QUESTIONS (5):**\n**🛡️ OBJECTION HANDLERS:**\n- Not interested:\n- Too expensive:\n- Already have solution:\n**✅ CLOSING SCRIPTS (3):**`,type:"text"},
{id:"emailmarketing",name:"AI Email Campaign",icon:"📨",desc:"Complete email sequences that convert",color:"#be185d",label:"Describe your campaign",ph:"e.g., 'Welcome sequence for new SaaS trial users'",tpl:["Welcome sequence","Product launch","Re-engagement","Promotional campaign"],pr:i=>`You are an email marketing expert. Create campaign for: ${i}\n\n**Email 1 - Day 0:**\nSubject:\nBody:\nCTA:\n\n**Email 2 - Day 3:**\nSubject:\nBody:\n\n**Email 3 - Day 7:**\nSubject:\nBody:\n\n**📊 EXPECTED METRICS:**`,type:"text"},
{id:"studyguide",textUpload:true,exportFormats:["pdf","docx","txt"],name:"AI Study Guide",icon:"📚",desc:"Turn any topic into study materials",color:"#7e22ce",label:"What to study?",ph:"e.g., 'Machine learning basics for beginners'",tpl:["Exam prep","Concept explainer","Practice questions","Study schedule"],pr:i=>`You are a master educator. Study guide for: ${i}\n\n**📋 CORE CONCEPTS:**\n**🧠 MEMORY AIDS:**\n**✅ PRACTICE QUESTIONS (10):**\n**📝 CHEAT SHEET:**\n**📅 7-DAY STUDY PLAN:**`,type:"text",exportFormats:["pdf","docx","txt"]},
{id:"negotiation",name:"AI Negotiation Coach",icon:"🤝",desc:"Win salary, contract & business negotiations",color:"#1e3a5f",label:"What are you negotiating?",ph:"e.g., 'Salary negotiation: offered $60K, want $75K'",tpl:["Salary negotiation","Freelance rate","Business deal","Rent negotiation"],pr:i=>`You are a master negotiator. Coach me on: ${i}\n\n**🎯 YOUR LEVERAGE:**\n**💬 OPENING SCRIPT:**\n**🛡️ PUSH BACK RESPONSES:**\n**📊 COUNTER-OFFER STRATEGY:**\n**🏆 PSYCHOLOGY TIPS:**`,type:"text"},
{id:"swot",name:"AI SWOT Analysis",icon:"🔎",desc:"Strategic business analysis",color:"#0f766e",label:"What to analyze?",ph:"e.g., 'Small coffee shop competing with Starbucks'",tpl:["Startup analysis","Product analysis","Competitor analysis","Career SWOT"],pr:i=>`You are a strategy consultant. SWOT for: ${i}\n\n**💪 STRENGTHS:**\n**⚠️ WEAKNESSES:**\n**🚀 OPPORTUNITIES:**\n**🔴 THREATS:**\n\n**📊 STRATEGIC RECOMMENDATIONS:**\n**🎯 TOP PRIORITY ACTIONS:**`,type:"text"},
{id:"jobdescription",exportFormats:["pdf","docx","txt"],name:"AI Job Description",icon:"👔",desc:"Attract top talent with compelling job posts",color:"#155e75",label:"What role are you hiring for?",ph:"e.g., 'Senior React Developer, remote, $80-100K'",tpl:["Software Developer","Marketing Manager","Customer Support","Sales Executive"],pr:i=>`You are an HR expert. Job description for: ${i}\n\n**[JOB TITLE]**\n📍 Location | 💰 Salary | ⏰ Type\n\n**ABOUT THE ROLE:**\n**RESPONSIBILITIES:**\n**REQUIREMENTS:**\nMust Have:\nNice to Have:\n**WHAT WE OFFER:**`,type:"text",exportFormats:["pdf","docx","txt"]},
{id:"meetingnotes",textUpload:true,exportFormats:["pdf","docx","txt"],name:"AI Meeting Notes",icon:"📋",desc:"Turn raw notes into professional summaries",color:"#b45309",label:"Paste your meeting notes",ph:"e.g., 'Discussed Q2 targets, John handles marketing...'",tpl:["Board meeting","Client call summary","Team standup","Project kickoff"],pr:i=>`You are an executive assistant. Transform: "${i}"\n\n**📋 MEETING SUMMARY**\n**📌 KEY DECISIONS:**\n**✅ ACTION ITEMS:**\n| Action | Owner | Deadline |\n**📅 NEXT STEPS:**`,type:"text",exportFormats:["pdf","docx","txt"]},
{id:"spreadsheet",exportFormats:["xlsx","csv","txt"],name:"AI Spreadsheet Helper",icon:"📈",desc:"Excel/Sheets formulas in plain English",color:"#16a34a",label:"What formula do you need?",ph:"e.g., 'Calculate 5% commission if sales > $10K'",tpl:["Sales commission","VLOOKUP help","Pivot table guide","Data cleaning"],pr:i=>`You are an Excel/Sheets expert. Help with: ${i}\n\n**📊 FORMULA:**\n\`\`\`excel\n[Formula]\n\`\`\`\n**📝 HOW IT WORKS:**\n**⚠️ COMMON ERRORS:**\n**💡 PRO TIPS:**`,type:"text",exportFormats:["xlsx","csv","txt"]},
{id:"websitebuilder",exportFormats:["html","txt"],name:"AI Website Builder",icon:"🖥️",desc:"Generate complete website code instantly",color:"#7c3aed",label:"Describe your website",ph:"e.g., 'Landing page for fitness coaching business'",tpl:["SaaS landing page","Portfolio website","Restaurant website","E-commerce homepage"],pr:i=>`You are a senior full-stack developer. Create complete website for: ${i}\n\nProvide: full HTML with embedded CSS and JS. Modern, responsive, professional design. Include all key sections.`,type:"text",exportFormats:["html","txt"]},
{id:"taskmanager",name:"AI Task Manager",icon:"✅",desc:"AI prioritizes tasks & suggests deadlines",color:"#059669",label:"What tasks need organizing?",ph:"e.g., 'Tasks: launch website, write blog, fix bugs'",tpl:["Prioritize my tasks","Plan my week","Break down project","Daily schedule"],pr:i=>`You are a productivity expert. Organize: ${i}\n\n**🎯 PRIORITY MATRIX:**\n| Task | Priority | Effort | Deadline |\n**📅 DAILY SCHEDULE:**\n**⚡ QUICK WINS:**\n**🔥 CRITICAL PATH:**`,type:"text"},
{id:"pdfsummary",textUpload:true,name:"AI Document Summarizer",icon:"📑",desc:"Summarize any text — extract key insights",color:"#dc2626",label:"Paste text to summarize",ph:"Paste your document, article, or report here...",tpl:["Research paper","Extract key points","Executive summary","Simplify legal doc"],pr:i=>`You are a senior analyst. Summarize: "${i}"\n\n**📌 ONE-LINE SUMMARY:**\n**📊 EXECUTIVE SUMMARY (100 words):**\n**🔑 KEY POINTS:**\n**📈 IMPORTANT DATA:**\n**💡 RECOMMENDATIONS:**`,type:"text"},
{id:"productivitycoach",name:"AI Productivity Coach",icon:"⚡",desc:"Personalized productivity systems & habits",color:"#065f46",label:"What's your productivity challenge?",ph:"e.g., 'I procrastinate and work 12hrs but feel unproductive'",tpl:["Beat procrastination","Morning routine","Deep work system","Work-life balance"],pr:i=>`You are a world-class productivity coach. Address: ${i}\n\n**🔍 ROOT CAUSE:**\n**⚡ IMMEDIATE FIXES:**\n**📅 7-DAY PLAN:**\n| Day | Focus | Action |\n**🧠 MINDSET SHIFTS:**\n**🛠️ RECOMMENDED SYSTEMS:**`,type:"text"},
];
let at=T[0],co="";
function renderT(){const l=document.getElementById('tL');l.innerHTML='';
const h1=document.createElement('div');h1.className='tl-l';h1.textContent='⚡ FEATURED — IMAGE & VOICE';l.appendChild(h1);
const featured=T.filter(t=>t.type==='image'||t.type==='voice'||t.type==='upload');
featured.forEach(t=>{const d=document.createElement('div');d.className='ti'+(t.id===at.id?' on':'');d.style.background=t.id===at.id?t.color+'12':'';d.style.borderColor=t.id===at.id?t.color+'35':'transparent';
const badge=t.type==='image'?'<span style="background:#ec489920;color:#ec4899;font-size:8px;font-weight:700;padding:1px 5px;border-radius:3px;margin-left:4px">IMAGE</span>':t.type==='upload'?'<span style="background:#14b8a620;color:#14b8a6;font-size:8px;font-weight:700;padding:1px 5px;border-radius:3px;margin-left:4px">UPLOAD</span>':'<span style="background:#8b5cf620;color:#8b5cf6;font-size:8px;font-weight:700;padding:1px 5px;border-radius:3px;margin-left:4px">VOICE</span>';
d.innerHTML=`<div class="tic" style="${t.id===at.id?'background:'+t.color+'15':''}">${t.icon}</div><div style="flex:1;min-width:0"><div class="tin" style="color:${t.id===at.id?'#fff':'#94a3b8'}">${t.name}${badge}</div><div class="tid">${t.desc}</div></div>`;d.onclick=()=>sel(t);l.appendChild(d)});
const h2=document.createElement('div');h2.className='tl-l';h2.textContent='📝 TEXT TOOLS ('+T.filter(t=>t.type==='text').length+')';l.appendChild(h2);
T.filter(t=>t.type==='text').forEach(t=>{const d=document.createElement('div');d.className='ti'+(t.id===at.id?' on':'');d.style.background=t.id===at.id?t.color+'12':'';d.style.borderColor=t.id===at.id?t.color+'35':'transparent';
const free=t.free?'<span style="background:#10b98120;color:#10b981;font-size:8px;font-weight:700;padding:1px 5px;border-radius:3px;margin-left:4px">FREE</span>':'';
d.innerHTML=`<div class="tic" style="${t.id===at.id?'background:'+t.color+'15':''}">${t.icon}</div><div style="flex:1;min-width:0"><div class="tin" style="color:${t.id===at.id?'#fff':'#94a3b8'}">${t.name}${free}</div><div class="tid">${t.desc}</div></div>`;d.onclick=()=>sel(t);l.appendChild(d)})}
function renderC(){const c=document.getElementById('cH');c.innerHTML='';(at.tpl||[]).forEach(t=>{const s=document.createElement('span');s.className='cp';s.textContent=t;s.onclick=()=>{document.getElementById('iB').value=t;ucc()};c.appendChild(s)})}
function sel(t){at=t;document.getElementById('tI').textContent=t.icon;document.getElementById('tN').textContent=t.name;document.getElementById('tD').textContent=t.desc;document.getElementById('iB').placeholder=t.ph;document.getElementById('iL').textContent=t.label||'What do you need?';
const tB=document.getElementById('tB');
if(t.type==='image'){tB.style.background='#ec489910';tB.style.borderColor='#ec489920';tB.style.color='#ec4899';tB.textContent='🎨 Stability AI ('+t.cost+' credits)';}
else if(t.type==='voice'){tB.style.background='#8b5cf610';tB.style.borderColor='#8b5cf620';tB.style.color='#8b5cf6';tB.textContent='🎙️ ElevenLabs ('+t.cost+' credits)';}
else if(t.type==='upload'){tB.style.background='#14b8a610';tB.style.borderColor='#14b8a620';tB.style.color='#14b8a6';tB.textContent='📤 Upload Image ('+t.cost+' credits)';}
else{tB.style.background='#3b82f610';tB.style.borderColor='#3b82f620';tB.style.color='#3b82f6';tB.textContent='⚡ Gemini AI';}
document.getElementById('gB').style.background=`linear-gradient(135deg,${t.color},#06b6d4)`;document.getElementById('iB').value='';
// Show/hide file upload area
const fU=document.getElementById('fileUpload');
const tU=document.getElementById('textFileUpload');
window.uploadedImage=null;
window.extractedText='';

if(t.type==='upload'){
  // Image upload tools (BG remover, Photo enhancer, etc.)
  if(fU)fU.style.display='block';
  if(tU)tU.style.display='none';
  if(t.uploadOnly){
    document.getElementById('iB').style.display='none';
    const lbl=document.getElementById('iL');if(lbl&&lbl.parentElement)lbl.parentElement.style.display='none';
  }else{
    document.getElementById('iB').style.display='';
    const lbl=document.getElementById('iL');if(lbl&&lbl.parentElement)lbl.parentElement.style.display='';
  }
}else if(t.textUpload){
  // Text upload tools (Resume, CV, Document edit)
  if(fU)fU.style.display='none';
  if(tU)tU.style.display='block';
  document.getElementById('iB').style.display='';
  const lbl=document.getElementById('iL');if(lbl&&lbl.parentElement)lbl.parentElement.style.display='';
}else{
  // Regular text tools
  if(fU)fU.style.display='none';
  if(tU)tU.style.display='none';
  document.getElementById('iB').style.display='';
  const lbl=document.getElementById('iL');if(lbl&&lbl.parentElement)lbl.parentElement.style.display='';
}
const fp=document.getElementById('filePreview');if(fp)fp.innerHTML='';
const tp=document.getElementById('textFilePreview');if(tp)tp.innerHTML='';
clrO();

function renderExportButtons(){
  const formats=at.exportFormats||['txt'];
  const container=document.getElementById('exportButtons');
  if(!container)return;
  container.innerHTML='';
  const icons={pdf:'📄 PDF',docx:'📝 Word',xlsx:'📊 Excel',csv:'📋 CSV',html:'🌐 HTML',txt:'💾 Text'};
  formats.forEach(fmt=>{
    const btn=document.createElement('button');
    btn.className='sb2';
    btn.style.padding='8px 14px';
    btn.style.fontSize='11px';
    btn.innerHTML=icons[fmt]||fmt.toUpperCase();
    btn.onclick=()=>dlO(fmt);
    container.appendChild(btn);
  });
  container.style.display='flex';
}
renderT();renderC();ucc();if(window.innerWidth<768)toggleSB()}
function clrO(){document.getElementById('oA').innerHTML='<div style="padding:50px 20px;text-align:center"><div style="font-size:42px;margin-bottom:12px;opacity:0.2">✨</div><div style="color:#475569;font-size:13px">Your AI content will appear here</div></div>';['cpB','dlB','clB'].forEach(id=>document.getElementById(id).style.display='none');const eb=document.getElementById('exportButtons');if(eb)eb.style.display='none';co=''}
function ucc(){const l=document.getElementById('iB').value.length;document.getElementById('cC').textContent=l>0?l+'/4096':''}
function md2h(s){let h=s;h=h.replace(/```(\w*)\n([\s\S]*?)```/g,'<pre><code>$2</code></pre>');h=h.replace(/`([^`]+)`/g,'<code>$1</code>');h=h.replace(/^### (.*$)/gm,'<h3>$1</h3>');h=h.replace(/^## (.*$)/gm,'<h2>$1</h2>');h=h.replace(/^# (.*$)/gm,'<h1>$1</h1>');h=h.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');h=h.replace(/\*(.*?)\*/g,'<em>$1</em>');h=h.replace(/^> (.*$)/gm,'<blockquote>$1</blockquote>');h=h.replace(/^---$/gm,'<hr>');h=h.replace(/^\|(.+)\|$/gm,m=>{const c=m.split('|').filter(x=>x.trim());if(c.every(x=>/^[\s\-:]+$/.test(x)))return'';return'<tr>'+c.map(x=>'<td>'+x.trim()+'</td>').join('')+'</tr>'});h=h.replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g,'<table>$&</table>');h=h.replace(/^[\*\-] (.*$)/gm,'<li>$1</li>');h=h.replace(/^\d+\. (.*$)/gm,'<li>$1</li>');h=h.replace(/(<li>[\s\S]*?<\/li>\n?)+/g,'<ul>$&</ul>');h=h.replace(/\n\n/g,'</p><p>');h=h.replace(/\n/g,'<br>');return'<p>'+h+'</p>'}
async function gen(){
  const i=document.getElementById('iB').value.trim();
  if(at.type==='upload'){if(!window.uploadedImage){alert('Please upload an image first!');return;}if(at.needsPrompt&&!i){alert('Please describe the edit!');return;}}
  else if(!i)return;
  
  // PRE-CHECK CREDITS before making API call
  const requiredCredits = at.type==='text' ? 2 : (at.cost || 10);
  const isFreeT = at.free === true;
  if(!isFreeT && window.userPlan !== 'pro' && (window.userCredits || 0) < requiredCredits){
    document.getElementById('oA').innerHTML = '<div style="padding:50px 20px;text-align:center"><div style="font-size:48px;margin-bottom:16px">⚠️</div><div style="color:#fff;font-size:16px;font-weight:800;margin-bottom:8px">Insufficient Credits</div><div style="color:#94a3b8;font-size:13px;margin-bottom:16px;max-width:400px;margin-left:auto;margin-right:auto">This tool requires <strong style="color:#ef4444">'+requiredCredits+' credits</strong> but you only have <strong style="color:#f59e0b">'+(window.userCredits||0)+' credits</strong>.<br/><br/>Upgrade to Pro for <strong style="color:#10b981">500 credits/month</strong> + automatic Library save.</div><a href="/pricing.html" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:800">🚀 Upgrade to Pro — $9.99/mo</a></div>';
    return;
  }
  if(!isFreeT && window.userPlan === 'pro' && (window.userCredits || 0) < requiredCredits){
    document.getElementById('oA').innerHTML = '<div style="padding:50px 20px;text-align:center"><div style="font-size:48px;margin-bottom:16px">⚠️</div><div style="color:#fff;font-size:16px;font-weight:800;margin-bottom:8px">Monthly Credits Exhausted</div><div style="color:#94a3b8;font-size:13px;margin-bottom:16px">You have used all 500 credits this month. They will refresh next month.<br/><br/>Need more? Contact support for credit top-up.</div><a href="mailto:support@taskbasehq.com" style="display:inline-block;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:800">📧 Contact Support</a></div>';
    return;
  }
  
  const b=document.getElementById('gB');b.innerHTML='⏳ Generating...';b.disabled=true;
  document.getElementById('oA').innerHTML='<div style="padding:50px 20px;text-align:center"><div style="width:36px;height:36px;border:3px solid rgba(59,130,246,0.15);border-top-color:#3b82f6;border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 14px"></div><div style="color:#3b82f6;font-size:13px;font-weight:700">AI generating...</div><div style="color:#475569;font-size:11px;margin-top:3px">'+(at.type==='image'?'10-30 seconds':at.type==='voice'?'5-10 seconds':'5-15 seconds')+'</div></div>';
  try{
    let url=API_URL,body={};
    if(at.type==='image'){url=IMAGE_API;body={prompt:(at.promptPrefix||'')+i};}
    else if(at.type==='voice'){url=VOICE_API;body={text:i};}
    else if(at.type==='upload'){
      if(!window.uploadedImage){throw new Error('Please upload an image first!');}
      url=at.api;
      body={image:window.uploadedImage};
      if(at.needsPrompt){if(!i)throw new Error('Please describe the edit!');body.prompt=i;}
      else if(at.optionalPrompt&&i){body.replacePrompt=i;}
      else if(at.extraPrompt){body.prompt=at.extraPrompt;}
    }
    else{
      // For text upload tools, prepend extracted file content to user instruction
      let promptInput = i;
      if(at.textUpload && window.extractedText){
        promptInput = 'I have this existing document:\n\n---\n' + window.extractedText + '\n---\n\nUser instruction: ' + i;
      }
      body={prompt:at.pr(promptInput)};
    }
    const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    if(!r.ok){const er=await r.json();throw new Error(er.error||'API Error: '+r.status);}
    const d=await r.json();
    if(d.error)throw new Error(d.error);
    if(at.type==='image'||at.type==='upload'){
      co=d.image||'';
      const lbl=at.type==='upload'?'✨ Edited Image':'🎨 Generated Image';
      document.getElementById('oA').innerHTML='<div class="ot"><div class="ol">'+lbl+'</div><div class="os"><span>Stability AI</span></div></div><div class="oc" style="text-align:center"><img src="data:image/png;base64,'+co+'" style="max-width:100%;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.3)" /></div>';
      document.getElementById('dlB').style.display='';
    }else if(at.type==='voice'){
      co=d.audio||'';
      document.getElementById('oA').innerHTML='<div class="ot"><div class="ol">🎙️ Generated Voice</div><div class="os"><span>ElevenLabs</span></div></div><div class="oc" style="text-align:center"><audio controls style="width:100%;margin:20px 0"><source src="data:audio/mpeg;base64,'+co+'" type="audio/mpeg"></audio></div>';
      document.getElementById('dlB').style.display='';
    }else{
      co=d.text||'No response.';
      const w=co.split(/\s+/).length,c=co.length,rt=Math.ceil(w/200);
      document.getElementById('oA').innerHTML='<div class="ot"><div class="ol">📄 AI Output</div><div class="os"><span>📝 '+w+' words</span><span>📖 '+rt+' min</span><span>🔤 '+c+' chars</span></div></div><div class="oc">'+md2h(co)+'</div>';
      ['cpB','clB'].forEach(id=>document.getElementById(id).style.display='');
      // Show export buttons based on exportFormats
      renderExportButtons();
    }
    if(window.trackUsage)window.trackUsage(at.type==='text'?2:(at.cost||10));
    // Generation succeeded — deduct credits AND save to library
    // (This block only runs after successful API response, so credits won't be deducted on failures)
    if(window.saveToLibrary && window.userPlan==='pro'){
      const libType=at.type==='text'?'text':at.type==='voice'?'voice':'image';
      window.saveToLibrary({
        tool:at.id,
        toolName:at.name,
        type:libType,
        input:i,
        output:co,
        cost:at.type==='text'?2:(at.cost||10)
      });
    }
  }catch(e){document.getElementById('oA').innerHTML='<div style="padding:40px 20px;text-align:center"><div style="font-size:36px;margin-bottom:12px">⚠️</div><div style="color:#ef4444;font-size:13px;font-weight:700">'+e.message+'</div><div style="color:#475569;font-size:11px;margin-top:6px">Please try again</div></div>';}
  b.innerHTML='⚡ Generate';b.disabled=false;
}
function cpO(){navigator.clipboard?.writeText(co);const b=document.getElementById('cpB');b.innerHTML='✅ Copied!';setTimeout(()=>b.innerHTML='📋 Copy',2000)}
function dlO(format){
  if(at.type==='image'||at.type==='upload'){
    const a=document.createElement('a');a.href='data:image/png;base64,'+co;a.download='taskbasehq-image-'+Date.now()+'.png';a.click();
    return;
  }
  if(at.type==='voice'){
    const a=document.createElement('a');a.href='data:audio/mpeg;base64,'+co;a.download='taskbasehq-voice-'+Date.now()+'.mp3';a.click();
    return;
  }
  // Text-based exports
  const fmt=format||'txt';
  const baseName=at.name.replace(/\s+/g,'-').toLowerCase()+'-'+Date.now();
  
  if(fmt==='pdf'){
    window.exportPDF(co,baseName,at.name);
  } else if(fmt==='docx'){
    window.exportDocx(co,baseName,at.name);
  } else if(fmt==='xlsx'){
    window.exportXlsx(co,baseName);
  } else if(fmt==='csv'){
    window.exportCsv(co,baseName);
  } else if(fmt==='html'){
    const blob=new Blob([co],{type:'text/html'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=baseName+'.html';a.click();URL.revokeObjectURL(u);
  } else {
    const b=new Blob([co],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=baseName+'.txt';a.click();URL.revokeObjectURL(u);
  }
}

window.exportPDF = function(text,filename,title){
  if(!window.jspdf){alert('PDF library loading... please try again in a moment');return;}
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({unit:'pt',format:'letter'});
  const margin=50, maxWidth=512, lineHeight=14;
  let y=margin;
  
  // Title
  doc.setFont('helvetica','bold');doc.setFontSize(16);
  doc.text(title||'Document',margin,y);y+=24;
  
  // Footer info
  doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(120);
  doc.text('Generated by TaskBase HQ — taskbasehq.com',margin,y);y+=20;
  doc.setTextColor(0);doc.setFontSize(11);
  
  // Strip markdown for clean output
  const cleanText=text.replace(/[*#`\[\]_~]/g,'').replace(/\n{3,}/g,'\n\n');
  const lines=doc.splitTextToSize(cleanText,maxWidth);
  
  lines.forEach(line=>{
    if(y>740){doc.addPage();y=margin;}
    doc.text(line,margin,y);
    y+=lineHeight;
  });
  
  doc.save(filename+'.pdf');
}

window.exportDocx = function(text,filename,title){
  // Try multiple ways docx library could load
  const docxLib = window.docx || window.Docx || window['docx-js'];
  if(!docxLib){
    alert('Word export library failed to load. Please refresh the page and try again.');
    return;
  }
  try {
    const { Document, Paragraph, TextRun, Packer, HeadingLevel } = docxLib;
    
    const cleanText=text.replace(/[*#`\[\]_~]/g,'');
    const paragraphs=cleanText.split('\n').map(line=>{
      if(line.trim()==='') return new Paragraph({});
      return new Paragraph({children:[new TextRun({text:line,size:22})]});
    });
    
    const doc=new Document({
      sections:[{
        properties:{},
        children:[
          new Paragraph({text:title||'Document',heading:HeadingLevel.HEADING_1}),
          new Paragraph({children:[new TextRun({text:'Generated by TaskBase HQ',italics:true,color:'888888',size:18})]}),
          new Paragraph({}),
          ...paragraphs,
        ]
      }]
    });
    
    Packer.toBlob(doc).then(blob=>{
      if(window.saveAs){
        window.saveAs(blob, filename+'.docx');
      } else {
        const u=URL.createObjectURL(blob);
        const a=document.createElement('a');a.href=u;a.download=filename+'.docx';
        document.body.appendChild(a);a.click();document.body.removeChild(a);
        URL.revokeObjectURL(u);
      }
    }).catch(err=>{
      console.error('DOCX export error:',err);
      alert('Word export failed. Try downloading as PDF or Text instead.');
    });
  } catch(e){
    console.error('DOCX error:',e);
    alert('Word export failed: '+e.message+'. Try PDF or Text format instead.');
  }
}

window.exportXlsx = function(text,filename){
  if(!window.XLSX){alert('Excel library loading... please try again');return;}
  // Try to detect tabular data
  const lines=text.split('\n').filter(l=>l.trim());
  const data=lines.map(line=>{
    if(line.includes('|')) return line.split('|').map(c=>c.trim()).filter(Boolean);
    if(line.includes('\t')) return line.split('\t');
    if(line.includes(',')) return line.split(',').map(c=>c.trim());
    return [line];
  });
  
  const ws=window.XLSX.utils.aoa_to_sheet(data);
  const wb=window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
  window.XLSX.writeFile(wb,filename+'.xlsx');
}

window.exportCsv = function(text,filename){
  const lines=text.split('\n').filter(l=>l.trim());
  const csv=lines.map(line=>{
    if(line.includes('|')) return line.split('|').map(c=>'"'+c.trim().replace(/"/g,'""')+'"').filter(c=>c!=='""').join(',');
    if(line.includes('\t')) return line.split('\t').map(c=>'"'+c.trim().replace(/"/g,'""')+'"').join(',');
    return '"'+line.replace(/"/g,'""')+'"';
  }).join('\n');
  
  const blob=new Blob([csv],{type:'text/csv'});
  const u=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=u;a.download=filename+'.csv';a.click();
  URL.revokeObjectURL(u);
}
function clr(){document.getElementById('iB').value='';clrO();ucc()}
function toggleSB(){document.getElementById('sb').classList.toggle('open');document.getElementById('ov').classList.toggle('show')}


function renderExportButtons(){
  const formats=at.exportFormats||['txt'];
  const container=document.getElementById('exportButtons');
  if(!container)return;
  container.innerHTML='';
  const icons={pdf:'📄 PDF',docx:'📝 Word',xlsx:'📊 Excel',csv:'📋 CSV',html:'🌐 HTML',txt:'💾 Text'};
  formats.forEach(fmt=>{
    const btn=document.createElement('button');
    btn.className='sb2';
    btn.style.padding='8px 14px';
    btn.style.fontSize='11px';
    btn.innerHTML=icons[fmt]||fmt.toUpperCase();
    btn.onclick=()=>dlO(fmt);
    container.appendChild(btn);
  });
  container.style.display='flex';
}
renderT();renderC();

// File upload handler
window.handleFileUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { alert('Please upload an image file'); return; }
  if (file.size > 10*1024*1024) { alert('Image must be less than 10MB'); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result.split(',')[1];
    window.uploadedImage = base64;
    const fp = document.getElementById('filePreview');
    if (fp) fp.innerHTML = '<img src="' + e.target.result + '" style="max-width:200px;max-height:200px;border-radius:8px;border:1px solid rgba(255,255,255,0.1)" /><div style="color:#10b981;font-size:11px;margin-top:6px">✓ Image uploaded — ' + (file.size/1024).toFixed(0) + 'KB</div>';
  };
  reader.readAsDataURL(file);
};


// Text file upload handler (PDF, DOCX, TXT)
window.handleTextFileUpload = async function(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const tp = document.getElementById('textFilePreview');
  if (tp) tp.innerHTML = '<div style="color:#06b6d4;font-size:11px">⏳ Extracting text from ' + file.name + '...</div>';
  
  try {
    let extracted = '';
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (ext === 'txt' || file.type === 'text/plain') {
      extracted = await file.text();
    } else if (ext === 'pdf' || file.type === 'application/pdf') {
      if (!window.pdfjsLib) throw new Error('PDF library still loading. Please wait and try again.');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({data: arrayBuffer}).promise;
      const pages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        pages.push(content.items.map(item => item.str).join(' '));
      }
      extracted = pages.join('\n\n');
    } else if (ext === 'docx' || file.type.includes('wordprocessingml')) {
      if (!window.mammoth) throw new Error('Word library still loading. Please wait and try again.');
      const arrayBuffer = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({arrayBuffer});
      extracted = result.value;
    } else {
      throw new Error('Unsupported file type. Use PDF, DOCX, or TXT.');
    }
    
    if (!extracted.trim()) throw new Error('No text could be extracted from this file.');
    
    window.extractedText = extracted;
    const wordCount = extracted.split(/\s+/).length;
    if (tp) tp.innerHTML = '<div style="background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.2);padding:10px 12px;border-radius:8px;margin-top:8px"><div style="color:#10b981;font-size:12px;font-weight:700;margin-bottom:4px">✓ ' + file.name + ' — ' + wordCount + ' words extracted</div><div style="color:#94a3b8;font-size:10px;line-height:1.5;max-height:60px;overflow:hidden">' + extracted.slice(0, 200) + '...</div><button onclick="clearUploadedText()" style="margin-top:6px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.15);color:#ef4444;padding:3px 9px;border-radius:5px;font-size:10px;font-weight:700;cursor:pointer;font-family:inherit">✕ Remove</button></div>';
  } catch (err) {
    console.error('Extract error:', err);
    if (tp) tp.innerHTML = '<div style="color:#ef4444;font-size:11px">⚠️ ' + err.message + '</div>';
    window.extractedText = '';
  }
};

window.clearUploadedText = function() {
  window.extractedText = '';
  const tp = document.getElementById('textFilePreview');
  if (tp) tp.innerHTML = '';
  const tInput = document.getElementById('textFileInput');
  if (tInput) tInput.value = '';
};
