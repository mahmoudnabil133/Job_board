import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-red flex items-center justify-center text-white font-black text-lg rounded-lg">
                ITI
              </div>
              <span className="font-bold text-xl tracking-tight">Careers</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Egypt's premier talent gateway, bridge the gap between education and professional excellence.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-brand-red">For Candidates</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Career Advice</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Application Tips</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-brand-red">For Employers</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Hiring Solutions</Link></li>
              <li><Link to="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-brand-red">Connect</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Email Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-gray-500">
          <p>© 2024 ITI Careers Platform. Built with integrity.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-red">Privacy Policy</a>
            <a href="#" className="hover:text-brand-red">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
