'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calculator, TrendingUp, Info,
  Star, Zap, Target, Award, Loader2, Sparkles, FileText,
  Trophy, BarChart3, RefreshCw, Flag, BookOpen,
  FolderKanban, Users, Calendar, Clock, ChevronDown, ChevronUp,
  Check, Send, Medal, Crown, Coins, ExternalLink, Globe,
  Twitter, Verified, AlertCircle, DollarSign, Percent,
  HelpCircle, Lightbulb, PieChart, Layers, Hash, Settings,
  ClipboardList, AwardIcon, Shield, MapPin, Link2
} from 'lucide-react'
import { toast } from 'sonner'

// Types matching Rally API
interface RallyCampaign {
  id: string
  title: string
  intelligentContractAddress: string
  creator: string
  creatorUsername: string
  creatorAvatar: string
  creatorProfile: string
  creatorVerified: boolean
  brief: string
  organizationName: string
  organizationWebsite: string
  organizationLogo: string
  // Briefing sections
  style?: string
  styleDescription?: string
  additionalInfo?: string
  aboutOrganization?: string
  knowledgeBase?: string
  contentEvaluationCriteria?: any
  distributionType?: string
  distributionDescription?: string
  participationRequirements?: {
    minimumFollowers: number
    maximumFollowers: number
    onlyVerifiedUsers: boolean
    requiredChains?: number[]
    geoRestrictions?: string[]
    whitelistEnabled?: boolean
  }
  scoringType?: string
  scoringDescription?: string
  // Dates
  startDate: string
  endDate: string
  campaignDurationPeriods: number
  periodLengthDays: number
  // Stats
  missionCount: number
  participantCount: number
  // Token & Rewards
  token: string
  tokenAddress: string
  tokenLogo: string
  tokenUsdPrice: number
  chainId: number
  totalReward: number
  rewards: any[]
  // Requirements
  minimumFollowers: number
  maximumFollowers: number
  onlyVerifiedUsers: boolean
  // Images
  headerImageUrl: string
  participating: boolean
  userMissionProgress: number
  missions?: RallyMission[]
}

interface RallyMission {
  id: string
  title: string
  description: string
  rules: string
  active: boolean
  participantsCount?: number
}

interface LeaderboardEntry {
  rank: number
  username: string
  displayName?: string
  avatar?: string
  verified?: boolean
  totalPoints: number
  topPercent: number
  followersCount?: number
  totalSubmissions?: number
}

// Grade configuration matching Rally's scoring
const GRADE_CONFIG: { min: number; grade: string; color: string; label: string }[] = [
  { min: 8.0, grade: 'S+', color: 'text-yellow-400', label: 'Exceptional' },
  { min: 7.5, grade: 'S', color: 'text-amber-400', label: 'Outstanding' },
  { min: 7.0, grade: 'A+', color: 'text-green-400', label: 'Excellent' },
  { min: 6.5, grade: 'A', color: 'text-emerald-400', label: 'Very Good' },
  { min: 6.0, grade: 'B+', color: 'text-teal-400', label: 'Good' },
  { min: 5.5, grade: 'B', color: 'text-cyan-400', label: 'Above Average' },
  { min: 5.0, grade: 'C+', color: 'text-blue-400', label: 'Average' },
  { min: 4.0, grade: 'C', color: 'text-gray-400', label: 'Below Average' },
  { min: 0, grade: 'F', color: 'text-red-400', label: 'Fail' }
]

const getGrade = (points: number) => {
  return GRADE_CONFIG.find(g => points >= g.min) || GRADE_CONFIG[GRADE_CONFIG.length - 1]
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const calculateRankAndReward = (
  score: number, 
  leaderboard: LeaderboardEntry[], 
  totalParticipants: number,
  totalReward: number
) => {
  if (totalParticipants === 0 || totalReward === 0) {
    return { estimatedRank: 0, topPercent: 0, estimatedReward: 0 }
  }
  
  const higherScores = leaderboard.filter(e => e.totalPoints > score).length
  let estimatedRank = higherScores + 1
  
  if (leaderboard.length < totalParticipants) {
    const avgScore = leaderboard.length > 0 
      ? leaderboard.reduce((sum, e) => sum + e.totalPoints, 0) / leaderboard.length 
      : 5.0
    
    if (score > avgScore * 1.5) {
      estimatedRank = Math.max(1, Math.floor(totalParticipants * 0.01))
    } else if (score > avgScore * 1.2) {
      estimatedRank = Math.max(1, Math.floor(totalParticipants * 0.05))
    } else if (score > avgScore) {
      estimatedRank = Math.max(1, Math.floor(totalParticipants * 0.1))
    } else if (score > avgScore * 0.8) {
      estimatedRank = Math.max(1, Math.floor(totalParticipants * 0.25))
    } else {
      estimatedRank = Math.floor(totalParticipants * 0.5)
    }
  }
  
  const topPercent = (estimatedRank / totalParticipants) * 100
  
  let estimatedReward = 0
  if (topPercent <= 1) estimatedReward = totalReward * 0.20
  else if (topPercent <= 5) estimatedReward = totalReward * 0.10
  else if (topPercent <= 10) estimatedReward = totalReward * 0.05
  else if (topPercent <= 25) estimatedReward = totalReward * 0.02
  else if (topPercent <= 50) estimatedReward = totalReward * 0.01
  else estimatedReward = totalReward * 0.005
  
  estimatedReward = estimatedReward / 3
  
  return {
    estimatedRank,
    topPercent: Math.min(topPercent, 100),
    estimatedReward: Math.max(estimatedReward, 0)
  }
}

// Analysis Card Component
const AnalysisCard = ({ 
  title, score, maxScore, analysis, icon: Icon 
}: { 
  title: string
  score: number
  maxScore: number
  analysis: string
  icon: React.ElementType
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const percentage = (score / maxScore) * 100
  const scoreColor = percentage >= 80 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400'
  
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${scoreColor}`} />
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${scoreColor} bg-gray-700/50 text-xs`}>
            {score.toFixed(1)}/{maxScore}
          </Badge>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>
      {isOpen && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">{analysis}</p>
        </div>
      )}
    </div>
  )
}

// Collapsible Section Component
const CollapsibleSection = ({ 
  title, icon: Icon, iconColor, children, defaultOpen = false 
}: { 
  title: string
  icon: React.ElementType
  iconColor: string
  children: React.ReactNode
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg bg-gray-700/50`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <span className="font-medium text-white">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && (
        <CardContent className="pt-0 pb-4">
          {children}
        </CardContent>
      )}
    </Card>
  )
}

// Campaign Briefing Component - Rally Style
const CampaignBriefingCard = ({ campaign }: { campaign: RallyCampaign }) => {
  return (
    <div className="space-y-3">
      {/* Style */}
      {campaign.style && (
        <CollapsibleSection title="Style" icon={Zap} iconColor="text-purple-400" defaultOpen={true}>
          <div className="space-y-2">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
              {campaign.style}
            </Badge>
            {campaign.styleDescription && (
              <p className="text-sm text-gray-300">{campaign.styleDescription}</p>
            )}
            {campaign.scoringDescription && (
              <div className="mt-2 p-2 bg-gray-700/30 rounded-lg">
                <p className="text-xs text-gray-400">{campaign.scoringDescription}</p>
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}
      
      {/* Additional Information */}
      {(campaign.additionalInfo || campaign.aboutOrganization) && (
        <CollapsibleSection title="Additional Information" icon={Info} iconColor="text-blue-400">
          <div className="space-y-2 text-sm text-gray-300">
            {campaign.aboutOrganization && (
              <div>
                <p className="text-xs text-gray-500 mb-1">About {campaign.organizationName || 'Organization'}</p>
                <p>{campaign.aboutOrganization}</p>
              </div>
            )}
            {campaign.additionalInfo && <p>{campaign.additionalInfo}</p>}
          </div>
        </CollapsibleSection>
      )}
      
      {/* Knowledge Base */}
      {campaign.knowledgeBase && (
        <CollapsibleSection title="Knowledge Base" icon={BookOpen} iconColor="text-cyan-400">
          <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
            {campaign.knowledgeBase}
          </div>
        </CollapsibleSection>
      )}
      
      {/* Content Evaluation Criteria */}
      {campaign.contentEvaluationCriteria && (
        <CollapsibleSection title="Content Evaluation Criteria" icon={ClipboardList} iconColor="text-amber-400">
          <div className="space-y-2">
            {Object.entries(campaign.contentEvaluationCriteria).map(([key, criteria]: [string, any]) => (
              <div key={key} className="p-2 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{criteria.name || key}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-gray-600">
                      Max: {criteria.maxScore}
                    </Badge>
                    <Badge className={`text-xs ${criteria.weight === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {criteria.weight}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{criteria.description}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}
      
      {/* Distribution Type */}
      {campaign.distributionType && (
        <CollapsibleSection title="Distribution Type" icon={PieChart} iconColor="text-green-400">
          <div className="space-y-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              {campaign.distributionType}
            </Badge>
            {campaign.distributionDescription && (
              <p className="text-sm text-gray-300">{campaign.distributionDescription}</p>
            )}
          </div>
        </CollapsibleSection>
      )}
      
      {/* Participation Requirements */}
      {campaign.participationRequirements && (
        <CollapsibleSection title="Participation Requirements" icon={Shield} iconColor="text-red-400">
          <div className="space-y-2">
            {/* Follower Requirements */}
            {(campaign.participationRequirements.minimumFollowers > 0 || campaign.participationRequirements.maximumFollowers > 0) && (
              <div className="flex items-center gap-2 p-2 bg-gray-700/30 rounded-lg">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  {campaign.participationRequirements.minimumFollowers > 0 && campaign.participationRequirements.maximumFollowers > 0
                    ? `${formatNumber(campaign.participationRequirements.minimumFollowers)} - ${formatNumber(campaign.participationRequirements.maximumFollowers)} followers required`
                    : campaign.participationRequirements.minimumFollowers > 0
                    ? `Min ${formatNumber(campaign.participationRequirements.minimumFollowers)} followers required`
                    : `Max ${formatNumber(campaign.participationRequirements.maximumFollowers)} followers`}
                </span>
              </div>
            )}
            
            {/* Verified Only */}
            {campaign.participationRequirements.onlyVerifiedUsers && (
              <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Verified className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">Verified accounts only</span>
              </div>
            )}
            
            {/* Whitelist */}
            {campaign.participationRequirements.whitelistEnabled && (
              <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400">Whitelist enabled</span>
              </div>
            )}
            
            {/* Geo Restrictions */}
            {campaign.participationRequirements.geoRestrictions && campaign.participationRequirements.geoRestrictions.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">
                  Restricted regions: {campaign.participationRequirements.geoRestrictions.join(', ')}
                </span>
              </div>
            )}
            
            {/* No special requirements */}
            {!campaign.participationRequirements.onlyVerifiedUsers && 
             campaign.participationRequirements.minimumFollowers === 0 && 
             campaign.participationRequirements.maximumFollowers === 0 && (
              <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Open to all participants</span>
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}
    </div>
  )
}

// Campaign Stats Card
const CampaignStatsCard = ({ campaign, totalParticipants }: { campaign: RallyCampaign, totalParticipants: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 p-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <Users className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Peserta</p>
          <p className="text-xl font-bold text-white">{formatNumber(totalParticipants || campaign.participantCount)}</p>
        </div>
      </div>
    </Card>
    
    <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 p-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-amber-500/20 rounded-lg">
          <Coins className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Reward</p>
          <p className="text-xl font-bold text-white">{formatNumber(campaign.totalReward)} <span className="text-sm text-amber-400">{campaign.token}</span></p>
        </div>
      </div>
    </Card>
    
    <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 p-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <FolderKanban className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Misi</p>
          <p className="text-xl font-bold text-white">{campaign.missionCount}</p>
        </div>
      </div>
    </Card>
    
    <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/30 p-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-red-500/20 rounded-lg">
          <Calendar className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400">Berakhir</p>
          <p className="text-xl font-bold text-white">{new Date(campaign.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
        </div>
      </div>
    </Card>
  </div>
)

// Your Position Card
const YourPositionCard = ({ 
  rank, topPercent, reward, token, tokenUsdPrice 
}: { 
  rank: number
  topPercent: number
  reward: number
  token: string
  tokenUsdPrice?: number
}) => (
  <Card className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-purple-500/20 border-amber-500/50 overflow-hidden">
    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
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
          <p className="text-xs text-gray-400">Estimasi Ranking</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Percent className="w-4 h-4 text-gray-400" />
            <span className="text-3xl font-bold text-green-400">{topPercent.toFixed(1)}%</span>
          </div>
          <p className="text-xs text-gray-400">Top Persentase</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Coins className="w-4 h-4 text-gray-400" />
            <span className="text-2xl font-bold text-purple-400">{formatNumber(reward)}</span>
          </div>
          <p className="text-xs text-gray-400">Estimasi {token}</p>
        </div>
      </div>
      
      {tokenUsdPrice && reward > 0 && (
        <div className="mt-3 p-2 bg-green-500/20 rounded-lg border border-green-500/30 text-center">
          <span className="text-green-400 font-medium">≈ ${(reward * tokenUsdPrice).toFixed(2)} USD</span>
          <span className="text-gray-400 text-xs ml-2">(@ ${tokenUsdPrice.toFixed(4)}/{token})</span>
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
  
  const [missions, setMissions] = useState<RallyMission[]>([])
  const [selectedMission, setSelectedMission] = useState<RallyMission | null>(null)
  
  const [content, setContent] = useState('')
  const [campaignContext, setCampaignContext] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  
  const [engagement, setEngagement] = useState({
    likes: 50, replies: 5, retweets: 3, impressions: 1000, followersOfRepliers: 5000
  })
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [totalParticipants, setTotalParticipants] = useState(0)
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)
  
  const fetchCampaigns = useCallback(async () => {
    setIsLoadingCampaigns(true)
    try {
      const response = await fetch('/api/rally-campaigns')
      if (!response.ok) throw new Error('Failed to fetch campaigns')
      const data = await response.json()
      setCampaigns(data)
      toast.success(`${data.length} campaigns loaded!`)
    } catch (error) {
      console.error('Fetch campaigns error:', error)
      toast.error('Failed to fetch campaigns')
    } finally {
      setIsLoadingCampaigns(false)
    }
  }, [])
  
  const selectCampaign = useCallback(async (campaign: RallyCampaign) => {
    setSelectedCampaign(campaign)
    setAnalysisResult(null)
    
    if (campaign.intelligentContractAddress) {
      try {
        const response = await fetch(`/api/rally-campaigns?address=${campaign.intelligentContractAddress}`)
        if (response.ok) {
          const fullCampaign = await response.json()
          setSelectedCampaign(fullCampaign)
          
          const missionList = fullCampaign.missions || []
          setMissions(missionList)
          
          if (missionList.length > 0) {
            setSelectedMission(missionList[0])
            setCampaignContext([
              fullCampaign.brief ? `Brief: ${fullCampaign.brief}` : '',
              fullCampaign.knowledgeBase ? `Knowledge: ${fullCampaign.knowledgeBase.substring(0, 500)}` : '',
              missionList[0].description ? `Mission: ${missionList[0].description}` : '',
              missionList[0].rules ? `Rules: ${missionList[0].rules}` : ''
            ].filter(Boolean).join('\n\n'))
          }
          
          const leaderboardResponse = await fetch(`/api/rally-leaderboard?campaignAddress=${campaign.intelligentContractAddress}&limit=100`)
          if (leaderboardResponse.ok) {
            const leaderboardData = await leaderboardResponse.json()
            setLeaderboard(leaderboardData.leaderboard || [])
            setTotalParticipants(leaderboardData.total || fullCampaign.participantCount || 0)
          }
          
          toast.success('Campaign loaded!')
        }
      } catch (error) {
        console.error('Error loading campaign:', error)
      }
    }
    setActiveTab('analyze')
  }, [])
  
  const fetchLeaderboard = useCallback(async () => {
    setIsLoadingLeaderboard(true)
    try {
      const campaignAddress = selectedCampaign?.intelligentContractAddress || ''
      const url = campaignAddress 
        ? `/api/rally-leaderboard?campaignAddress=${campaignAddress}&limit=100`
        : '/api/rally-leaderboard?limit=100'
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      const data = await response.json()
      setLeaderboard(data.leaderboard || [])
      setTotalParticipants(data.total || 0)
      toast.success(`Leaderboard loaded!`)
    } catch (error) {
      toast.error('Failed to fetch leaderboard')
    } finally {
      setIsLoadingLeaderboard(false)
    }
  }, [selectedCampaign])
  
  const analyzeContent = useCallback(async () => {
    if (!content.trim()) {
      toast.error('Masukkan konten untuk dianalisis')
      return
    }
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: content.trim(), 
          campaignContext: campaignContext || undefined,
          engagement: engagement
        })
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Analisis gagal')
      
      const gates = data.analysis.gates
      const quality = data.analysis.quality
      
      const gateSum = gates.contentAlignment.score + gates.informationAccuracy.score +
                      gates.campaignCompliance.score + gates.originality.score
      const qualitySum = quality.engagementPotential.score + quality.technicalQuality.score + quality.replyQuality.score
      
      let atemporalPoints = (gateSum / 8) * (qualitySum / 15) * 2.5
      const minGate = Math.min(gates.contentAlignment.score, gates.informationAccuracy.score, 
                               gates.campaignCompliance.score, gates.originality.score)
      if (minGate === 0) atemporalPoints *= 0.5
      atemporalPoints = Math.min(atemporalPoints, 2.43)
      
      const temporalPoints = 1.12 + 
        Math.log10(engagement.likes + 1) * 0.18 +
        Math.log10(engagement.replies + 1) * 0.22 +
        Math.log10(engagement.retweets + 1) * 0.15 +
        Math.log10(engagement.impressions + 1) * 0.025 +
        Math.log10(engagement.followersOfRepliers + 1) * 0.41
      
      const totalPoints = atemporalPoints + temporalPoints
      const grade = getGrade(totalPoints)
      
      setAnalysisResult({
        gates, quality, engagement,
        atemporalPoints: Math.round(atemporalPoints * 100) / 100,
        temporalPoints: Math.round(temporalPoints * 100) / 100,
        totalPoints: Math.round(totalPoints * 100) / 100,
        grade,
      })
      
      toast.success('Analysis complete!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }, [content, campaignContext, engagement])
  
  useEffect(() => {
    if (campaigns.length === 0) fetchCampaigns()
  }, [])
  
  const rankAndReward = analysisResult && selectedCampaign ? 
    calculateRankAndReward(analysisResult.totalPoints, leaderboard, totalParticipants || selectedCampaign.participantCount, selectedCampaign.totalReward) : null
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Rally Score Analyzer
              </h1>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                Connected to Rally.fun API
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50 flex items-center gap-1">
            <Globe className="w-3 h-3" /> LIVE DATA
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <FolderKanban className="w-4 h-4 mr-2" /> Campaigns
            </TabsTrigger>
            <TabsTrigger value="analyze" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Send className="w-4 h-4 mr-2" /> Analyze
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" /> Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Active Rally Campaigns</h2>
              <Button onClick={fetchCampaigns} disabled={isLoadingCampaigns} variant="outline" className="border-gray-600 text-gray-300">
                {isLoadingCampaigns ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
            </div>
            
            {isLoadingCampaigns && campaigns.length === 0 && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="py-12 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                  <p className="text-gray-400">Loading campaigns...</p>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <Card 
                  key={campaign.id}
                  onClick={() => selectCampaign(campaign)}
                  className={`cursor-pointer transition-all hover:scale-[1.02] overflow-hidden ${
                    selectedCampaign?.id === campaign.id 
                      ? 'bg-amber-600/20 border-amber-500' 
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {campaign.headerImageUrl && (
                    <div className="h-24 w-full overflow-hidden">
                      <img src={campaign.headerImageUrl} alt="" className="w-full h-full object-cover opacity-60" />
                    </div>
                  )}
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base text-white truncate">{campaign.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {campaign.creatorAvatar && (
                            <img src={campaign.creatorAvatar} alt="" className="w-5 h-5 rounded-full" />
                          )}
                          <p className="text-xs text-gray-500 truncate">
                            by {campaign.creator}
                            {campaign.creatorVerified && <Verified className="w-3 h-3 inline ml-1 text-blue-400" />}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {campaign.tokenLogo && <img src={campaign.tokenLogo} alt="" className="w-5 h-5 rounded-full" />}
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 text-xs">{campaign.token}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {campaign.brief && (
                      <p className="text-xs text-gray-400 line-clamp-2">{campaign.brief}</p>
                    )}
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg text-center">
                        <FolderKanban className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                        <p className="text-white font-bold text-sm">{campaign.missionCount || 0}</p>
                        <p className="text-[10px] text-gray-400">Missions</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 p-2 rounded-lg text-center">
                        <Users className="w-4 h-4 text-green-400 mx-auto mb-1" />
                        <p className="text-white font-bold text-sm">{formatNumber(campaign.participantCount || 0)}</p>
                        <p className="text-[10px] text-gray-400">Members</p>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-center">
                        <Coins className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                        <p className="text-white font-bold text-sm">{formatNumber(campaign.totalReward || 0)}</p>
                        <p className="text-[10px] text-gray-400">Rewards</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          {campaign.chainId === 8453 ? '🔵 Base' : `Chain ${campaign.chainId}`}
                        </Badge>
                        {campaign.onlyVerifiedUsers && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                            <Verified className="w-3 h-3 mr-1" /> Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {campaign.minimumFollowers > 0 && (
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <AlertCircle className="w-3 h-3" />
                        <span>Min {formatNumber(campaign.minimumFollowers)} followers</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analyze Tab */}
          <TabsContent value="analyze" className="space-y-4">
            {selectedCampaign && (
              <>
                {/* Campaign Header */}
                <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedCampaign.creatorAvatar && (
                          <img src={selectedCampaign.creatorAvatar} alt="" className="w-10 h-10 rounded-full" />
                        )}
                        <div>
                          <p className="text-xs text-gray-400">Selected Campaign</p>
                          <p className="text-white font-bold">{selectedCampaign.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" 
                          onClick={() => window.open(`https://rally.fun/campaign/${selectedCampaign.intelligentContractAddress}`, '_blank')}
                          className="border-amber-600 text-amber-400 hover:bg-amber-600/20">
                          <ExternalLink className="w-4 h-4 mr-1" /> Open in Rally
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('campaigns')} className="border-gray-600 text-gray-300">
                          Change
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Campaign Stats */}
                <CampaignStatsCard campaign={selectedCampaign} totalParticipants={totalParticipants} />
                
                {/* Campaign Briefing Sections */}
                <CampaignBriefingCard campaign={selectedCampaign} />
              </>
            )}
            
            {/* Mission Briefing */}
            {selectedMission && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" /> Mission Briefing
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-300 space-y-2">
                  <p><strong>Title:</strong> {selectedMission.title}</p>
                  {selectedMission.description && <p><strong>Description:</strong> {selectedMission.description}</p>}
                  {selectedMission.rules && <p><strong>Rules:</strong> {selectedMission.rules}</p>}
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input */}
              <div className="space-y-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" /> Content to Analyze
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Paste your tweet/content here..."
                      className="bg-gray-700/50 border-gray-600 text-white min-h-[120px] resize-none"
                    />
                    <Button
                      onClick={analyzeContent}
                      disabled={isAnalyzing || !content.trim()}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50"
                    >
                      {isAnalyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4 mr-2" /> Analyze with AI</>}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-400" /> Engagement Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-xs">Likes</label>
                        <Input type="number" min={0} value={engagement.likes}
                          onChange={(e) => setEngagement(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                          className="bg-gray-700/50 border-gray-600 text-white h-9" />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs">Replies</label>
                        <Input type="number" min={0} value={engagement.replies}
                          onChange={(e) => setEngagement(prev => ({ ...prev, replies: parseInt(e.target.value) || 0 }))}
                          className="bg-gray-700/50 border-gray-600 text-white h-9" />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs">Retweets</label>
                        <Input type="number" min={0} value={engagement.retweets}
                          onChange={(e) => setEngagement(prev => ({ ...prev, retweets: parseInt(e.target.value) || 0 }))}
                          className="bg-gray-700/50 border-gray-600 text-white h-9" />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs">Impressions</label>
                        <Input type="number" min={0} value={engagement.impressions}
                          onChange={(e) => setEngagement(prev => ({ ...prev, impressions: parseInt(e.target.value) || 0 }))}
                          className="bg-gray-700/50 border-gray-600 text-white h-9" />
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs">Followers of Repliers</label>
                      <Input type="number" min={0} value={engagement.followersOfRepliers}
                        onChange={(e) => setEngagement(prev => ({ ...prev, followersOfRepliers: parseInt(e.target.value) || 0 }))}
                        className="bg-gray-700/50 border-gray-600 text-white h-9" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="space-y-4">
                {analysisResult ? (
                  <>
                    <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Award className="w-4 h-4 text-amber-400" /> Estimated Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-4">
                          <div className={`text-5xl font-bold ${analysisResult.grade.color} mb-2`}>
                            {analysisResult.totalPoints.toFixed(2)}
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <Badge className={`${analysisResult.grade.color} bg-gray-700/50 text-lg px-3 py-1`}>
                              {analysisResult.grade.grade}
                            </Badge>
                            <span className="text-gray-400 text-sm">{analysisResult.grade.label}</span>
                          </div>
                        </div>
                        
                        <Separator className="bg-gray-700 my-4" />
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Atemporal Points</span>
                            <span className="font-bold text-cyan-400">{analysisResult.atemporalPoints.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Temporal Points</span>
                            <span className="font-bold text-green-400">{analysisResult.temporalPoints.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {rankAndReward && selectedCampaign && (
                      <YourPositionCard 
                        rank={rankAndReward.estimatedRank}
                        topPercent={rankAndReward.topPercent}
                        reward={rankAndReward.estimatedReward}
                        token={selectedCampaign.token}
                        tokenUsdPrice={selectedCampaign.tokenUsdPrice}
                      />
                    )}

                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Target className="w-4 h-4 text-cyan-400" /> Gate Scores (0-2)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <AnalysisCard title="Content Alignment" score={analysisResult.gates.contentAlignment.score} maxScore={2} analysis={analysisResult.gates.contentAlignment.reason} icon={Check} />
                        <AnalysisCard title="Information Accuracy" score={analysisResult.gates.informationAccuracy.score} maxScore={2} analysis={analysisResult.gates.informationAccuracy.reason} icon={Info} />
                        <AnalysisCard title="Campaign Compliance" score={analysisResult.gates.campaignCompliance.score} maxScore={2} analysis={analysisResult.gates.campaignCompliance.reason} icon={Flag} />
                        <AnalysisCard title="Originality" score={analysisResult.gates.originality.score} maxScore={2} analysis={analysisResult.gates.originality.reason} icon={Star} />
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Star className="w-4 h-4 text-purple-400" /> Quality Scores (0-5)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <AnalysisCard title="Engagement Potential" score={analysisResult.quality.engagementPotential.score} maxScore={5} analysis={analysisResult.quality.engagementPotential.reason} icon={Zap} />
                        <AnalysisCard title="Technical Quality" score={analysisResult.quality.technicalQuality.score} maxScore={5} analysis={analysisResult.quality.technicalQuality.reason} icon={FileText} />
                        <AnalysisCard title="Reply Quality" score={analysisResult.quality.replyQuality.score} maxScore={5} analysis={analysisResult.quality.replyQuality.reason} icon={TrendingUp} />
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="py-12 flex flex-col items-center gap-3">
                      <Calculator className="w-8 h-8 text-gray-500" />
                      <p className="text-gray-400 text-center">Paste your content and click Analyze</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Leaderboard</h2>
                {selectedCampaign && <p className="text-sm text-gray-400">{selectedCampaign.title}</p>}
              </div>
              <Button onClick={fetchLeaderboard} disabled={isLoadingLeaderboard} variant="outline" className="border-gray-600 text-gray-300">
                {isLoadingLeaderboard ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
            </div>
            
            {selectedCampaign && <CampaignStatsCard campaign={selectedCampaign} totalParticipants={totalParticipants} />}
            
            {analysisResult && rankAndReward && selectedCampaign && (
              <YourPositionCard 
                rank={rankAndReward.estimatedRank}
                topPercent={rankAndReward.topPercent}
                reward={rankAndReward.estimatedReward}
                token={selectedCampaign.token}
                tokenUsdPrice={selectedCampaign.tokenUsdPrice}
              />
            )}
            
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <div className="grid grid-cols-12 gap-2 p-4 text-xs text-gray-400 bg-gray-700/30 border-b border-gray-700">
                <div className="col-span-1 font-medium">Rank</div>
                <div className="col-span-5 font-medium">User</div>
                <div className="col-span-2 text-right font-medium">Points</div>
                <div className="col-span-2 text-right font-medium">Top %</div>
                <div className="col-span-2 text-right font-medium">Submissions</div>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto">
                {leaderboard.map((entry, idx) => (
                  <div 
                    key={entry.rank} 
                    className={`grid grid-cols-12 gap-2 p-4 text-sm items-center border-b border-gray-700/50 ${
                      idx < 3 ? 'bg-gradient-to-r from-amber-500/5 to-orange-500/5' : idx % 2 === 0 ? 'bg-gray-800/20' : ''
                    } hover:bg-gray-700/30 transition-colors`}
                  >
                    <div className="col-span-1">
                      {entry.rank <= 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          entry.rank === 1 ? 'bg-yellow-500/20' : entry.rank === 2 ? 'bg-gray-400/20' : 'bg-amber-600/20'
                        }`}>
                          {entry.rank === 1 ? <Crown className="w-5 h-5 text-yellow-400" /> : 
                           entry.rank === 2 ? <Medal className="w-5 h-5 text-gray-300" /> : 
                           <Medal className="w-5 h-5 text-amber-600" />}
                        </div>
                      ) : <span className="text-gray-400 font-medium">#{entry.rank}</span>}
                    </div>
                    <div className="col-span-5 flex items-center gap-3">
                      {entry.avatar && <img src={entry.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-gray-600" />}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-white font-medium truncate">{entry.displayName || entry.username}</p>
                          {entry.verified && <Verified className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500">@{entry.username}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-right font-mono text-green-400 font-medium">{entry.totalPoints.toFixed(2)}</div>
                    <div className="col-span-2 text-right">
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">Top {entry.topPercent.toFixed(1)}%</Badge>
                    </div>
                    <div className="col-span-2 text-right text-gray-400">{entry.totalSubmissions || 1} posts</div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
