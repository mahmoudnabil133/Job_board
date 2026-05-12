/**
 * Mirrors backend admin capabilities (read-only UI): pending job approvals,
 * approve/reject under `/v1/admin` with `EnsureRole:admin` — wire to API when needed.
 */
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
        <p className="text-gray-600 mb-8">
          You are signed in with the <strong>admin</strong> role. The Laravel API exposes moderation tools for the job marketplace.
        </p>

        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-lg">What this role can do (backend)</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
            <li>
              <code className="text-xs bg-gray-100 px-1 rounded">GET /api/v1/admin/jobs/pending</code> — list postings awaiting approval.
            </li>
            <li>
              <code className="text-xs bg-gray-100 px-1 rounded">PATCH …/jobs/{"{job}"}/approve</code> — approve a listing.
            </li>
            <li>
              <code className="text-xs bg-gray-100 px-1 rounded">PATCH …/jobs/{"{job}"}/reject</code> — reject a listing.
            </li>
          </ul>
          <p className="text-xs text-gray-500 pt-2">
            This screen is a placeholder; connect these endpoints from the frontend when you are ready to build the moderation UI.
          </p>
        </section>
      </div>
    </div>
  );
}
