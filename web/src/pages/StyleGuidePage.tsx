import React, { Suspense } from 'react';

const RemoteStyleGuide = React.lazy(() => import('../components/StyleGuide.jsx').catch(() => ({ default: () => <div className="p-8">Style guide failed to load.</div> })));

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <Suspense fallback={<div className="p-8">Loading style guide…</div>}>
        <RemoteStyleGuide />
      </Suspense>
    </div>
  );
}
