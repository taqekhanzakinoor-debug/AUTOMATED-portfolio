'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    githubUrl: '',
    skills: '',
    projects: [{ title: '', description: '' }],
  });

  const updateProject = (i: number, field: string, value: string) => {
    const updated = [...form.projects];
    (updated[i] as any)[field] = value;
    setForm({ ...form, projects: updated });
  };

  const addProject = () =>
    setForm({ ...form, projects: [...form.projects, { title: '', description: '' }] });

  const removeProject = (i: number) => {
    if (form.projects.length === 1) return;
    setForm({ ...form, projects: form.projects.filter((_, idx) => idx !== i) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/generate-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      setLoading(false);
      if (res.ok) {
        router.push(`/portfolio/${result.username}`);
      } else {
        alert(result.error || 'Something went wrong');
      }
    } catch (err) {
      setLoading(false);
      alert('Network error, please try again');
    }
  };

  const inputClass =
    'w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition';

  return (
    <div className="min-h-screen bg-neutral-950 py-16 px-4">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Create Your Portfolio
          </h1>
          <p className="text-neutral-400 mt-2">
            Fill this in once. We'll generate a polished portfolio page for you automatically.
          </p>
        </div>

        <div className="space-y-5 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              Portfolio Username
            </label>
            <input
              placeholder="e.g. janedoe"
              className={inputClass}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <p className="text-xs text-neutral-500 mt-1">
              Your page will live at codehub.com/portfolio/<span className="text-neutral-400">{form.username || 'yourname'}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              GitHub Username
            </label>
            <input
              placeholder="e.g. octocat"
              className={inputClass}
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              Skills
            </label>
            <textarea
              placeholder="JavaScript, React, Node.js, PostgreSQL..."
              className={`${inputClass} resize-none`}
              rows={2}
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Projects
            </label>
            <div className="space-y-3">
              {form.projects.map((p, i) => (
                <div
                  key={i}
                  className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/50 space-y-3 relative"
                >
                  {form.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(i)}
                      className="absolute top-3 right-3 text-neutral-500 hover:text-red-400 text-sm"
                    >
                      ✕
                    </button>
                  )}
                  <input
                    placeholder="Project title"
                    className={inputClass}
                    value={p.title}
                    onChange={(e) => updateProject(i, 'title', e.target.value)}
                  />
                  <textarea
                    placeholder="Rough description — don't worry about wording, AI will polish it"
                    className={`${inputClass} resize-none`}
                    rows={2}
                    value={p.description}
                    onChange={(e) => updateProject(i, 'description', e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addProject}
              className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 font-medium"
            >
              + Add another project
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generating your portfolio...
              </>
            ) : (
              'Generate Portfolio'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}