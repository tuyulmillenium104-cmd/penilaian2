/**
 * LLM Analyzer Service - Internal Content Analysis
 * Provides LLM-like analysis for Rally content scoring
 * Port: 3030
 */

const PORT = 3030;

// Check if content is gibberish/low quality
function detectGibberish(content: string): {
  isGibberish: boolean;
  wordCount: number;
  realWordRatio: number;
  issues: string[];
} {
  const issues: string[] = [];
  const words = content.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Common English words for validation
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
    'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
    'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him',
    'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
    'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
    'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most',
    'us', 'is', 'are', 'was', 'were', 'been', 'being', 'has', 'had', 'did', 'does', 'doing', 'am', 'im',
    'crypto', 'web3', 'blockchain', 'twitter', 'x', 'project', 'community', 'token', 'defi', 'nft', 'airdrop',
    'love', 'great', 'amazing', 'awesome', 'thanks', 'thank', 'please', 'help', 'need', 'check', 'look',
    'nice', 'cool', 'wow', 'hey', 'hi', 'hello', 'yes', 'no', 'ok', 'okay'
  ]);
  
  // Count real words
  let realWordCount = 0;
  for (const word of words) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length >= 2 && (commonWords.has(cleanWord) || cleanWord.length > 5)) {
      realWordCount++;
    }
  }
  
  const realWordRatio = wordCount > 0 ? realWordCount / wordCount : 0;
  
  // Detect gibberish patterns
  const hasRepeatedChars = /^(.)\1+$/.test(content.replace(/\s/g, '')); // aaa, bbb
  const hasNoVowels = !/[aeiou]/i.test(content); // No vowels
  const isSingleWord = wordCount < 2 && content.length < 10;
  const isRandomChars = /^[a-z]{1,8}$/i.test(content.trim()) && !commonWords.has(content.trim().toLowerCase());
  
  const isGibberish = 
    wordCount < 2 ||
    realWordRatio < 0.2 ||
    hasRepeatedChars ||
    hasNoVowels ||
    isSingleWord ||
    isRandomChars;
  
  // Collect issues
  if (wordCount < 3) issues.push('too short');
  if (realWordRatio < 0.3) issues.push('mostly gibberish');
  if (hasNoVowels && wordCount < 3) issues.push('not real words');
  if (hasRepeatedChars) issues.push('repeated characters');
  
  return { isGibberish, wordCount, realWordRatio, issues };
}

// Advanced content analysis engine
class ContentAnalyzer {
  
  // AI writing patterns with weights
  private static AI_PATTERNS = [
    { pattern: /in today'?s?\s+(digital|crypto|blockchain|web3|modern|ever-?evolving)/i, weight: 0.4, name: 'in today\'s [field]' },
    { pattern: /harnessing\s+the\s+power\s+of/i, weight: 0.4, name: 'harnessing the power' },
    { pattern: /unlock\s+(the\s+)?potential/i, weight: 0.3, name: 'unlock potential' },
    { pattern: /seamless\s+experience/i, weight: 0.3, name: 'seamless experience' },
    { pattern: /game-?changing/i, weight: 0.25, name: 'game-changing' },
    { pattern: /cutting-?edge/i, weight: 0.25, name: 'cutting-edge' },
    { pattern: /paradigm\s+shift/i, weight: 0.35, name: 'paradigm shift' },
    { pattern: /in\s+conclusion[,\.]/i, weight: 0.4, name: 'in conclusion' },
    { pattern: /furthermore[,\.]/i, weight: 0.3, name: 'furthermore' },
    { pattern: /moreover[,\.]/i, weight: 0.3, name: 'moreover' },
    { pattern: /it\s+is\s+important\s+to\s+note/i, weight: 0.4, name: 'important to note' },
    { pattern: /best\s+practices/i, weight: 0.2, name: 'best practices' },
    { pattern: /comprehensive\s+guide/i, weight: 0.3, name: 'comprehensive guide' },
    { pattern: /deep\s+dive/i, weight: 0.2, name: 'deep dive' },
    { pattern: /revolutionary/i, weight: 0.25, name: 'revolutionary' },
    { pattern: /innovative\s+solution/i, weight: 0.3, name: 'innovative solution' },
    { pattern: /embark\s+on\s+a\s+journey/i, weight: 0.4, name: 'embark on a journey' },
    { pattern: /elevate\s+your/i, weight: 0.25, name: 'elevate your' },
    { pattern: /streamline\s+your/i, weight: 0.25, name: 'streamline your' },
    { pattern: /maximize\s+your/i, weight: 0.25, name: 'maximize your' },
    { pattern: /transform\s+(your|the)/i, weight: 0.25, name: 'transform' },
    { pattern: /leveraging?\s+(the\s+)?(power\s+of\s+)?(ai|blockchain|technology)/i, weight: 0.35, name: 'leverage AI/tech' },
    { pattern: /are\s+(you\s+)?(ready|looking)\s+to/i, weight: 0.2, name: 'are you ready' },
    { pattern: /imagine\s+(a\s+)?(world|future)/i, weight: 0.25, name: 'imagine a world' },
    { pattern: /picture\s+this/i, weight: 0.2, name: 'picture this' },
    { pattern: /let'?s?\s+(me\s+)?(tell|explain|show)/i, weight: 0.15, name: 'let me tell' },
    { pattern: /here'?s?\s+the\s+thing/i, weight: 0.2, name: 'here\'s the thing' },
  ];

  // Spam patterns
  private static SPAM_PATTERNS = [
    /click\s+here/i,
    /buy\s+now/i,
    /limited\s+time/i,
    /act\s+fast/i,
    /shocking/i,
    /doctors?\s+hate/i,
    /you\s+won'?t?\s+believe/i,
    /must\s+(see|read|try)/i,
    /exclusive\s+offer/i,
    /don'?t?\s+miss\s+out/i,
    /once\s+in\s+a\s+lifetime/i,
  ];

  // Engagement drivers
  private static ENGAGEMENT_DRIVERS = {
    questions: [/\?/g, 0.3],
    ctas: [/comment below|let me know|share your|what do you think|tell me|reply|dm me|follow|retweet|like if|thoughts\?/i, 0.5],
    numbers: [/\d+%|\d+\s*(million|billion|thousand|percent|x|times)/i, 0.3],
    mentions: [/@[\w]+/g, 0.1],
    threads: [/🧵|thread|🧵/i, 0.2],
    emojis: [/[\u{1F300}-\u{1F9FF}]/gu, 0.05],
  };

  // Analyze content alignment with campaign
  analyzeContentAlignment(content: string, context: string, rules: string): { score: number; reason: string } {
    const contentLower = content.toLowerCase();
    const contextLower = context.toLowerCase();
    const rulesLower = rules.toLowerCase();
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    
    // Extract brand mentions from context/rules
    const brandMentions = (contextLower.match(/@[\w]+/g) || []).concat(rulesLower.match(/@[\w]+/g) || []);
    const uniqueBrands = [...new Set(brandMentions)];
    
    // Also detect @mentions in content itself (they ARE brand mentions)
    const contentMentions = content.match(/@[\w]+/gi) || [];
    
    // Check for brand mentions in content
    let brandScore = 0;
    const foundBrands: string[] = [];
    
    // Check if any content mention matches context brands
    for (const mention of contentMentions) {
      brandScore += 0.6;
      foundBrands.push(mention);
    }
    
    // Also check for brand names without @
    for (const brand of uniqueBrands) {
      const brandName = brand.replace('@', '');
      if (contentLower.includes(brandName) && !foundBrands.includes(brand)) {
        brandScore += 0.5;
        foundBrands.push(brand);
      }
    }
    brandScore = Math.min(brandScore, 1);
    
    // Check topic alignment - look for relevant keywords
    const campaignKeywords = ['rally', 'campaign', 'reward', 'earn', 'crypto', 'web3', 'blockchain', 'defi', 'ai', 'content', 'creator', 'social', 'trading', 'app', 'project', 'great', 'amazing', 'love', 'best'];
    const matchedKeywords = campaignKeywords.filter(kw => contentLower.includes(kw));
    const topicScore = matchedKeywords.length >= 3 ? 1 : matchedKeywords.length >= 1 ? 0.5 : 0;
    
    // Give base score for meaningful content even without brand mentions
    // This is more realistic - Rally validators assess content quality, not just brand mentions
    let baseScore = 0;
    const positiveWords = ['great', 'amazing', 'awesome', 'love', 'best', 'good', 'nice', 'excellent', 'fantastic'];
    const hasPositive = positiveWords.some(w => contentLower.includes(w));
    if (hasPositive && wordCount >= 2) {
      baseScore = 0.5; // Some alignment for positive sentiment
    }
    
    // Combined score
    const totalScore = Math.min(brandScore + topicScore + baseScore, 2);
    
    // Generate reason
    let reason = '';
    if (foundBrands.length > 0) {
      reason = `Excellent alignment. Mentions ${foundBrands.slice(0, 2).join(', ')} and relevant topics.`;
    } else if (totalScore >= 1.5) {
      reason = `Good alignment with campaign themes and relevant discussion.`;
    } else if (totalScore >= 1) {
      reason = `Partial alignment. Content touches on campaign topics.`;
    } else if (totalScore >= 0.5) {
      reason = `Weak alignment. Could better address campaign requirements.`;
    } else {
      reason = `Content does not appear aligned with campaign objectives.`;
    }
    
    return { score: Math.round(totalScore * 10) / 10, reason };
  }

  // Analyze information accuracy
  analyzeInformationAccuracy(content: string): { score: number; reason: string } {
    const contentLower = content.toLowerCase();
    
    // Check for spam patterns
    for (const pattern of ContentAnalyzer.SPAM_PATTERNS) {
      if (pattern.test(content)) {
        return { score: 0, reason: `Contains suspicious patterns typical of spam or misleading content.` };
      }
    }
    
    // Check for credibility indicators
    const hasNumbers = /\d+%|\d+\s*(million|billion|thousand|percent)/i.test(content);
    const hasSources = /according to|reported|source|via|study|research|data/i.test(content);
    const hasSpecifics = /\$?\d+|\d+\s*(users|people|transactions|volume)/i.test(content);
    
    let score = 1.5; // Base score
    
    if (hasNumbers) score += 0.2;
    if (hasSources) score += 0.2;
    if (hasSpecifics) score += 0.1;
    
    score = Math.min(score, 2);
    
    let reason = 'Content appears accurate and trustworthy.';
    if (hasSources) reason = 'Content includes source references, adding credibility.';
    else if (hasNumbers) reason = 'Content includes specific data points.';
    
    return { score: Math.round(score * 10) / 10, reason };
  }

  // Analyze campaign compliance
  analyzeCampaignCompliance(content: string, rules: string): { score: number; reason: string } {
    const contentLower = content.toLowerCase();
    const rulesLower = rules.toLowerCase();
    
    let score = 2;
    const violations: string[] = [];
    const compliance: string[] = [];
    
    // Check required mentions
    const requiredMentions = rulesLower.match(/@[\w]+/g) || [];
    for (const mention of [...new Set(requiredMentions)]) {
      if (contentLower.includes(mention.replace('@', ''))) {
        compliance.push(`includes ${mention}`);
      } else {
        score -= 0.3;
        violations.push(`missing ${mention}`);
      }
    }
    
    // Check link requirement
    if (rulesLower.includes('link') || rulesLower.includes('referral')) {
      if (/https?:\/\/[^\s]+/.test(content)) {
        compliance.push('includes link');
      } else {
        score -= 0.3;
        violations.push('missing link');
      }
    }
    
    // Check hashtag requirements
    if (rulesLower.includes('no hashtag') && /#[\w]+/.test(content)) {
      score -= 0.3;
      violations.push('contains prohibited hashtags');
    }
    
    // Check post starting with mention
    if (rulesLower.includes('must not start with a mention')) {
      if (content.trim().startsWith('@')) {
        score = 0;
        violations.push('starts with mention (major violation)');
      }
    }
    
    score = Math.max(0, score);
    
    let reason = '';
    if (violations.length === 0) {
      reason = compliance.length > 0 
        ? `Fully compliant. ${compliance.slice(0, 2).join(', ')}.`
        : 'Content follows campaign rules.';
    } else {
      reason = `Issues: ${violations.slice(0, 2).join(', ')}.`;
    }
    
    return { score: Math.round(score * 10) / 10, reason };
  }

  // Analyze originality
  analyzeOriginality(content: string): { score: number; reason: string } {
    let penalty = 0;
    const detectedPatterns: string[] = [];
    
    // Check AI patterns
    for (const { pattern, weight, name } of ContentAnalyzer.AI_PATTERNS) {
      if (pattern.test(content)) {
        penalty += weight;
        detectedPatterns.push(name);
      }
    }
    
    // Check em dash overuse
    const emDashCount = (content.match(/—/g) || []).length;
    if (emDashCount > 2) {
      penalty += 0.1 * emDashCount;
      detectedPatterns.push('excessive em dashes');
    }
    
    // Check sentence uniformity
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 2) {
      const lengths = sentences.map(s => s.trim().split(/\s+/).length);
      const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const variance = lengths.reduce((sum, l) => sum + Math.pow(l - avgLength, 2), 0) / lengths.length;
      
      if (variance < 10 && avgLength > 12 && avgLength < 20) {
        penalty += 0.2;
        detectedPatterns.push('uniform sentence structure');
      }
    }
    
    // Check for personal voice indicators
    const personalIndicators = /i\s+(think|believe|learned|realized|discovered|found|noticed)|my\s+(experience|story|journey)|personally|imo|tbh/i;
    const hasPersonalVoice = personalIndicators.test(content);
    
    if (hasPersonalVoice) {
      penalty -= 0.3; // Bonus for personal voice
    }
    
    const score = Math.max(0, Math.min(2, 2 - penalty));
    
    let reason = '';
    if (detectedPatterns.length > 2) {
      reason = `AI-like patterns detected: ${detectedPatterns.slice(0, 3).join(', ')}. ${hasPersonalVoice ? 'Some personal voice present.' : ''}`;
    } else if (detectedPatterns.length > 0) {
      reason = `Minor AI patterns: ${detectedPatterns[0]}. ${hasPersonalVoice ? 'Good personal touch.' : ''}`;
    } else {
      reason = hasPersonalVoice 
        ? 'Original content with authentic personal voice.'
        : 'Content appears original and authentic.';
    }
    
    return { score: Math.round(score * 10) / 10, reason };
  }

  // Analyze engagement potential
  analyzeEngagementPotential(content: string): { score: number; reason: string } {
    let score = 3.0; // Base score (lowered from 3.5)
    const factors: string[] = [];
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    
    // Questions
    const questionCount = (content.match(/\?/g) || []).length;
    if (questionCount > 0) {
      score += Math.min(questionCount * 0.4, 1);
      factors.push(`${questionCount} question${questionCount > 1 ? 's' : ''}`);
    }
    
    // CTAs
    if (ContentAnalyzer.ENGAGEMENT_DRIVERS.ctas[0] instanceof RegExp) {
      if ((ContentAnalyzer.ENGAGEMENT_DRIVERS.ctas[0] as RegExp).test(content)) {
        score += 0.5;
        factors.push('call-to-action');
      }
    }
    
    // Numbers/data
    if ((ContentAnalyzer.ENGAGEMENT_DRIVERS.numbers[0] as RegExp).test(content)) {
      score += 0.3;
      factors.push('includes data');
    }
    
    // Length-based scoring (more strict)
    if (wordCount >= 25 && wordCount <= 200) {
      score += 0.3;
      factors.push('good length');
    } else if (wordCount >= 15 && wordCount < 25) {
      score += 0.1;
      factors.push('decent length');
    } else if (wordCount < 5) {
      score -= 1.5; // Harsher penalty for very short content
      factors.push('very short');
    } else if (wordCount < 10) {
      score -= 0.8;
      factors.push('too short');
    }
    
    // Thread indicator
    if (/🧵|thread/i.test(content)) {
      score += 0.3;
      factors.push('thread format');
    }
    
    // Formatting
    if (content.includes('\n')) {
      score += 0.2;
      factors.push('good formatting');
    }
    
    score = Math.max(0.5, Math.min(5, score));
    
    const reason = factors.length > 0 
      ? `Score: ${score.toFixed(1)}/5. ${factors.slice(0, 3).join(', ')}.`
      : `Score: ${score.toFixed(1)}/5. Average engagement potential.`;
    
    return { score: Math.round(score * 10) / 10, reason };
  }

  // Analyze technical quality
  analyzeTechnicalQuality(content: string): { score: number; reason: string } {
    let score = 4; // Base
    const issues: string[] = [];
    const positives: string[] = [];
    
    // Capitalization
    if (/^[A-Z]/.test(content)) {
      score += 0.2;
      positives.push('proper capitalization');
    } else {
      issues.push('missing capitalization');
      score -= 0.2;
    }
    
    // Punctuation
    if (/[.!?]$/.test(content.trim())) {
      score += 0.1;
      positives.push('proper punctuation');
    }
    
    // Excessive caps
    const capsRatio = (content.match(/[A-Z]/g) || []).length / Math.max(content.length, 1);
    if (capsRatio > 0.5) {
      issues.push('excessive caps');
      score -= 0.5;
    }
    
    // Excessive punctuation
    const exclamations = (content.match(/!/g) || []).length;
    if (exclamations > 3) {
      issues.push('too many exclamations');
      score -= 0.3;
    }
    
    // Line breaks for readability
    if (content.includes('\n\n') || (content.includes('\n') && content.split('\n').length > 2)) {
      score += 0.2;
      positives.push('good formatting');
    }
    
    // Spelling check
    const misspellings = ['teh ', ' ur ', ' u r ', 'dont ', 'wont ', 'cant ', 'shouldnt '];
    if (misspellings.some(m => content.toLowerCase().includes(m))) {
      issues.push('possible spelling issues');
      score -= 0.3;
    }
    
    score = Math.max(0, Math.min(5, score));
    
    const reason = issues.length > 0 
      ? `Issues: ${issues.join(', ')}.`
      : positives.length > 0 
      ? `${positives.join(', ')}.`
      : 'Standard technical quality.';
    
    return { score: Math.round(score * 10) / 10, reason };
  }

  // Analyze reply quality potential
  analyzeReplyQuality(content: string): { score: number; reason: string } {
    let score = 3.5;
    const factors: string[] = [];
    
    // Discussion prompts
    const discussionPatterns = /what do you think|share your thoughts|agree or disagree|opinion on|thoughts\?|discuss|let'?s?\s+talk|comment below/i;
    if (discussionPatterns.test(content)) {
      score += 1;
      factors.push('encourages discussion');
    }
    
    // Controversial topics
    if (/unpopular opinion|hot take|controversial|debate|vs\.?$/i.test(content)) {
      score += 0.5;
      factors.push('debatable topic');
    }
    
    // Educational value
    if (/how to|guide|tutorial|learn|explained|tips|steps/i.test(content)) {
      score += 0.5;
      factors.push('educational');
    }
    
    // Personal story
    if (/my experience|i learned|i realized|i discovered|my story/i.test(content)) {
      score += 0.4;
      factors.push('personal touch');
    }
    
    // Questions
    const questionCount = (content.match(/\?/g) || []).length;
    score += Math.min(questionCount * 0.15, 0.5);
    
    // Spam indicators
    if (/follow for more|like and subscribe|check my bio|link in bio|promo code/i.test(content)) {
      score -= 1;
      factors.push('spam-like elements');
    }
    
    score = Math.max(0, Math.min(5, score));
    
    const reason = factors.length > 0 
      ? `${factors.slice(0, 3).join(', ')}.`
      : 'Standard reply potential.';
    
    return { score: Math.round(score * 10) / 10, reason };
  }

  // Generate overall assessment
  generateAssessment(gates: any, quality: any): string {
    const gateSum = Object.values(gates).reduce((sum: number, g: any) => sum + g.score, 0);
    const qualitySum = Object.values(quality).reduce((sum: number, q: any) => sum + q.score, 0);
    
    if (gateSum >= 7 && qualitySum >= 13) {
      return 'Exceptional content that demonstrates strong alignment with campaign objectives, authentic voice, and high engagement potential. Ready for submission.';
    } else if (gateSum >= 5 && qualitySum >= 10) {
      return 'Good content with solid campaign alignment and engagement potential. Consider the suggestions below to boost your score further.';
    } else if (gateSum >= 4 && qualitySum >= 8) {
      return 'Content meets basic requirements but has room for improvement. Focus on authenticity and engagement drivers.';
    } else {
      return 'Content needs significant improvement to meet Rally standards. Review the suggestions and consider a rewrite.';
    }
  }

  // Generate improvement suggestions
  generateSuggestions(gates: any, quality: any, content: string): string[] {
    const suggestions: string[] = [];
    
    if (gates.contentAlignment.score < 1.5) {
      suggestions.push('Add more campaign-specific keywords and directly address the campaign topic');
    }
    
    if (gates.originality.score < 1.5) {
      suggestions.push('Remove AI-style phrases and add your personal perspective or experience');
    }
    
    if (gates.campaignCompliance.score < 2) {
      suggestions.push('Ensure all campaign requirements are met (mentions, links, hashtags)');
    }
    
    if (quality.engagementPotential.score < 4) {
      suggestions.push('Add questions or calls-to-action to boost engagement');
    }
    
    if (quality.technicalQuality.score < 4) {
      suggestions.push('Improve formatting and writing quality for better readability');
    }
    
    if (quality.replyQuality.score < 4) {
      suggestions.push('Add discussion prompts to encourage quality replies');
    }
    
    // Check for missing elements
    if (!/\?/.test(content)) {
      suggestions.push('Consider adding a question to spark discussion');
    }
    
    if (!/@[\w]+/.test(content)) {
      suggestions.push('Mention relevant accounts to increase visibility');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('Great content! Consider testing different hooks for even better engagement');
    }
    
    return suggestions.slice(0, 5);
  }

  // Main analysis function
  analyze(content: string, context: string, rules: string) {
    // First check for gibberish/low quality content
    const gibberishCheck = detectGibberish(content);
    
    if (gibberishCheck.isGibberish) {
      // Return very low scores for gibberish content
      return {
        gates: {
          contentAlignment: { 
            score: 0, 
            reason: 'Gibberish content - no meaningful alignment possible' 
          },
          informationAccuracy: { 
            score: 0, 
            reason: 'Cannot verify meaningless content' 
          },
          campaignCompliance: { 
            score: 0.5, 
            reason: 'Content does not meet minimum quality requirements' 
          },
          originality: { 
            score: 0.5, 
            reason: 'Not original - appears to be random text' 
          }
        },
        quality: {
          engagementPotential: { 
            score: 0.5, 
            reason: 'No engagement potential - content is not meaningful' 
          },
          technicalQuality: { 
            score: 0.5, 
            reason: 'Very low quality - ' + (gibberishCheck.issues.join(', ') || 'not proper content') 
          },
          replyQuality: { 
            score: 0.5, 
            reason: 'Cannot generate quality replies to gibberish' 
          }
        },
        overallAssessment: `Content appears to be gibberish or very low quality (${gibberishCheck.issues.join(', ') || 'not meaningful'}). Please provide real, meaningful content.`,
        improvementSuggestions: [
          'Write actual content with real words',
          'Include complete sentences',
          'Make sure content is relevant to the campaign'
        ]
      };
    }
    
    const gates = {
      contentAlignment: this.analyzeContentAlignment(content, context, rules),
      informationAccuracy: this.analyzeInformationAccuracy(content),
      campaignCompliance: this.analyzeCampaignCompliance(content, rules),
      originality: this.analyzeOriginality(content)
    };
    
    const quality = {
      engagementPotential: this.analyzeEngagementPotential(content),
      technicalQuality: this.analyzeTechnicalQuality(content),
      replyQuality: this.analyzeReplyQuality(content)
    };
    
    return {
      gates,
      quality,
      overallAssessment: this.generateAssessment(gates, quality),
      improvementSuggestions: this.generateSuggestions(gates, quality, content)
    };
  }
}

const analyzer = new ContentAnalyzer();

// HTTP Server
const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Health check
    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', service: 'llm-analyzer', port: PORT });
    }
    
    // Analyze endpoint
    if (url.pathname === '/analyze' && req.method === 'POST') {
      try {
        const body = await req.json();
        const { content, context, rules } = body;
        
        if (!content) {
          return Response.json({ error: 'Content required' }, { status: 400, headers: corsHeaders });
        }
        
        const result = analyzer.analyze(content, context || '', rules || '');
        
        return Response.json({
          success: true,
          ...result
        }, { headers: corsHeaders });
      } catch (e) {
        return Response.json({ error: String(e) }, { status: 500, headers: corsHeaders });
      }
    }
    
    // Chat completions compatible endpoint (for drop-in replacement)
    if (url.pathname === '/v1/chat/completions' && req.method === 'POST') {
      try {
        const body = await req.json();
        const messages = body.messages || [];
        
        // Extract content from last user message
        let content = '';
        let context = '';
        let rules = '';
        
        for (const msg of messages) {
          if (msg.role === 'user') {
            const msgContent = msg.content || '';
            if (msgContent.includes('CONTENT:') || msgContent.includes('CONTEXT:')) {
              // Parse structured prompt
              const contentMatch = msgContent.match(/CONTENT:\s*([\s\S]*?)(?=CONTEXT:|RULES:|$)/i);
              const contextMatch = msgContent.match(/CONTEXT:\s*([\s\S]*?)(?=RULES:|CONTENT:|$)/i);
              const rulesMatch = msgContent.match(/RULES:\s*([\s\S]*?)(?=CONTEXT:|CONTENT:|Reply|$)/i);
              
              if (contentMatch) content = contentMatch[1].trim();
              if (contextMatch) context = contextMatch[1].trim();
              if (rulesMatch) rules = rulesMatch[1].trim();
            } else {
              content = msgContent;
            }
          }
        }
        
        if (!content) {
          return Response.json({ error: 'No content to analyze' }, { status: 400, headers: corsHeaders });
        }
        
        const result = analyzer.analyze(content, context, rules);
        
        // Format as chat completion response
        const responseContent = JSON.stringify({
          gates: result.gates,
          quality: result.quality,
          overallAssessment: result.overallAssessment,
          improvementSuggestions: result.improvementSuggestions
        });
        
        return Response.json({
          id: `analysis-${Date.now()}`,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: 'rally-validator-v1',
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: responseContent
            },
            finish_reason: 'stop'
          }]
        }, { headers: corsHeaders });
      } catch (e) {
        return Response.json({ error: String(e) }, { status: 500, headers: corsHeaders });
      }
    }
    
    return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
  }
});

console.log(`🤖 LLM Analyzer Service running on port ${PORT}`);
console.log(`📍 Endpoints: /health, /analyze, /v1/chat/completions`);
