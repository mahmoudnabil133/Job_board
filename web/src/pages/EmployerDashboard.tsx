export default function EmployerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Employer Dashboard</h1>
            <p className="text-gray-500">Manage your recruitment pipeline and active job postings.</p>
          </div>
          <button className="bg-brand-red text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-red-dark active:bg-brand-red-active transition-all shadow-lg shadow-brand-red/25">
            Post New Job
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-6">Active Postings</h3>
              <div className="space-y-4">
                {[
                  { title: 'Full Stack Engineer', apps: 24, status: 'Active' },
                  { title: 'DevOps Specialist', apps: 12, status: 'Active' },
                  { title: 'QA Automation Engineer', apps: 8, status: 'Draft' }
                ].map((job) => (
                  <div key={job.title} className="flex items-center justify-between p-4 border rounded-xl hover:border-brand-red/30 transition-colors cursor-pointer group">
                    <div>
                      <h4 className="font-semibold group-hover:text-brand-red transition-colors">{job.title}</h4>
                      <p className="text-xs text-gray-500">{job.apps} applicants • Posted 5 days ago</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {job.status}
                      </span>
                      <button className="text-gray-400 hover:text-brand-red transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4">Pipeline Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Shortlisted</span>
                  <span className="font-bold text-blue-600">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Interviews</span>
                  <span className="font-bold text-green-600">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hired (This month)</span>
                  <span className="font-bold text-purple-600">2</span>
                </div>
              </div>
            </div>

            <div className="text-white p-6 rounded-xl shadow-lg overflow-hidden relative border border-brand-red-dark/30 bg-[linear-gradient(142deg,var(--color-brand-red)_0%,var(--color-brand-gradient-via)_50%,var(--color-brand-red-dark)_100%)]">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-white/80 text-sm mb-4">Get expert assistance from ITI's corporate relations team to find the perfect match.</p>
                <button className="bg-white text-brand-red px-4 py-2 rounded-lg text-sm font-bold hover:bg-sky-50 active:bg-sky-100 transition-colors">Contact Support</button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
