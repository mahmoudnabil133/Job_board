import { useParams, Link } from 'react-router-dom';

export default function JobDetailsPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link to="/jobs" className="text-sm text-gray-500 hover:text-brand-red mb-6 inline-flex items-center gap-1">
          ← Back to all jobs
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-6 items-start mb-8">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold text-xl">
                  LOGO
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Senior Frontend Developer</h1>
                  <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">VOIS</span>
                    <span className="flex items-center gap-1">Cairo, Egypt (Remote)</span>
                    <span className="flex items-center gap-1">Posted 2 days ago</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-brand max-w-none">
                <h3 className="text-xl font-bold mb-4">Job Description</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We are looking for a Senior Frontend Developer with strong React skills to join our growing team. You will be responsible for building high-quality, performant user interfaces that power our global logistics platform.
                </p>

                <h3 className="text-xl font-bold mb-4">Key Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
                  <li>Develop new user-facing features using React.js</li>
                  <li>Build reusable components and front-end libraries for future use</li>
                  <li>Optimize components for maximum performance across web-capable devices and browsers</li>
                  <li>Collaborate with cross-functional teams to define, design, and ship new features</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">Requirements</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>5+ years of experience in frontend development</li>
                  <li>In-depth knowledge of JavaScript, CSS, HTML, and React.js</li>
                  <li>Experience with modern frontend pipelines and tools</li>
                  <li>Strong communication and collaboration skills</li>
                </ul>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Salary Range</span>
                  <span className="font-bold text-gray-900">$2,500 - $4,000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Job Type</span>
                  <span className="font-bold text-brand-red-dark bg-brand-red/15 px-2 py-1 rounded">Full-time</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-bold text-gray-900">Senior Level</span>
                </div>
              </div>
              
              <button className="w-full bg-brand-red hover:bg-brand-red-dark active:bg-brand-red-active text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-brand-red/25 mb-3">
                Apply for this job
              </button>
              <button className="w-full bg-white border border-gray-200 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all">
                Save for later
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold mb-4">About the Company</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                VOIS is a global leader in Vodafone technology solutions, providing cutting-edge infrastructure and software for millions of users worldwide.
              </p>
              <button className="text-brand-red text-sm font-bold mt-4 hover:underline">View company profile</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
