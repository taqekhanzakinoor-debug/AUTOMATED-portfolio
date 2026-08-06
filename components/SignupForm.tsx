'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoMode, setPhotoMode] = useState<'github' | 'upload' | 'url'>('github');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [form, setForm] = useState({
    username: '',
    githubUrl: '',
    skills: '',
    email: '',
    websiteUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error } = await supabaseClient.storage.from('avatars').upload(fileName, file);
      if (error) throw error;

      const { data } = supabaseClient.storage.from('avatars').getPublicUrl(fileName);
      setCustomAvatarUrl(data.publicUrl);
    } catch (err) {
      alert('Photo upload failed, please try again');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/generate-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          customAvatarUrl: photoMode !== 'github' ? customAvatarUrl : '',
        }),
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
    'w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200';

  return (
    <div className="min-h-screen bg-neutral-950 py-16 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Create Your Portfolio
          </h1>
          <p className="text-neutral-400 mt-2">
            Fill this in once. We'll generate a polished portfolio page for you automatically.
          </p>
        </div>

        <div className="space-y-5 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 animate-fade-in-delay-1 backdrop-blur-sm">
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
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Profile Picture
            </label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPhotoMode('github')}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${photoMode === 'github' ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'}`}
              >
                Use GitHub photo
              </button>
              <button
                type="button"
                onClick={() => setPhotoMode('upload')}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${photoMode === 'upload' ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'}`}
              >
                Upload a photo
              </button>
              <button
                type="button"
                onClick={() => setPhotoMode('url')}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${photoMode === 'url' ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'}`}
              >
                Paste a photo URL
              </button>
            </div>

            {photoMode === 'upload' && (
              <div>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="text-sm text-neutral-400" />
                {uploading && <p className="text-xs text-indigo-400 mt-2">Uploading...</p>}
                {customAvatarUrl && !uploading && (
                  <img src={customAvatarUrl} className="w-16 h-16 rounded-full mt-3 border border-neutral-800" alt="Preview" />
                )}
              </div>
            )}

            {photoMode === 'url' && (
              <input
                placeholder="https://example.com/your-photo.jpg"
                className={inputClass}
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Email <span className="text-neutral-500 font-normal">(optional)</span>
              </label>
              <input
                placeholder="you@example.com"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Website <span className="text-neutral-500 font-normal">(optional)</span>
              </label>
              <input
                placeholder="yoursite.com"
                className={inputClass}
                value={form.websiteUrl}
                onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                LinkedIn <span className="text-neutral-500 font-normal">(optional)</span>
              </label>
              <input
                placeholder="linkedin.com/in/you"
                className={inputClass}
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Twitter / X <span className="text-neutral-500 font-normal">(optional)</span>
              </label>
              <input
                placeholder="x.com/you"
                className={inputClass}
                value={form.twitterUrl}
                onChange={(e) => setForm({ ...form, twitterUrl: e.target.value })}
              />
            </div>
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
                  className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/50 space-y-3 relative hover:border-neutral-700 transition-colors duration-200"
                >
                  {form.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(i)}
                      className="absolute top-3 right-3 text-neutral-500 hover:text-red-400 text-sm transition-colors"
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
              className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              + Add another project
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
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