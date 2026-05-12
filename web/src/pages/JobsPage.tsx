import { useState } from 'react';
import { Link } from 'react-router-dom';
import { JobType } from '../types';

export default function JobsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4">Job Type</h3>
              <div className="space-y-3">
                {Object.values(JobType).map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4">Experience Level</h3>
              <div className="space-y-3">
                {['Entry Level', 'Mid Level', 'Senior', 'Lead'].map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Job Listings Area */}
          <main className="flex-1 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Found 42 Jobs</h1>
              <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand-red transition-colors">
                <option>Newest First</option>
                <option>Relevant</option>
              </select>
            </div>

            {[1, 2, 3, 4, 5].map((i) => (
              <Link 
                to={`/jobs/${i}`} 
                key={i} 
                className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-brand-red/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-bold">
                      LOGO
                    </div>
                    <div>
                      <h2 className="font-bold text-lg group-hover:text-brand-red transition-colors">Senior Frontend Developer</h2>
                      <p className="text-gray-500 text-sm">VOIS • Remote</p>
                    </div>
                  </div>
                  <span className="text-brand-red font-semibold">$2,500 - $4,000</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-medium">Full-time</span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-medium">React</span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-medium">TypeScript</span>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Posted 2 days ago</span>
                  <span>12 applicants</span>
                </div>
              </Link>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
