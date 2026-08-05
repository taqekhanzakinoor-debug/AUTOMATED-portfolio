import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
        <div className="mb-6 inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-4 py-1.5 rounded-full text-sm font-medium animate-fade-in">
          Built for CodeHub members
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight max-w-3xl animate-fade-in-delay-1">
          Your portfolio, generated automatically
        </h1>

        <p className="mt-6 text-lg text-neutral-400 max-w-xl leading-relaxed animate-fade-in-delay-2">
          Enter your GitHub username and a few project notes. We'll pull your activity, write your bio, and publish a polished portfolio page — live in under a minute.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-delay-3">
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.03] active:scale-[0.98] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20"
          >
            Create Your Portfolio
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full animate-fade-in-delay-3">
          <div className="border border-neutral-800 rounded-2xl p-5 bg-neutral-900/40 text-left hover:border-neutral-700 hover:-translate-y-1 transition-all duration-200">
            <h3 className="text-white font-semibold">One-time setup</h3>
            <p className="text-neutral-500 text-sm mt-1.5">Fill in your info once. No recurring AI cost, no maintenance.</p>
          </div>
          <div className="border border-neutral-800 rounded-2xl p-5 bg-neutral-900/40 text-left hover:border-neutral-700 hover:-translate-y-1 transition-all duration-200">
            <h3 className="text-white font-semibold">GitHub-powered</h3>
            <p className="text-neutral-500 text-sm mt-1.5">Pulls your real repos, languages, and activity automatically.</p>
          </div>
          <div className="border border-neutral-800 rounded-2xl p-5 bg-neutral-900/40 text-left hover:border-neutral-700 hover:-translate-y-1 transition-all duration-200">
            <h3 className="text-white font-semibold">AI-polished</h3>
            <p className="text-neutral-500 text-sm mt-1.5">Gemini writes your bio and refines your project descriptions.</p>
          </div>
        </div>
      </div>

      <footer className="text-center text-neutral-600 text-sm py-6 relative z-10">
        Built with CodeHub
      </footer>
    </main>
  );
}