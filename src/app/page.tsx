'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Zap, FileText, Save, Trash2, Copy, Download, 
  Plus, X, Trophy, Target, AlertTriangle, CheckCircle2, 
  Info, TrendingUp, Percent, Award, Sparkles, RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

// Types
interface CampaignData {
  campaignName: string
  projectHandle: string
  platform: string
  contentType: string
  campaignDescription: string
  campaignRules: string
  campaignStyle: string
  requiredDisclaimer: string
  requiredHashtags: string
  requiredMentions: string
  formatRequirements: string
  forbiddenElements: string
  knowledgeBase: string
}

interface ContentItem {
  id: string
  label: string
  content: string
}

type PromptMode = 'rally' | 'hybrid' | 'creative'
type DistributionCurve = 'balanced' | 'default' | 'extreme'

// Mode configurations
const MODE_CONFIG = {
  rally: {
    label: 'Rally Optimized',
    description: 'Maximum scoring potential based on Rally.fun formula',
    color: 'from-amber-600 to-orange-500',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  hybrid: {
    label: 'Balanced',
    description: 'Balance between scoring and authentic voice',
    color: 'from-emerald-600 to-teal-500',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  creative: {
    label: 'Pure Creative',
    description: 'Full creative freedom, authenticity-first',
    color: 'from-rose-600 to-pink-500',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  }
}

const DISTRIBUTION_INFO = {
  balanced: { alpha: 1, top10: '25%', top1: '5%', description: 'Fair distribution, moderate competition' },
  default: { alpha: 3, top10: '90%', top1: '50%', description: 'Winner-takes-most, HIGH competition' },
  extreme: { alpha: 8, top10: '99%', top1: '90%', description: 'Extreme winner-takes-all' }
}

// Helper function to generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9)

// Helper to load saved data from localStorage
const loadSavedData = () => {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem('rally_campaign_v17')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const defaultCampaignData: CampaignData = {
  campaignName: '',
  projectHandle: '',
  platform: '',
  contentType: 'joke',
  campaignDescription: '',
  campaignRules: '',
  campaignStyle: '',
  requiredDisclaimer: '',
  requiredHashtags: '',
  requiredMentions: '',
  formatRequirements: '',
  forbiddenElements: '',
  knowledgeBase: ''
}

const defaultContentItems: ContentItem[] = [
  { id: generateId(), label: 'Content #1', content: '' }
]

export default function Home() {
  // State
  const [currentTab, setCurrentTab] = useState('campaign')
  const [promptMode, setPromptMode] = useState<PromptMode>('rally')
  const [distributionCurve, setDistributionCurve] = useState<DistributionCurve>('default')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [generatedEvalPrompt, setGeneratedEvalPrompt] = useState('')
  
  // Campaign data with lazy initialization
  const [campaignData, setCampaignData] = useState<CampaignData>(() => {
    const saved = loadSavedData()
    return saved?.campaign || defaultCampaignData
  })

  // Multi-content for evaluation
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
    const saved = loadSavedData()
    return (saved?.contentItems?.length ? saved.contentItems : defaultContentItems)
  })

  // Prompt settings
  const [includeScoringFormula, setIncludeScoringFormula] = useState(true)
  const [includeEngagementTips, setIncludeEngagementTips] = useState(true)
  const [additionalInstructions, setAdditionalInstructions] = useState('')

  // Evaluation settings
  const [evalFormat, setEvalFormat] = useState('detailed')
  const [includeImprovement, setIncludeImprovement] = useState(true)
  const [determineWinner, setDetermineWinner] = useState(true)
  const [includeCombinedGeneration, setIncludeCombinedGeneration] = useState(true)

  // Update campaign field
  const updateCampaign = (field: keyof CampaignData, value: string) => {
    setCampaignData(prev => ({ ...prev, [field]: value }))
  }

  // Add new content item
  const addContentItem = () => {
    setContentItems(prev => [
      ...prev,
      { id: generateId(), label: `Content #${prev.length + 1}`, content: '' }
    ])
  }

  // Remove content item
  const removeContentItem = (id: string) => {
    if (contentItems.length <= 1) {
      toast.error('Minimal 1 konten harus ada')
      return
    }
    setContentItems(prev => prev.filter(item => item.id !== id))
  }

  // Update content item
  const updateContentItem = (id: string, content: string) => {
    setContentItems(prev => prev.map(item => 
      item.id === id ? { ...item, content } : item
    ))
  }

  // Save campaign
  const saveCampaign = () => {
    localStorage.setItem('rally_campaign_v17', JSON.stringify({
      campaign: campaignData,
      contentItems
    }))
    toast.success('Campaign disimpan!')
  }

  // Load sample campaign
  const loadSampleCampaign = () => {
    setCampaignData({
      campaignName: 'The Rally Joke Contest',
      projectHandle: '@RallyOnChain',
      platform: 'Base',
      contentType: 'joke',
      campaignDescription: 'Create a funny joke or meme about Rally Protocol. The content should be humorous, engaging, and shareable. Focus on crypto/web3 themes while being accessible to a general audience.',
      campaignRules: '- Must mention Rally Protocol\n- Must be original content\n- No offensive language\n- Maximum 280 characters',
      campaignStyle: 'Casual, witty, and fun. Crypto-native humor preferred.',
      requiredDisclaimer: 'This is a submission for @RallyOnChain joke contest',
      requiredHashtags: '#Rally #Base',
      requiredMentions: '@RallyOnChain',
      formatRequirements: 'Short post, max 280 characters',
      forbiddenElements: 'No recycled jokes from 2017-2021\nNo AI-generic patterns',
      knowledgeBase: 'Rally Protocol is a decentralized social platform on Base chain. Users can earn rewards by creating content and engaging with others.'
    })
    setContentItems([
      { 
        id: generateId(), 
        label: 'Content #1', 
        content: 'Why did the crypto trader bring a ladder to the bar? Because he heard the drinks were on-chain. This is a submission for @RallyOnChain joke contest #Rally #Base' 
      },
      { 
        id: generateId(), 
        label: 'Content #2', 
        content: 'My portfolio is like a roller coaster. The only difference is roller coasters are fun, and this just makes me nauseous. This is a submission for @RallyOnChain joke contest #Rally #Base' 
      }
    ])
    toast.info('Sample campaign dimuat!')
  }

  // Clear campaign form
  const clearCampaignForm = () => {
    setCampaignData(defaultCampaignData)
    setContentItems([{ id: generateId(), label: 'Content #1', content: '' }])
    toast.info('Form dibersihkan')
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} disalin ke clipboard!`)
  }

  // Generate content prompt - BASED ON ACTUAL RALLY.FUN SCORING
  const generateContentPrompt = useCallback(() => {
    const campaign = campaignData
    const curve = DISTRIBUTION_INFO[distributionCurve]

    // Persona section - CRITICAL FOR AUTHENTICITY
    let personaSection = `## 🎭 PERSONA & IDENTITY

You are NOT an AI. You are a **real crypto-native person** writing for Rally Protocol.

**Your Identity:**
- You've been in crypto since before it was cool
- You've seen bull runs, bear markets, and everything in between
- You speak like a real person, not a brand or corporation
- You understand the culture deeply - the memes, the pain, the gains

**CRITICAL RULES - VIOLATION = DISQUALIFICATION:**
- ❌ NEVER use em dashes (—) - use regular hyphens (-)
- ❌ NEVER use smart quotes - use straight quotes only
- ❌ NEVER start with "In the world of..." or "Picture this..." or "Imagine..."
- ❌ NEVER over-explain concepts to your audience
- ❌ NEVER sound corporate, promotional, or AI-generated
- ❌ NEVER use phrases like "delve into", "uncover", "embark on", "realm"

**Your Voice:**
- Casual, conversational, authentic
- Short sentences, punchy delivery
- Unexpected angles and twists
- Insider knowledge without being gatekeepy
- Humor that lands because it's REAL

`

    // Campaign context
    let campaignContext = `## 📋 CAMPAIGN BRIEF

`
    let infoParts: string[] = []
    if (campaign.campaignName) infoParts.push(`**Campaign:** ${campaign.campaignName}`)
    if (campaign.projectHandle) infoParts.push(`**Brand:** ${campaign.projectHandle}`)
    if (campaign.platform) infoParts.push(`**Platform:** ${campaign.platform}`)
    if (campaign.contentType) infoParts.push(`**Type:** ${campaign.contentType}`)
    if (infoParts.length > 0) {
      campaignContext += infoParts.join(' | ') + '\n\n'
    }
    
    if (campaign.campaignDescription) {
      campaignContext += `### What They Want:\n${campaign.campaignDescription}\n\n`
    }
    
    if (campaign.campaignRules) {
      campaignContext += `### Rules (MUST FOLLOW):\n${campaign.campaignRules}\n\n`
    }
    
    if (campaign.campaignStyle) {
      campaignContext += `### Style:\n${campaign.campaignStyle}\n\n`
    }
    
    if (campaign.knowledgeBase) {
      campaignContext += `### Context You Should Know:\n${campaign.knowledgeBase}\n\n`
    }

    // MANDATORY requirements - CRITICAL
    const hasRequirements = campaign.requiredDisclaimer || campaign.requiredHashtags || campaign.requiredMentions || campaign.formatRequirements || campaign.forbiddenElements
    
    if (hasRequirements) {
      campaignContext += `---\n\n## ⚠️ MANDATORY ELEMENTS (EXACT MATCH REQUIRED)\n\n`
      
      if (campaign.requiredDisclaimer) {
        campaignContext += `### DISCLAIMER (copy EXACTLY):\n\`\`\`\n${campaign.requiredDisclaimer}\n\`\`\`\n\n`
      }
      
      if (campaign.requiredHashtags) {
        campaignContext += `### HASHTAGS (include ALL): ${campaign.requiredHashtags}\n\n`
      }
      
      if (campaign.requiredMentions) {
        campaignContext += `### MENTIONS (include ALL): ${campaign.requiredMentions}\n\n`
      }
      
      if (campaign.formatRequirements) {
        campaignContext += `### FORMAT: ${campaign.formatRequirements}\n\n`
      }
      
      campaignContext += `### FORBIDDEN:\n- Em dashes (—)\n- Smart quotes\n- AI-generic patterns\n`
      if (campaign.forbiddenElements) {
        campaign.forbiddenElements.split('\n').forEach(e => {
          if (e.trim()) campaignContext += `- ${e.trim()}\n`
        })
      }
      campaignContext += '\n'
    }
    
    campaignContext += '---\n\n'

    // Rally Scoring System - CORRECTED VERSION
    let scoringSection = ''
    
    if (includeScoringFormula) {
      scoringSection = `## 📊 RALLY.FUN SCORING SYSTEM (REAL FORMULA)

### 🚪 FOUR GATES (0-2 each) - ALL MUST PASS

**⚠️ ANY gate = 0 means 0.5x multiplier (BASICALLY DISQUALIFIED)**

| Gate | What It Means | How to Score 2/2 |
|------|---------------|------------------|
| **Content Alignment** | Is this about the campaign topic? | Stay 100% on-topic, no tangents |
| **Information Accuracy** | Is everything true? | Only state facts you know are correct |
| **Campaign Compliance** | Did you follow ALL rules? | Include EVERY required element EXACTLY |
| **Originality & Authenticity** | Does it feel HUMAN? | Write like a real person, avoid AI patterns |

**Gate Multiplier Formula:**
\`\`\`
g_star = average of 4 gates
M_gate = 1 + 0.5 × (g_star - 1)

Range: 1.0x (all gates = 1) to 1.5x (all gates = 2)
If ANY gate = 0: M_gate = 0.5x (PENALTY)
\`\`\`

---

### ⭐ TWO QUALITY METRICS (0-5 each)

| Metric | What It Measures | How to Score 5/5 |
|--------|------------------|------------------|
| **Engagement Potential** | Will people engage? | Hook in first 3 words, emotional resonance, shareable |
| **Technical Quality** | Is it well-written? | Clean grammar, good formatting, no errors |

**Why These Matter:**
- Quality Score = (Engagement + Technical) / 5 (max 2.0)
- This is multiplied by your Gate Multiplier
- High gates + high quality = maximum points

---

### 📈 ENGAGEMENT METRICS (Dynamic)

These are measured AFTER posting - you can't control them directly, but you can optimize:

| Metric | How to Maximize |
|--------|-----------------|
| **Retweets** | Be insightful, funny, or breaking news |
| **Likes** | Emotional resonance, relatable content |
| **Replies** | Ask questions, be controversial (within bounds) |
| **Quality of Replies** | Create meaningful discussion |
| **Followers of Repliers** | Attract engagement from reputable accounts |

**Pro Tip:** Rally has a "Refresh Engagement" feature - your engagement can be measured multiple times over the campaign period!

---

### 🎯 DISTRIBUTION CURVE: ${distributionCurve.toUpperCase()} (α = ${curve.alpha})

| Stat | Value |
|------|-------|
| Top 10% gets | **${curve.top10}** of rewards |
| Top 1% gets | **${curve.top1}** of rewards |

${distributionCurve === 'default' || distributionCurve === 'extreme' ? 
`⚠️ **HIGH COMPETITION:** In this mode, if you're not in the top 10%, you get almost nothing. Quality is NON-NEGOTIABLE.` : 
`This mode has fairer distribution. Consistent quality matters more than viral hits.`}

---

`
    }

    // Mode-specific instructions
    let modeInstructions = ''
    if (promptMode === 'rally') {
      modeInstructions = `## 🎯 STRATEGY: RALLY OPTIMIZED

**Your Goal:** Maximum Campaign Points through perfect execution.

**Priority Order:**
1. **FIRST:** Pass all 4 gates with score 2 - this is NON-NEGOTIABLE
2. **SECOND:** Maximize Engagement Potential (hook, emotion, shareability)
3. **THIRD:** Perfect Technical Quality (clean, error-free)
4. **FOURTH:** Include engagement triggers (questions, controversy, insights)

**Content Focus:**
- Lead with your strongest hook
- Keep it punchy and memorable
- End with engagement catalyst (question, call-to-action, or punchline)
- Include ALL required elements EXACTLY as specified

`
    } else if (promptMode === 'hybrid') {
      modeInstructions = `## 🎯 STRATEGY: BALANCED

**Your Goal:** Score well while maintaining authentic voice.

**Approach:**
- Pass all gates (required)
- Write authentically - your real voice
- Don't sacrifice personality for points
- Quality + authenticity = sustainable success

**Remember:** Content that feels forced will score low on Originality gate anyway.

`
    } else {
      modeInstructions = `## 🎯 STRATEGY: PURE CREATIVE

**Your Goal:** Create the most engaging, authentic content possible.

**Approach:**
- Write what YOU would want to read
- Ignore formulaic approaches
- Let your unique voice shine
- Trust that authenticity scores better than optimization

**Note:** You still need to pass gates and include required elements.

`
    }

    // Engagement tips
    let engagementSection = ''
    if (includeEngagementTips) {
      engagementSection = `## 💡 ENGAGEMENT OPTIMIZATION TIPS

### Hooks That Work:
- Unexpected statement: "Nobody talks about..."
- Counter-intuitive take: "The best traders I know..."
- Insider insight: "Here's what whales don't want you to know"
- Relatable pain: "POV: you checked your portfolio at 3am"
- Question: "Why does everyone ignore..."

### Engagement Triggers:
- Ask a genuine question at the end
- Make a bold (but defensible) claim
- Share an unpopular opinion
- Use pattern interrupt (unexpected twist)

### What Kills Engagement:
- Generic AI opening ("In today's...")
- Over-explaining
- Corporate speak
- No clear point
- Missing required elements (disqualified)

### Format Tips:
- Keep it SHORT (under 280 chars for Twitter/X)
- Use line breaks for readability
- Put hashtags at the end
- Front-load your hook

`
    }

    // Examples
    let examplesSection = `## 📝 EXAMPLES

### ✅ GOOD (Passes all gates, high quality):

\`\`\`
Why did the crypto trader bring a ladder to the bar?
Because he heard the drinks were on-chain.

This is a submission for @RallyOnChain joke contest #Rally #Base
\`\`\`

**Why it works:**
- Unexpected punchline (Engagement = high)
- Crypto-native humor (Authenticity = high)
- All required elements present (Compliance = 2)
- Short, clean, punchy (Technical = high)

### ❌ BAD (Fails authenticity gate):

\`\`\`
In the exciting world of cryptocurrency, we often find ourselves 
pondering the future of decentralized finance. Rally Protocol 
is revolutionizing how we think about social engagement with 
their innovative approach to content creation...

#Rally #Base
\`\`\`

**Why it fails:**
- Generic AI opening (Originality = 0)
- No punchline or point (Engagement = low)
- Missing disclaimer (Compliance = 0)
- Corporate tone (Authenticity = 0)
- Over-explaining (Technical = low)

---

`

    // Additional instructions
    let additionalSection = ''
    if (additionalInstructions) {
      additionalSection = `## 📌 ADDITIONAL INSTRUCTIONS

${additionalInstructions}

---
`
    }

    // Output format
    let outputFormat = `## 📤 OUTPUT

Write ONLY the final content. No explanations, no commentary, no analysis.
Just the content ready to copy-paste and post.

`

    // Combine all parts
    const prompt = `# RALLY CONTENT GENERATION PROMPT v1.7
## Based on ACTUAL Rally.fun Scoring System

---

${personaSection}${campaignContext}${scoringSection}${modeInstructions}${engagementSection}${examplesSection}${additionalSection}${outputFormat}`

    setGeneratedPrompt(prompt)
    toast.success('Prompt v1.7 berhasil dibuat!')
  }, [campaignData, promptMode, distributionCurve, includeScoringFormula, includeEngagementTips, additionalInstructions])

  // Generate evaluation prompt
  const generateEvaluationPrompt = useCallback(() => {
    const validContents = contentItems.filter(item => item.content.trim())
    
    if (validContents.length === 0) {
      toast.error('Tambahkan minimal 1 konten untuk evaluasi')
      return
    }

    const campaign = campaignData

    let evalPrompt = `# RALLY CONTENT EVALUATION PROMPT v1.7
## Based on ACTUAL Rally.fun Scoring System

---

## ⚠️ EVALUATION PRINCIPLES

**This evaluation MUST be:**
- **HONEST** - No sugar-coating
- **STRICT** - Apply criteria rigorously
- **OBJECTIVE** - Score based on evidence, not feelings

**DO NOT:**
- Inflate scores to be "nice"
- Give partial credit where none is due
- Ignore violations

---

## 📋 CAMPAIGN CONTEXT

`
    let infoParts: string[] = []
    if (campaign.campaignName) infoParts.push(`**Campaign:** ${campaign.campaignName}`)
    if (campaign.projectHandle) infoParts.push(`**Brand:** ${campaign.projectHandle}`)
    if (campaign.platform) infoParts.push(`**Platform:** ${campaign.platform}`)
    if (campaign.contentType) infoParts.push(`**Type:** ${campaign.contentType}`)
    if (infoParts.length > 0) {
      evalPrompt += infoParts.join(' | ') + '\n\n'
    }
    
    if (campaign.campaignDescription) {
      evalPrompt += `### Description:\n${campaign.campaignDescription}\n\n`
    }
    
    if (campaign.campaignRules) {
      evalPrompt += `### Rules:\n${campaign.campaignRules}\n\n`
    }

    // Required elements
    const hasRequired = campaign.requiredDisclaimer || campaign.requiredHashtags || campaign.requiredMentions
    if (hasRequired) {
      evalPrompt += `### Required Elements:\n`
      if (campaign.requiredDisclaimer) evalPrompt += `- Disclaimer: "${campaign.requiredDisclaimer}"\n`
      if (campaign.requiredHashtags) evalPrompt += `- Hashtags: ${campaign.requiredHashtags}\n`
      if (campaign.requiredMentions) evalPrompt += `- Mentions: ${campaign.requiredMentions}\n`
      evalPrompt += '\n'
    }

    // Forbidden
    evalPrompt += `### Forbidden:\n- Em dashes (—)\n- Smart quotes\n- AI-generic patterns\n`
    if (campaign.forbiddenElements) {
      campaign.forbiddenElements.split('\n').forEach(e => {
        if (e.trim()) evalPrompt += `- ${e.trim()}\n`
      })
    }
    evalPrompt += '\n---\n\n'

    // Contents to evaluate
    evalPrompt += `## 📝 CONTENTS TO EVALUATE (${validContents.length} total)\n\n`
    
    validContents.forEach((item, index) => {
      evalPrompt += `### Content #${index + 1}:\n\`\`\`\n${item.content}\n\`\`\`\n\n`
    })

    evalPrompt += '---\n\n'

    // Evaluation criteria - CORRECTED
    evalPrompt += `## 📊 EVALUATION CRITERIA (REAL RALLY.FUN SYSTEM)

### 🚪 1. FOUR GATES (0-2 each) - CRITICAL

**⚠️ ANY gate = 0 → 0.5x multiplier (PENALTY)**

| Gate | 0 (FAIL) | 1 (PARTIAL) | 2 (PASS) |
|------|----------|-------------|----------|
| **Content Alignment** | Off-topic | Partially related | Perfectly aligned |
| **Information Accuracy** | Contains false info | Minor inaccuracies | 100% accurate |
| **Campaign Compliance** | Missing requirements | Minor deviations | All requirements met |
| **Originality & Authenticity** | Generic AI/Recycled | Some originality | Feels HUMAN-written |

**Gate Multiplier:**
\`\`\`
g_star = (G1 + G2 + G3 + G4) / 4
M_gate = 1 + 0.5 × (g_star - 1)  [range: 0.5 - 1.5]
\`\`\`

---

### ⭐ 2. QUALITY METRICS (0-5 each)

| Metric | 0-1 (Poor) | 2-3 (Average) | 4-5 (Excellent) |
|--------|------------|---------------|-----------------|
| **Engagement Potential** | No hook, boring | Some interest | Viral potential, strong hook |
| **Technical Quality** | Errors, messy | Readable | Polished, professional |

**Quality Score = (Engagement + Technical) / 5** (max 2.0)

---

### 🧮 SCORING FORMULA

\`\`\`
Campaign Points = M_gate × Quality_Score × 100

Maximum possible: 1.5 × 2.0 × 100 = 300 points (before engagement)
\`\`\`

---

`

    // Winner determination
    if (determineWinner && validContents.length > 1) {
      evalPrompt += `## 🏆 WINNER DETERMINATION

**Compare all ${validContents.length} contents:**

1. Calculate Campaign Points for each
2. Rank from highest to lowest
3. Identify winner with reasoning
4. Explain why others lost

**Analysis Required:**
- Gate scores comparison
- Quality metrics comparison
- Why winner wins
- What losers need to improve

---

`
    }

    // Combined generation
    if (includeCombinedGeneration) {
      evalPrompt += `## 🌟 COMBINED CONTENT GENERATION

**After evaluation, generate SUPERIOR content by:**

1. Taking the BEST elements from each submission
2. Fixing ALL identified issues
3. Ensuring ALL gates pass with 2/2
4. Maximizing both quality metrics
5. Making it feel AUTHENTIC and HUMAN

**Output the improved content at the end.**

---

`
    }

    // Improvement suggestions
    if (includeImprovement) {
      evalPrompt += `## 📈 IMPROVEMENT SUGGESTIONS

**For EACH content, provide:**
1. Specific issues identified
2. Concrete improvement suggestions
3. A revised version

---

`
    }

    // Output format
    if (evalFormat === 'json') {
      evalPrompt += `## 📤 OUTPUT FORMAT (JSON)

\`\`\`json
{
  "contents": [
    {
      "id": 1,
      "gates": {
        "contentAlignment": { "score": 0-2, "feedback": "..." },
        "informationAccuracy": { "score": 0-2, "feedback": "..." },
        "campaignCompliance": { "score": 0-2, "feedback": "..." },
        "originalityAuthenticity": { "score": 0-2, "feedback": "..." }
      },
      "quality": {
        "engagementPotential": { "score": 0-5, "feedback": "..." },
        "technicalQuality": { "score": 0-5, "feedback": "..." }
      },
      "gateMultiplier": number,
      "qualityScore": number,
      "campaignPoints": number,
      "rank": number
    }
  ],
  "winner": { "id": number, "reason": "..." },
  "combinedContent": "..."
}
\`\`\`
`
    } else {
      evalPrompt += `## 📤 OUTPUT FORMAT

Provide detailed evaluation with:

1. **Per-Content Analysis:**
   - Gate scores (0-2 each) with reasoning
   - Quality scores (0-5 each) with reasoning
   - Gate Multiplier calculation
   - Final Campaign Points

2. **Ranking** (if multiple contents)

3. **Winner Analysis** (if multiple)

4. **Improvement Suggestions**

5. **Combined Superior Content**
`
    }

    setGeneratedEvalPrompt(evalPrompt)
    toast.success('Evaluation prompt v1.7 berhasil dibuat!')
  }, [contentItems, campaignData, evalFormat, determineWinner, includeCombinedGeneration, includeImprovement])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Rally Scoring Generator</h1>
                <p className="text-xs text-gray-400">v1.7 - Based on ACTUAL Rally.fun Formula</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={MODE_CONFIG[promptMode].badge}>
                {MODE_CONFIG[promptMode].label}
              </Badge>
              <a
                href="/download/rally-scoring-v1.7"
                download
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download HTML
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="campaign" className="data-[state=active]:bg-amber-600">
              <FileText className="w-4 h-4 mr-2" />
              Campaign
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-amber-600">
              <Zap className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="generate" className="data-[state=active]:bg-amber-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="evaluate" className="data-[state=active]:bg-amber-600">
              <Target className="w-4 h-4 mr-2" />
              Evaluate
            </TabsTrigger>
          </TabsList>

          {/* Campaign Tab */}
          <TabsContent value="campaign" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-500" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Campaign Name</Label>
                    <Input
                      value={campaignData.campaignName}
                      onChange={(e) => updateCampaign('campaignName', e.target.value)}
                      placeholder="e.g., The Rally Joke Contest"
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Project Handle</Label>
                      <Input
                        value={campaignData.projectHandle}
                        onChange={(e) => updateCampaign('projectHandle', e.target.value)}
                        placeholder="@RallyOnChain"
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Platform</Label>
                      <Input
                        value={campaignData.platform}
                        onChange={(e) => updateCampaign('platform', e.target.value)}
                        placeholder="Base, Solana, etc."
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Content Type</Label>
                    <Select
                      value={campaignData.contentType}
                      onValueChange={(v) => updateCampaign('contentType', v)}
                    >
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="joke">Joke/Meme</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="thread">Thread</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Description & Rules */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" />
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Campaign Description</Label>
                    <Textarea
                      value={campaignData.campaignDescription}
                      onChange={(e) => updateCampaign('campaignDescription', e.target.value)}
                      placeholder="What is this campaign about?"
                      className="bg-gray-700/50 border-gray-600 text-white min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Campaign Rules</Label>
                    <Textarea
                      value={campaignData.campaignRules}
                      onChange={(e) => updateCampaign('campaignRules', e.target.value)}
                      placeholder="- Rule 1&#10;- Rule 2&#10;- Rule 3"
                      className="bg-gray-700/50 border-gray-600 text-white min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Style Guidelines</Label>
                    <Textarea
                      value={campaignData.campaignStyle}
                      onChange={(e) => updateCampaign('campaignStyle', e.target.value)}
                      placeholder="Casual, witty, professional..."
                      className="bg-gray-700/50 border-gray-600 text-white min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Required Elements
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    These MUST be included EXACTLY as specified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Required Disclaimer</Label>
                    <Textarea
                      value={campaignData.requiredDisclaimer}
                      onChange={(e) => updateCampaign('requiredDisclaimer', e.target.value)}
                      placeholder="Exact disclaimer text..."
                      className="bg-gray-700/50 border-gray-600 text-white min-h-[60px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Required Hashtags</Label>
                      <Input
                        value={campaignData.requiredHashtags}
                        onChange={(e) => updateCampaign('requiredHashtags', e.target.value)}
                        placeholder="#Rally #Base"
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Required Mentions</Label>
                      <Input
                        value={campaignData.requiredMentions}
                        onChange={(e) => updateCampaign('requiredMentions', e.target.value)}
                        placeholder="@RallyOnChain"
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Format Requirements</Label>
                    <Input
                      value={campaignData.formatRequirements}
                      onChange={(e) => updateCampaign('formatRequirements', e.target.value)}
                      placeholder="Max 280 characters, single post..."
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Knowledge Base & Forbidden */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    Context & Restrictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Knowledge Base</Label>
                    <Textarea
                      value={campaignData.knowledgeBase}
                      onChange={(e) => updateCampaign('knowledgeBase', e.target.value)}
                      placeholder="Background info about the project..."
                      className="bg-gray-700/50 border-gray-600 text-white min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Forbidden Elements</Label>
                    <Textarea
                      value={campaignData.forbiddenElements}
                      onChange={(e) => updateCampaign('forbiddenElements', e.target.value)}
                      placeholder="- No recycled jokes&#10;- No offensive content&#10;- No AI-generic patterns"
                      className="bg-gray-700/50 border-gray-600 text-white min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={saveCampaign} className="bg-amber-600 hover:bg-amber-700">
                <Save className="w-4 h-4 mr-2" />
                Save Campaign
              </Button>
              <Button onClick={loadSampleCampaign} variant="outline" className="border-gray-600 text-gray-300">
                <Info className="w-4 h-4 mr-2" />
                Load Sample
              </Button>
              <Button onClick={clearCampaignForm} variant="outline" className="border-gray-600 text-gray-300">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Form
              </Button>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Content to Evaluate
                  </CardTitle>
                  <Button onClick={addContentItem} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Add multiple content pieces to evaluate and compare
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[400px] pr-4">
                  {contentItems.map((item, index) => (
                    <div key={item.id} className="mb-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-gray-300 font-medium">Content #{index + 1}</Label>
                        <Button
                          onClick={() => removeContentItem(item.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={item.content}
                        onChange={(e) => updateContentItem(item.id, e.target.value)}
                        placeholder="Paste your content here..."
                        className="bg-gray-700/50 border-gray-600 text-white min-h-[100px]"
                      />
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Settings */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-500" />
                    Generation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mode Selection */}
                  <div>
                    <Label className="text-gray-300 mb-2 block">Prompt Mode</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {(Object.keys(MODE_CONFIG) as PromptMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setPromptMode(mode)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            promptMode === mode
                              ? `bg-gradient-to-r ${MODE_CONFIG[mode].color} border-transparent text-white`
                              : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="font-medium">{MODE_CONFIG[mode].label}</div>
                          <div className="text-xs opacity-80">{MODE_CONFIG[mode].description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Distribution Curve */}
                  <div>
                    <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Distribution Curve
                    </Label>
                    <Select
                      value={distributionCurve}
                      onValueChange={(v) => setDistributionCurve(v as DistributionCurve)}
                    >
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced (α=1) - Top 10% gets 25%</SelectItem>
                        <SelectItem value="default">Default (α=3) - Top 10% gets 90%</SelectItem>
                        <SelectItem value="extreme">Extreme (α=8) - Top 10% gets 99%</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {DISTRIBUTION_INFO[distributionCurve].description}
                    </p>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Options */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeScoring"
                        checked={includeScoringFormula}
                        onCheckedChange={(c) => setIncludeScoringFormula(!!c)}
                      />
                      <Label htmlFor="includeScoring" className="text-gray-300 text-sm">
                        Include Rally scoring formula
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeEngagement"
                        checked={includeEngagementTips}
                        onCheckedChange={(c) => setIncludeEngagementTips(!!c)}
                      />
                      <Label htmlFor="includeEngagement" className="text-gray-300 text-sm">
                        Include engagement tips
                      </Label>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Additional Instructions */}
                  <div>
                    <Label className="text-gray-300 text-sm">Additional Instructions</Label>
                    <Textarea
                      value={additionalInstructions}
                      onChange={(e) => setAdditionalInstructions(e.target.value)}
                      placeholder="Any specific requirements..."
                      className="bg-gray-700/50 border-gray-600 text-white mt-2 min-h-[80px]"
                    />
                  </div>

                  <Button
                    onClick={generateContentPrompt}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Prompt v1.7
                  </Button>
                </CardContent>
              </Card>

              {/* Output */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-800/50 border-gray-700 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-500" />
                        Generated Prompt
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(generatedPrompt, 'Prompt')}
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300"
                          disabled={!generatedPrompt}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded-lg">
                        {generatedPrompt || 'Click "Generate Prompt" to create a content generation prompt based on the ACTUAL Rally.fun scoring system...'}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Evaluate Tab */}
          <TabsContent value="evaluate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Settings */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    Evaluation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Output Format</Label>
                    <Select value={evalFormat} onValueChange={setEvalFormat}>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detailed">Detailed Report</SelectItem>
                        <SelectItem value="json">JSON Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="determineWinner"
                        checked={determineWinner}
                        onCheckedChange={(c) => setDetermineWinner(!!c)}
                      />
                      <Label htmlFor="determineWinner" className="text-gray-300 text-sm">
                        Determine winner (if 2+ contents)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeCombined"
                        checked={includeCombinedGeneration}
                        onCheckedChange={(c) => setIncludeCombinedGeneration(!!c)}
                      />
                      <Label htmlFor="includeCombined" className="text-gray-300 text-sm">
                        Generate combined superior content
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeImprovement"
                        checked={includeImprovement}
                        onCheckedChange={(c) => setIncludeImprovement(!!c)}
                      />
                      <Label htmlFor="includeImprovement" className="text-gray-300 text-sm">
                        Include improvement suggestions
                      </Label>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <Button
                    onClick={generateEvaluationPrompt}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Generate Evaluation Prompt
                  </Button>
                </CardContent>
              </Card>

              {/* Output */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-800/50 border-gray-700 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-500" />
                        Evaluation Prompt
                      </CardTitle>
                      <Button
                        onClick={() => copyToClipboard(generatedEvalPrompt, 'Evaluation Prompt')}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300"
                        disabled={!generatedEvalPrompt}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded-lg">
                        {generatedEvalPrompt || 'Add content in the "Content" tab, then generate an evaluation prompt...'}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Rally Scoring Info */}
        <Card className="mt-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Rally.fun Scoring System - Quick Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-amber-400 mb-2">4 Gates (0-2 each)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Content Alignment</li>
                  <li>• Information Accuracy</li>
                  <li>• Campaign Compliance</li>
                  <li>• Originality & Authenticity</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-amber-400 mb-2">2 Quality Metrics (0-5)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Engagement Potential</li>
                  <li>• Technical Quality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-amber-400 mb-2">5 Engagement Metrics</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Retweets (log-scaled)</li>
                  <li>• Likes (log-scaled)</li>
                  <li>• Replies (log-scaled)</li>
                  <li>• Quality of Replies</li>
                  <li>• Followers of Repliers</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <p className="text-sm text-amber-300">
                <strong>Formula:</strong> Campaign Points = M_gate × Quality_Score × 100
                <br />
                <strong>Gate Multiplier:</strong> M_gate = 1 + 0.5 × (g_star - 1), where g_star = average of 4 gates
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Rally Scoring Generator v1.7</span>
            <span>Based on ACTUAL Rally.fun scoring formula</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
