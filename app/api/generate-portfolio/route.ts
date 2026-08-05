import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchGithubActivity } from '@/lib/github';
import { generatePortfolioContent } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { username, githubUrl, skills, projects } = await req.json();

    if (!username || !githubUrl) {
      return NextResponse.json({ error: 'Username and GitHub username are required' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    const githubData = await fetchGithubActivity(githubUrl);
    const aiContent = await generatePortfolioContent(githubData, projects, skills);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        username,
        github_url: `https://github.com/${githubUrl}`,
        full_name: githubData.fullName,
        bio: aiContent.bio,
        skill_tags: aiContent.skillTags,
        avatar_url: githubData.avatarUrl,
        public_repos: githubData.publicRepos,
        followers: githubData.followers,
        total_stars: githubData.totalStars,
        top_languages: githubData.topLanguages,
      })
      .select()
      .single();

    if (profileError) throw profileError;

    const projectRows = aiContent.refinedProjects.map((p: any, i: number) => ({
      profile_id: profile.id,
      title: p.title,
      original_description: projects[i]?.description || '',
      refined_description: p.refinedDescription,
      repo_url: githubData.repos[i]?.url || '',
      tech_stack: githubData.repos[i]?.topics || [],
    }));

    if (projectRows.length > 0) {
      const { error: projectsError } = await supabase.from('projects').insert(projectRows);
      if (projectsError) throw projectsError;
    }

    return NextResponse.json({ username });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 });
  }
}