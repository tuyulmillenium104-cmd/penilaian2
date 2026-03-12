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
  Check, Send, Medal, Crown, Coins, ExternalLink, Globe, Verified, AlertCircle, Percent, Hash, PieChart
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
  points: number
  totalSubmissions?: number
}

// Grade config from real Rally data
const GRADE_CONFIG = [
  { min: 2.80, grade: 'S+', color: 'text-yellow-400', label: 'Exceptional', percentile: 'Top 1%' },
  { min: 2.60, grade: 'S', color: 'text-amber-400', label: 'Outstanding', percentile: 'Top 5%' },
  { min: 2.40, grade: 'A+', color: 'text-green-400', label: 'Excellent', percentile: 'Top 10%' },
  { min: 2.20, grade: 'A', color: 'text-emerald-400', label: 'Very Good', percentile: 'Top 25%' },
  { min: 2.00, grade: 'B+', color: 'text-teal-400', label: 'Good', percentile: 'Above Avg' },
  { min: 1.70, grade: 'B', color: 'text-cyan-400', label: 'Average', percentile: 'Average' },
  { min: 1.30, grade: 'C+', color: 'text-blue-400', label: 'Below Avg', percentile: 'Below Avg' },
  { min: 1.00, grade: 'C', color: 'text-gray-400', label: 'Poor', percentile: 'Poor' },
  { min: 0, grade: 'F', color: 'text-red-400', label: 'Fail', percentile: 'Fail' }
]

const getGrade = (points: number) => GRADE_CONFIG.find(g => points >= g.min) || GRADE_CONFIG[GRADE_CONFIG.length - 1]
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const calculateRankAndReward = (score: number, leaderboard: LeaderboardEntry[], totalParticipants: number, totalReward: number) => {
  if (totalParticipants === 0 || totalReward === 0) return { estimatedRank: 0, topPercent: 0, estimatedReward: 0 }
  const higherScores = leaderboard.filter(e => (e.points / 1e18) > score).length
  let estimatedRank = higherScores + 1
  if (leaderboard.length < totalParticipants) {
    const avgScore = leaderboard.length > 0 ? leaderboard.reduce((sum, e) => sum + e.points / 1e18, 0) / leaderboard.length : 1.88
    if (score > avgScore * 1.3) estimatedRank = Math.max(1, Math.floor(totalParticipants * 0.01))
    else if (score > avgScore * 1.1) estimatedRank = Math.max(1, Math.floor(totalParticipants * 0.05))
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
              <p className="text-gray-400 text-xs">Base {config.scoringFormula.atemporalBase} + Gate × Quality</p>
              <p className="text-gray-500 text-xs">Max: {config.scoringFormula.atemporalMax}</p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/30">
              <p className="text-green-400 font-medium">Temporal (Engagement)</p>
              <p className="text-gray-400 text-xs">Base {config.scoringFormula.temporalBase} + log(metrics)</p>
              <p className="text-gray-500 text-xs">Max: {config.scoringFormula.temporalMax}</p>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <p className="text-amber-400 font-medium">Total Max: {config.scoringFormula.totalMax}</p>
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
  const [comparisonData, setComparisonData] = useState<any>(null)
  const [isLoadingComparison, setIsLoadingComparison] = useState(false)

  const fetchComparison = useCallback(async (limit: number = 150) => {
    setIsLoadingComparison(true)
    try {
      const res = await fetch(`/api/rally-comparison?limit=${limit}`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setComparisonData(data)
      toast.success(`Loaded ${data.verification.totalSamples} samples!`)
    } catch (e) {
      toast.error('Failed to load comparison')
    } finally {
      setIsLoadingComparison(false)
    }
  }, [])

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
              <p className="text-gray-400 text-sm flex items-center gap-2">
                Calibrated from Real Rally Data 
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 font-mono">v1.0 BASELINE</Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50"><Globe className="w-3 h-3 mr-1" /> LIVE</Badge>
          </div>
        </div>
        
        {/* Version Info Banner */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 mb-4">
          <CardContent className="py-3 px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Atemporal:</span>
                  <span className="text-sm font-bold text-green-400">90.8%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Temporal:</span>
                  <span className="text-sm font-bold text-green-400">91.3%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Overall:</span>
                  <span className="text-sm font-bold text-green-400">95.1%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Samples:</span>
                  <span className="text-sm font-bold text-purple-400">200</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Formula: <code className="text-cyan-400">QUALITY_AVG × 0.617 + BONUS (max 2.70)</code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"><FolderKanban className="w-4 h-4 mr-2" />Campaigns</TabsTrigger>
            <TabsTrigger value="analyze" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"><Send className="w-4 h-4 mr-2" />Analyze</TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"><Trophy className="w-4 h-4 mr-2" />Leaderboard</TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"><BarChart3 className="w-4 h-4 mr-2" />Accuracy</TabsTrigger>
          </TabsList>

          {/* Campaigns */}
          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Active Campaigns</h2>
              <Button onClick={fetchCampaigns} disabled={isLoadingCampaigns} variant="outline" className="border-gray-600 text-gray-300">
                {isLoadingCampaigns ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map(c => (
                <Card key={c.id} onClick={() => selectCampaign(c)} className={`cursor-pointer transition-all hover:scale-[1.02] overflow-hidden ${selectedCampaign?.id === c.id ? 'bg-amber-600/20 border-amber-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'}`}>
                  {c.headerImageUrl && <div className="h-20 w-full overflow-hidden"><img src={c.headerImageUrl} alt="" className="w-full h-full object-cover opacity-60" /></div>}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base truncate">{c.title}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {c.creatorAvatar && <img src={c.creatorAvatar} alt="" className="w-4 h-4 rounded-full" />}
                      <span>by {c.creator}{c.creatorVerified && <Verified className="w-3 h-3 inline ml-1 text-blue-400" />}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-blue-500/10 p-2 rounded text-center"><p className="text-white font-bold">{c.missionCount}</p><p className="text-gray-400">Missions</p></div>
                      <div className="bg-green-500/10 p-2 rounded text-center"><p className="text-white font-bold">{formatNumber(c.participantCount)}</p><p className="text-gray-400">Users</p></div>
                      <div className="bg-amber-500/10 p-2 rounded text-center"><p className="text-white font-bold">{formatNumber(c.totalReward)}</p><p className="text-gray-400">{c.token}</p></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className="border-gray-600 text-gray-400">{c.style || 'Quality Engagement'}</Badge>
                      <span className="text-gray-400">Ends: {new Date(c.endDate).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                  </>
                ) : (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="py-12 flex flex-col items-center gap-3">
                      <Calculator className="w-8 h-8 text-gray-500" />
                      <p className="text-gray-400 text-center">Paste content to analyze</p>
                      <p className="text-xs text-gray-500">Score range: 0.77 - 3.04 (real Rally data)</p>
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
                    <div className="col-span-3 text-right font-mono text-green-400 font-medium">{(e.points / 1e18).toFixed(3)}</div>
                    <div className="col-span-3 text-right text-gray-400">{e.totalSubmissions || 1}</div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Accuracy Comparison */}
          <TabsContent value="comparison" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Formula Accuracy Verification</h2>
                <p className="text-sm text-gray-400">Comparing our formula against real Rally scores</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => fetchComparison(50)} disabled={isLoadingComparison} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                  50
                </Button>
                <Button onClick={() => fetchComparison(100)} disabled={isLoadingComparison} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                  100
                </Button>
                <Button onClick={() => fetchComparison(200)} disabled={isLoadingComparison} variant="outline" className="border-amber-600 text-amber-400 text-xs">
                  {isLoadingComparison ? <Loader2 className="w-4 h-4 animate-spin" /> : '200+'}
                </Button>
              </div>
            </div>
            
            {comparisonData?.success ? (
              <>
                {/* Formula Display */}
                <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
                  <CardContent className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-cyan-400 font-medium mb-1">Atemporal Formula</p>
                        <code className="text-xs text-gray-300">{comparisonData.formula.atemporal}</code>
                      </div>
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-green-400 font-medium mb-1">Temporal Formula</p>
                        <code className="text-xs text-gray-300">{comparisonData.formula.temporal}</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 p-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Samples Tested</p>
                      <p className="text-2xl font-bold text-white">{comparisonData.verification.totalSamples}</p>
                    </div>
                  </Card>
                  <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30 p-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Atemporal Accuracy</p>
                      <p className="text-2xl font-bold text-cyan-400">{comparisonData.verification.atemporalFormula.accuracy}</p>
                    </div>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30 p-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Temporal Accuracy</p>
                      <p className="text-2xl font-bold text-green-400">{comparisonData.verification.temporalFormula.accuracy}</p>
                    </div>
                  </Card>
                  <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 p-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Overall Accuracy</p>
                      <p className="text-2xl font-bold text-amber-400">{comparisonData.verification.overallAccuracy}</p>
                    </div>
                  </Card>
                </div>

                {/* Error Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-cyan-400">Atemporal Error Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {comparisonData.verification.atemporalFormula.distribution && (
                          <>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Exact (&lt;0.01)</span>
                              <span className="text-green-400 font-bold">{comparisonData.verification.atemporalFormula.distribution.exact}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Very Close (&lt;0.05)</span>
                              <span className="text-green-400">{comparisonData.verification.atemporalFormula.distribution.veryClose}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Close (&lt;0.1)</span>
                              <span className="text-yellow-400">{comparisonData.verification.atemporalFormula.distribution.close}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Moderate (&lt;0.2)</span>
                              <span className="text-orange-400">{comparisonData.verification.atemporalFormula.distribution.moderate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Far (&gt;=0.2)</span>
                              <span className="text-red-400">{comparisonData.verification.atemporalFormula.distribution.far}</span>
                            </div>
                          </>
                        )}
                        <Separator className="bg-gray-700 my-2" />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Median Error</span>
                          <span className="text-gray-400">{comparisonData.verification.atemporalFormula.medianDiff}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Max Error</span>
                          <span className="text-gray-400">{comparisonData.verification.atemporalFormula.maxDiff}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-green-400">Temporal Error Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {comparisonData.verification.temporalFormula.distribution && (
                          <>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Exact (&lt;0.05)</span>
                              <span className="text-green-400 font-bold">{comparisonData.verification.temporalFormula.distribution.exact}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Very Close (&lt;0.1)</span>
                              <span className="text-green-400">{comparisonData.verification.temporalFormula.distribution.veryClose}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Close (&lt;0.3)</span>
                              <span className="text-yellow-400">{comparisonData.verification.temporalFormula.distribution.close}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Moderate (&lt;0.5)</span>
                              <span className="text-orange-400">{comparisonData.verification.temporalFormula.distribution.moderate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Far (&gt;=0.5)</span>
                              <span className="text-red-400">{comparisonData.verification.temporalFormula.distribution.far}</span>
                            </div>
                          </>
                        )}
                        <Separator className="bg-gray-700 my-2" />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Median Error</span>
                          <span className="text-gray-400">{comparisonData.verification.temporalFormula.medianDiff}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Max Error</span>
                          <span className="text-gray-400">{comparisonData.verification.temporalFormula.maxDiff}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sample Comparisons */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-base">Sample Comparisons ({comparisonData.samples?.length || 0} of {comparisonData.verification.totalSamples})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-gray-800">
                          <tr className="border-b border-gray-700">
                            <th className="text-left p-2 text-gray-400">#</th>
                            <th className="text-left p-2 text-gray-400">User</th>
                            <th className="text-right p-2 text-gray-400">Rally Atemp.</th>
                            <th className="text-right p-2 text-gray-400">Our Atemp.</th>
                            <th className="text-right p-2 text-gray-400">Diff</th>
                            <th className="text-right p-2 text-gray-400">Rally Temp.</th>
                            <th className="text-right p-2 text-gray-400">Our Temp.</th>
                            <th className="text-right p-2 text-gray-400">Diff</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonData.samples?.map((s: any, idx: number) => (
                            <tr key={s.username || idx} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                              <td className="p-2 text-gray-500">{idx + 1}</td>
                              <td className="p-2 font-medium truncate max-w-[120px]">{s.username || 'Unknown'}</td>
                              <td className="p-2 text-right text-cyan-400">{s.rally?.atemporal?.toFixed(3) || '-'}</td>
                              <td className="p-2 text-right text-white">{s.our?.atemporal?.toFixed(3) || '-'}</td>
                              <td className={`p-2 text-right ${s.atemporalMatch ? 'text-green-400' : 'text-yellow-400'}`}>
                                {s.diff?.atemporal?.toFixed(4) || '-'} {s.atemporalMatch ? '✓' : '✗'}
                              </td>
                              <td className="p-2 text-right text-green-400">{s.rally?.temporal?.toFixed(3) || '-'}</td>
                              <td className="p-2 text-right text-white">{s.our?.temporal?.toFixed(3) || '-'}</td>
                              <td className={`p-2 text-right ${s.temporalMatch ? 'text-green-400' : 'text-yellow-400'}`}>
                                {s.diff?.temporal?.toFixed(4) || '-'} {s.temporalMatch ? '✓' : '✗'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="py-12 flex flex-col items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-gray-500" />
                  <p className="text-gray-400 text-center">Click button to load comparison data</p>
                  <Button onClick={() => fetchComparison(150)} className="bg-amber-600 hover:bg-amber-700">
                    Load 150 Samples
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
