import { NextRequest, NextResponse } from 'next/server';

// Fallback content generator with Rally knowledge
function generateFallbackContent(topic: string, campaignContext: any): string {
  const { title, brief, missionTitle, missionRules } = campaignContext || {};
  
  const templates = [
    `Hot take: ${topic}

This is exactly what ${title || 'this campaign'} is about.

Key insight: ${brief?.substring(0, 100) || 'Quality content matters'}...

Thoughts? 🧵`,

    `Breaking: ${topic}

Here's what most people miss:
• The real opportunity isn't obvious
• ${brief?.substring(0, 80) || 'Early movers have advantage'}
• Community is everything

Thread 🧵`,

    `${topic}

Unpopular opinion: Most people are doing this wrong.

What actually works:
1. Authentic voice > perfect grammar
2. Specific examples > general statements  
3. Ask questions > make declarations

What's your take?`,

    `Thread 🧵: ${topic}

1/ First, understand why this matters.
${brief?.substring(0, 100) || 'The space is evolving rapidly.'}

2/ Key considerations:
- Timing is critical
- Community feedback shapes outcomes
- Quality beats quantity

3/ My take: This is just the beginning.

Agree or disagree?`
  ];

  const hash = topic.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return templates[hash % templates.length];
}

export async function POST(request: NextRequest) {
  try {
    const { topic, campaignContext } = await request.json();

    if (!topic?.trim()) {
      return NextResponse.json({ success: false, error: 'Topic is required' }, { status: 400 });
    }

    // Try AI generation
    try {
      const ZAI = await import('z-ai-web-dev-sdk').then(m => m.default);
      const zai = await ZAI.create();
      
      const systemPrompt = `You are an expert Rally.fun content creator. Generate viral-style tweets/threads optimized for Rally scoring.

KEY SCORING FACTORS:
- Gate Scores (must pass all): Content Alignment, Information Accuracy, Campaign Compliance, Originality
- Quality Scores (max 5 each): Engagement Potential, Technical Quality, Reply Quality

STYLE GUIDELINES:
- Strong hooks: "Breaking:", "Hot take:", "Thread 🧵:", "Unpopular opinion:"
- 100-280 characters ideal for single tweets
- End with CTAs: "Thoughts?", "What's your take?", "Agree or disagree?"
- Use personal voice, avoid AI patterns
- Include specific details, not generic statements

${campaignContext ? `
CAMPAIGN CONTEXT:
- Campaign: ${campaignContext.title}
- Brief: ${campaignContext.brief}
${campaignContext.missionTitle ? `- Mission: ${campaignContext.missionTitle}` : ''}
${campaignContext.missionRules ? `- Rules: ${campaignContext.missionRules}` : ''}
` : ''}

Generate 1-2 tweet variations. Make them authentic, engaging, and optimized for high Rally scores.`;

      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: systemPrompt },
          { role: 'user', content: `Generate Rally-optimized content about: ${topic}` }
        ],
        thinking: { type: 'disabled' }
      });

      const content = completion.choices[0]?.message?.content || '';
      
      if (content) {
        return NextResponse.json({ success: true, content, method: 'ai' });
      }
    } catch (aiError) {
      console.log('[Generate] AI not available, using fallback');
    }

    // Fallback
    const content = generateFallbackContent(topic, campaignContext);
    return NextResponse.json({ success: true, content, method: 'fallback' });

  } catch (error) {
    console.error('[Generate] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Generation failed' 
    }, { status: 500 });
  }
}
