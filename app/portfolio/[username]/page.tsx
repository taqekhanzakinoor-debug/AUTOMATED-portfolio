import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import DownloadPdfButton from '@/components/DownloadPdfButton';

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const { data: profile } = await supabase.from('profiles').select('full_name, bio').eq('username', username).single();
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

  const hasStats = (profile.public_repos || 0) > 0 || (profile.total_stars || 0) > 0 || (profile.followers || 0) > 0;
  const hasContact = profile.email || profile.website_url || profile.linkedin_url || profile.twitter_url;
  const joinedYear = profile.github_joined_at ? new Date(profile.github_joined_at).getFullYear() : null;

  return (
    <main className="min-h-screen bg-neutral-950">
      <div className="border-b border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 relative overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
          <div className="flex items-start justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-5">
              <img src={profile.avatar_url} className="w-24 h-24 rounded-full border-2 border-neutral-800" alt={profile.full_name} />
              <div>
                <h1 className="text-3xl font-bold text-white">{profile.full_name}</h1>
                <a href={profile.github_url} target="_blank" className="text-sm text-indigo-400 hover:text-indigo-300 mt-1 inline-block transition-colors">
                  {profile.github_url}
                </a>
                {joinedYear && (
                  <p className="text-xs text-neutral-500 mt-1">Building on GitHub since {joinedYear}</p>
                )}
              </div>
            </div>
            <DownloadPdfButton />
          </div>

          <p className="mt-6 text-neutral-300 text-lg leading-relaxed max-w-2xl animate-fade-in-delay-1">
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-2 mt-6 animate-fade-in-delay-2">
            {profile.skill_tags && profile.skill_tags.map((tag: string) => (
              <span key={tag} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full text-sm font-medium hover:bg-indigo-500/20 transition-colors">
                {tag}
              </span>
            ))}
          </div>

          {hasContact && (
            <div className="flex flex-wrap gap-4 mt-6 animate-fade-in-delay-2">
              {profile.email && (
                <a href={"mailto:" + profile.email} className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Email
                </a>
              )}
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Website
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
              )}
              {profile.twitter_url && (
                <a href={profile.twitter_url} target="_blank" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Twitter / X
                </a>
              )}
            </div>
          )}

          {hasStats && (
            <div className="flex gap-8 mt-8 pt-6 border-t border-neutral-800 animate-fade-in-delay-3">
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
          )}
        </div>
      </div>

      {profile.featured_repos && profile.featured_repos.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 py-12 border-b border-neutral-800">
          <h2 className="text-xl font-semibold text-white mb-6">Featured Repositories</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.featured_repos.map((r: any) => (
              <a key={r.name} href={r.url} target="_blank" className="border border-neutral-800 rounded-2xl p-5 bg-neutral-900/40 hover:border-neutral-700 hover:-translate-y-0.5 transition-all duration-200 block">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{r.name}</h3>
                  <span className="text-xs text-neutral-500">Stars: {r.stars}</span>
                </div>
                {r.description && (
                  <p className="text-neutral-400 text-sm mt-2 leading-relaxed">{r.description}</p>
                )}
                {r.language && (
                  <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-md font-mono mt-3 inline-block">
                    {r.language}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold text-white mb-6">Projects</h2>
        <div className="grid gap-4">
          {projects && projects.map((p) => (
            <div key={p.id} className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/40 hover:border-neutral-700 hover:-translate-y-0.5 transition-all duration-200">
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
                <a href={p.repo_url} target="_blank" className="text-indigo-400 hover:text-indigo-300 text-sm mt-4 inline-block font-medium transition-colors">
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