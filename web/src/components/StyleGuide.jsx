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
