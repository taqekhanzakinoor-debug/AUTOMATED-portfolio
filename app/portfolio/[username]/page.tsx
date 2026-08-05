import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio')
    .eq('username', username)
    .single();

  if (!profile) return { title: 'Portfolio not found' };

  return {
    title: `${profile.full_name} — Portfolio`,
    description: profile.bio || `Check out ${profile.full_name}'s developer portfolio.`,
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;
  const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();
  if (!profile) notFound();
  const { data: projects } = await supabase.from('projects').select('*').eq('profile_id', profile.id);

  return (
    <main className="min-h-screen bg-neutral-950">
      <div className="border-b border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="flex items-center gap-5">
            <img src={profile.avatar_url} className="w-24 h-24 rounded-full border-2 border-neutral-800" alt={profile.full_name} />
            <div>
              <h1 className="text-3xl font-bold text-white">{profile.full_name}</h1>
              <a href={profile.github_url} target="_blank" className="text-sm text-indigo-400 hover:text-indigo-300 mt-1 inline-block">
                {profile.github_url}
              </a>
            </div>
          </div>
          <p className="mt-6 text-neutral-300 text-lg leading-relaxed max-w-2xl">
            {profile.bio}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {profile.skill_tags && profile.skill_tags.map((tag: string) => (
              <span key={tag} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-8 mt-8 pt-6 border-t border-neutral-800">
          <div>
            <div className="text-2xl font-bold text-white">{profile.public_repos || 0}</div>
            <div className="text-xs text-neutral-500 mt-0.5">Public Repos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{profile.total_stars || 0}</div>
            <div className="text-xs text-neutral-500 mt-0.5">Total Stars</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{profile.followers || 0}</div>
            <div className="text-xs text-neutral-500 mt-0.5">Followers</div>
          </div>
          {profile.top_languages && profile.top_languages.length > 0 && (
            <div>
              <div className="text-2xl font-bold text-white">{profile.top_languages[0]}</div>
              <div className="text-xs text-neutral-500 mt-0.5">Top Language</div>
            </div>
          )}
        </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold text-white mb-6">Projects</h2>
        <div className="grid gap-4">
          {projects && projects.map((p) => (
            <div key={p.id} className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/40 hover:border-neutral-700 transition">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold text-white text-lg">{p.title}</h3>
                {p.created_at && (
                  <span className="text-xs text-neutral-600 whitespace-nowrap mt-1">
                    {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
              <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
                {p.refined_description}
              </p>
              {p.tech_stack && p.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.tech_stack.map((t: string) => (
                    <span key={t} className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-md font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {p.repo_url && (
                <a href={p.repo_url} target="_blank" className="text-indigo-400 hover:text-indigo-300 text-sm mt-4 inline-block font-medium">
                  View repository
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-16 text-neutral-600 text-sm">
          Built with CodeHub
        </div>
      </div>
    </main>
  );
}