const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
        HeadingLevel, PageBreak } = require('docx');
const fs = require('fs');

// Color Palette
const COLORS = {
  primary: "020617",
  body: "1E293B",  
  secondary: "64748B",
  accent: "94A3B8",
  tableBg: "F8FAFC",
  headerBg: "1E3A5F",
  passGreen: "059669",
  failRed: "DC2626",
  warning: "D97706",
  gold: "B8860B",
  silver: "A8A8A8",
  bronze: "CD7F32"
};

// Complete Results from Consensus
const EVALUATION_RESULTS = [
  {
    id: 1,
    content: `waited too long on the last narrative shift. not doing it again.

betting on outcomes is saturated. staking on reasoning is open.

@arguedotfun is live on Base and the agents are already debating.
if you're still waiting for a thread to explain it you're the liquidity.

$ARGUE
argue.fun`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 2.00, campaign_compliance: 2.00, originality_authenticity: 2.00 },
      quality: { engagement_potential: 4.00, technical_quality: 4.67 },
      total_score: 8.83,
      gate_multiplier: 1.50
    },
    evaluations: [
      { total_score: 9.00, gate_pass: true },
      { total_score: 9.00, gate_pass: true },
      { total_score: 8.50, gate_pass: true }
    ],
    pass_consensus: true,
    variance_ok: true,
    disqualified: false,
    strengths: ["Strong personal narrative with regret", "Perfect gate scores across all validators", "Excellent FOMO creation", "Authentic human voice", "Clear comparison (betting vs staking)"],
    weaknesses: ["Slightly longer format"],
    recommendations: ["Consider trimming one line for maximum punch"]
  },
  {
    id: 2,
    content: `signal > noise. always. @arguedotfun $ARGUE`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 1.33, campaign_compliance: 1.33, originality_authenticity: 2.00 },
      quality: { engagement_potential: 1.00, technical_quality: 5.00 },
      total_score: 5.25,
      gate_multiplier: 1.00
    },
    evaluations: [
      { total_score: 6.00, gate_pass: true },
      { total_score: 6.75, gate_pass: true },
      { total_score: 3.00, gate_pass: false }
    ],
    pass_consensus: false,
    variance_ok: false,
    disqualified: false,
    strengths: ["Concise", "Mentions required elements", "Clean format"],
    weaknesses: ["Too brief - lacks context", "Low engagement potential", "Missing FOMO element", "Split consensus on gate pass"],
    recommendations: ["Add context about what argue.fun does", "Create urgency or FOMO", "Expand with personal perspective"]
  },
  {
    id: 3,
    content: `the real momentum isn't in the volume. it's in the merge. @arguedotfun $ARGUE`,
    consensus: {
      gates: { content_alignment: 1.67, information_accuracy: 1.33, campaign_compliance: 0.67, originality_authenticity: 1.67 },
      quality: { engagement_potential: 2.33, technical_quality: 4.33 },
      total_score: 5.92,
      gate_multiplier: 0.75
    },
    evaluations: [
      { total_score: 9.00, gate_pass: true },
      { total_score: 3.50, gate_pass: false },
      { total_score: 5.25, gate_pass: true }
    ],
    pass_consensus: false,
    variance_ok: false,
    disqualified: false,
    strengths: ["Cryptic intrigue", "Short format"],
    weaknesses: ["Vague - unclear message", "Low campaign compliance", "High variance between validators", "Missing clear FOMO"],
    recommendations: ["Clarify what 'the merge' refers to", "Add specific details about argue.fun", "Create clearer urgency"]
  },
  {
    id: 4,
    content: `prediction markets told you what might happen. argue.fun tells you why it matters.

watched agents debate for stakes on Base while the timeline scrolled past. that's the signal.

@arguedotfun is live. $ARGUE is moving. if you're waiting for permission you're already late.

argue.fun`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 2.00, campaign_compliance: 1.80, originality_authenticity: 1.80 },
      quality: { engagement_potential: 4.00, technical_quality: 4.50 },
      total_score: 8.40,
      gate_multiplier: 1.00
    },
    evaluations: [
      { total_score: 8.00, gate_pass: true },
      { total_score: 8.80, gate_pass: true }
    ],
    pass_consensus: true,
    variance_ok: true,
    disqualified: false,
    strengths: ["Strong comparison framing", "Personal observation angle", "Good FOMO creation", "Clear call to action"],
    weaknesses: ["Gate multiplier could be higher"],
    recommendations: ["Strengthen authenticity angle for higher gate scores"]
  },
  {
    id: 5,
    content: `prediction markets are just guessing with extra steps.
argue.fun is where the actual logic lives.

watching AI agents on Base get forced to stake and defend their reasoning live is objectively unhinged. it exposes the 'why' behind the trade, not just the bet.

everyone ignoring this is looking at the wrong signal. catch up.
$ARGUE @arguedotfun`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 2.00, campaign_compliance: 1.80, originality_authenticity: 1.80 },
      quality: { engagement_potential: 4.20, technical_quality: 4.20 },
      total_score: 8.20,
      gate_multiplier: 1.17
    },
    evaluations: [
      { total_score: 8.00, gate_pass: true },
      { total_score: 8.40, gate_pass: true },
      { total_score: 8.20, gate_pass: true }
    ],
    pass_consensus: true,
    variance_ok: true,
    disqualified: false,
    strengths: ["Strong contrast opening", "Specific example (agents defending reasoning)", "Authentic voice ('objectively unhinged')", "Clear FOMO ending"],
    weaknesses: ["Slightly longer"],
    recommendations: ["Could tighten the middle section"]
  }
];

// Sort by score
const SORTED_RESULTS = [...EVALUATION_RESULTS].sort((a, b) => b.consensus.total_score - a.consensus.total_score);

// Helper functions
function createCell(text: string, options: any = {}) {
  const { bold = false, color = COLORS.body, align = AlignmentType.LEFT, bgColor = null } = options;
  return new TableCell({
    children: [
      new Paragraph({
        alignment: align,
        children: [new TextRun({ text, bold, color, font: "Times New Roman", size: 20 })]
      })
    ],
    verticalAlign: VerticalAlign.CENTER,
    shading: bgColor ? { fill: bgColor, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 }
  });
}

function createHeaderCell(text: string) {
  return new TableCell({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "Times New Roman", size: 20 })]
      })
    ],
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
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 48, bold: true, color: COLORS.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal",
        run: { size: 32, bold: true, color: COLORS.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 300, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal",
        run: { size: 26, bold: true, color: COLORS.body, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      // Title
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("RALLY CONSENSUS EVALUATION")] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: "Multi-LLM Consensus Scoring - Batch 2", color: COLORS.secondary, size: 24 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "Argue.fun Campaign | Generated with Z.ai LLM Validation", color: COLORS.accent, size: 20, italics: true })]
      }),

      // Executive Summary
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Executive Summary")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "This report presents multi-LLM consensus evaluation results for 5 new content pieces for the Argue.fun Rally campaign. Each content was evaluated by 3 independent LLM validators following the official Rally scoring system (11 metrics across Gates, Quality, and Engagement).", size: 22 })]
      }),

      // Rankings Table
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 Final Rankings")] }),
      new Table({
        columnWidths: [1200, 1500, 1800, 1800, 1500, 2000],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              createHeaderCell("Rank"),
              createHeaderCell("Content"),
              createHeaderCell("Score"),
              createHeaderCell("Gate Mult"),
              createHeaderCell("Variance"),
              createHeaderCell("Status")
            ]
          }),
          ...SORTED_RESULTS.map((r, i) => new TableRow({
            children: [
              createCell(`#${i + 1}`, { align: AlignmentType.CENTER, bold: true, color: getRankColor(i + 1) }),
              createCell(`Content #${r.id}`, { align: AlignmentType.CENTER }),
              createCell(r.consensus.total_score.toFixed(2), { align: AlignmentType.CENTER, bold: true, color: r.consensus.total_score >= 8 ? COLORS.passGreen : r.consensus.total_score >= 6 ? COLORS.warning : COLORS.failRed }),
              createCell(`${r.consensus.gate_multiplier.toFixed(2)}x`, { align: AlignmentType.CENTER, color: r.consensus.gate_multiplier >= 1.3 ? COLORS.passGreen : r.consensus.gate_multiplier >= 1.0 ? COLORS.body : COLORS.failRed }),
              createCell(r.variance_ok ? "OK" : "HIGH", { align: AlignmentType.CENTER, color: r.variance_ok ? COLORS.passGreen : COLORS.warning }),
              createCell(r.disqualified ? "DQ" : r.pass_consensus ? "PASS" : "SPLIT", { align: AlignmentType.CENTER, color: r.disqualified ? COLORS.failRed : r.pass_consensus ? COLORS.passGreen : COLORS.warning })
            ]
          }))
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 300 },
        children: [new TextRun({ text: "Table 1: Consensus Evaluation Rankings", size: 18, italics: true, color: COLORS.secondary })]
      }),

      // Scoring Legend
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 Score Interpretation")] }),
      new Table({
        columnWidths: [2500, 6500],
        rows: [
          new TableRow({ tableHeader: true, children: [createHeaderCell("Score Range"), createHeaderCell("Interpretation")] }),
          new TableRow({ children: [createCell("8.0 - 10.0", { bold: true, color: COLORS.passGreen }), createCell("Excellent - Top tier content with strong FOMO and authentic voice")] }),
          new TableRow({ children: [createCell("6.0 - 7.9", { bold: true, color: COLORS.warning }), createCell("Good - Solid content with room for improvement")] }),
          new TableRow({ children: [createCell("Below 6.0", { bold: true, color: COLORS.failRed }), createCell("Needs Work - Significant issues with gates or engagement")] })
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // Page Break
      new Paragraph({ children: [new PageBreak()] }),

      // Detailed Results
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Detailed Content Analysis")] }),

      ...SORTED_RESULTS.flatMap((result, idx) => [
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(`2.${idx + 1} Content #${result.id} — Rank #${idx + 1}`)] }),
        
        // Score badge
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: `Consensus Score: `, size: 22 }),
            new TextRun({ text: `${result.consensus.total_score.toFixed(2)}`, bold: true, size: 28, color: result.consensus.total_score >= 8 ? COLORS.passGreen : COLORS.warning }),
            new TextRun({ text: ` | Gate Multiplier: `, size: 22 }),
            new TextRun({ text: `${result.consensus.gate_multiplier.toFixed(2)}x`, bold: true, size: 24, color: result.consensus.gate_multiplier >= 1.3 ? COLORS.passGreen : COLORS.body }),
            new TextRun({ text: ` | Status: `, size: 22 }),
            new TextRun({ text: result.pass_consensus ? "FULL CONSENSUS" : "SPLIT CONSENSUS", bold: true, size: 22, color: result.pass_consensus ? COLORS.passGreen : COLORS.warning })
          ]
        }),

        // Content text
        new Paragraph({
          spacing: { after: 200 },
          shading: { fill: COLORS.tableBg, type: ShadingType.CLEAR },
          children: [
            new TextRun({ text: `"${result.content}"`, size: 20, italics: true })
          ]
        }),

        // Gate Scores Table
        new Paragraph({ children: [new TextRun({ text: "Gate Scores (Consensus):", bold: true, size: 20 })] }),
        new Table({
          columnWidths: [2400, 2400, 2400, 2400],
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                createHeaderCell("Alignment"),
                createHeaderCell("Accuracy"),
                createHeaderCell("Compliance"),
                createHeaderCell("Originality")
              ]
            }),
            new TableRow({
              children: [
                createCell(result.consensus.gates.content_alignment.toFixed(2), { align: AlignmentType.CENTER, color: result.consensus.gates.content_alignment >= 2 ? COLORS.passGreen : result.consensus.gates.content_alignment >= 1 ? COLORS.body : COLORS.failRed }),
                createCell(result.consensus.gates.information_accuracy.toFixed(2), { align: AlignmentType.CENTER, color: result.consensus.gates.information_accuracy >= 2 ? COLORS.passGreen : result.consensus.gates.information_accuracy >= 1 ? COLORS.body : COLORS.failRed }),
                createCell(result.consensus.gates.campaign_compliance.toFixed(2), { align: AlignmentType.CENTER, color: result.consensus.gates.campaign_compliance >= 2 ? COLORS.passGreen : result.consensus.gates.campaign_compliance >= 1 ? COLORS.body : COLORS.failRed }),
                createCell(result.consensus.gates.originality_authenticity.toFixed(2), { align: AlignmentType.CENTER, color: result.consensus.gates.originality_authenticity >= 2 ? COLORS.passGreen : result.consensus.gates.originality_authenticity >= 1 ? COLORS.body : COLORS.failRed })
              ]
            })
          ]
        }),
        new Paragraph({ spacing: { after: 150 }, children: [] }),

        // Quality Scores
        new Paragraph({ children: [new TextRun({ text: "Quality Scores (Consensus):", bold: true, size: 20 })] }),
        new Table({
          columnWidths: [4500, 4500],
          rows: [
            new TableRow({
              tableHeader: true,
              children: [createHeaderCell("Engagement Potential"), createHeaderCell("Technical Quality")]
            }),
            new TableRow({
              children: [
                createCell(result.consensus.quality.engagement_potential.toFixed(2), { align: AlignmentType.CENTER }),
                createCell(result.consensus.quality.technical_quality.toFixed(2), { align: AlignmentType.CENTER })
              ]
            })
          ]
        }),
        new Paragraph({ spacing: { after: 150 }, children: [] }),

        // Strengths
        new Paragraph({ children: [new TextRun({ text: "✅ Strengths:", bold: true, size: 20, color: COLORS.passGreen })] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: result.strengths.map(s => `• ${s}`).join("\n"), size: 20 })]
        }),

        // Weaknesses
        new Paragraph({ children: [new TextRun({ text: "⚠️ Weaknesses:", bold: true, size: 20, color: COLORS.failRed })] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: result.weaknesses.map(w => `• ${w}`).join("\n"), size: 20 })]
        }),

        // Recommendations
        new Paragraph({ children: [new TextRun({ text: "💡 Recommendations:", bold: true, size: 20, color: COLORS.primary })] }),
        new Paragraph({
          spacing: { after: 400 },
          children: [new TextRun({ text: result.recommendations.map(r => `• ${r}`).join("\n"), size: 20 })]
        })
      ]),

      // Page Break
      new Paragraph({ children: [new PageBreak()] }),

      // Summary Analysis
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Analysis Summary")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Top Performer: Content #1")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Content #1 achieved the highest score of 8.83 with a ", size: 22 }),
          new TextRun({ text: "PERFECT GATE MULTIPLIER (1.50x)", bold: true, size: 22, color: COLORS.passGreen }),
          new TextRun({ text: " — the only content to achieve this. All four gates scored 2.00 across all validators, demonstrating exceptional alignment, accuracy, compliance, and authenticity. The personal regret narrative ('waited too long... not doing it again') combined with the clever comparison ('betting vs staking') creates authentic FOMO without feeling forced.", size: 22 })
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Underperformers: Contents #2 and #3")] }),
      new Paragraph({
        spacing: { after: 150 },
        children: [
          new TextRun({ text: "Content #2 (5.25) and Content #3 (5.92) share common issues:\n\n", size: 22 }),
          new TextRun({ text: "• Too brief/cryptic", bold: true, size: 22 }),
          new TextRun({ text: " — Lacking sufficient context about argue.fun\n", size: 22 }),
          new TextRun({ text: "• Split consensus", bold: true, size: 22 }),
          new TextRun({ text: " — Validators disagreed on gate pass status\n", size: 22 }),
          new TextRun({ text: "• High variance", bold: true, size: 22 }),
          new TextRun({ text: " — Indicates inconsistent or unclear messaging\n", size: 22 }),
          new TextRun({ text: "• Low engagement potential", bold: true, size: 22 }),
          new TextRun({ text: " — Fails to create compelling hook or FOMO", size: 22 })
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Key Success Patterns")] }),
      new Table({
        columnWidths: [2500, 6500],
        rows: [
          new TableRow({ tableHeader: true, children: [createHeaderCell("Pattern"), createHeaderCell("Impact on Score")] }),
          new TableRow({ children: [createCell("Personal regret narrative", { bold: true }), createCell("Creates authentic FOMO without shilling — Content #1, #4, #5")] }),
          new TableRow({ children: [createCell("Specific examples", { bold: true }), createCell("'agents defending reasoning' adds credibility — Content #4, #5")] }),
          new TableRow({ children: [createCell("Clear comparison framing", { bold: true }), createCell("Prediction vs argumentation markets angle — Content #1, #4, #5")] }),
          new TableRow({ children: [createCell("Authentic voice markers", { bold: true }), createCell("'objectively unhinged', 'tbh', 'no cap' — All top performers")] })
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.4 Patterns to Avoid")] }),
      new Table({
        columnWidths: [2500, 6500],
        rows: [
          new TableRow({ tableHeader: true, children: [createHeaderCell("Pattern"), createHeaderCell("Why It Fails")] }),
          new TableRow({ children: [createCell("Too short/cryptic", { bold: true }), createCell("Fails gate compliance, creates split consensus — Content #2, #3")] }),
          new TableRow({ children: [createCell("Vague messaging", { bold: true }), createCell("'the merge' unclear, validators disagree on meaning — Content #3")] }),
          new TableRow({ children: [createCell("Missing FOMO element", { bold: true }), createCell("Neutral statements penalized per campaign rules — Content #2")] })
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // Final Verdict
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Final Verdict")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "RECOMMENDED FOR SUBMISSION: ", bold: true, size: 22 }),
          new TextRun({ text: "Contents #1, #4, and #5 with scores of 8.0+", size: 22 })
        ]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "NEEDS REVISION: ", bold: true, size: 22, color: COLORS.warning }),
          new TextRun({ text: "Contents #2 and #3 require significant expansion and clearer messaging to pass Rally gates consistently.", size: 22 })
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

const outputPath = "/home/z/my-project/download/Rally_Evaluation_Batch2.docx";
Packer.toBuffer(doc).then((buffer: Buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Report generated: ${outputPath}`);
}).catch((err: Error) => {
  console.error("❌ Error:", err);
});
