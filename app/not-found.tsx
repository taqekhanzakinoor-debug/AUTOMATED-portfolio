import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
        <span className="text-2xl">🔍</span>
      </div>
      <h1 className="text-3xl font-bold text-white">Portfolio not found</h1>
      <p className="text-neutral-400 mt-3 max-w-sm">
        This page doesn't exist yet — or the username hasn't created a portfolio.
      </p>
      <Link
        href="/signup"
        className="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
      >
        Create Your Portfolio
      </Link>
    </main>
  );
}