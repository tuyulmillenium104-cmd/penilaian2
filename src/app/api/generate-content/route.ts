import { NextRequest, NextResponse } from 'next/server';

// Local content generator - works without external API

// AI pattern markers to avoid
const AI_PATTERNS = {
  forbidden: [
    '—', '"In the world of', '"Picture this', '━', '══',
    'game changer', 'next level', 'revolutionary', 'paradigm shift',
    'harnessing the power', 'unlock the potential', 'seamless experience',
    'comprehensive guide', 'deep dive', 'embark on a journey',
    'elevate your', 'streamline your', 'transform your',
    'furthermore', 'moreover', 'in conclusion', 'important to note'
  ],
  safeHooks: [
    'Hot take:', 'tbh,', 'Unpopular opinion:', 'Just realized:',
    'Been thinking...', 'Plot twist:', 'Nobody talks about',
    'POV:', 'NGL,', 'Confession:', 'What if I told you',
    'Lost money on this mistake:', 'Finally understood why'
  ],
  personalOpeners: [
    "I've been", "My experience", "After testing", "What I learned",
    "Mistake I made", "wish someone told me", "don't make my mistake",
    "been using", "tried", "finally got", "switched to"
  ],
  closers: [
    "Thoughts?", "What do you think?", "Anyone else?",
    "Agree or disagree?", "What's your take?", "Or am I missing something?",
    "What would you add?", "Who else has experienced this?"
  ]
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function extractKeywordsFromKnowledge(knowledgeBase?: string): string[] {
  if (!knowledgeBase) return [];
  
  // Extract important terms
  const keywords: string[] = [];
  
  // Look for project names, tickers, key features
  const projectMatch = knowledgeBase.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g);
  const tickerMatch = knowledgeBase.match(/\$([A-Z]+)/g);
  const featureMatch = knowledgeBase.match(/(?:feature|offer|provide|supports?)[:\s]+([^.]+)/gi);
  
  if (projectMatch) keywords.push(...projectMatch.slice(0, 3));
  if (tickerMatch) keywords.push(...tickerMatch.slice(0, 2));
  
  return [...new Set(keywords)].slice(0, 5);
}

function generateTweetVariations(topic: string, campaignContext: any): string {
  const keywords = extractKeywordsFromKnowledge(campaignContext?.knowledgeBase);
  const projectName = campaignContext?.title || keywords[0] || 'this project';
  const hasRules = campaignContext?.rules || campaignContext?.missionRules;
  
  // Extract required elements from rules
  const requiredHashtags = hasRules?.match(/#\w+/g) || [];
  const requiredMentions = hasRules?.match(/@\w+/g) || [];
  
  const variations: string[] = [];
  
  // Variation 1: Personal experience angle
  variations.push(`${pickRandom(AI_PATTERNS.personalOpeners)} ${topic.toLowerCase()} and honestly didn't expect much.

But after actually trying it - the ${keywords[0] || 'experience'} is different from what I thought.

Key things I noticed:
- Much faster than expected
- UI doesn't suck (finally)
- Actually works as advertised

${pickRandom(AI_PATTERNS.closers)}

${requiredHashtags.slice(0, 2).join(' ')}`);

  // Variation 2: Contrarian/hot take angle
  variations.push(`${pickRandom(AI_PATTERNS.safeHooks)} everyone's sleeping on ${topic}.

While everyone's focused on [trending thing], ${projectName} quietly ${keywords[1] || 'building something real'}.

Not financial advice, but this is what I'm watching.

${pickRandom(AI_PATTERNS.closers)}

${requiredHashtags.slice(0, 2).join(' ')} ${requiredMentions.slice(0, 1).join(' ')}`);

  // Variation 3: Learning/insight angle
  variations.push(`Just realized something about ${topic}:

Most people ${pickRandom(['get this wrong', 'overlook this', 'don\'t understand'])}.

The real opportunity isn't obvious - it's ${keywords[0]?.toLowerCase() || 'in the details'}.

${campaignContext?.knowledgeBase?.substring(0, 100).split('.')[0] || 'This changes how I see things'}.

${pickRandom(AI_PATTERNS.closers)}

${requiredHashtags.slice(0, 1).join(' ')}`);

  // Variation 4: Short and punchy
  variations.push(`${topic} - ${pickRandom(['actually legit', 'underrated af', 'worth checking', 'surprisingly good'])}.

${keywords[0] || 'This'} + ${keywords[1] || 'that'} = ${pickRandom(['finally works', 'makes sense', 'is the play'])}.

${pickRandom(AI_PATTERNS.closers)}

${requiredHashtags.slice(0, 2).join(' ')} ${requiredMentions.slice(0, 1).join(' ')}`);

  // Variation 5: Story-based (most human sounding)
  const storyIntro = pickRandom([
    `So I tried ${topic} last week...`,
    `Been testing ${topic} for a few days...`,
    `Friend put me on to ${topic}...`,
    `Finally gave ${topic} a shot...`
  ]);
  
  variations.push(`${storyIntro}

Verdict: ${pickRandom(['actually impressed', 'not what I expected', 'pleasantly surprised', 'solid so far'])}.

${keywords[0] || 'The thing'} is ${pickRandom(['clean', 'fast', 'smooth', 'intuitive'])}. ${keywords[1] ? `Also ${keywords[1].toLowerCase()} is a nice touch.` : ''}

No affiliate links, no referral - just sharing what I found.

${pickRandom(AI_PATTERNS.closers)}

${requiredHashtags.slice(0, 2).join(' ')}`);

  return `Here are ${variations.length} human-sounding options for "${topic}":

---

**Option 1 - Personal Experience:**
${variations[0]}

---

**Option 2 - Hot Take:**
${variations[1]}

---

**Option 3 - Insight:**
${variations[2]}

---

**Option 4 - Short & Punchy:**
${variations[3]}

---

**Option 5 - Story Style (Recommended):**
${variations[4]}

---

📝 **IMPORTANT BEFORE POSTING:**
• Add any missing required hashtags/mentions from campaign rules
• Personalize with YOUR actual experience
• Check facts against knowledge base
• Remove anything that doesn't sound like YOU
• Post during peak hours for better engagement`;
}

export async function POST(request: NextRequest) {
  try {
    const { topic, campaignContext } = await request.json();

    if (!topic?.trim()) {
      return NextResponse.json({ success: false, error: 'Topic is required' }, { status: 400 });
    }

    // Generate content locally - no external API needed
    const content = generateTweetVariations(topic.trim(), campaignContext);

    return NextResponse.json({ 
      success: true, 
      content, 
      method: 'local-generator-v2',
      tips: [
        'Review each option and pick the most natural-sounding one',
        'Edit to add your personal voice and real experience',
        'Make sure to include required hashtags/mentions from campaign rules',
        'Post during peak hours for better initial engagement'
      ]
    });

  } catch (error) {
    console.error('[Generate] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Generation failed' 
    }, { status: 500 });
  }
}
