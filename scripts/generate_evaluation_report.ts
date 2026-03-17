const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
        HeadingLevel, PageBreak } = require('docx');
const fs = require('fs');

// Color Palette - "Midnight Code" for tech document
const COLORS = {
  primary: "020617",      // Midnight Black
  body: "1E293B",         // Deep Slate Blue  
  secondary: "64748B",    // Cool Blue-Gray
  accent: "94A3B8",       // Steady Silver
  tableBg: "F8FAFC",      // Glacial Blue-White
  headerBg: "1E3A5F",     // Dark Blue Header
  passGreen: "059669",    // Green for pass
  failRed: "DC2626",      // Red for fail
  warning: "D97706"       // Orange warning
};

// Evaluation Results from Consensus
const EVALUATION_RESULTS = [
  {
    id: 1,
    content: `copium dead. new meta is here. ai vs humans. real money. argue.fun rn. $ARGUE. you missed it. last call. printing. @arguedotfun`,
    consensus: {
      gates: { content_alignment: 1.33, information_accuracy: 0.67, campaign_compliance: 1.33, originality_authenticity: 1.33 },
      quality: { engagement_potential: 2.33, technical_quality: 1.33 },
      total_score: 4.80,
      gate_multiplier: 0.90
    },
    evaluations: [
      { total_score: 0, gate_pass: false },
      { total_score: 7.60, gate_pass: true },
      { total_score: 6.80, gate_pass: true }
    ],
    pass_consensus: false,
    variance_ok: false,
    disqualified: false,
    strengths: ["Short and punchy", "Creates urgency", "Mentions required elements"],
    weaknesses: ["Very fragmented", "Low information accuracy", "Feels forced/inauthentic"],
    recommendations: ["Add more context", "Improve flow between phrases", "Include specific details about argue.fun"]
  },
  {
    id: 2,
    content: `watched this for a minute. thought about jumping in. now i'm seeing the real heat. the window is closing. if you're not looking at @arguedotfun right now with $ARGUE, you're already behind. no cap`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 2.00, campaign_compliance: 2.00, originality_authenticity: 2.00 },
      quality: { engagement_potential: 4.33, technical_quality: 5.00 },
      total_score: 8.80,
      gate_multiplier: 1.27
    },
    evaluations: [
      { total_score: 8.40, gate_pass: true },
      { total_score: 8.50, gate_pass: true },
      { total_score: 9.50, gate_pass: true }
    ],
    pass_consensus: true,
    variance_ok: true,
    disqualified: false,
    strengths: ["Authentic voice", "Strong FOMO creation", "Personal narrative", "Natural language", "All required elements"],
    weaknesses: ["Could be slightly more specific about platform features"],
    recommendations: ["Consider adding one concrete detail about live debates"]
  },
  {
    id: 3,
    content: `copium is dead. this is the new meta. ai vs humans. real money. @arguedotfun. $ARGUE. you're either in or out.`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 1.00, campaign_compliance: 1.00, originality_authenticity: 2.00 },
      quality: { engagement_potential: 4.00, technical_quality: 4.33 },
      total_score: 7.97,
      gate_multiplier: 1.07
    },
    evaluations: [
      { total_score: 8.30, gate_pass: true },
      { total_score: 7.80, gate_pass: true },
      { total_score: 7.80, gate_pass: true }
    ],
    pass_consensus: true,
    variance_ok: true,
    disqualified: false,
    strengths: ["Strong ultimatum hook", "Good FOMO", "Authentic tone", "Concise"],
    weaknesses: ["Limited information about platform", "Some validators noted it could use more depth"],
    recommendations: ["Add one sentence about what's actually happening on the platform"]
  },
  {
    id: 4,
    content: `prediction markets tell you what people think.
argue.fun tells you why.

AI agents are already live on Base debating for stakes and exposing their actual reasoning. watching an agent panic-defend a trade logic in real-time is wild tbh.

if you're late to this, you're late to the only signal that matters.

$ARGUE @arguedotfun`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 2.00, campaign_compliance: 2.00, originality_authenticity: 2.00 },
      quality: { engagement_potential: 4.00, technical_quality: 5.00 },
      total_score: 8.53,
      gate_multiplier: 1.33
    },
    evaluations: [
      { total_score: 8.50, gate_pass: true },
      { total_score: 8.40, gate_pass: true },
      { total_score: 8.70, gate_pass: true }
    ],
    pass_consensus: true,
    variance_ok: true,
    disqualified: false,
    strengths: ["Excellent comparison framing", "Specific and tangible example", "Authentic voice with 'tbh'", "High information accuracy", "Perfect gate multiplier"],
    weaknesses: ["Slightly longer than optimal"],
    recommendations: ["Consider trimming one line for maximum punch"]
  },
  {
    id: 5,
    content: `everyone's still betting on outcomes. nobody's pricing the reasoning.
watched the last wave pass while i waited. not making that mistake again.
@arguedotfun is live on Base and the timeline is sleeping hard. ai agents are debating for real stakes right now. not simulating.
if you wait for the crowd you're exit liquidity. $ARGUE is moving before the narrative flips.
check it.
argue.fun`,
    consensus: {
      gates: { content_alignment: 2.00, information_accuracy: 2.00, campaign_compliance: 2.00, originality_authenticity: 1.80 },
      quality: { engagement_potential: 4.50, technical_quality: 4.50 },
      total_score: 8.60,
      gate_multiplier: 1.20
    },
    evaluations: [
      { total_score: 9.00, gate_pass: true },
      { total_score: 8.80, gate_pass: true },
      { total_score: 8.00, gate_pass: true }
    ],
    pass_consensus: true,
    variance_ok: true,
    disqualified: false,
    strengths: ["Strong contrast opening", "Personal regret narrative", "Crypto-native language ('exit liquidity')", "Clear call to action", "Multiple platform references"],
    weaknesses: ["Slightly longer", "Multiple links might look promotional"],
    recommendations: ["Consider consolidating the ending for stronger impact"]
  }
];

// Sort by score
const SORTED_RESULTS = [...EVALUATION_RESULTS].sort((a, b) => b.consensus.total_score - a.consensus.total_score);

// Helper function to create table cell
function createCell(text: string, options: any = {}) {
  const { bold = false, color = COLORS.body, align = AlignmentType.LEFT, bgColor = null, width = null } = options;
  
  return new TableCell({
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text: text,
            bold: bold,
            color: color,
            font: "Times New Roman",
            size: 20
          })
        ]
      })
    ],
    verticalAlign: VerticalAlign.CENTER,
    shading: bgColor ? { fill: bgColor, type: ShadingType.CLEAR } : undefined,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 }
  });
}

// Helper function to create header cell
function createHeaderCell(text: string, width: number = null) {
  return new TableCell({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: text,
            bold: true,
            color: "FFFFFF",
            font: "Times New Roman",
            size: 20
          })
        ]
      })
    ],
    verticalAlign: VerticalAlign.CENTER,
    shading: { fill: COLORS.headerBg, type: ShadingType.CLEAR },
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    margins: { top: 100, bottom: 100, left: 120, right: 120 }
  });
}

// Create document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Times New Roman", size: 22 }
      }
    },
    paragraphStyles: [
      {
        id: "Title",
        name: "Title",
        basedOn: "Normal",
        run: { size: 48, bold: true, color: COLORS.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER }
      },
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        run: { size: 32, bold: true, color: COLORS.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 300, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        run: { size: 26, bold: true, color: COLORS.body, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // Title
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun({ text: "RALLY CONSENSUS EVALUATION REPORT", bold: true })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: "Multi-LLM Consensus Scoring for Argue.fun Campaign",
            color: COLORS.secondary,
            size: 24
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: "Generated with Z.ai LLM Consensus Validation",
            color: COLORS.accent,
            size: 20,
            italics: true
          })
        ]
      }),

      // Executive Summary
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Executive Summary")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "This report presents the results of a multi-LLM consensus evaluation of 5 content pieces for the Argue.fun Rally campaign. Each content was evaluated by 3 independent LLM validators following the Rally scoring system (11 metrics across Gates, Quality, and Engagement categories). The consensus approach ensures objectivity and reduces individual model bias, with maximum 2-point variance threshold as specified in the Rally protocol.",
            size: 22
          })
        ]
      }),

      // Key Findings Table
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 Key Findings")] }),
      new Table({
        columnWidths: [1500, 2000, 1800, 1800, 2000],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              createHeaderCell("Rank"),
              createHeaderCell("Content ID"),
              createHeaderCell("Score"),
              createHeaderCell("Gate Mult."),
              createHeaderCell("Status")
            ]
          }),
          ...SORTED_RESULTS.map((r, i) => new TableRow({
            children: [
              createCell(`#${i + 1}`, { align: AlignmentType.CENTER, bold: true }),
              createCell(`Content #${r.id}`, { align: AlignmentType.CENTER }),
              createCell(r.consensus.total_score.toFixed(2), { align: AlignmentType.CENTER, bold: true, color: r.consensus.total_score >= 8 ? COLORS.passGreen : r.consensus.total_score >= 6 ? COLORS.warning : COLORS.failRed }),
              createCell(`${r.consensus.gate_multiplier.toFixed(2)}x`, { align: AlignmentType.CENTER }),
              createCell(r.disqualified ? "DISQUALIFIED" : r.variance_ok ? "PASSED" : "VARIANCE WARNING", { 
                align: AlignmentType.CENTER, 
                color: r.disqualified ? COLORS.failRed : r.variance_ok ? COLORS.passGreen : COLORS.warning 
              })
            ]
          }))
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 300 },
        children: [new TextRun({ text: "Table 1: Consensus Evaluation Rankings", size: 18, italics: true, color: COLORS.secondary })]
      }),

      // Scoring Methodology
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Scoring Methodology")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "The evaluation follows the official Rally Scoring System with multi-LLM consensus validation. Three independent LLM validators assessed each content piece, and consensus scores were calculated using mean values. Variance between validators was monitored to ensure reliability (threshold: 2.0 points maximum).",
            size: 22
          })
        ]
      }),

      // Gates Section
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Gate Metrics (Score 0-2 each)")] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({ text: "All 4 gates must pass (score > 0) for content to be eligible for rewards.", size: 20, italics: true, color: COLORS.secondary })
        ]
      }),
      new Table({
        columnWidths: [2500, 6500],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              createHeaderCell("Gate"),
              createHeaderCell("Description")
            ]
          }),
          new TableRow({ children: [createCell("G1: Content Alignment", { bold: true }), createCell("How well content aligns with campaign message and values")] }),
          new TableRow({ children: [createCell("G2: Information Accuracy", { bold: true }), createCell("Factual correctness and consistency with knowledge base")] }),
          new TableRow({ children: [createCell("G3: Campaign Compliance", { bold: true }), createCell("Adherence to campaign rules (hashtags, mentions, format)")] }),
          new TableRow({ children: [createCell("G4: Originality & Authenticity", { bold: true }), createCell("Unique perspective, human voice, not AI-generated patterns")] })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 300 },
        children: [new TextRun({ text: "Table 2: Gate Metrics Description", size: 18, italics: true, color: COLORS.secondary })]
      }),

      // Quality Metrics
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Quality Metrics (Score 0-5 each)")] }),
      new Table({
        columnWidths: [2500, 6500],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              createHeaderCell("Metric"),
              createHeaderCell("Description")
            ]
          }),
          new TableRow({ children: [createCell("Engagement Potential", { bold: true }), createCell("Hook effectiveness, call-to-action quality, conversation potential")] }),
          new TableRow({ children: [createCell("Technical Quality", { bold: true }), createCell("Grammar, spelling, formatting, platform optimization")] })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 300 },
        children: [new TextRun({ text: "Table 3: Quality Metrics Description", size: 18, italics: true, color: COLORS.secondary })]
      }),

      // Formula
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.3 Scoring Formula")] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "Gate Multiplier: M_gate = 1 + 0.5 × (g_star - 1), where g_star = average of 4 gate scores", size: 22 })]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "Campaign Points: Campaign_Points = M_gate × Σ(weighted_metrics)", size: 22 })]
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [new TextRun({ text: "Gate Multiplier Range: 0.5x (failed gate) to 1.5x (perfect gates)", size: 22 })]
      }),

      // Page Break before detailed results
      new Paragraph({ children: [new PageBreak()] }),

      // Detailed Results
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Detailed Evaluation Results")] }),

      // For each content
      ...EVALUATION_RESULTS.flatMap((result, idx) => [
        new Paragraph({ 
          heading: HeadingLevel.HEADING_2, 
          children: [new TextRun(`3.${idx + 1} Content #${result.id}`)] 
        }),
        
        // Content text
        new Paragraph({
          spacing: { after: 200 },
          shading: { fill: COLORS.tableBg, type: ShadingType.CLEAR },
          children: [
            new TextRun({ text: "Content: ", bold: true, size: 20 }),
            new TextRun({ text: `"${result.content}"`, size: 20, italics: true })
          ]
        }),

        // Consensus Scores Table
        new Table({
          columnWidths: [3000, 2000, 2000, 2000],
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                createHeaderCell("Metric"),
                createHeaderCell("V1"),
                createHeaderCell("V2"),
                createHeaderCell("V3")
              ]
            }),
            new TableRow({ children: [
              createCell("Content Alignment", { bold: true }),
              createCell(result.evaluations[0]?.gates?.content_alignment?.toString() || "-", { align: AlignmentType.CENTER }),
              createCell(result.evaluations[1]?.gates?.content_alignment?.toString() || "-", { align: AlignmentType.CENTER }),
              createCell(result.evaluations[2]?.gates?.content_alignment?.toString() || "-", { align: AlignmentType.CENTER })
            ]}),
            new TableRow({ children: [
              createCell("Consensus Score", { bold: true, bgColor: COLORS.tableBg }),
              createCell(result.consensus.total_score.toFixed(2), { align: AlignmentType.CENTER, bold: true, bgColor: COLORS.tableBg, color: result.consensus.total_score >= 8 ? COLORS.passGreen : COLORS.warning }),
              createCell(`Gate Mult: ${result.consensus.gate_multiplier.toFixed(2)}x`, { align: AlignmentType.CENTER, bgColor: COLORS.tableBg }),
              createCell(result.variance_ok ? "Variance OK" : "Variance Warning", { align: AlignmentType.CENTER, bgColor: COLORS.tableBg, color: result.variance_ok ? COLORS.passGreen : COLORS.warning })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 200 }, children: [] }),

        // Strengths & Weaknesses
        new Paragraph({
          children: [new TextRun({ text: "Strengths: ", bold: true, size: 20, color: COLORS.passGreen })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: result.strengths.map(s => `• ${s}`).join("\n"), size: 20 })]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Weaknesses: ", bold: true, size: 20, color: COLORS.failRed })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: result.weaknesses.map(w => `• ${w}`).join("\n"), size: 20 })]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Recommendations: ", bold: true, size: 20, color: COLORS.primary })]
        }),
        new Paragraph({
          spacing: { after: 400 },
          children: [new TextRun({ text: result.recommendations.map(r => `• ${r}`).join("\n"), size: 20 })]
        })
      ]),

      // Page Break before recommendations
      new Paragraph({ children: [new PageBreak()] }),

      // Overall Recommendations
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Overall Recommendations")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Top Performer Analysis")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `Content #${SORTED_RESULTS[0].id} achieved the highest consensus score of ${SORTED_RESULTS[0].consensus.total_score.toFixed(2)}. Key success factors include: ${SORTED_RESULTS[0].strengths.slice(0, 3).join(", ")}. This content demonstrates excellent balance between FOMO creation and authentic voice, achieving near-perfect gate scores across all validators.`,
            size: 22
          })
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Common Patterns in High-Scoring Content")] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "1. Personal Narrative: Content that includes personal experience or regret performs significantly better.", size: 22 })]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "2. Natural Language: Using casual, conversational tone (like 'tbh', 'no cap') increases authenticity scores.", size: 22 })]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "3. Specific Details: Including concrete examples (agents debating, real stakes) improves information accuracy.", size: 22 })]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "4. FOMO Without Hype: Creating urgency without obvious shilling maintains credibility.", size: 22 })]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 Patterns to Avoid")] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "1. Overly Fragmented Text: Short, disconnected phrases lower technical quality scores.", size: 22 })]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "2. Generic AI Patterns: Avoid phrases like 'delve into', 'revolutionize', 'in the world of'.", size: 22 })]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "3. Missing Context: Without specific details about the platform, information accuracy suffers.", size: 22 })]
      }),

      // Footer
      new Paragraph({
        spacing: { before: 400 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "— End of Report —",
            size: 18,
            italics: true,
            color: COLORS.secondary
          })
        ]
      })
    ]
  }]
});

// Generate document
const outputPath = "/home/z/my-project/download/Rally_Consensus_Evaluation_Report.docx";
Packer.toBuffer(doc).then((buffer: Buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Report generated: ${outputPath}`);
}).catch((err: Error) => {
  console.error("❌ Error:", err);
});
