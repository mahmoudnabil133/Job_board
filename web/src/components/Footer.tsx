import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="bg-slate-950 text-slate-200 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-16">
          <div className="lg:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-black flex items-center justify-center shadow-lg shadow-indigo-500/20">
                JW
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">Job Work</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Egypt's premier talent gateway, bridging education and professional excellence with beautiful jobs and hiring tools.
            </p>
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-indigo-200">Candidates</h4>
            <ul className="space-y-4 text-slate-300 text-sm">
              {user?.role === 'candidate' && (
                <li>
                  <Link to="/jobs" className="hover:text-white transition-colors">
                    Browse Jobs
                  </Link>
                </li>
              )}
              <li><Link to="/profile" className="hover:text-white transition-colors">Career Advice</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Application Tips</Link></li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-indigo-200">Employers</h4>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li><Link to="/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Hiring Solutions</Link></li>
              <li><Link to="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-indigo-200">Connect</h4>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Email Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] uppercase tracking-widest text-slate-500">
          <p>© 2026 Job Work. Built with integrity.</p>
          <div className="flex flex-wrap gap-6 text-slate-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
