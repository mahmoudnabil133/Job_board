import { motion } from 'motion/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-[linear-gradient(168deg,var(--color-brand-surface-tint)_0%,#ffffff_40%,var(--color-brand-gradient-from)_100%)]">
        <div className="absolute inset-0 z-0 opacity-[0.14]">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-red-light rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-red rounded-full mix-blend-multiply filter blur-xl animate-float [animation-delay:1s]"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-red-dark rounded-full mix-blend-multiply filter blur-xl animate-float [animation-delay:2s]"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            Your Career Gateway at <span className="text-brand-red">ITI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Connecting Egypt's finest ITI graduates with leading technology employers across the region.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto bg-white p-2 rounded-xl shadow-lg border border-gray-100"
          >
            <input 
              type="text" 
              placeholder="Search jobs, skills, or companies..." 
              className="flex-1 px-4 py-3 bg-transparent border-none focus:ring-0 outline-none w-full" 
            />
            <button className="bg-brand-red hover:bg-brand-red-dark active:bg-brand-red-active text-white px-8 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto">
              Find Jobs
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <div className="text-2xl font-bold">IBM</div>
          <div className="text-2xl font-bold">VOIS</div>
          <div className="text-2xl font-bold">VALEO</div>
          <div className="text-2xl font-bold">DELL</div>
          <div className="text-2xl font-bold">ORANGE</div>
        </div>
      </section>
    </div>
  );
}
