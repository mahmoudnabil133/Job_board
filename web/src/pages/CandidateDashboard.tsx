export default function CandidateDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-24 h-24 bg-brand-red/10 rounded-full mx-auto mb-4 flex items-center justify-center text-brand-red text-2xl font-bold">
                AA
              </div>
              <h2 className="font-bold text-lg">Ahmed Ali</h2>
              <p className="text-gray-500 text-sm mb-4">Full Stack Developer</p>
              <div className="w-full bg-gray-100 h-2 rounded-full mb-2">
                <div className="bg-brand-red h-full w-[85%] rounded-full"></div>
              </div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Profile Strength: 85%</p>
            </div>

            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button className="w-full text-left px-6 py-4 bg-brand-red hover:bg-brand-red-dark active:bg-brand-red-active text-white font-medium transition-colors">Dashboard</button>
              <button className="w-full text-left px-6 py-4 hover:bg-sky-50 active:bg-sky-100 transition-colors">My Applications</button>
              <button className="w-full text-left px-6 py-4 hover:bg-sky-50 active:bg-sky-100 transition-colors">Saved Jobs</button>
              <button className="w-full text-left px-6 py-4 hover:bg-sky-50 active:bg-sky-100 transition-colors">Settings</button>
            </nav>
          </aside>

          <main className="md:col-span-3 space-y-8">
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Total Applications', value: '12', color: 'bg-blue-50 text-blue-600' },
                { label: 'Interviews', value: '3', color: 'bg-green-50 text-green-600' },
                { label: 'Offers', value: '1', color: 'bg-orange-50 text-orange-600' }
              ].map((stat) => (
                <div key={stat.label} className={`${stat.color} p-6 rounded-xl border border-current opacity-70`}>
                  <p className="text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-bottom border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">Recent Applications</h3>
                <button className="text-brand-red text-sm font-medium hover:underline">View All</button>
              </div>
              <div className="divide-y divide-gray-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center font-bold text-xs text-gray-400">CO</div>
                      <div>
                        <h4 className="font-semibold">Software Engineer</h4>
                        <p className="text-xs text-gray-500">TechCorp • Applied 3 days ago</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-100 text-yellow-700">Under Review</span>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
