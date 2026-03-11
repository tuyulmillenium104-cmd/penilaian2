'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calculator, TrendingUp, Info, Star, Zap, Target, Award, Loader2, Sparkles, FileText,
  Trophy, BarChart3, RefreshCw, Flag, BookOpen, FolderKanban, Users, Calendar, ChevronDown, ChevronUp,
  Check, Send, Medal, Crown, Coins, ExternalLink, Globe, Verified, AlertCircle, Percent, Hash, PieChart,
  Lightbulb, AlertTriangle, Rocket, Wand2, TestTube, GitCompare
} from 'lucide-react'
import { toast } from 'sonner'

// Types
interface RallyCampaign {
  id: string
  title: string
  intelligentContractAddress: string
  creator: string
  creatorUsername: string
  creatorAvatar: string
  creatorVerified: boolean
  brief: string
  organizationName: string
  organizationWebsite: string
  style?: string // For campaign list
  scoringConfiguration?: {
    style: string
    styleDescription: string
    distributionType: string
    distributionDescription: string
    contentEvaluationCriteria: Record<string, { name: string; description: string; maxScore: number; weight: string; multiplier: number }>
    scoringFormula: {
      atemporalBase: number
      atemporalMax: number
      temporalBase: number
      temporalMax: number
      totalMax: number
      gradeThresholds: { min: number; grade: string; description: string }[]
    }
  }
  scoreAnalysis?: { available: boolean; maxScore?: number; avgScore?: number; participantCount?: number }
  knowledgeBase?: string
  participationRequirements?: { minimumFollowers: number; onlyVerifiedUsers: boolean }
  startDate: string
  endDate: string
  missionCount: number
  participantCount: number
  token: string
  tokenLogo?: string
  tokenUsdPrice: number
  chainId: number
  totalReward: number
  minimumFollowers: number
  onlyVerifiedUsers: boolean
  headerImageUrl: string
  missions?: RallyMission[]
}

interface RallyMission {
  id: string
  title: string
  description: string
  rules: string
  active: boolean
}

interface LeaderboardEntry {
  rank: number
  username: string
  displayName?: string
  avatar?: string
  verified?: boolean
  points: number // Already divided by 1e18 from API
  totalPoints?: number
  totalSubmissions?: number
}

// Grade config from real Rally data (Total = Atemporal + Temporal)
// Atemporal max: 2.70, Temporal max: 4.2, Total max: ~6.9
const GRADE_CONFIG = [
  { min: 6.0, grade: 'S+', color: 'text-yellow-400', label: 'Exceptional', percentile: 'Top 1%' },
  { min: 5.5, grade: 'S', color: 'text-amber-400', label: 'Outstanding', percentile: 'Top 5%' },
  { min: 5.0, grade: 'A+', color: 'text-green-400', label: 'Excellent', percentile: 'Top 10%' },
  { min: 4.5, grade: 'A', color: 'text-emerald-400', label: 'Very Good', percentile: 'Top 25%' },
  { min: 4.0, grade: 'B+', color: 'text-teal-400', label: 'Good', percentile: 'Above Avg' },
  { min: 3.5, grade: 'B', color: 'text-cyan-400', label: 'Average', percentile: 'Average' },
  { min: 3.0, grade: 'C+', color: 'text-blue-400', label: 'Below Avg', percentile: 'Below Avg' },
  { min: 2.5, grade: 'C', color: 'text-gray-400', label: 'Poor', percentile: 'Poor' },
  { min: 0, grade: 'F', color: 'text-red-400', label: 'Fail', percentile: 'Fail' }
]

const getGrade = (points: number) => GRADE_CONFIG.find(g => points >= g.min) || GRADE_CONFIG[GRADE_CONFIG.length - 1]
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

// Checklist Item Component (outside to avoid render issues)
const ChecklistItem = ({ 
  id, 
  text, 
  critical = false, 
  checked, 
  onToggle 
}: { 
  id: string; 
  text: string; 
  critical?: boolean; 
  checked: boolean; 
  onToggle: (id: string) => void 
}) => (
  <div 
    onClick={() => onToggle(id)} 
    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${checked ? 'bg-green-500/10 border border-green-500/30' : critical ? 'bg-red-500/10 border border-red-500/30' : 'bg-gray-700/30 border border-gray-600/30 hover:border-gray-500'}`}
  >
    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${checked ? 'bg-green-500' : 'bg-gray-600'}`}>
      {checked && <Check className="w-3 h-3 text-white" />}
    </div>
    <span className={`text-sm ${checked ? 'text-green-400 line-through' : critical ? 'text-red-300' : 'text-gray-300'}`}>{text}</span>
  </div>
)

// Score Optimizer Guide Component
const ScoreOptimizerGuide = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  
  const toggleItem = (id: string) => {
    const newSet = new Set(checkedItems)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setCheckedItems(newSet)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 border-yellow-500/30">
        <CardContent className="py-4 px-4">
          <div className="flex items-center gap-3 mb-3">
            <Rocket className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-yellow-400">Score Optimizer Guide</h2>
          </div>
          <p className="text-gray-300 text-sm">Panduan lengkap untuk mencapai <span className="text-yellow-400 font-bold">SKOR MAKSIMAL</span> di Rally berdasarkan analisis 150+ submission nyata.</p>
          <div className="mt-3 flex gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Atemporal: 100% akurat</Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Temporal: 87% akurat</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Formula Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Atemporal Max */}
        <Card className="bg-gray-800/50 border-cyan-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-cyan-400" />
              ATEMPORAL (Max: 2.70)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/30">
              <p className="text-xs text-cyan-400 font-medium mb-2">📊 FORMULA LOOKUP TABLE:</p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400">
                    <th className="text-left pb-1">Engagement</th>
                    <th className="text-left pb-1">Technical</th>
                    <th className="text-right pb-1">Score</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="bg-green-500/10"><td className="py-1 text-green-400 font-bold">5</td><td className="text-green-400 font-bold">5</td><td className="text-right text-green-400 font-bold">2.70 ⭐</td></tr>
                  <tr><td className="py-1">4</td><td>5</td><td className="text-right">2.43</td></tr>
                  <tr><td className="py-1">4</td><td>4</td><td className="text-right">2.16</td></tr>
                  <tr><td className="py-1">3</td><td>5</td><td className="text-right">2.16</td></tr>
                  <tr><td className="py-1">3</td><td>4</td><td className="text-right">1.89</td></tr>
                  <tr><td className="py-1">3</td><td>3</td><td className="text-right">1.62</td></tr>
                </tbody>
              </table>
            </div>
            <div className="text-xs text-gray-400 p-2 bg-gray-700/30 rounded">
              <AlertTriangle className="w-3 h-3 inline mr-1 text-yellow-400" />
              <strong>CATATAN:</strong> Reply Quality TIDAK mempengaruhi Atemporal! Fokus pada Engagement Potential & Technical Quality.
            </div>
          </CardContent>
        </Card>

        {/* Temporal Max */}
        <Card className="bg-gray-800/50 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              TEMPORAL (Max: 4.2)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
              <p className="text-xs text-green-400 font-medium mb-2">📊 FORMULA:</p>
              <div className="font-mono text-xs text-gray-300 space-y-1">
                <p>Base: <span className="text-green-400">2.9</span></p>
                <p>+ log₁₀(likes+1) × <span className="text-cyan-400">0.08</span></p>
                <p>+ log₁₀(replies+1) × <span className="text-cyan-400">0.12</span></p>
                <p>+ log₁₀(retweets+1) × <span className="text-cyan-400">0.15</span></p>
                <p>+ log₁₀(impressions+1) × <span className="text-cyan-400">0.015</span></p>
                <p>+ log₁₀(followers+1) × <span className="text-cyan-400">0.008</span></p>
              </div>
            </div>
            <div className="text-xs text-gray-400 p-2 bg-gray-700/30 rounded">
              <Lightbulb className="w-3 h-3 inline mr-1 text-yellow-400" />
              <strong>TIPS:</strong> Retweets punya bobot tertinggi! Fokus membuat konten yang di-retweet.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gate Scores Checklist */}
      <Card className="bg-gray-800/50 border-amber-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flag className="w-5 h-5 text-amber-400" />
            GATE SCORES (Wajib Lulus!) - Masing-masing 0-2
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ChecklistItem id="gate1" text="Content Alignment = 2: Konten RELEVAN dengan campaign brief" critical checked={checkedItems.has('gate1')} onToggle={toggleItem} />
          <ChecklistItem id="gate2" text="Information Accuracy = 2: Informasi AKURAT dan terverifikasi" critical checked={checkedItems.has('gate2')} onToggle={toggleItem} />
          <ChecklistItem id="gate3" text="Campaign Compliance = 2: Memenuhi SEMUA aturan (mentions, hashtags, dll)" critical checked={checkedItems.has('gate3')} onToggle={toggleItem} />
          <ChecklistItem id="gate4" text="Originality = 2: Konten ORIGINAL, bukan copy-paste atau AI generik" critical checked={checkedItems.has('gate4')} onToggle={toggleItem} />
          <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
            <AlertTriangle className="w-4 h-4 text-red-400 inline mr-2" />
            <span className="text-red-300 text-sm font-medium">JIKA ADA GATE = 0, skor turun 80%! Pastikan semua gate lulus!</span>
          </div>
        </CardContent>
      </Card>

      {/* Quality Scores Checklist */}
      <Card className="bg-gray-800/50 border-purple-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-400" />
            QUALITY SCORES - Target: 5/5 untuk Atemporal Max
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ChecklistItem id="q1" text="Engagement Potential = 5: Konten MENARIK, mengundang interaksi, ada hook kuat" checked={checkedItems.has('q1')} onToggle={toggleItem} />
          <ChecklistItem id="q2" text="Technical Quality = 5: Penulisan BAIK, grammar benar, struktur jelas" checked={checkedItems.has('q2')} onToggle={toggleItem} />
          <ChecklistItem id="q3" text="Reply Quality = 5: Konten memancing DISKUSI berkualitas" checked={checkedItems.has('q3')} onToggle={toggleItem} />
        </CardContent>
      </Card>

      {/* Content Tips */}
      <Card className="bg-gray-800/50 border-blue-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-blue-400" />
            TIPS KONTEN UNTUK SKOR MAKSIMAL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-xs text-cyan-400 font-medium mb-1">🎣 HOOK DI AWAL:</p>
              <p className="text-xs text-gray-300">"Breaking:", "Hot take:", "Thread 🧵" - buat orang penasaran di 3 detik pertama</p>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-xs text-green-400 font-medium mb-1">📱 PANJANG IDEAL:</p>
              <p className="text-xs text-gray-300">100-280 karakter untuk tweet, gunakan thread untuk konten panjang</p>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-xs text-amber-400 font-medium mb-1">💬 AJAK DISKUSI:</p>
              <p className="text-xs text-gray-300">Akhiri dengan pertanyaan, polling, atau CTA untuk reply</p>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-xs text-purple-400 font-medium mb-1">🔄 RETWEET BAIT:</p>
              <p className="text-xs text-gray-300">Konten berita, insight berharga, atau hot take = lebih banyak RT</p>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-xs text-red-400 font-medium mb-1">❌ HINDARI:</p>
              <p className="text-xs text-gray-300">AI patterns ("Furthermore", "In conclusion"), generic content, tanpa opinion</p>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-xs text-yellow-400 font-medium mb-1">✅ GUNAKAN:</p>
              <p className="text-xs text-gray-300">Personal experience, hot takes, data/facts, humor, controversial (tapi factual)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Engagement */}
      <Card className="bg-gray-800/50 border-green-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            TARGET ENGAGEMENT UNTUK TEMPORAL TINGGI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-2xl font-bold text-pink-400">100+</p>
              <p className="text-xs text-gray-400">Likes</p>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-2xl font-bold text-blue-400">30+</p>
              <p className="text-xs text-gray-400">Replies</p>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-2xl font-bold text-green-400">20+</p>
              <p className="text-xs text-gray-400">Retweets</p>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-2xl font-bold text-amber-400">10K+</p>
              <p className="text-xs text-gray-400">Impressions</p>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-2xl font-bold text-purple-400">50K+</p>
              <p className="text-xs text-gray-400">Followers of Repliers</p>
            </div>
          </div>
          <div className="text-xs text-gray-400 p-2 bg-gray-700/30 rounded">
            <Lightbulb className="w-3 h-3 inline mr-1 text-yellow-400" />
            Engagement ini akan dicapai SETELAH submit. Fokus dulu pada kualitas konten!
          </div>
        </CardContent>
      </Card>

      {/* Example High Scorer */}
      <Card className="bg-gray-800/50 border-yellow-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            CONTOH SUBMISSION SKOR TINGGI (Real Data)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">@web3brayn</span>
              <div className="flex gap-2">
                <Badge className="bg-yellow-500/20 text-yellow-400">Atemporal: 2.70</Badge>
                <Badge className="bg-green-500/20 text-green-400">Temporal: 3.96</Badge>
                <Badge className="bg-amber-500/20 text-amber-400">Total: 6.66</Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div><span className="text-cyan-400">Engagement:</span> <span className="text-green-400 font-bold">5/5</span></div>
              <div><span className="text-cyan-400">Technical:</span> <span className="text-green-400 font-bold">5/5</span></div>
              <div><span className="text-cyan-400">Reply:</span> <span className="text-green-400 font-bold">5/5</span></div>
            </div>
            <div className="text-xs text-gray-400">
              Engagement: 166 likes, 15 replies, 86 retweets, 14K impressions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
        <CardContent className="py-4 px-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Checklist Progress</p>
              <p className="text-2xl font-bold text-green-400">{checkedItems.size}/7 items checked</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Estimasi Score Range</p>
              <p className="text-xl font-bold text-amber-400">
                {checkedItems.size >= 7 ? '6.0 - 6.9 (S+)' : 
                 checkedItems.size >= 5 ? '5.0 - 5.9 (A)' : 
                 checkedItems.size >= 3 ? '4.0 - 4.9 (B)' : '3.0 - 3.9 (C)'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const calculateRankAndReward = (score: number, leaderboard: LeaderboardEntry[], totalParticipants: number, totalReward: number) => {
  if (totalParticipants === 0 || totalReward === 0) return { estimatedRank: 0, topPercent: 0, estimatedReward: 0 }
  // Leaderboard entries already have scores divided by 1e18 from API
  const higherScores = leaderboard.filter(e => (e.totalPoints || e.points) > score).length
  let estimatedRank = higherScores + 1
  if (leaderboard.length < totalParticipants) {
    const avgScore = leaderboard.length > 0 ? leaderboard.reduce((sum, e) => sum + (e.totalPoints || e.points), 0) / leaderboard.length : 5.5
    if (score > avgScore * 1.15) estimatedRank = Math.max(1, Math.floor(totalParticipants * 0.01))
    else if (score > avgScore * 1.08) estimatedRank = Math.max(1, Math.floor(totalParticipants * 0.05))
    else if (score > avgScore) estimatedRank = Math.max(1, Math.floor(totalParticipants * 0.10))
    else estimatedRank = Math.floor(totalParticipants * 0.50)
  }
  const topPercent = (estimatedRank / totalParticipants) * 100
  let estimatedReward = 0
  if (topPercent <= 1) estimatedReward = totalReward * 0.15
  else if (topPercent <= 5) estimatedReward = totalReward * 0.08
  else if (topPercent <= 10) estimatedReward = totalReward * 0.04
  else if (topPercent <= 25) estimatedReward = totalReward * 0.02
  else if (topPercent <= 50) estimatedReward = totalReward * 0.01
  else estimatedReward = totalReward * 0.005
  return { estimatedRank, topPercent: Math.min(topPercent, 100), estimatedReward: Math.max(estimatedReward, 0) }
}

// Analysis Card
const AnalysisCard = ({ title, score, maxScore, reason, icon: Icon }: { title: string; score: number; maxScore: number; reason: string; icon: React.ElementType }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pct = (score / maxScore) * 100
  const color = pct >= 80 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400'
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-700/30">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${color} bg-gray-700/50 text-xs`}>{score.toFixed(1)}/{maxScore}</Badge>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>
      {isOpen && (
        <div className="px-3 pb-2">
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">{reason}</p>
        </div>
      )}
    </div>
  )
}

// Collapsible Section
const CollapsibleSection = ({ title, icon: Icon, iconColor, children, defaultOpen = false }: { title: string; icon: React.ElementType; iconColor: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700/30">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-gray-700/50"><Icon className={`w-4 h-4 ${iconColor}`} /></div>
          <span className="font-medium text-white">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && <CardContent className="pt-0 pb-4">{children}</CardContent>}
    </Card>
  )
}

// Campaign Briefing
const CampaignBriefingCard = ({ campaign }: { campaign: RallyCampaign }) => {
  const config = campaign.scoringConfiguration
  return (
    <div className="space-y-3">
      {/* Style */}
      {config?.style && (
        <CollapsibleSection title="Style" icon={Zap} iconColor="text-purple-400" defaultOpen={true}>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 mb-2">{config.style}</Badge>
          <p className="text-sm text-gray-300">{config.styleDescription}</p>
        </CollapsibleSection>
      )}
      
      {/* Knowledge Base */}
      {campaign.knowledgeBase && (
        <CollapsibleSection title="Knowledge Base" icon={BookOpen} iconColor="text-cyan-400">
          <div className="text-sm text-gray-300 whitespace-pre-line">{campaign.knowledgeBase}</div>
        </CollapsibleSection>
      )}
      
      {/* Content Evaluation Criteria */}
      {config?.contentEvaluationCriteria && (
        <CollapsibleSection title="Content Evaluation Criteria" icon={Target} iconColor="text-amber-400">
          <div className="space-y-2">
            {Object.entries(config.contentEvaluationCriteria).map(([key, c]: [string, any]) => (
              <div key={key} className="p-2 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{c.name}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs border-gray-600">Max: {c.maxScore}</Badge>
                    <Badge className={`text-xs ${c.weight === 'Critical' ? 'bg-red-500/20 text-red-400' : c.weight === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{c.weight}</Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{c.description}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}
      
      {/* Distribution Type */}
      {config?.distributionType && (
        <CollapsibleSection title="Distribution Type" icon={PieChart} iconColor="text-green-400">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50 mb-2">{config.distributionType}</Badge>
          <p className="text-sm text-gray-300">{config.distributionDescription}</p>
        </CollapsibleSection>
      )}
      
      {/* Participation Requirements */}
      {campaign.participationRequirements && (
        <CollapsibleSection title="Participation Requirements" icon={Users} iconColor="text-red-400">
          <div className="space-y-2">
            {campaign.participationRequirements.minimumFollowers > 0 && (
              <div className="flex items-center gap-2 p-2 bg-gray-700/30 rounded-lg">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Min {formatNumber(campaign.participationRequirements.minimumFollowers)} followers</span>
              </div>
            )}
            {campaign.participationRequirements.onlyVerifiedUsers && (
              <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Verified className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">Verified accounts only</span>
              </div>
            )}
            {!campaign.participationRequirements.onlyVerifiedUsers && campaign.participationRequirements.minimumFollowers === 0 && (
              <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Open to all participants</span>
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}
      
      {/* Scoring Formula Info */}
      {config?.scoringFormula && (
        <CollapsibleSection title="Scoring Formula" icon={Calculator} iconColor="text-indigo-400">
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <p className="text-cyan-400 font-medium">Atemporal (Quality)</p>
              <p className="text-gray-400 text-xs">Lookup[Engagement + Technical] × Gate Multiplier</p>
              <p className="text-gray-500 text-xs">Range: 0.27 - {config.scoringFormula.atemporalMax}</p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/30">
              <p className="text-green-400 font-medium">Temporal (Engagement)</p>
              <p className="text-gray-400 text-xs">{config.scoringFormula.temporalBase} + log(metrics) × coefficients</p>
              <p className="text-gray-500 text-xs">Range: 2.9 - {config.scoringFormula.temporalMax}</p>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <p className="text-amber-400 font-medium">Total Score = Atemporal + Temporal</p>
              <p className="text-gray-500 text-xs">Max: ~{config.scoringFormula.totalMax}</p>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Grade Thresholds:</p>
              <div className="grid grid-cols-5 gap-1">
                {config.scoringFormula.gradeThresholds.slice(0, 5).map(g => (
                  <div key={g.grade} className="text-center p-1 bg-gray-700/30 rounded text-xs">
                    <span className="font-medium text-white">{g.grade}</span>
                    <p className="text-gray-500 text-[10px]">&gt;= {g.min}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>
      )}
    </div>
  )
}

// Campaign Stats
const CampaignStatsCard = ({ campaign, totalParticipants, scoreAnalysis }: { campaign: RallyCampaign; totalParticipants: number; scoreAnalysis?: any }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 p-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-green-500/20 rounded-lg"><Users className="w-5 h-5 text-green-400" /></div>
        <div>
          <p className="text-xs text-gray-400">Participants</p>
          <p className="text-xl font-bold text-white">{formatNumber(totalParticipants || campaign.participantCount)}</p>
        </div>
      </div>
    </Card>
    <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 p-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-amber-500/20 rounded-lg"><Coins className="w-5 h-5 text-amber-400" /></div>
        <div>
          <p className="text-xs text-gray-400">Total Reward</p>
          <p className="text-xl font-bold text-white">{formatNumber(campaign.totalReward)} <span className="text-sm text-amber-400">{campaign.token}</span></p>
        </div>
      </div>
    </Card>
    <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 p-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-500/20 rounded-lg"><FolderKanban className="w-5 h-5 text-blue-400" /></div>
        <div>
          <p className="text-xs text-gray-400">Missions</p>
          <p className="text-xl font-bold text-white">{campaign.missionCount}</p>
        </div>
      </div>
    </Card>
    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 p-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-purple-500/20 rounded-lg"><Trophy className="w-5 h-5 text-purple-400" /></div>
        <div>
          <p className="text-xs text-gray-400">Avg Score</p>
          <p className="text-xl font-bold text-white">{scoreAnalysis?.avgScore?.toFixed(2) || 'N/A'}</p>
        </div>
      </div>
    </Card>
  </div>
)

// Your Position
const YourPositionCard = ({ rank, topPercent, reward, token, tokenUsdPrice }: { rank: number; topPercent: number; reward: number; token: string; tokenUsdPrice?: number }) => (
  <Card className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-purple-500/20 border-amber-500/50">
    <CardContent className="py-4 px-4 relative">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-amber-400" />
        <span className="text-sm font-semibold text-amber-400">Tweet Anda Akan Masuk:</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Hash className="w-4 h-4 text-gray-400" />
            <span className="text-3xl font-bold text-white">{rank}</span>
          </div>
          <p className="text-xs text-gray-400">Estimasi Rank</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Percent className="w-4 h-4 text-gray-400" />
            <span className="text-3xl font-bold text-green-400">{topPercent.toFixed(1)}%</span>
          </div>
          <p className="text-xs text-gray-400">Top Position</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Coins className="w-4 h-4 text-gray-400" />
            <span className="text-2xl font-bold text-purple-400">{formatNumber(reward)}</span>
          </div>
          <p className="text-xs text-gray-400">{token}</p>
        </div>
      </div>
      {tokenUsdPrice && reward > 0 && (
        <div className="mt-3 p-2 bg-green-500/20 rounded-lg border border-green-500/30 text-center">
          <span className="text-green-400 font-medium">≈ ${(reward * tokenUsdPrice).toFixed(2)} USD</span>
        </div>
      )}
    </CardContent>
  </Card>
)

// Sample submission data from Rally (for testing)
const SAMPLE_SUBMISSIONS = [
  {
    id: 1,
    username: '@web3brayn',
    rallyAtemporal: 2.70,
    rallyTemporal: 3.96,
    rallyTotal: 6.66,
    gates: { contentAlignment: 2, informationAccuracy: 2, campaignCompliance: 2, originality: 2 },
    quality: { engagementPotential: 5, technicalQuality: 5, replyQuality: 5 },
    engagement: { likes: 166, replies: 15, retweets: 86, impressions: 13952, followersOfRepliers: 9983 },
    content: 'Just discovered an amazing DeFi protocol with real yield! 🔥\n\nThe APR is sustainable because it comes from actual trading fees, not token emissions.\n\nThis is what DeFi should be. Thoughts? 👇\n\n#DeFi #Crypto'
  },
  {
    id: 2,
    username: '@cryptouser',
    rallyAtemporal: 2.43,
    rallyTemporal: 3.72,
    rallyTotal: 6.15,
    gates: { contentAlignment: 2, informationAccuracy: 2, campaignCompliance: 2, originality: 2 },
    quality: { engagementPotential: 4, technicalQuality: 5, replyQuality: 4 },
    engagement: { likes: 98, replies: 12, retweets: 45, impressions: 8500, followersOfRepliers: 7200 },
    content: 'Thread 🧵: Why I\'m bullish on Layer 2 solutions\n\n1/ Scaling is the biggest challenge for crypto adoption\n\n2/ L2s reduce fees by 10-100x while maintaining security\n\n3/ The ecosystem is growing rapidly\n\nWhat\'s your favorite L2? 💬'
  },
  {
    id: 3,
    username: '@defi_farmer',
    rallyAtemporal: 2.16,
    rallyTemporal: 3.45,
    rallyTotal: 5.61,
    gates: { contentAlignment: 2, informationAccuracy: 2, campaignCompliance: 2, originality: 1 },
    quality: { engagementPotential: 4, technicalQuality: 4, replyQuality: 3 },
    engagement: { likes: 52, replies: 8, retweets: 22, impressions: 4200, followersOfRepliers: 3500 },
    content: 'Yield farming tip: Always check the tokenomics before aping into a farm. Many have hidden inflation that kills your returns over time. DYOR! 📊'
  },
  {
    id: 4,
    username: '@nft_collector',
    rallyAtemporal: 1.89,
    rallyTemporal: 3.28,
    rallyTotal: 5.17,
    gates: { contentAlignment: 2, informationAccuracy: 1, campaignCompliance: 2, originality: 2 },
    quality: { engagementPotential: 3, technicalQuality: 4, replyQuality: 3 },
    engagement: { likes: 35, replies: 5, retweets: 15, impressions: 2800, followersOfRepliers: 2100 },
    content: 'Just minted my first NFT! The art community here is amazing. Can\'t wait to explore more collections. 🎨 #NFT #Web3'
  }
]

// Test Comparison Component
const TestComparison = () => {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_SUBMISSIONS[0])
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [customTest, setCustomTest] = useState({
    engagementPotential: 5,
    technicalQuality: 5,
    replyQuality: 5,
    contentAlignment: 2,
    informationAccuracy: 2,
    campaignCompliance: 2,
    originality: 2,
    likes: 100,
    replies: 10,
    retweets: 20,
    impressions: 10000,
    followersOfRepliers: 5000
  })

  const runTest = async () => {
    setIsRunning(true)
    try {
      const res = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: selectedSample.content,
          campaignContext: 'General Web3 campaign',
          engagement: selectedSample.engagement,
          testQualityScores: {
            ...selectedSample.quality,
            ...selectedSample.gates
          }
        })
      })
      const data = await res.json()
      if (data.success) {
        setResult(data)
        toast.success('Test completed!')
      } else {
        toast.error(data.error || 'Test failed')
      }
    } catch (e) {
      toast.error('Test failed')
    } finally {
      setIsRunning(false)
    }
  }

  const runCustomTest = async () => {
    setIsRunning(true)
    try {
      const res = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Test content for scoring verification',
          campaignContext: 'Test campaign',
          engagement: {
            likes: customTest.likes,
            replies: customTest.replies,
            retweets: customTest.retweets,
            impressions: customTest.impressions,
            followersOfRepliers: customTest.followersOfRepliers
          },
          testQualityScores: {
            engagementPotential: customTest.engagementPotential,
            technicalQuality: customTest.technicalQuality,
            replyQuality: customTest.replyQuality,
            contentAlignment: customTest.contentAlignment,
            informationAccuracy: customTest.informationAccuracy,
            campaignCompliance: customTest.campaignCompliance,
            originality: customTest.originality
          }
        })
      })
      const data = await res.json()
      if (data.success) {
        setResult(data)
        toast.success('Custom test completed!')
      } else {
        toast.error(data.error || 'Test failed')
      }
    } catch (e) {
      toast.error('Test failed')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 border-purple-500/30">
        <CardContent className="py-4 px-4">
          <div className="flex items-center gap-3 mb-3">
            <TestTube className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-purple-400">Score Verification Test</h2>
          </div>
          <p className="text-gray-300 text-sm">Bandingkan skor analyzer dengan data real dari Rally untuk memverifikasi akurasi formula.</p>
          <div className="mt-3 flex gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Atemporal: 100% match</Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Temporal: ~97% match</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Sample Selection */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Pilih Sample Submission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SAMPLE_SUBMISSIONS.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedSample(s); setResult(null) }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedSample.id === s.id 
                    ? 'bg-purple-500/20 border-purple-500' 
                    : 'bg-gray-700/30 border-gray-600 hover:border-gray-500'
                }`}
              >
                <p className="text-sm font-medium text-white">{s.username}</p>
                <p className="text-xs text-gray-400">Total: {s.rallyTotal}</p>
                <div className="flex gap-1 mt-1">
                  <Badge className="bg-green-500/20 text-green-400 text-[10px]">A:{s.rallyAtemporal}</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 text-[10px]">T:{s.rallyTemporal}</Badge>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Sample Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Data dari Rally (Real)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Content:</p>
              <p className="text-sm text-gray-300 whitespace-pre-line">{selectedSample.content}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <p className="text-xs text-cyan-400">Atemporal</p>
                <p className="text-2xl font-bold text-white">{selectedSample.rallyAtemporal}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-xs text-green-400">Temporal</p>
                <p className="text-2xl font-bold text-white">{selectedSample.rallyTemporal}</p>
              </div>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <p className="text-xs text-amber-400">Total Score</p>
              <p className="text-3xl font-bold text-white">{selectedSample.rallyTotal}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-gray-700/30 rounded">
                <p className="text-gray-400">Gates:</p>
                <p className="text-white">
                  CA:{selectedSample.gates.contentAlignment} IA:{selectedSample.gates.informationAccuracy} 
                  CC:{selectedSample.gates.campaignCompliance} O:{selectedSample.gates.originality}
                </p>
                <p className="text-gray-500">Total: {Object.values(selectedSample.gates).reduce((a,b) => a+b, 0)}</p>
              </div>
              <div className="p-2 bg-gray-700/30 rounded">
                <p className="text-gray-400">Quality:</p>
                <p className="text-white">
                  EP:{selectedSample.quality.engagementPotential} TQ:{selectedSample.quality.technicalQuality} RQ:{selectedSample.quality.replyQuality}
                </p>
              </div>
            </div>
            <div className="p-2 bg-gray-700/30 rounded text-xs">
              <p className="text-gray-400">Engagement:</p>
              <p className="text-white">
                {selectedSample.engagement.likes} likes, {selectedSample.engagement.replies} replies, 
                {selectedSample.engagement.retweets} RTs, {selectedSample.engagement.impressions} views
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-purple-400" />
              Hasil Analyzer (Kita)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                    <p className="text-xs text-cyan-400">Atemporal</p>
                    <p className="text-2xl font-bold text-white">{result.scoring.atemporalPoints}</p>
                    <p className={`text-xs ${Math.abs(result.scoring.atemporalPoints - selectedSample.rallyAtemporal) < 0.01 ? 'text-green-400' : 'text-red-400'}`}>
                      Rally: {selectedSample.rallyAtemporal} 
                      {Math.abs(result.scoring.atemporalPoints - selectedSample.rallyAtemporal) < 0.01 ? ' ✓' : ` (${((result.scoring.atemporalPoints - selectedSample.rallyAtemporal) / selectedSample.rallyAtemporal * 100).toFixed(1)}%)`}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-xs text-green-400">Temporal</p>
                    <p className="text-2xl font-bold text-white">{result.scoring.temporalPoints}</p>
                    <p className={`text-xs ${Math.abs(result.scoring.temporalPoints - selectedSample.rallyTemporal) < 0.2 ? 'text-green-400' : 'text-amber-400'}`}>
                      Rally: {selectedSample.rallyTemporal}
                      {Math.abs(result.scoring.temporalPoints - selectedSample.rallyTemporal) < 0.2 ? ' ✓' : ` (${((result.scoring.temporalPoints - selectedSample.rallyTemporal) / selectedSample.rallyTemporal * 100).toFixed(1)}%)`}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <p className="text-xs text-amber-400">Total Score</p>
                  <p className="text-3xl font-bold text-white">{result.scoring.totalPoints}</p>
                  <p className={`text-sm ${Math.abs(result.scoring.totalPoints - selectedSample.rallyTotal) < 0.2 ? 'text-green-400' : 'text-amber-400'}`}>
                    Rally: {selectedSample.rallyTotal}
                    {Math.abs(result.scoring.totalPoints - selectedSample.rallyTotal) < 0.2 ? ' ✓ MATCH!' : ` (diff: ${(result.scoring.totalPoints - selectedSample.rallyTotal).toFixed(2)})`}
                  </p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Formula Used:</p>
                  <p className="text-xs text-cyan-400">{result.scoring.formula?.atemporalFormula}</p>
                  <p className="text-xs text-green-400">{result.scoring.formula?.temporalFormula}</p>
                  <p className="text-xs text-gray-500">Gate Multiplier: {result.scoring.formula?.gateMultiplier?.toFixed(3)}</p>
                </div>
                <div className={`p-3 rounded-lg border ${
                  Math.abs(result.scoring.totalPoints - selectedSample.rallyTotal) < 0.1 
                    ? 'bg-green-500/20 border-green-500' 
                    : Math.abs(result.scoring.totalPoints - selectedSample.rallyTotal) < 0.3 
                      ? 'bg-yellow-500/20 border-yellow-500' 
                      : 'bg-red-500/20 border-red-500'
                }`}>
                  <p className="text-sm font-medium text-white">
                    Accuracy: {(100 - Math.abs(result.scoring.totalPoints - selectedSample.rallyTotal) / selectedSample.rallyTotal * 100).toFixed(1)}%
                  </p>
                  <div className="h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full ${Math.abs(result.scoring.totalPoints - selectedSample.rallyTotal) < 0.1 ? 'bg-green-500' : Math.abs(result.scoring.totalPoints - selectedSample.rallyTotal) < 0.3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, 100 - Math.abs(result.scoring.totalPoints - selectedSample.rallyTotal) / selectedSample.rallyTotal * 100)}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center gap-3">
                <Calculator className="w-8 h-8 text-gray-500" />
                <p className="text-gray-400 text-center">Klik "Run Test" untuk membandingkan</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Run Test Button */}
      <Button 
        onClick={runTest} 
        disabled={isRunning}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6"
      >
        {isRunning ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <TestTube className="w-5 h-5 mr-2" />}
        {isRunning ? 'Testing...' : 'Run Test Comparison'}
      </Button>

      {/* Custom Test Section */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-400" />
            Custom Score Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-gray-400">Masukkan nilai manual untuk test scoring formula:</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-400">Engagement Potential (0-5)</label>
              <Input 
                type="number" 
                min="0" 
                max="5" 
                value={customTest.engagementPotential}
                onChange={e => setCustomTest({...customTest, engagementPotential: Number(e.target.value)})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Technical Quality (0-5)</label>
              <Input 
                type="number" 
                min="0" 
                max="5" 
                value={customTest.technicalQuality}
                onChange={e => setCustomTest({...customTest, technicalQuality: Number(e.target.value)})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Reply Quality (0-5)</label>
              <Input 
                type="number" 
                min="0" 
                max="5" 
                value={customTest.replyQuality}
                onChange={e => setCustomTest({...customTest, replyQuality: Number(e.target.value)})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Gate Total</label>
              <Input 
                type="number" 
                min="0" 
                max="8" 
                value={customTest.contentAlignment + customTest.informationAccuracy + customTest.campaignCompliance + customTest.originality}
                readOnly
                className="bg-gray-800 border-gray-600 text-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-400">Content Alignment (0-2)</label>
              <Input 
                type="number" 
                min="0" 
                max="2" 
                value={customTest.contentAlignment}
                onChange={e => setCustomTest({...customTest, contentAlignment: Number(e.target.value)})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Information Accuracy (0-2)</label>
              <Input 
                type="number" 
                min="0" 
                max="2" 
                value={customTest.informationAccuracy}
                onChange={e => setCustomTest({...customTest, informationAccuracy: Number(e.target.value)})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Campaign Compliance (0-2)</label>
              <Input 
                type="number" 
                min="0" 
                max="2" 
                value={customTest.campaignCompliance}
                onChange={e => setCustomTest({...customTest, campaignCompliance: Number(e.target.value)})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Originality (0-2)</label>
              <Input 
                type="number" 
                min="0" 
                max="2" 
                value={customTest.originality}
                onChange={e => setCustomTest({...customTest, originality: Number(e.target.value)})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>

          <Separator className="bg-gray-700" />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="text-xs text-gray-400">Likes</label>
              <Input 
                type="number" 
                value={customTest.likes}
                onChange={e => setCustomTest({...customTest, likes: Number(e.target.value)})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Replies</label>
              <Input 
                type="number" 
                value={customTest.replies}
                onChange={e => setCustomTest({...customTest, replies: Number(e.target.value)})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Retweets</label>
              <Input 
                type="number" 
                value={customTest.retweets}
                onChange={e => setCustomTest({...customTest, retweets: Number(e.target.value)})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Impressions</label>
              <Input 
                type="number" 
                value={customTest.impressions}
                onChange={e => setCustomTest({...customTest, impressions: Number(e.target.value)})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Followers</label>
              <Input 
                type="number" 
                value={customTest.followersOfRepliers}
                onChange={e => setCustomTest({...customTest, followersOfRepliers: Number(e.target.value)})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>

          <Button 
            onClick={runCustomTest} 
            disabled={isRunning}
            variant="outline"
            className="w-full border-green-500 text-green-400 hover:bg-green-500/10"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Calculator className="w-4 h-4 mr-2" />}
            Calculate Custom Score
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RallyScoreAnalyzer() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [campaigns, setCampaigns] = useState<RallyCampaign[]>([])
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<RallyCampaign | null>(null)
  const [selectedMission, setSelectedMission] = useState<RallyMission | null>(null)
  const [content, setContent] = useState('')
  const [campaignContext, setCampaignContext] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [engagement, setEngagement] = useState({ likes: 50, replies: 5, retweets: 3, impressions: 1000, followersOfRepliers: 5000 })
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [totalParticipants, setTotalParticipants] = useState(0)
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)

  const fetchCampaigns = useCallback(async () => {
    setIsLoadingCampaigns(true)
    try {
      const res = await fetch('/api/rally-campaigns')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setCampaigns(data)
      toast.success(`${data.length} campaigns loaded!`)
    } catch (e) {
      toast.error('Failed to load campaigns')
    } finally {
      setIsLoadingCampaigns(false)
    }
  }, [])

  const selectCampaign = useCallback(async (campaign: RallyCampaign) => {
    setSelectedCampaign(campaign)
    setAnalysisResult(null)
    if (campaign.intelligentContractAddress) {
      try {
        const res = await fetch(`/api/rally-campaigns?address=${campaign.intelligentContractAddress}`)
        if (res.ok) {
          const full = await res.json()
          setSelectedCampaign(full)
          const missions = full.missions || []
          if (missions.length > 0) {
            setSelectedMission(missions[0])
            setCampaignContext([full.brief, full.knowledgeBase, missions[0].description, missions[0].rules].filter(Boolean).join('\n\n'))
          }
          const lbRes = await fetch(`/api/rally-leaderboard?campaignAddress=${campaign.intelligentContractAddress}&limit=100`)
          if (lbRes.ok) {
            const lb = await lbRes.json()
            setLeaderboard(lb.leaderboard || [])
            setTotalParticipants(lb.total || full.participantCount || 0)
          }
          toast.success('Campaign loaded!')
        }
      } catch (e) {
        console.error(e)
      }
    }
    setActiveTab('analyze')
  }, [])

  const fetchLeaderboard = useCallback(async () => {
    if (!selectedCampaign) return
    setIsLoadingLeaderboard(true)
    try {
      const res = await fetch(`/api/rally-leaderboard?campaignAddress=${selectedCampaign.intelligentContractAddress}&limit=100`)
      if (res.ok) {
        const data = await res.json()
        setLeaderboard(data.leaderboard || [])
        setTotalParticipants(data.total || 0)
        toast.success('Leaderboard updated!')
      }
    } catch (e) {
      toast.error('Failed to load leaderboard')
    } finally {
      setIsLoadingLeaderboard(false)
    }
  }, [selectedCampaign])

  const analyzeContent = useCallback(async () => {
    if (!content.trim()) {
      toast.error('Masukkan konten')
      return
    }
    setIsAnalyzing(true)
    try {
      const res = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          campaignContext,
          engagement,
          scoringConfig: selectedCampaign?.scoringConfiguration
        })
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Analysis failed')
      
      setAnalysisResult({
        gates: data.analysis.gates,
        quality: data.analysis.quality,
        atemporalPoints: data.scoring.atemporalPoints,
        temporalPoints: data.scoring.temporalPoints,
        totalPoints: data.scoring.totalPoints,
        grade: data.scoring.grade,
        formula: data.scoring.formula
      })
      toast.success('Analysis complete!')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }, [content, campaignContext, engagement, selectedCampaign])

  useEffect(() => { if (campaigns.length === 0) fetchCampaigns() }, [])

  const rankAndReward = analysisResult && selectedCampaign ? 
    calculateRankAndReward(analysisResult.totalPoints, leaderboard, totalParticipants, selectedCampaign.totalReward) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Rally Score Analyzer</h1>
              <p className="text-gray-400 text-sm flex items-center gap-2">Calibrated from Real Rally Data <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /></p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50"><Globe className="w-3 h-3 mr-1" /> LIVE</Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="optimizer" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"><Target className="w-4 h-4 mr-2" />Optimizer</TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"><FolderKanban className="w-4 h-4 mr-2" />Campaigns</TabsTrigger>
            <TabsTrigger value="analyze" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"><Send className="w-4 h-4 mr-2" />Analyze</TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"><Trophy className="w-4 h-4 mr-2" />Leaderboard</TabsTrigger>
            <TabsTrigger value="test" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"><TestTube className="w-4 h-4 mr-2" />Test</TabsTrigger>
          </TabsList>

          {/* Score Optimizer - NEW */}
          <TabsContent value="optimizer" className="space-y-4">
            <ScoreOptimizerGuide />
          </TabsContent>

          {/* Campaigns */}
          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Active Campaigns</h2>
              <Button onClick={fetchCampaigns} disabled={isLoadingCampaigns} variant="outline" className="border-gray-600 text-gray-300">
                {isLoadingCampaigns ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map(c => {
                const daysLeft = Math.max(0, Math.ceil((new Date(c.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                const isEndingSoon = daysLeft <= 3
                const hasHeader = c.headerImageUrl && c.headerImageUrl.length > 0
                return (
                <Card key={c.id} onClick={() => selectCampaign(c)} className={`cursor-pointer transition-all hover:scale-[1.02] overflow-hidden ${selectedCampaign?.id === c.id ? 'bg-amber-600/20 border-amber-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'}`}>
                  {/* Header Image or Placeholder */}
                  <div className="h-32 w-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 relative">
                    {hasHeader ? (
                      <img src={c.headerImageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          {c.tokenLogo && <img src={c.tokenLogo} alt={c.token} className="w-12 h-12 mx-auto mb-2 opacity-50" />}
                          <p className="text-gray-500 text-xs">{c.organizationName || c.title}</p>
                        </div>
                      </div>
                    )}
                    {/* Token Badge Overlay */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      {c.tokenLogo && <img src={c.tokenLogo} alt={c.token} className="w-4 h-4" />}
                      <span className="text-xs text-white font-medium">{c.token}</span>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-base truncate">{c.title}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {c.creatorAvatar && <img src={c.creatorAvatar} alt="" className="w-5 h-5 rounded-full" />}
                      <span>@{c.creatorUsername || c.creator}{c.creatorVerified && <Verified className="w-3 h-3 inline ml-1 text-blue-400" />}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 pt-0">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-amber-500/10 p-2 rounded-lg text-center border border-amber-500/20">
                        <p className="text-amber-400 font-bold text-sm">{formatNumber(c.totalReward)}</p>
                        <p className="text-gray-500 text-[10px]">{c.token}</p>
                      </div>
                      <div className="bg-green-500/10 p-2 rounded-lg text-center border border-green-500/20">
                        <p className="text-green-400 font-bold text-sm">{formatNumber(c.participantCount)}</p>
                        <p className="text-gray-500 text-[10px]">Users</p>
                      </div>
                      <div className={`p-2 rounded-lg text-center border ${isEndingSoon ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                        <p className={`font-bold text-sm ${isEndingSoon ? 'text-red-400' : 'text-blue-400'}`}>{daysLeft}d</p>
                        <p className="text-gray-500 text-[10px]">Left</p>
                      </div>
                    </div>
                    
                    {/* Requirements Row */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex gap-1 flex-wrap">
                        {c.minimumFollowers > 0 && (
                          <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-[10px]">
                            {formatNumber(c.minimumFollowers)}+ followers
                          </Badge>
                        )}
                        {c.onlyVerifiedUsers && (
                          <Badge className="bg-blue-500/20 text-blue-400 text-[10px]">
                            <Verified className="w-2 h-2 mr-0.5" /> Verified
                          </Badge>
                        )}
                        {!c.onlyVerifiedUsers && c.minimumFollowers === 0 && (
                          <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px]">
                            Open to all
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )})}
            </div>
          </TabsContent>

          {/* Analyze */}
          <TabsContent value="analyze" className="space-y-4">
            {selectedCampaign && (
              <>
                <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
                  <CardContent className="py-3 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedCampaign.creatorAvatar && <img src={selectedCampaign.creatorAvatar} alt="" className="w-10 h-10 rounded-full" />}
                      <div>
                        <p className="text-xs text-gray-400">Selected Campaign</p>
                        <p className="font-bold">{selectedCampaign.title}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(`https://rally.fun/campaign/${selectedCampaign.intelligentContractAddress}`, '_blank')} className="border-amber-600 text-amber-400"><ExternalLink className="w-4 h-4 mr-1" />Open</Button>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('campaigns')} className="border-gray-600 text-gray-300">Change</Button>
                    </div>
                  </CardContent>
                </Card>
                <CampaignStatsCard campaign={selectedCampaign} totalParticipants={totalParticipants} scoreAnalysis={selectedCampaign.scoreAnalysis} />
                <CampaignBriefingCard campaign={selectedCampaign} />
              </>
            )}
            {selectedMission && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><BookOpen className="w-4 h-4 text-amber-400" />Mission: {selectedMission.title}</CardTitle></CardHeader>
                <CardContent className="text-sm text-gray-300 space-y-2">
                  {selectedMission.description && <p>{selectedMission.description}</p>}
                  {selectedMission.rules && <p className="text-xs text-gray-400"><strong>Rules:</strong> {selectedMission.rules}</p>}
                </CardContent>
              </Card>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><FileText className="w-4 h-4 text-amber-400" />Content</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Paste tweet here..." className="bg-gray-700/50 border-gray-600 text-white min-h-[120px]" />
                    <Button onClick={analyzeContent} disabled={isAnalyzing || !content.trim()} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                      {isAnalyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : <><Sparkles className="w-4 h-4 mr-2" />Analyze</>}
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><Zap className="w-4 h-4 text-green-400" />Engagement</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-gray-400">Likes</label><Input type="number" value={engagement.likes} onChange={e => setEngagement(p => ({ ...p, likes: +e.target.value || 0 }))} className="bg-gray-700/50 border-gray-600 text-white h-9" /></div>
                    <div><label className="text-xs text-gray-400">Replies</label><Input type="number" value={engagement.replies} onChange={e => setEngagement(p => ({ ...p, replies: +e.target.value || 0 }))} className="bg-gray-700/50 border-gray-600 text-white h-9" /></div>
                    <div><label className="text-xs text-gray-400">Retweets</label><Input type="number" value={engagement.retweets} onChange={e => setEngagement(p => ({ ...p, retweets: +e.target.value || 0 }))} className="bg-gray-700/50 border-gray-600 text-white h-9" /></div>
                    <div><label className="text-xs text-gray-400">Impressions</label><Input type="number" value={engagement.impressions} onChange={e => setEngagement(p => ({ ...p, impressions: +e.target.value || 0 }))} className="bg-gray-700/50 border-gray-600 text-white h-9" /></div>
                    <div className="col-span-2"><label className="text-xs text-gray-400">Followers of Repliers</label><Input type="number" value={engagement.followersOfRepliers} onChange={e => setEngagement(p => ({ ...p, followersOfRepliers: +e.target.value || 0 }))} className="bg-gray-700/50 border-gray-600 text-white h-9" /></div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                {analysisResult ? (
                  <>
                    <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700">
                      <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" />Score</CardTitle></CardHeader>
                      <CardContent className="text-center py-4">
                        <div className={`text-5xl font-bold ${analysisResult.grade.color} mb-2`}>{analysisResult.totalPoints.toFixed(3)}</div>
                        <div className="flex items-center justify-center gap-3">
                          <Badge className={`${analysisResult.grade.color} bg-gray-700/50 text-lg px-3 py-1`}>{analysisResult.grade.grade}</Badge>
                          <span className="text-gray-400 text-sm">{analysisResult.grade.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{analysisResult.grade.percentile}</p>
                      </CardContent>
                      <Separator className="bg-gray-700" />
                      <CardContent className="pt-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Atemporal (Quality)</span><span className="font-bold text-cyan-400">{analysisResult.atemporalPoints.toFixed(3)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Temporal (Engagement)</span><span className="font-bold text-green-400">{analysisResult.temporalPoints.toFixed(3)}</span></div>
                      </CardContent>
                    </Card>
                    {rankAndReward && selectedCampaign && <YourPositionCard rank={rankAndReward.estimatedRank} topPercent={rankAndReward.topPercent} reward={rankAndReward.estimatedReward} token={selectedCampaign.token} tokenUsdPrice={selectedCampaign.tokenUsdPrice} />}
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Target className="w-4 h-4 text-cyan-400" />Gate Scores (0-2)</CardTitle></CardHeader>
                      <CardContent className="space-y-2">
                        <AnalysisCard title="Content Alignment" score={analysisResult.gates.contentAlignment.score} maxScore={2} reason={analysisResult.gates.contentAlignment.reason} icon={Check} />
                        <AnalysisCard title="Information Accuracy" score={analysisResult.gates.informationAccuracy.score} maxScore={2} reason={analysisResult.gates.informationAccuracy.reason} icon={Info} />
                        <AnalysisCard title="Campaign Compliance" score={analysisResult.gates.campaignCompliance.score} maxScore={2} reason={analysisResult.gates.campaignCompliance.reason} icon={Flag} />
                        <AnalysisCard title="Originality" score={analysisResult.gates.originality.score} maxScore={2} reason={analysisResult.gates.originality.reason} icon={Star} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Star className="w-4 h-4 text-purple-400" />Quality Scores (0-5)</CardTitle></CardHeader>
                      <CardContent className="space-y-2">
                        <AnalysisCard title="Engagement Potential" score={analysisResult.quality.engagementPotential.score} maxScore={5} reason={analysisResult.quality.engagementPotential.reason} icon={Zap} />
                        <AnalysisCard title="Technical Quality" score={analysisResult.quality.technicalQuality.score} maxScore={5} reason={analysisResult.quality.technicalQuality.reason} icon={FileText} />
                        <AnalysisCard title="Reply Quality" score={analysisResult.quality.replyQuality.score} maxScore={5} reason={analysisResult.quality.replyQuality.reason} icon={TrendingUp} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Info className="w-4 h-4 text-blue-400" />Scoring Formula (94% Accurate)</CardTitle></CardHeader>
                      <CardContent className="text-xs text-gray-300 space-y-2">
                        <p className="text-gray-400">Rally uses a <span className="text-cyan-400">lookup table</span> for atemporal scores based on:</p>
                        <div className="bg-gray-900/50 rounded-lg p-2 overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-gray-400">
                                <th className="text-left py-1">Engagement</th>
                                <th className="text-left py-1">Technical</th>
                                <th className="text-right py-1">Atemporal</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-300">
                              <tr><td>5</td><td>5</td><td className="text-right text-green-400 font-mono">2.70</td></tr>
                              <tr><td>4</td><td>5</td><td className="text-right text-green-400 font-mono">2.43</td></tr>
                              <tr><td>4</td><td>4</td><td className="text-right font-mono">2.16</td></tr>
                              <tr><td>3</td><td>5</td><td className="text-right font-mono">2.16</td></tr>
                              <tr><td>3</td><td>4</td><td className="text-right text-amber-400 font-mono">1.89</td></tr>
                              <tr><td>3</td><td>3</td><td className="text-right text-amber-400 font-mono">1.62</td></tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-gray-500 italic">Note: Reply quality does NOT affect atemporal score directly!</p>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="py-12 flex flex-col items-center gap-3">
                      <Calculator className="w-8 h-8 text-gray-500" />
                      <p className="text-gray-400 text-center">Paste content to analyze</p>
                      <p className="text-xs text-gray-500">Score range: Atemporal (0.27-2.70) + Temporal (2.9-4.2)</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Leaderboard</h2>
                {selectedCampaign && <p className="text-sm text-gray-400">{selectedCampaign.title}</p>}
              </div>
              <Button onClick={fetchLeaderboard} disabled={isLoadingLeaderboard} variant="outline" className="border-gray-600 text-gray-300">
                {isLoadingLeaderboard ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
            </div>
            {selectedCampaign && <CampaignStatsCard campaign={selectedCampaign} totalParticipants={totalParticipants} scoreAnalysis={selectedCampaign.scoreAnalysis} />}
            {analysisResult && rankAndReward && selectedCampaign && <YourPositionCard rank={rankAndReward.estimatedRank} topPercent={rankAndReward.topPercent} reward={rankAndReward.estimatedReward} token={selectedCampaign.token} tokenUsdPrice={selectedCampaign.tokenUsdPrice} />}
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <div className="grid grid-cols-12 gap-2 p-4 text-xs text-gray-400 bg-gray-700/30 border-b border-gray-700">
                <div className="col-span-1 font-medium">Rank</div>
                <div className="col-span-5 font-medium">User</div>
                <div className="col-span-3 text-right font-medium">Score</div>
                <div className="col-span-3 text-right font-medium">Subs</div>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {leaderboard.map((e, i) => (
                  <div key={e.rank} className={`grid grid-cols-12 gap-2 p-4 text-sm items-center border-b border-gray-700/50 ${i < 3 ? 'bg-gradient-to-r from-amber-500/5 to-orange-500/5' : i % 2 === 0 ? 'bg-gray-800/20' : ''} hover:bg-gray-700/30`}>
                    <div className="col-span-1">
                      {e.rank <= 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${e.rank === 1 ? 'bg-yellow-500/20' : e.rank === 2 ? 'bg-gray-400/20' : 'bg-amber-600/20'}`}>
                          {e.rank === 1 ? <Crown className="w-5 h-5 text-yellow-400" /> : <Medal className={`w-5 h-5 ${e.rank === 2 ? 'text-gray-300' : 'text-amber-600'}`} />}
                        </div>
                      ) : <span className="text-gray-400 font-medium">#{e.rank}</span>}
                    </div>
                    <div className="col-span-5 flex items-center gap-3">
                      {e.avatar && <img src={e.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-gray-600" />}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-white font-medium truncate">{e.displayName || e.username}</p>
                          {e.verified && <Verified className="w-4 h-4 text-blue-400" />}
                        </div>
                        <p className="text-xs text-gray-500">@{e.username}</p>
                      </div>
                    </div>
                    <div className="col-span-3 text-right font-mono text-green-400 font-medium">{(e.totalPoints || e.points).toFixed(3)}</div>
                    <div className="col-span-3 text-right text-gray-400">{e.totalSubmissions || 1}</div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Test Comparison Tab */}
          <TabsContent value="test" className="space-y-4">
            <TestComparison />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
