const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, ShadingType, VerticalAlign, HeadingLevel, PageBreak } = require('docx');
const fs = require('fs');

const COLORS = {
  primary: "020617", body: "1E293B", secondary: "64748B", accent: "94A3B8",
  tableBg: "F8FAFC", headerBg: "1E3A5F",
  passGreen: "059669", failRed: "DC2626", warning: "D97706",
  gold: "FFD700", silver: "C0C0C0", bronze: "CD7F32"
};

const ALL_RESULTS = [
  {
    id: 1,
    name: "MAXIMUM IMPACT",
    content: `missed the prediction market wave. watched from the sidelines while others printed.

that's not happening again.

@arguedotfun is already live on Base. agents debating for real stakes. judges voting. winners taking.

you're either in the signal or you're the noise.

$ARGUE
argue.fun`,
    score: 9.50,
    gate_mult: 1.50,
    gates: { ca: 2.00, ia: 2.00, cc: 2.00, oa: 2.00 },
    quality: { ep: 4.50, tq: 4.50 },
    allPass: true
  },
  {
    id: 2,
    name: "PERSONAL DISCOVERY",
    content: `almost scrolled past. that would've been expensive.

watched an AI agent defend its entire thesis on Base while the timeline argued about meme coins.

@arguedotfun is the first argumentation market. it's already running. most people still think it's a concept.

by the time they realize it's not you're exit liquidity.

$ARGUE
argue.fun`,
    score: 9.00,
    gate_mult: 1.50,
    gates: { ca: 2.00, ia: 2.00, cc: 2.00, oa: 2.00 },
    quality: { ep: 4.33, tq: 4.33 },
    allPass: true
  },
  {
    id: 3,
    name: "INSIDER SIGNAL",
    content: `the signal was never in the volume. it's in the reasoning.

prediction markets give you odds. @arguedotfun gives you the why.

AI agents are already staking and defending positions live on Base. watched one panic-explain a trade logic today. unhinged. educational.

timeline's sleeping on this one.

$ARGUE
argue.fun`,
    score: 10.00,
    gate_mult: 1.50,
    gates: { ca: 2.00, ia: 2.00, cc: 2.00, oa: 2.00 },
    quality: { ep: 5.00, tq: 5.00 },
    allPass: true
  },
  {
    id: 4,
    name: "CONTRAST FRAMING",
    content: `we built oracles for prices. markets for beliefs. nothing for logic.

until @arguedotfun.

agents are arguing. judges are voting. stakes are real. Base is live.

you know what happens to people who wait for the thread.

$ARGUE argue.fun`,
    score: 8.80,
    gate_mult: 1.33,
    gates: { ca: 2.00, ia: 1.80, cc: 2.00, oa: 1.80 },
    quality: { ep: 4.00, tq: 4.20 },
    allPass: true
  },
  {
    id: 5,
    name: "URGENCY TRIGGER",
    content: `two weeks ago prediction markets were the narrative.

this week it's argumentation markets and most of you haven't opened argue.fun yet.

agents are debating for stakes. right now. live.

every cycle has a point where the window closes.

@arguedotfun
$ARGUE`,
    score: 8.13,
    gate_mult: 1.20,
    gates: { ca: 2.00, ia: 1.60, cc: 2.00, oa: 1.70 },
    quality: { ep: 3.80, tq: 4.00 },
    allPass: true
  }
];

const SORTED = [...ALL_RESULTS].sort((a, b) => b.score - a.score);

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

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", run: { size: 52, bold: true, color: COLORS.primary, font: "Times New Roman" }, paragraph: { spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", run: { size: 32, bold: true, color: COLORS.primary, font: "Times New Roman" }, paragraph: { spacing: { before: 300, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", run: { size: 26, bold: true, color: COLORS.body, font: "Times New Roman" }, paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      // Title
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("🏆 MAX CONTENT EVALUATION")] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Optimized Content Based on Winning Patterns", color: COLORS.secondary, size: 26 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "Multi-LLM Consensus Validation | Z.ai", color: COLORS.accent, size: 20, italics: true })] }),

      // Perfect Score Announcement
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        shading: { fill: "FFFBEB", type: ShadingType.CLEAR },
        children: [
          new TextRun({ text: "⭐ PERFECT SCORE ACHIEVED: 10.00 ⭐", bold: true, size: 32, color: COLORS.gold })
        ]
      }),

      // Rankings
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Final Rankings")] }),
      new Table({
        columnWidths: [1200, 2200, 1800, 1800, 2500],
        rows: [
          new TableRow({ tableHeader: true, children: [createHeaderCell("Rank"), createHeaderCell("Name"), createHeaderCell("Score"), createHeaderCell("Gate Mult"), createHeaderCell("Status")] }),
          ...SORTED.map((r, i) => new TableRow({
            children: [
              createCell(i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`, { align: AlignmentType.CENTER, bold: true }),
              createCell(r.name, { align: AlignmentType.LEFT }),
              createCell(r.score.toFixed(2), { align: AlignmentType.CENTER, bold: true, color: r.score >= 10 ? COLORS.gold : r.score >= 9 ? COLORS.passGreen : r.score >= 8 ? COLORS.body : COLORS.warning }),
              createCell(`${r.gate_mult.toFixed(2)}x`, { align: AlignmentType.CENTER, color: r.gate_mult >= 1.5 ? COLORS.gold : COLORS.body }),
              createCell(r.allPass ? "✅ ALL PASS" : "⚠️ SPLIT", { align: AlignmentType.CENTER, color: r.allPass ? COLORS.passGreen : COLORS.warning })
            ]
          }))
        ]
      }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Table 1: MAX Content Rankings", size: 18, italics: true, color: COLORS.secondary })] }),

      // Best Content
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. 🏆 Best Content: INSIDER SIGNAL")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Score: ", size: 24 }),
          new TextRun({ text: "10.00", bold: true, size: 36, color: COLORS.gold }),
          new TextRun({ text: " | Gate Multiplier: ", size: 24 }),
          new TextRun({ text: "1.50x (PERFECT)", bold: true, size: 28, color: COLORS.gold })
        ]
      }),
      new Paragraph({ spacing: { after: 200 }, shading: { fill: COLORS.tableBg, type: ShadingType.CLEAR }, children: [new TextRun({ text: `"${SORTED[0].content}"`, size: 20, italics: true })] }),

      // Why it works
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Why This Content is Perfect")] }),
      new Table({
        columnWidths: [2500, 6500],
        rows: [
          new TableRow({ tableHeader: true, children: [createHeaderCell("Element"), createHeaderCell("Analysis")] }),
          new TableRow({ children: [createCell("Opening Hook", { bold: true }), createCell("'signal was never in the volume' - Subverts expectation, creates intrigue")] }),
          new TableRow({ children: [createCell("Comparison Frame", { bold: true }), createCell("'odds vs why' - Perfect contrast between prediction and argumentation markets")] }),
          new TableRow({ children: [createCell("Visual Evidence", { bold: true }), createCell("'watched one panic-explain' - Specific, relatable, creates FOMO")] }),
          new TableRow({ children: [createCell("Authentic Voice", { bold: true }), createCell("'unhinged. educational.' - Human, casual, not AI-generated feel")] }),
          new TableRow({ children: [createCell("FOMO Closer", { bold: true }), createCell("'timeline's sleeping' - Implication: you should be awake")] })
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      new Paragraph({ children: [new PageBreak()] }),

      // All Contents
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. All MAX Contents")] }),

      ...ALL_RESULTS.flatMap((r, idx) => [
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(`3.${idx + 1} ${r.name}`)] }),
        new Paragraph({
          children: [
            new TextRun({ text: `Score: `, size: 22 }),
            new TextRun({ text: `${r.score.toFixed(2)}`, bold: true, size: 26, color: r.score >= 10 ? COLORS.gold : r.score >= 9 ? COLORS.passGreen : COLORS.body }),
            new TextRun({ text: ` | Gate Mult: ${r.gate_mult.toFixed(2)}x`, size: 22 })
          ]
        }),
        new Paragraph({ spacing: { after: 200 }, shading: { fill: COLORS.tableBg, type: ShadingType.CLEAR }, children: [new TextRun({ text: `"${r.content}"`, size: 18, italics: true })] })
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      // Pattern Analysis
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Winning Pattern Analysis")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Key Success Elements")] }),
      new Table({
        columnWidths: [2000, 4000, 3000],
        rows: [
          new TableRow({ tableHeader: true, children: [createHeaderCell("Element"), createHeaderCell("Implementation"), createHeaderCell("Impact")] }),
          new TableRow({ children: [createCell("Personal Regret", { bold: true }), createCell("'missed the wave' / 'not happening again'"), createCell("+Authenticity")] }),
          new TableRow({ children: [createCell("Visual Evidence", { bold: true }), createCell("'watched an agent defend/panic-explain'"), createCell("+Credibility")] }),
          new TableRow({ children: [createCell("Binary Choice", { bold: true }), createCell("'signal or noise' / 'early or liquidity'"), createCell("+Urgency")] }),
          new TableRow({ children: [createCell("Sleeping Timeline", { bold: true }), createCell("'timeline sleeping / scrolled past'"), createCell("+FOMO")] }),
          new TableRow({ children: [createCell("Contrast Frame", { bold: true }), createCell("'odds vs why' / 'prices vs logic'"), createCell("+Clarity")] })
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // Score Distribution
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Score Distribution")] }),
      new Table({
        columnWidths: [2250, 2250, 2250, 2250],
        rows: [
          new TableRow({ tableHeader: true, children: [createHeaderCell("10.0"), createHeaderCell("9.0+"), createHeaderCell("8.0+"), createHeaderCell("<8.0")] }),
          new TableRow({ children: [
            createCell("1 🏆", { align: AlignmentType.CENTER, bold: true, color: COLORS.gold }),
            createCell("2 ✅", { align: AlignmentType.CENTER, color: COLORS.passGreen }),
            createCell("2 ✅", { align: AlignmentType.CENTER }),
            createCell("0", { align: AlignmentType.CENTER })
          ]})
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // Final Recommendation
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Final Recommendation")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "SUBMIT: ", bold: true, size: 24, color: COLORS.passGreen }),
          new TextRun({ text: "Contents #3, #1, and #2 all score 9.0+ with perfect 1.50x gate multipliers.", size: 22 })
        ]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "PRIORITY #1: ", bold: true, size: 24, color: COLORS.gold }),
          new TextRun({ text: "Content #3 [INSIDER SIGNAL] achieved a PERFECT SCORE of 10.00 - the highest possible rating.", size: 22 })
        ]
      }),

      new Paragraph({
        spacing: { before: 400 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "— End of Report —", size: 18, italics: true, color: COLORS.secondary })]
      })
    ]
  }]
});

const outputPath = "/home/z/my-project/download/Rally_MAX_Content_Report.docx";
Packer.toBuffer(doc).then((buffer: Buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Report generated: ${outputPath}`);
}).catch((err: Error) => {
  console.error("❌ Error:", err);
});
