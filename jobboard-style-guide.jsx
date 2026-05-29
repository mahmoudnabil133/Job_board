import { useState } from "react";

const colors = {
  primary: { name: "Indigo", values: { 50:"#EEF2FF",100:"#E0E7FF",200:"#C7D2FE",400:"#818CF8",500:"#6366F1",600:"#4F46E5",700:"#4338CA",800:"#3730A3",900:"#312E81" }},
  accent:  { name: "Violet", values: { 50:"#F5F3FF",100:"#EDE9FE",400:"#A78BFA",500:"#8B5CF6",600:"#7C3AED",700:"#6D28D9" }},
  success: { name: "Emerald", values: { 50:"#ECFDF5",400:"#34D399",500:"#10B981",600:"#059669" }},
  warning: { name: "Amber",   values: { 50:"#FFFBEB",400:"#FBBF24",500:"#F59E0B",600:"#D97706" }},
  danger:  { name: "Rose",    values: { 50:"#FFF1F2",400:"#FB7185",500:"#F43F5E",600:"#E11D48" }},
  neutral: { name: "Slate",   values: { 50:"#F8FAFC",100:"#F1F5F9",200:"#E2E8F0",300:"#CBD5E1",400:"#94A3B8",500:"#64748B",600:"#475569",700:"#334155",800:"#1E293B",900:"#0F172A" }},
};

const typography = [
  { label:"Display / Hero", tag:"h1", size:"text-5xl", weight:"font-black", sample:"Find Your Dream Job", note:"Hero headings, page titles" },
  { label:"Heading 1", tag:"h2", size:"text-3xl", weight:"font-bold", sample:"Featured Positions", note:"Section titles" },
  { label:"Heading 2", tag:"h3", size:"text-xl", weight:"font-semibold", sample:"Senior Product Designer", note:"Job titles, card headers" },
  { label:"Subtitle", tag:"p", size:"text-base", weight:"font-medium", sample:"Figma · Remote · Full-time", note:"Meta labels, breadcrumbs" },
  { label:"Body", tag:"p", size:"text-sm", weight:"font-normal", sample:"We're looking for a creative designer who thrives on crafting beautiful digital experiences.", note:"Descriptions, paragraphs" },
  { label:"Caption / Overline", tag:"span", size:"text-xs", weight:"font-semibold", sample:"POSTED 2 DAYS AGO", note:"Tags, overlines, timestamps" },
];

const spacing = [2,4,6,8,12,16,20,24,32,40,48,64];
const borderRadii = [
  { label:"sm", value:"rounded-sm", px:"2px" },
  { label:"md", value:"rounded-md", px:"6px" },
  { label:"lg", value:"rounded-lg", px:"8px" },
  { label:"xl", value:"rounded-xl", px:"12px" },
  { label:"2xl", value:"rounded-2xl", px:"16px" },
  { label:"full", value:"rounded-full", px:"9999px" },
];

const shadows = [
  { label:"sm", css:"shadow-sm" },
  { label:"md", css:"shadow-md" },
  { label:"lg", css:"shadow-lg" },
  { label:"xl", css:"shadow-xl" },
  { label:"2xl", css:"shadow-2xl" },
  { label:"glow", css:"", style:"0 0 24px 4px rgba(99,102,241,0.25)" },
];

const badges = [
  { label:"Full-time", bg:"bg-indigo-100", text:"text-indigo-700" },
  { label:"Remote", bg:"bg-violet-100", text:"text-violet-700" },
  { label:"Contract", bg:"bg-amber-100", text:"text-amber-700" },
  { label:"Part-time", bg:"bg-slate-100", text:"text-slate-600" },
  { label:"Internship", bg:"bg-emerald-100", text:"text-emerald-700" },
  { label:"Urgent", bg:"bg-rose-100", text:"text-rose-700" },
];

const sampleJob = {
  title: "Senior Product Designer",
  company: "Notion",
  logo: "N",
  logoColor: "bg-slate-900",
  location: "San Francisco, CA",
  type: "Full-time",
  salary: "$140k–$180k",
  tags: ["Figma", "Design Systems", "UX Research"],
  posted: "2d ago",
  featured: true,
};

function ColorSwatch({ name, values }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">{name}</p>
      <div className="flex gap-1 flex-wrap">
        {Object.entries(values).map(([stop, hex]) => (
          <div key={stop} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-lg border border-slate-200" style={{ background: hex }} title={hex} />
            <span className="text-[10px] text-slate-500">{stop}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobCard({ job, variant = "default" }) {
  const [saved, setSaved] = useState(false);
  if (variant === "compact") return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 px-4 py-3 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className={`w-10 h-10 rounded-xl ${job.logoColor} text-white font-black text-lg flex items-center justify-center shrink-0`}>{job.logo}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-indigo-600 transition-colors">{job.title}</p>
        <p className="text-xs text-slate-500">{job.company} · {job.location}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{job.type}</span>
        <span className="text-xs text-slate-400">{job.posted}</span>
      </div>
    </div>
  );

  return (
    <div className={`relative bg-white rounded-2xl border ${job.featured ? "border-indigo-300 shadow-lg shadow-indigo-100" : "border-slate-200"} p-6 hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 cursor-pointer group`}>
      {job.featured && (
        <div className="absolute top-4 right-4">
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full uppercase tracking-wide">Featured</span>
        </div>
      )}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl ${job.logoColor} text-white font-black text-xl flex items-center justify-center shrink-0`}>{job.logo}</div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors leading-tight">{job.title}</h3>
          <p className="text-sm text-slate-500">{job.company} · {job.location}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map(t => (
          <span key={t} className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">{job.type}</span>
          <span className="text-sm font-bold text-emerald-600">{job.salary}</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); setSaved(!saved); }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${saved ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-500"}`}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}

const TABS = ["Colors","Typography","Spacing","Components","Job Cards","Buttons & Forms","Icons & Status"];

export default function StyleGuide() {
  const [tab, setTab] = useState("Colors");

  return (
    <div style={{ fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">J</span>
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm leading-none">JobBoard</p>
              <p className="text-[10px] text-slate-400 font-medium">Design System v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1"></span>
            React + Tailwind CSS
          </div>
        </div>
        {/* Tab nav */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1 overflow-x-auto pb-px">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 px-4 py-2 text-xs font-semibold rounded-t-lg transition-all duration-150 ${tab === t ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── COLORS ── */}
        {tab === "Colors" && (
          <div>
            <SectionTitle title="Color Palette" desc="Core colors driving the JobBoard brand. Indigo is primary, Violet for accents, semantic colors for status." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(colors).map(([key, { name, values }]) => (
                <div key={key} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <ColorSwatch name={name} values={values} />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Role: {key}</p>
                </div>
              ))}
            </div>
            <SectionTitle title="Gradient Tokens" desc="Use sparingly for hero sections, CTAs, and illustrations." />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label:"Brand", style:"linear-gradient(135deg,#6366F1,#8B5CF6)" },
                { label:"Warm Violet", style:"linear-gradient(135deg,#818CF8,#EC4899)" },
                { label:"Success", style:"linear-gradient(135deg,#10B981,#34D399)" },
                { label:"Subtle BG", style:"linear-gradient(180deg,#EEF2FF 0%,#F8FAFC 100%)" },
              ].map(g => (
                <div key={g.label} className="rounded-2xl overflow-hidden border border-slate-200">
                  <div style={{ background: g.style }} className="h-20 w-full" />
                  <p className="text-xs font-semibold text-slate-600 px-3 py-2">{g.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TYPOGRAPHY ── */}
        {tab === "Typography" && (
          <div>
            <SectionTitle title="Type Scale" desc="Built on Sora (headings) + Plus Jakarta Sans (body). All sizes use Tailwind utility classes." />
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {typography.map((t, i) => (
                <div key={i} className={`flex flex-col md:flex-row md:items-center gap-2 px-6 py-5 ${i < typography.length-1 ? "border-b border-slate-100" : ""}`}>
                  <div className="md:w-40 shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.label}</p>
                    <code className="text-[10px] text-indigo-500 font-mono">{t.size} {t.weight}</code>
                  </div>
                  <div className="flex-1">
                    <p className={`${t.size} ${t.weight} text-slate-900 leading-tight`}>{t.sample}</p>
                  </div>
                  <div className="md:w-40 shrink-0">
                    <p className="text-[10px] text-slate-400">{t.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <SectionTitle title="Font Pairing" desc="Two fonts for contrast and personality." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Display — Sora</p>
                <p style={{ fontFamily:"'Sora',sans-serif" }} className="text-4xl font-black text-slate-900 leading-tight">Aa Bb Cc</p>
                <p style={{ fontFamily:"'Sora',sans-serif" }} className="text-sm text-slate-500 mt-2">0123456789 !@#$%</p>
                <code className="text-[10px] text-indigo-400 mt-3 block">font-family: 'Sora', sans-serif</code>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Body — Plus Jakarta Sans</p>
                <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }} className="text-4xl font-bold text-slate-900 leading-tight">Aa Bb Cc</p>
                <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }} className="text-sm text-slate-500 mt-2">0123456789 !@#$%</p>
                <code className="text-[10px] text-indigo-400 mt-3 block">font-family: 'Plus Jakarta Sans', sans-serif</code>
              </div>
            </div>
          </div>
        )}

        {/* ── SPACING ── */}
        {tab === "Spacing" && (
          <div>
            <SectionTitle title="Spacing Scale" desc="Tailwind default scale (1 unit = 4px). Use consistently for padding, margin, and gap." />
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex flex-wrap gap-4 items-end">
                {spacing.map(s => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <div className="bg-indigo-200 rounded" style={{ width: `${s * 4}px`, height: `${s * 4}px`, minWidth: "4px", minHeight: "4px" }} />
                    <code className="text-[10px] text-slate-500 font-mono">p-{s}</code>
                    <span className="text-[10px] text-slate-400">{s * 4}px</span>
                  </div>
                ))}
              </div>
            </div>
            <SectionTitle title="Border Radius" desc="Consistent rounding for a friendly, modern feel." />
            <div className="flex flex-wrap gap-4">
              {borderRadii.map(r => (
                <div key={r.label} className="bg-white border border-slate-200 p-5 flex flex-col items-center gap-2" style={{ borderRadius: r.px }}>
                  <div className="w-14 h-14 bg-indigo-100" style={{ borderRadius: r.px }} />
                  <code className="text-[10px] font-mono text-indigo-600">{r.value}</code>
                  <span className="text-[10px] text-slate-400">{r.px}</span>
                </div>
              ))}
            </div>
            <SectionTitle title="Shadows" desc="Elevation layers from subtle to dramatic." />
            <div className="flex flex-wrap gap-4">
              {shadows.map(s => (
                <div key={s.label}
                  className={`bg-white rounded-2xl flex flex-col items-center justify-center w-28 h-28 gap-2 ${s.css}`}
                  style={s.style ? { boxShadow: s.style } : {}}
                >
                  <code className="text-[10px] font-mono text-indigo-500">{s.label}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COMPONENTS ── */}
        {tab === "Components" && (
          <div>
            <SectionTitle title="Badges & Tags" desc="Used for job type, work mode, skill tags, and status indicators." />
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex flex-wrap gap-3 mb-6">
                {badges.map(b => (
                  <span key={b.label} className={`text-xs font-bold px-3 py-1.5 rounded-full ${b.bg} ${b.text}`}>{b.label}</span>
                ))}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Outline Variants</p>
              <div className="flex flex-wrap gap-3">
                {badges.map(b => (
                  <span key={b.label} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${b.text} bg-transparent`} style={{ borderColor: "currentColor" }}>{b.label}</span>
                ))}
              </div>
            </div>

            <SectionTitle title="Avatar Stack" desc="Company logos and user avatars." />
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-wrap gap-6 items-center">
              {[
                { letter:"N", bg:"bg-slate-900" },
                { letter:"G", bg:"bg-blue-600" },
                { letter:"A", bg:"bg-indigo-600" },
                { letter:"S", bg:"bg-violet-600" },
                { letter:"M", bg:"bg-emerald-600" },
              ].map((a, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  {[12,10,8].map(size => (
                    <div key={size} className={`rounded-xl ${a.bg} text-white font-black flex items-center justify-center`} style={{ width: size*4, height: size*4, fontSize: size*1.5 }}>
                      {a.letter}
                    </div>
                  ))}
                  <span className="text-[10px] text-slate-400">lg / md / sm</span>
                </div>
              ))}
              <div className="flex flex-col gap-2 items-start ml-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Stacked</p>
                <div className="flex -space-x-2">
                  {["bg-indigo-600","bg-violet-600","bg-blue-600","bg-emerald-600"].map((c, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-white flex items-center justify-center text-white font-bold text-xs`}>{String.fromCharCode(65+i)}</div>
                  ))}
                  <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 font-bold text-xs">+8</div>
                </div>
              </div>
            </div>

            <SectionTitle title="Navigation Bar" desc="Sticky top nav with logo, links, and CTA." />
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                      <span className="text-white font-black text-xs">J</span>
                    </div>
                    <span className="font-black text-slate-900">JobBoard</span>
                  </div>
                  <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
                    {["Browse Jobs","Companies","Salaries","Blog"].map(l => (
                      <a key={l} href="#" className="hover:text-indigo-600 transition-colors">{l}</a>
                    ))}
                  </nav>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Sign In</button>
                  <button className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-xl">Post a Job</button>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center py-2">↑ Navbar component preview</p>
            </div>

            <SectionTitle title="Search Bar" desc="Primary search input with filter pills." />
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex gap-3 mb-4">
                <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <span className="text-slate-400 text-lg">🔍</span>
                  <input className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none" placeholder="Job title, keywords, or company..." />
                </div>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 w-44 focus-within:border-indigo-400 transition-all">
                  <span className="text-slate-400">📍</span>
                  <input className="bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none w-full" placeholder="Location..." />
                </div>
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shrink-0">Search</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Remote","Full-time","$100k+","Design","Engineering","Product"].map(f => (
                  <button key={f} className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 px-3 py-1.5 rounded-full transition-colors">{f}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── JOB CARDS ── */}
        {tab === "Job Cards" && (
          <div>
            <SectionTitle title="Job Card — Default" desc="Standard card with all meta info. Use in grid layouts." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <JobCard job={sampleJob} />
              <JobCard job={{ ...sampleJob, title:"Staff Engineer", company:"Linear", logo:"L", logoColor:"bg-violet-600", salary:"$180k–$230k", featured:false, tags:["TypeScript","GraphQL","Distributed Systems"] }} />
            </div>

            <SectionTitle title="Job Card — Compact" desc="For lists, sidebars, and search results." />
            <div className="flex flex-col gap-2">
              {[
                { title:"Head of Product", company:"Vercel", logo:"V", logoColor:"bg-black", location:"Remote", type:"Full-time", salary:"$160k", tags:[], posted:"1d ago", featured:false },
                { title:"UX Researcher", company:"Stripe", logo:"S", logoColor:"bg-indigo-600", location:"New York", type:"Full-time", salary:"$130k", tags:[], posted:"3d ago", featured:false },
                { title:"Data Scientist", company:"Figma", logo:"F", logoColor:"bg-rose-500", location:"San Francisco", type:"Hybrid", salary:"$150k", tags:[], posted:"5d ago", featured:false },
              ].map((j, i) => <JobCard key={i} job={j} variant="compact" />)}
            </div>

            <SectionTitle title="Featured / Hero Card" desc="Full-width featured listing for sponsored or premium jobs." />
            <div className="relative bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 -translate-y-20" />
              <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/5 rounded-full translate-y-10" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center font-black text-indigo-600 text-xl shrink-0">A</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Featured Partner</span>
                  </div>
                  <h3 className="text-xl font-black leading-tight">VP of Engineering</h3>
                  <p className="text-indigo-200 text-sm">Anthropic · San Francisco, CA · $250k–$320k</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button className="px-6 py-2.5 bg-white text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-50 transition-colors">Apply Now →</button>
                  <p className="text-[10px] text-indigo-300 text-center">142 applicants · 1d ago</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BUTTONS & FORMS ── */}
        {tab === "Buttons & Forms" && (
          <div>
            <SectionTitle title="Button Variants" desc="Consistent button styles for every action level." />
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all active:scale-95">Primary</button>
                <button className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl transition-all active:scale-95">Secondary</button>
                <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all active:scale-95">Dark</button>
                <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all active:scale-95">Success</button>
                <button className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-xl transition-all active:scale-95">Danger</button>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <button className="px-5 py-2.5 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold text-sm rounded-xl transition-all">Outline Primary</button>
                <button className="px-5 py-2.5 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm rounded-xl transition-all">Outline Default</button>
                <button className="px-5 py-2.5 text-indigo-600 hover:bg-indigo-50 font-bold text-sm rounded-xl transition-all">Ghost</button>
                <button className="px-5 py-2.5 bg-slate-100 text-slate-500 font-bold text-sm rounded-xl cursor-not-allowed opacity-50">Disabled</button>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                {["xs","sm","md","lg","xl"].map((s, i) => {
                  const sizes = ["text-[10px] px-3 py-1","text-xs px-3.5 py-1.5","text-sm px-5 py-2.5","text-base px-6 py-3","text-lg px-7 py-3.5"];
                  return <button key={s} className={`bg-indigo-600 text-white font-bold rounded-xl transition-all ${sizes[i]}`}>{s.toUpperCase()}</button>;
                })}
              </div>
            </div>

            <SectionTitle title="Form Fields" desc="Input, select, textarea, and checkbox styles." />
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Job Title</label>
                  <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="e.g. Senior Designer" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Location</label>
                  <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="City or Remote" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Job Type</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none bg-white">
                    <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Salary Range</label>
                  <div className="flex items-center gap-2">
                    <input className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder="Min" />
                    <span className="text-slate-400">–</span>
                    <input className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder="Max" />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Job Description</label>
                <textarea rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" placeholder="Describe the role, responsibilities, and requirements..." />
              </div>
              <div className="flex flex-wrap gap-4">
                {["Remote OK","Visa Sponsorship","Equity offered","Benefits included"].map(l => (
                  <label key={l} className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 rounded border-2 border-indigo-400 bg-indigo-50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-sm bg-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{l}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ICONS & STATUS ── */}
        {tab === "Icons & Status" && (
          <div>
            <SectionTitle title="Status Indicators" desc="Visual cues for job urgency, application status, company health." />
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-wrap gap-4">
              {[
                { label:"Actively Hiring", dot:"bg-emerald-500", text:"text-emerald-700", bg:"bg-emerald-50" },
                { label:"Closing Soon", dot:"bg-amber-500", text:"text-amber-700", bg:"bg-amber-50" },
                { label:"Paused", dot:"bg-slate-400", text:"text-slate-600", bg:"bg-slate-100" },
                { label:"Remote First", dot:"bg-indigo-500", text:"text-indigo-700", bg:"bg-indigo-50" },
                { label:"Urgent", dot:"bg-rose-500", text:"text-rose-700", bg:"bg-rose-50", pulse:true },
              ].map(s => (
                <div key={s.label} className={`flex items-center gap-2 px-4 py-2 rounded-full ${s.bg}`}>
                  <span className={`relative flex w-2 h-2`}>
                    {s.pulse && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${s.dot} opacity-75`} />}
                    <span className={`relative inline-flex rounded-full w-2 h-2 ${s.dot}`} />
                  </span>
                  <span className={`text-xs font-bold ${s.text}`}>{s.label}</span>
                </div>
              ))}
            </div>

            <SectionTitle title="Progress & Stats" desc="Application tracker, job stats, and metric cards." />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label:"Total Jobs", value:"12,480", trend:"+8%", up:true },
                { label:"New Today", value:"143", trend:"+22%", up:true },
                { label:"Avg Salary", value:"$142k", trend:"+3%", up:true },
                { label:"Companies", value:"2,341", trend:"-1%", up:false },
              ].map(m => (
                <div key={m.label} className="bg-white border border-slate-200 rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{m.label}</p>
                  <p className="text-2xl font-black text-slate-900">{m.value}</p>
                  <span className={`text-xs font-bold ${m.up ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"} px-2 py-0.5 rounded-full`}>{m.trend}</span>
                </div>
              ))}
            </div>

            <SectionTitle title="Application Pipeline" desc="Candidate application status tracker." />
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              {[
                { stage:"Applied", count:12, color:"bg-slate-200", fill:"bg-slate-500", pct:100 },
                { stage:"Screening", count:8, color:"bg-indigo-100", fill:"bg-indigo-500", pct:66 },
                { stage:"Interview", count:4, color:"bg-violet-100", fill:"bg-violet-500", pct:33 },
                { stage:"Offer", count:1, color:"bg-emerald-100", fill:"bg-emerald-500", pct:8 },
              ].map(s => (
                <div key={s.stage} className="flex items-center gap-4 mb-3">
                  <p className="text-xs font-semibold text-slate-600 w-20 shrink-0">{s.stage}</p>
                  <div className={`flex-1 h-2 rounded-full ${s.color}`}>
                    <div className={`h-2 rounded-full ${s.fill} transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-6 text-right">{s.count}</span>
                </div>
              ))}
            </div>

            <SectionTitle title="Empty States" desc="Use when no jobs match search or user has no saved jobs." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-3">🔍</div>
                <p className="font-bold text-slate-800 text-sm mb-1">No jobs found</p>
                <p className="text-xs text-slate-400 mb-4">Try adjusting your filters or broadening your search.</p>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Clear Filters →</button>
              </div>
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mb-3">♡</div>
                <p className="font-bold text-slate-800 text-sm mb-1">No saved jobs yet</p>
                <p className="text-xs text-slate-400 mb-4">Tap the heart on any listing to save it for later.</p>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Browse Jobs →</button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer token reference */}
      <div className="border-t border-slate-200 bg-white mt-10">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-900">JobBoard Design System</p>
            <p className="text-[10px] text-slate-400">React + Tailwind CSS · Sora + Plus Jakarta Sans</p>
          </div>
          <div className="flex gap-6 text-[10px] text-slate-400 font-semibold">
            <span>Primary: #6366F1</span>
            <span>Accent: #8B5CF6</span>
            <span>Base radius: rounded-xl</span>
            <span>Scale: 4px</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, desc }) {
  return (
    <div className="mt-10 mb-4">
      <h2 className="text-xl font-black text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
    </div>
  );
}
