export async function generatePortfolioContent(githubData: any, userProjects: any[], userSkillsRaw: string) {
  const prompt = `
You are helping generate content for a developer portfolio. Based on the data below, return ONLY valid JSON (no markdown, no code fences) with this exact shape:

{
  "bio": "2-3 sentence professional bio",
  "skillTags": ["tag1", "tag2"],
  "refinedProjects": [
    { "title": "...", "refinedDescription": "1-2 polished sentences" }
  ]
}

Developer name: ${githubData.fullName}
Public repos: ${githubData.publicRepos}
Raw skills entered by user: ${userSkillsRaw}
Projects entered by user: ${JSON.stringify(userProjects)}
Recent GitHub repos: ${JSON.stringify(githubData.repos)}
`;

  const maxRetries = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();

      if (!data.candidates || !data.candidates[0]) {
        const isOverloaded = data.error?.code === 503;
        lastError = new Error('Gemini API did not return candidates. Full response: ' + JSON.stringify(data));

        if (isOverloaded && attempt < maxRetries) {
          const waitMs = attempt * 2000;
          console.log(`Gemini overloaded, retrying in ${waitMs}ms (attempt ${attempt}/${maxRetries})`);
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          continue;
        }
        throw lastError;
      }

      const rawText = data.candidates[0].content.parts[0].text;
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) throw err;
    }
  }

  throw lastError;
}