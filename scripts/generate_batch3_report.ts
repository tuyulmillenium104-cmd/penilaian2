const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, ShadingType, VerticalAlign, HeadingLevel, PageBreak } = require('docx');
const fs = require('fs');

const COLORS = {
  primary: "020617", body: "1E293B", secondary: "64748B", accent: "94A3B8",
  tableBg: "F8FAFC", headerBg: "1E3A5F",
  passGreen: "059669", failRed: "DC2626", warning: "D97706",
  gold: "B8860B", silver: "A8A8A8", bronze: "CD7F32"
};

// Complete Results
const EVALUATION_RESULTS = [
  {
    id: 1,
    content: `prediction markets told you the odds. argue.fun tells you the reasoning.

watched agents debate for stakes on Base while the timeline scrolled past. that's the signal.

@arguedotfun is live. $ARGUE is moving. if you're waiting for permission you're already late.

argue.fun`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 2.00, campaign_compliance: 2.00, originality_authenticity: 1.67 },
      quality: { engagement_potential: 4.00, technical_quality: 4.00 },
      total_score: 8.67, gate_multiplier: 1.33
    },
    evaluations: [
      { total_score: 9.00, gate_pass: true },
      { total_score: 9.00, gate_pass: true },
      { total_score: 8.00, gate_pass: true }
    ],
    pass_consensus: true, variance_ok: true, disqualified: false,
    strengths: ["Strong comparison framing (odds vs reasoning)", "Personal observation angle", "Clear FOMO creation", "All gates passed"],
    weaknesses: ["Slightly lower originality score"],
    recommendations: ["Could strengthen authentic voice with more personal elements"]
  },
  {
    id: 2,
    content: `ai agents trade billions but never explain why. that breaks today.

@arguedotfun is live on Base and the agents are already debating.

if you're still waiting for a thread to explain it you're the liquidity.

$ARGUE
argue.fun`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 1.00, campaign_compliance: 2.00, originality_authenticity: 1.33 },
      quality: { engagement_potential: 4.00, technical_quality: 3.33 },
      total_score: 7.80, gate_multiplier: 1.10
    },
    evaluations: [
      { total_score: 8.00, gate_pass: true },
      { total_score: 7.00, gate_pass: true },
      { total_score: 8.40, gate_pass: true }
    ],
    pass_consensus: true, variance_ok: true, disqualified: false,
    strengths: ["Strong opening hook", "Clear problem-solution framing", "Good FOMO ending"],
    weaknesses: ["Lower information accuracy", "Less specific details about platform"],
    recommendations: ["Add more context about what makes argue.fun unique"]
  },
  {
    id: 3,
    content: `missed the prediction market wave because i waited for clarity.

not making that mistake twice.

argumentation markets are here and @arguedotfun is the only one live on Base.

you're either early or you're liquidity.

argue.fun
$ARGUE`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 1.67, campaign_compliance: 2.00, originality_authenticity: 2.00 },
      quality: { engagement_potential: 4.33, technical_quality: 4.00 },
      total_score: 9.17, gate_multiplier: 1.50
    },
    evaluations: [
      { total_score: 9.00, gate_pass: true },
      { total_score: 9.00, gate_pass: true },
      { total_score: 9.50, gate_pass: true }
    ],
    pass_consensus: true, variance_ok: true, disqualified: false,
    strengths: ["PERFECT gate multiplier (1.50x)", "Strong personal regret narrative", "Authentic voice", "Clear ultimatum ending", "Highest engagement potential"],
    weaknesses: ["Minor: could add slightly more detail"],
    recommendations: ["This content is optimal as-is"]
  },
  {
    id: 4,
    content: `most people think this is still a concept. it's not.

debates are happening right now with real stakes.

@arguedotfun removed the friction for agents and nobody noticed.

that's how you get priced out.

$ARGUE
argue.fun`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 1.80, campaign_compliance: 2.00, originality_authenticity: 1.60 },
      quality: { engagement_potential: 4.00, technical_quality: 3.80 },
      total_score: 8.03, gate_multiplier: 1.10
    },
    evaluations: [
      { total_score: 8.00, gate_pass: true },
      { total_score: 7.50, gate_pass: true },
      { total_score: 8.60, gate_pass: true }
    ],
    pass_consensus: true, variance_ok: true, disqualified: false,
    strengths: ["Strong reality check opening", "Unique angle (frictionless for agents)", "Good FOMO creation"],
    weaknesses: ["Could be more specific about debates"],
    recommendations: ["Add one concrete example of what's happening"]
  },
  {
    id: 5,
    content: `we built oracles for prices. we built markets for beliefs.

nobody built anything for logic until now.

@arguedotfun is live. agents are arguing. judges are voting.

if you're not looking you're already behind.

$ARGUE
argue.fun`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 2.00, campaign_compliance: 2.00, originality_authenticity: 1.60 },
      quality: { engagement_potential: 4.20, technical_quality: 4.00 },
      total_score: 8.20, gate_multiplier: 1.10
    },
    evaluations: [
      { total_score: 8.60, gate_pass: true },
      { total_score: 8.00, gate_pass: true },
      { total_score: 8.00, gate_pass: true }
    ],
    pass_consensus: true, variance_ok: true, disqualified: false,
    strengths: ["Excellent historical framing (oracles → markets → logic)", "Rhythmic structure", "Clear action items", "Good FOMO"],
    weaknesses: ["Slightly more formal tone"],
    recommendations: ["Could add more casual elements for authenticity"]
  }
];

const SORTED_RESULTS = [...EVALUATION_RESULTS].sort((a, b) => b.consensus.total_score - a.consensus.total_score);

function createCell(text: string, options: any = {}) {
  const { bold = false, color = COLORS.body, align = AlignmentType.LEFT, bgColor = null } = options;
  return new TableCell({
    children: [new Paragraph({ alignment: align, children: [new TextRun({ text, bold, color, font: "Times New Roman", size: 20 })] })],
    verticalAlign: VerticalAlign.CENTER,
    shading: bgColor ? { fill: bgColor, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 }
  });
}

function createHeaderCell(text: string) {
  return new TableCell({
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "Times New Roman", size: 20 })] })],
    verticalAlign: VerticalAlign.CENTER,
    shading: { fill: COLORS.headerBg, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 120, right: 120 }
  });
}

function getRankColor(rank: number) {
  if (rank === 1) return COLORS.gold;
  if (rank === 2) return COLORS.silver;
  if (rank === 3) return COLORS.bronze;
  return COLORS.body;
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", run: { size: 48, bold: true, color: COLORS.primary, font: "Times New Roman" }, paragraph: { spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", run: { size: 32, bold: true, color: COLORS.primary, font: "Times New Roman" }, paragraph: { spacing: { before: 300, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", run: { size: 26, bold: true, color: COLORS.body, font: "Times New Roman" }, paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      // Title
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("RALLY CONSENSUS EVALUATION")] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Multi-LLM Consensus Scoring - Batch 3", color: COLORS.secondary, size: 24 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "Argue.fun Campaign | Z.ai LLM Validation", color: COLORS.accent, size: 20, italics: true })] }),

      // Executive Summary
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Executive Summary")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "This report presents multi-LLM consensus evaluation results for 5 content pieces for the Argue.fun Rally campaign. Notable achievement: Content #3 achieved a PERFECT GATE MULTIPLIER (1.50x) with the highest consensus score of 9.17.", size: 22 })] }),

      // Rankings Table
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 Final Rankings")] }),
      new Table({
        columnWidths: [1200, 1500, 1800, 1800, 1500, 2000],
        rows: [
          new TableRow({ tableHeader: true, children: [createHeaderCell("Rank"), createHeaderCell("Content"), createHeaderCell("Score"), createHeaderCell("Gate Mult"), createHeaderCell("Variance"), createHeaderCell("Status")] }),
          ...SORTED_RESULTS.map((r, i) => new TableRow({
            children: [
              createCell(`#${i + 1}`, { align: AlignmentType.CENTER, bold: true, color: getRankColor(i + 1) }),
              createCell(`Content #${r.id}`, { align: AlignmentType.CENTER }),
              createCell(r.consensus.total_score.toFixed(2), { align: AlignmentType.CENTER, bold: true, color: r.consensus.total_score >= 9 ? COLORS.gold : r.consensus.total_score >= 8 ? COLORS.passGreen : COLORS.warning }),
              createCell(`${r.consensus.gate_multiplier.toFixed(2)}x`, { align: AlignmentType.CENTER, color: r.consensus.gate_multiplier >= 1.5 ? COLORS.gold : r.consensus.gate_multiplier >= 1.2 ? COLORS.passGreen : COLORS.body }),
              createCell(r.variance_ok ? "OK" : "HIGH", { align: AlignmentType.CENTER, color: r.variance_ok ? COLORS.passGreen : COLORS.warning }),
              createCell(r.pass_consensus ? "FULL" : "SPLIT", { align: AlignmentType.CENTER, color: r.pass_consensus ? COLORS.passGreen : COLORS.warning })
            ]
          }))
        ]
      }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Table 1: Consensus Evaluation Rankings", size: 18, italics: true, color: COLORS.secondary })] }),

      // Top Performer Highlight
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 🏆 Top Performer: Content #3")] }),
      new Paragraph({
        spacing: { after: 150 },
        shading: { fill: COLORS.tableBg, type: ShadingType.CLEAR },
        children: [
          new TextRun({ text: `"missed the prediction market wave because i waited for clarity. not making that mistake twice..."`, size: 20, italics: true })
        ]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Achievements: ", bold: true, size: 22 }),
          new TextRun({ text: "PERFECT Gate Multiplier (1.50x) • Score 9.17 • Variance 0.06 • Full Consensus", size: 22, color: COLORS.passGreen })
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // Detailed Results
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Detailed Content Analysis")] }),

      ...SORTED_RESULTS.flatMap((result, idx) => [
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(`2.${idx + 1} Content #${result.id} — Rank #${idx + 1}`)] }),
        
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: `Score: `, size: 22 }),
            new TextRun({ text: `${result.consensus.total_score.toFixed(2)}`, bold: true, size: 28, color: result.consensus.total_score >= 9 ? COLORS.gold : COLORS.passGreen }),
            new TextRun({ text: ` | Gate Mult: `, size: 22 }),
            new TextRun({ text: `${result.consensus.gate_multiplier.toFixed(2)}x`, bold: true, size: 24, color: result.consensus.gate_multiplier >= 1.5 ? COLORS.gold : COLORS.body }),
            new TextRun({ text: ` | Status: `, size: 22 }),
            new TextRun({ text: result.pass_consensus ? "FULL CONSENSUS" : "SPLIT", bold: true, size: 22, color: result.pass_consensus ? COLORS.passGreen : COLORS.warning })
          ]
        }),

        new Paragraph({ spacing: { after: 200 }, shading: { fill: COLORS.tableBg, type: ShadingType.CLEAR }, children: [new TextRun({ text: `"${result.content}"`, size: 20, italics: true })] }),

        // Gate Scores
        new Paragraph({ children: [new TextRun({ text: "Gate Scores:", bold: true, size: 20 })] }),
        new Table({
          columnWidths: [2400, 2400, 2400, 2400],
          rows: [
            new TableRow({ tableHeader: true, children: [createHeaderCell("Alignment"), createHeaderCell("Accuracy"), createHeaderCell("Compliance"), createHeaderCell("Originality")] }),
            new TableRow({ children: [
              createCell(result.consensus.gates.content_alignment.toFixed(2), { align: AlignmentType.CENTER, color: result.consensus.gates.content_alignment >= 2 ? COLORS.passGreen : COLORS.body }),
              createCell(result.consensus.gates.information_accuracy.toFixed(2), { align: AlignmentType.CENTER, color: result.consensus.gates.information_accuracy >= 2 ? COLORS.passGreen : COLORS.body }),
              createCell(result.consensus.gates.campaign_compliance.toFixed(2), { align: AlignmentType.CENTER, color: result.consensus.gates.campaign_compliance >= 2 ? COLORS.passGreen : COLORS.body }),
              createCell(result.consensus.gates.originality_authenticity.toFixed(2), { align: AlignmentType.CENTER, color: result.consensus.gates.originality_authenticity >= 2 ? COLORS.passGreen : COLORS.body })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 100 }, children: [] }),

        new Paragraph({ children: [new TextRun({ text: "✅ Strengths:", bold: true, size: 20, color: COLORS.passGreen })] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: result.strengths.map(s => `• ${s}`).join("\n"), size: 20 })] }),

        new Paragraph({ children: [new TextRun({ text: "⚠️ Weaknesses:", bold: true, size: 20, color: COLORS.failRed })] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: result.weaknesses.map(w => `• ${w}`).join("\n"), size: 20 })] }),

        new Paragraph({ children: [new TextRun({ text: "💡 Recommendations:", bold: true, size: 20, color: COLORS.primary })] }),
        new Paragraph({ spacing: { after: 400 }, children: [new TextRun({ text: result.recommendations.map(r => `• ${r}`).join("\n"), size: 20 })] })
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      // Analysis
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Pattern Analysis")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 What Made Content #3 Perfect")] }),
      new Table({
        columnWidths: [3000, 6000],
        rows: [
          new TableRow({ tableHeader: true, children: [createHeaderCell("Element"), createHeaderCell("Analysis")] }),
          new TableRow({ children: [createCell("Personal Regret", { bold: true }), createCell("'missed... because i waited' - Creates instant relatability and FOMO")] }),
          new TableRow({ children: [createCell("Resolution", { bold: true }), createCell("'not making that mistake twice' - Shows conviction and action")] }),
          new TableRow({ children: [createCell("Clarity", { bold: true }), createCell("'only one live on Base' - Specific, verifiable claim")] }),
          new TableRow({ children: [createCell("Ultimatum", { bold: true }), createCell("'early or liquidity' - Binary choice creates urgency")] })
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Score Distribution")] }),
      new Table({
        columnWidths: [2250, 2250, 2250, 2250],
        rows: [
          new TableRow({ tableHeader: true, children: [createHeaderCell("9.0+"), createHeaderCell("8.0-8.9"), createHeaderCell("7.0-7.9"), createHeaderCell("<7.0")] }),
          new TableRow({ children: [
            createCell("1 content", { align: AlignmentType.CENTER, color: COLORS.gold }),
            createCell("3 contents", { align: AlignmentType.CENTER, color: COLORS.passGreen }),
            createCell("1 content", { align: AlignmentType.CENTER, color: COLORS.warning }),
            createCell("0 contents", { align: AlignmentType.CENTER })
          ]})
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Final Verdict")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "ALL 5 CONTENTS PASS RALLY GATES. ", bold: true, size: 22, color: COLORS.passGreen }),
          new TextRun({ text: "This is a strong batch with 4 out of 5 contents scoring 8.0+. Content #3 is the clear winner and should be prioritized for submission.", size: 22 })
        ]
      }),

      new Paragraph({
        spacing: { before: 400 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "End of Report", size: 18, italics: true, color: COLORS.secondary })]
      })
    ]
  }]
});

const outputPath = "/home/z/my-project/download/Rally_Evaluation_Batch3.docx";
Packer.toBuffer(doc).then((buffer: Buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Report generated: ${outputPath}`);
}).catch((err: Error) => {
  console.error("❌ Error:", err);
});
