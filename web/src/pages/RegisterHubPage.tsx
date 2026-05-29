import { GlassCard } from "../components/GlassCard";
import { Link } from 'react-router-dom';
import { User, Building2 } from 'lucide-react';

const cards = [
  {
    to: '/register/employee',
    title: 'Job seeker (employee)',
    description: 'Create a candidate profile to browse listings, apply to openings, and track applications.',
    icon: User,
    accent: 'from-sky-100 to-sky-50 border-sky-200',
  },
  {
    to: '/register/employer',
    title: 'Employer / hiring team',
    description: 'Register to publish roles, manage your company profile, and review applicants.',
    icon: Building2,
    accent: 'from-cyan-100 to-sky-50 border-cyan-200',
  },
] as const;

export default function RegisterHubPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white/80">
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/login" className="text-sm font-semibold text-brand-red hover:underline">
            ← Back to sign in
          </Link>
          <span className="text-sm font-bold text-gray-900">ITI Careers</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">Choose how you will use the board</h1>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto text-sm md:text-base">
            Each path matches a different account type in our system—pick the one that fits you. You will sign in on the next step after your account is created.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {cards.map(({ to, title, description, icon: Icon, accent }) => (
              <Link
                key={to}
                to={to}
                className={`group flex flex-col rounded-2xl border bg-gradient-to-b p-6 shadow-sm hover:shadow-md transition-all ${accent}`}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-red shadow-sm group-hover:scale-105 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">{description}</p>
                <span className="mt-6 text-sm font-semibold text-brand-red group-hover:underline">Continue →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
