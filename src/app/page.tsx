'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calculator, TrendingUp, Info,
  Star, Zap, Target, Award, Loader2, Sparkles, FileText, Download,
  Trophy, BarChart3, RefreshCw, GitCompare, Flag, BookOpen, Settings2
} from 'lucide-react'
import { toast } from 'sonner'

// Types
interface RallyAnalysis {
  category: string
  analysis: string
  atto_score: string
  atto_max_score: string
}

interface RallySubmission {
  id: string
  xUsername: string
  atemporalPoints: string
  temporalPoints: string
  analysis: RallyAnalysis[]
  mission?: { title: string }
}

// Convert atto (10^-18) to decimal
const attoToDecimal = (atto: string | undefined): number => {
  if (!atto) return 0
  return parseFloat(atto) / 1e18
}

// Grade configuration
const GRADE_CONFIG: { min: number; grade: string; color: string; label: string }[] = [
  { min: 6.0, grade: 'S+', color: 'text-yellow-400', label: 'Exceptional' },
  { min: 5.5, grade: 'S', color: 'text-amber-400', label: 'Outstanding' },
  { min: 5.0, grade: 'A+', color: 'text-green-400', label: 'Excellent' },
  { min: 4.5, grade: 'A', color: 'text-emerald-400', label: 'Very Good' },
  { min: 4.0, grade: 'B+', color: 'text-teal-400', label: 'Good' },
  { min: 3.5, grade: 'B', color: 'text-cyan-400', label: 'Above Average' },
  { min: 3.0, grade: 'C+', color: 'text-blue-400', label: 'Average' },
  { min: 2.0, grade: 'C', color: 'text-gray-400', label: 'Below Average' },
  { min: 1.0, grade: 'D', color: 'text-orange-400', label: 'Poor' },
  { min: 0, grade: 'F', color: 'text-red-400', label: 'Fail' }
]

const getGrade = (points: number) => {
  return GRADE_CONFIG.find(g => points >= g.min) || GRADE_CONFIG[GRADE_CONFIG.length - 1]
}

// Rally Scoring Formula
const calculateRallyScore = (
  gateScores: { contentAlignment: number; informationAccuracy: number; campaignCompliance: number; originality: number },
  qualityScores: { engagementPotential: number; technicalQuality: number; replyQuality: number },
  engagementMetrics: { likes: number; replies: number; followersOfRepliers: number; impressions: number; retweets: number }
) => {
  const gates = [gateScores.contentAlignment, gateScores.informationAccuracy, gateScores.campaignCompliance, gateScores.originality]
  const minGate = Math.min(...gates)
  const avgGate = gates.reduce((a, b) => a + b, 0) / gates.length
  const gateSum = gates.reduce((a, b) => a + b, 0)
  
  let gateMultiplier: number
  if (minGate === 0) {
    gateMultiplier = 0.5
  } else {
    const gStar = avgGate / 2
    gateMultiplier = 1 + 0.5 * (gStar * 2 - 1)
  }
  
  const qualitySum = qualityScores.engagementPotential + qualityScores.technicalQuality + qualityScores.replyQuality
  
  const gateFactor = gateSum / 8
  const qualityFactor = qualitySum / 15
  
  let atemporalPoints = gateFactor * qualityFactor * 2.5
  if (gateMultiplier < 1) atemporalPoints *= gateMultiplier
  atemporalPoints = Math.min(atemporalPoints, 2.43)
  
  const { likes, replies, followersOfRepliers, impressions, retweets } = engagementMetrics
  const likesContrib = Math.log10(likes + 1) * 0.18
  const repliesContrib = Math.log10(replies + 1) * 0.22
  const retweetsContrib = Math.log10(retweets + 1) * 0.15
  const impressionsContrib = Math.log10(impressions + 1) * 0.025
  const followersContrib = Math.log10(followersOfRepliers + 1) * 0.41
  const baseTemporal = 1.12
  
  let temporalPoints = baseTemporal + likesContrib + repliesContrib + retweetsContrib + impressionsContrib + followersContrib
  const totalPoints = atemporalPoints + temporalPoints
  
  return {
    gateMultiplier,
    gateDetails: { ...gateScores, sum: gateSum, avg: avgGate },
    qualityDetails: { ...qualityScores, sum: qualitySum, avg: qualitySum / 3 },
    atemporalPoints: Math.round(atemporalPoints * 100) / 100,
    temporalPoints: Math.round(temporalPoints * 100) / 100,
    totalPoints: Math.round(totalPoints * 100) / 100,
    grade: getGrade(totalPoints)
  }
}

interface CampaignCriteria {
  mission: string
  rules: string
  style: string
  knowledgeBase: string
}

export default function RallyScoreAnalyzer() {
  const [activeTab, setActiveTab] = useState('estimator')
  const [content, setContent] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Campaign criteria
  const [campaignCriteria, setCampaignCriteria] = useState<CampaignCriteria>({
    mission: '',
    rules: '',
    style: '',
    knowledgeBase: ''
  })
  const [showCampaignInput, setShowCampaignInput] = useState(false)
  
  const [gateScores, setGateScores] = useState({
    contentAlignment: 2, informationAccuracy: 2, campaignCompliance: 2, originality: 2
  })
  
  const [qualityScores, setQualityScores] = useState({
    engagementPotential: 4, technicalQuality: 4, replyQuality: 3
  })
  
  const [engagementMetrics, setEngagementMetrics] = useState({
    likes: 50, replies: 5, followersOfRepliers: 5000, impressions: 1000, retweets: 5
  })
  
  const [estimatedResult, setEstimatedResult] = useState<ReturnType<typeof calculateRallyScore> | null>(null)
  const [realSubmissions, setRealSubmissions] = useState<RallySubmission[]>([])
  const [isLoadingReal, setIsLoadingReal] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<RallySubmission | null>(null)
  
  useEffect(() => {
    const result = calculateRallyScore(gateScores, qualityScores, engagementMetrics)
    setEstimatedResult(result)
  }, [gateScores, qualityScores, engagementMetrics])
  
  const fetchRealSubmissions = useCallback(async () => {
    setIsLoadingReal(true)
    setLoadError(null)
    try {
      // Use local proxy API to avoid CORS issues
      const response = await fetch('/api/rally-submissions')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setRealSubmissions(data)
      toast.success(`${data.length} submissions loaded!`)
    } catch (error) {
      console.error('Fetch error:', error)
      setLoadError('Failed to load Rally data. Click retry.')
      toast.error('Failed to load Rally data')
    } finally {
      setIsLoadingReal(false)
    }
  }, [])
  
  // Auto-fetch on mount
  useEffect(() => {
    if (realSubmissions.length === 0) {
      fetchRealSubmissions()
    }
  }, [])
  
  const analyzeContent = useCallback(async () => {
    if (!content.trim()) {
      toast.error('Masukkan konten untuk dianalisis')
      return
    }
    setIsAnalyzing(true)
    try {
      // Build campaign context from criteria
      const campaignContext = [
        campaignCriteria.mission ? `Mission: ${campaignCriteria.mission}` : '',
        campaignCriteria.rules ? `Rules: ${campaignCriteria.rules}` : '',
        campaignCriteria.style ? `Style: ${campaignCriteria.style}` : '',
        campaignCriteria.knowledgeBase ? `Knowledge Base: ${campaignCriteria.knowledgeBase}` : ''
      ].filter(Boolean).join('. ')
      
      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: content.trim(), 
          campaignContext: campaignContext || undefined 
        })
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Analisis gagal')
      
      setGateScores({
        contentAlignment: data.analysis.gates.contentAlignment.score,
        informationAccuracy: data.analysis.gates.informationAccuracy.score,
        campaignCompliance: data.analysis.gates.campaignCompliance.score,
        originality: data.analysis.gates.originality.score
      })
      setQualityScores({
        engagementPotential: data.analysis.quality.engagementPotential.score,
        technicalQuality: data.analysis.quality.technicalQuality.score,
        replyQuality: 3
      })
      toast.success('Analisis AI selesai!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Analisis gagal')
    } finally {
      setIsAnalyzing(false)
    }
  }, [content, campaignCriteria])
  
  const loadSubmissionData = useCallback((sub: RallySubmission) => {
    const getScore = (category: string) => {
      const a = sub.analysis.find(x => x.category === category)
      return a ? attoToDecimal(a.atto_score) : 0
    }
    setGateScores({
      contentAlignment: getScore('Content Alignment'),
      informationAccuracy: getScore('Information Accuracy'),
      campaignCompliance: getScore('Campaign Compliance'),
      originality: getScore('Originality and Authenticity')
    })
    setQualityScores({
      engagementPotential: getScore('Engagement Potential'),
      technicalQuality: getScore('Technical Quality'),
      replyQuality: getScore('Reply Quality')
    })
    setEngagementMetrics({
      likes: getScore('Likes'), replies: getScore('Replies'), retweets: getScore('Retweets'),
      impressions: getScore('Impressions'), followersOfRepliers: getScore('Followers of Repliers')
    })
    setSelectedSubmission(sub)
    setActiveTab('estimator')
    toast.success('Data submission dimuat!')
  }, [])

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
              <p className="text-gray-400 text-sm">Calibrated with Real Rally.fun API Data</p>
            </div>
          </div>
          
          <Button
            onClick={() => window.open('/rally-complete-guide.pdf', '_blank')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-amber-500/20"
          >
            <FileText className="w-4 h-4" />
            Open PDF Guide
          </Button>
        </div>

        {/* Formula Info */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="py-3 px-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <strong>Formula:</strong> Total = Atemporal (gate×quality×2.5) + Temporal (base + log engagement)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="estimator" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Calculator className="w-4 h-4 mr-2" /> Score Estimator
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" /> Live Rally Data
            </TabsTrigger>
          </TabsList>

          {/* Estimator Tab */}
          <TabsContent value="estimator" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Content Input */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" /> Konten
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Paste konten tweet di sini..."
                      className="bg-gray-700/50 border-gray-600 text-white min-h-[100px] resize-none"
                    />
                    {/* Campaign Criteria Input */}
                    <Button
                      variant="outline"
                      onClick={() => setShowCampaignInput(!showCampaignInput)}
                      className="w-full border-gray-600 text-gray-300 mb-2"
                    >
                      <Settings2 className="w-4 h-4 mr-2" />
                      {showCampaignInput ? 'Sembunyikan' : 'Set'} Campaign Criteria
                    </Button>
                    
                    {showCampaignInput && (
                      <div className="space-y-2 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                        <div>
                          <Label className="text-gray-400 text-xs flex items-center gap-1">
                            <Flag className="w-3 h-3" /> Mission
                          </Label>
                          <Input
                            value={campaignCriteria.mission}
                            onChange={(e) => setCampaignCriteria(prev => ({ ...prev, mission: e.target.value }))}
                            placeholder="Contoh: Post about AI technology"
                            className="bg-gray-700/50 border-gray-600 text-white h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs flex items-center gap-1">
                            <Info className="w-3 h-3" /> Rules
                          </Label>
                          <Input
                            value={campaignCriteria.rules}
                            onChange={(e) => setCampaignCriteria(prev => ({ ...prev, rules: e.target.value }))}
                            placeholder="Contoh: Must include #AI hashtag"
                            className="bg-gray-700/50 border-gray-600 text-white h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Style
                          </Label>
                          <Input
                            value={campaignCriteria.style}
                            onChange={(e) => setCampaignCriteria(prev => ({ ...prev, style: e.target.value }))}
                            placeholder="Contoh: Professional, Educational"
                            className="bg-gray-700/50 border-gray-600 text-white h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> Knowledge Base
                          </Label>
                          <Input
                            value={campaignCriteria.knowledgeBase}
                            onChange={(e) => setCampaignCriteria(prev => ({ ...prev, knowledgeBase: e.target.value }))}
                            placeholder="Contoh: AI, Web3, Blockchain"
                            className="bg-gray-700/50 border-gray-600 text-white h-8 text-sm"
                          />
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={analyzeContent}
                      disabled={isAnalyzing || !content.trim()}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50"
                    >
                      {isAnalyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menganalisis...</> : <><Sparkles className="w-4 h-4 mr-2" /> Analisis AI</>}
                    </Button>
                  </CardContent>
                </Card>

                {/* Gate Scores */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-4 h-4 text-cyan-400" /> Gate Scores (0-2)
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-xs">Min gate = 0 → 0.5x penalty</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { key: 'contentAlignment', label: 'Content Alignment' },
                      { key: 'informationAccuracy', label: 'Info Accuracy' },
                      { key: 'campaignCompliance', label: 'Compliance' },
                      { key: 'originality', label: 'Originality' }
                    ].map((gate) => (
                      <div key={gate.key}>
                        <Label className="text-gray-400 text-xs mb-1 block">{gate.label}</Label>
                        <div className="flex gap-1">
                          {[0, 1, 2].map((score) => (
                            <button
                              key={score}
                              onClick={() => setGateScores(prev => ({ ...prev, [gate.key]: score }))}
                              className={`flex-1 py-2 rounded text-sm font-medium transition-all ${
                                gateScores[gate.key as keyof typeof gateScores] === score
                                  ? score === 0 ? 'bg-red-500 text-white' : score === 1 ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'
                                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quality Scores */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-400" /> Quality Scores (0-5)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { key: 'engagementPotential', label: 'Engagement Potential' },
                      { key: 'technicalQuality', label: 'Technical Quality' },
                      { key: 'replyQuality', label: 'Reply Quality' }
                    ].map((metric) => (
                      <div key={metric.key}>
                        <Label className="text-gray-400 text-xs mb-1 block">{metric.label}</Label>
                        <Select
                          value={qualityScores[metric.key as keyof typeof qualityScores].toString()}
                          onValueChange={(v) => setQualityScores(prev => ({ ...prev, [metric.key]: parseInt(v) }))}
                        >
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((s) => (
                              <SelectItem key={s} value={s.toString()}>{s}/5</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column */}
              <div className="space-y-4">
                {/* Engagement */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-400" /> Engagement Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-gray-400 text-xs">Likes</Label>
                        <Input type="number" min={0} value={engagementMetrics.likes}
                          onChange={(e) => setEngagementMetrics(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                          className="bg-gray-700/50 border-gray-600 text-white h-9" />
                      </div>
                      <div>
                        <Label className="text-gray-400 text-xs">Replies</Label>
                        <Input type="number" min={0} value={engagementMetrics.replies}
                          onChange={(e) => setEngagementMetrics(prev => ({ ...prev, replies: parseInt(e.target.value) || 0 }))}
                          className="bg-gray-700/50 border-gray-600 text-white h-9" />
                      </div>
                      <div>
                        <Label className="text-gray-400 text-xs">Retweets</Label>
                        <Input type="number" min={0} value={engagementMetrics.retweets}
                          onChange={(e) => setEngagementMetrics(prev => ({ ...prev, retweets: parseInt(e.target.value) || 0 }))}
                          className="bg-gray-700/50 border-gray-600 text-white h-9" />
                      </div>
                      <div>
                        <Label className="text-gray-400 text-xs">Impressions</Label>
                        <Input type="number" min={0} value={engagementMetrics.impressions}
                          onChange={(e) => setEngagementMetrics(prev => ({ ...prev, impressions: parseInt(e.target.value) || 0 }))}
                          className="bg-gray-700/50 border-gray-600 text-white h-9" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Followers of Repliers</Label>
                      <Input type="number" min={0} value={engagementMetrics.followersOfRepliers}
                        onChange={(e) => setEngagementMetrics(prev => ({ ...prev, followersOfRepliers: parseInt(e.target.value) || 0 }))}
                        className="bg-gray-700/50 border-gray-600 text-white h-9" />
                      <p className="text-xs text-gray-500 mt-1">Main driver untuk temporal points</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Estimated Score */}
                {estimatedResult && (
                  <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 backdrop-blur overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" /> Estimasi Skor
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <div className={`text-5xl font-bold ${estimatedResult.grade.color} mb-2`}>
                          {estimatedResult.totalPoints.toFixed(2)}
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <Badge className={`${estimatedResult.grade.color} bg-gray-700/50 text-lg px-3 py-1`}>
                            {estimatedResult.grade.grade}
                          </Badge>
                          <span className="text-gray-400 text-sm">{estimatedResult.grade.label}</span>
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-700 my-4" />
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gate Multiplier</span>
                          <span className={`font-bold ${estimatedResult.gateMultiplier === 0.5 ? 'text-red-400' : estimatedResult.gateMultiplier >= 1.4 ? 'text-green-400' : 'text-white'}`}>
                            {estimatedResult.gateMultiplier.toFixed(2)}x
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Atemporal Points</span>
                          <span className="font-bold text-cyan-400">{estimatedResult.atemporalPoints.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Temporal Points</span>
                          <span className="font-bold text-green-400">{estimatedResult.temporalPoints.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Formula */}
                {estimatedResult && (
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" /> Formula Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                      <div className="p-2 bg-gray-700/30 rounded">
                        <p className="text-gray-400 mb-1">Atemporal = gate_factor × quality_factor × 2.5</p>
                        <p className="text-cyan-400">
                          {(estimatedResult.gateDetails.sum/8).toFixed(2)} × {(estimatedResult.qualityDetails.sum/15).toFixed(2)} × 2.5 = {estimatedResult.atemporalPoints.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {estimatedResult && (
                  <>
                    {/* Gate Details */}
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Target className="w-4 h-4 text-cyan-400" /> Gate Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-xs">
                          {Object.entries(estimatedResult.gateDetails).filter(([k]) => !['sum', 'avg'].includes(k)).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className={`${value === 2 ? 'text-green-400' : value === 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {value}/2
                              </span>
                            </div>
                          ))}
                          <Separator className="bg-gray-700 my-2" />
                          <div className="flex justify-between font-bold">
                            <span className="text-gray-300">Sum</span>
                            <span className="text-white">{estimatedResult.gateDetails.sum}/8</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quality Details */}
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Star className="w-4 h-4 text-purple-400" /> Quality Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-xs">
                          {Object.entries(estimatedResult.qualityDetails).filter(([k]) => !['sum', 'avg'].includes(k)).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className={value >= 4 ? 'text-green-400' : value >= 3 ? 'text-yellow-400' : 'text-red-400'}>
                                {value}/5
                              </span>
                            </div>
                          ))}
                          <Separator className="bg-gray-700 my-2" />
                          <div className="flex justify-between font-bold">
                            <span className="text-gray-300">Sum</span>
                            <span className="text-white">{estimatedResult.qualityDetails.sum}/15</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tips */}
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
                      <CardContent className="pt-4">
                        <p className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" /> Tips Maksimalkan Skor
                        </p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• Gate 2/2 semua → Multiplier 1.5x</li>
                          <li>• Quality 5/5 semua → Atemporal max ~2.5</li>
                          <li>• Followers of Repliers → Driver utama temporal</li>
                          <li>• Replies dari influencer → temporal tinggi</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Live Data Tab */}
          <TabsContent value="data" className="space-y-4">
            {/* Loading State */}
            {isLoadingReal && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
                <CardContent className="py-12 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                  <p className="text-gray-400">Loading Rally submissions...</p>
                </CardContent>
              </Card>
            )}
            
            {/* Error State */}
            {!isLoadingReal && loadError && (
              <Card className="bg-gray-800/50 border-red-500/50 backdrop-blur">
                <CardContent className="py-12 flex flex-col items-center gap-3">
                  <p className="text-red-400">{loadError}</p>
                  <Button onClick={fetchRealSubmissions} className="bg-amber-600 hover:bg-amber-700">
                    <RefreshCw className="w-4 h-4 mr-2" /> Retry
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Empty State */}
            {!isLoadingReal && !loadError && realSubmissions.length === 0 && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
                <CardContent className="py-12 flex flex-col items-center gap-3">
                  <Trophy className="w-8 h-8 text-gray-500" />
                  <p className="text-gray-400">No submissions loaded yet</p>
                  <Button onClick={fetchRealSubmissions} className="bg-amber-600 hover:bg-amber-700">
                    <RefreshCw className="w-4 h-4 mr-2" /> Load Data
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Data Grid */}
            {!isLoadingReal && !loadError && realSubmissions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {realSubmissions.map((sub, i) => {
                  const atemporal = attoToDecimal(sub.atemporalPoints)
                  const temporal = attoToDecimal(sub.temporalPoints)
                  const total = atemporal + temporal
                  const grade = getGrade(total)
                  
                  // Get gate scores
                  const getScore = (category: string) => {
                    const a = sub.analysis.find(x => x.category === category)
                    return a ? attoToDecimal(a.atto_score) : 0
                  }
                  
                  return (
                    <Card 
                      key={i}
                      onClick={() => loadSubmissionData(sub)}
                      className={`cursor-pointer transition-all hover:scale-[1.02] ${
                        selectedSubmission?.id === sub.id 
                          ? 'bg-amber-600/20 border-amber-500' 
                          : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-200">@{sub.xUsername}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{sub.mission?.title || 'No mission'}</p>
                          </div>
                          <Badge className={`${grade.color} bg-gray-700/50 text-base px-2`}>
                            {grade.grade}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Total Score */}
                        <div className="text-center py-2 bg-gray-700/30 rounded-lg">
                          <p className={`text-3xl font-bold ${grade.color}`}>{total.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">Total Points</p>
                        </div>
                        
                        {/* Score Breakdown */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-cyan-500/10 p-2 rounded text-center">
                            <p className="text-cyan-400 font-bold">{atemporal.toFixed(2)}</p>
                            <p className="text-gray-500">Atemporal</p>
                          </div>
                          <div className="bg-green-500/10 p-2 rounded text-center">
                            <p className="text-green-400 font-bold">{temporal.toFixed(2)}</p>
                            <p className="text-gray-500">Temporal</p>
                          </div>
                        </div>
                        
                        {/* Gate Scores Mini */}
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Gates:</span>
                          <div className="flex gap-1">
                            {['Content Alignment', 'Information Accuracy', 'Campaign Compliance', 'Originality and Authenticity'].map((cat) => {
                              const score = getScore(cat)
                              return (
                                <span key={cat} className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                                  score === 2 ? 'bg-green-500/30 text-green-400' : 
                                  score === 1 ? 'bg-yellow-500/30 text-yellow-400' : 
                                  'bg-red-500/30 text-red-400'
                                }`}>
                                  {score}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                        
                        {/* Quality Scores Mini */}
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Quality:</span>
                          <div className="flex gap-1">
                            {['Engagement Potential', 'Technical Quality', 'Reply Quality'].map((cat) => {
                              const score = getScore(cat)
                              return (
                                <span key={cat} className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                                  score >= 4 ? 'bg-green-500/30 text-green-400' : 
                                  score >= 3 ? 'bg-yellow-500/30 text-yellow-400' : 
                                  'bg-red-500/30 text-red-400'
                                }`}>
                                  {score}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
            
            {/* Refresh Button */}
            {!isLoadingReal && realSubmissions.length > 0 && (
              <div className="flex justify-center">
                <Button onClick={fetchRealSubmissions} variant="outline" className="border-gray-600 text-gray-300">
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
