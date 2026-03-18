const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, ShadingType, VerticalAlign, HeadingLevel, PageBreak } = require('docx');
const fs = require('fs');

const COLORS = {
  primary: "020617", body: "1E293B", secondary: "64748B", accent: "94A3B8",
  tableBg: "F8FAFC", headerBg: "1E3A5F",
  passGreen: "059669", gold: "FFD700", silver: "C0C0C0", bronze: "CD7F32"
};

const ALL_RESULTS = [
  { id: 1, name: "ALMOST SCROLLED", score: 9.00, gate_mult: 1.50, allPass: true,
    content: `almost scrolled past. thought it was another ai agent gimmick.\n\nwatched a debate settle on Base. real tokens moved.\n\n@arguedotfun isnt waiting for the narrative to catch up.\n\nby the time influencers post this you're already liquidity.\n\n$ARGUE\nargue.fun` },
  { id: 2, name: "HERES THE THING", score: 7.63, gate_mult: 1.20, allPass: true,
    content: `heres the thing. most of you will read this and do nothing.\n\nsame as prediction markets. same as perps. same as everything.\n\n@arguedotfun is live on Base. agents are arguing right now.\n\nwake up when youre liquidity or wake up now.\n\n$ARGUE\nargue.fun` },
  { id: 3, name: "WATCHING A WEEK", score: 8.53, gate_mult: 1.23, allPass: true,
    content: `been watching argue.fun for a week. said nothing.\n\nwatched agents defend positions. watched judges vote. watched tokens move.\n\n@arguedotfun doesnt need hype. it needs people who see it early.\n\nthats you or thats not.\n\n$ARGUE\nargue.fun` },
  { id: 4, name: "GOT BURNED", score: 7.73, gate_mult: 1.13, allPass: true,
    content: `got burned on the last narrative. waited for "proof". missed it.\n\nthis time im not waiting.\n\n@arguedotfun is live. agents debating. judges voting. on Base.\n\nif this feels like deja vu thats because youve been here before.\n\n$ARGUE\nargue.fun` },
  { id: 5, name: "CIRCUS WRONG", score: 8.33, gate_mult: 1.20, allPass: true,
    content: `thought this was another ai agent circus. was wrong.\n\nsaw the tx myself. real stakes. real arguments.\n\n@arguedotfun shipped while everyone tweeted about the next memecoin.\n\nyou know what happens when you wait.\n\n$ARGUE\nargue.fun` },
  { id: 6, name: "3AM SCROLL", score: 8.33, gate_mult: 1.20, allPass: true,
    content: `3am. scrolling. almost slept on this.\n\nwatched two agents go at it for 20 mins. one lost eth.\n\n@arguedotfun isnt a pitch deck. its live on Base.\n\nby the time ct talks about this youre funding exits.\n\n$ARGUE\nargue.fun` }
];

const SORTED = [...ALL_RESULTS].sort((a, b) => b.score - a.score);

function cell(text: string, opts: any = {}) {
  const { bold = false, color = COLORS.body, align = AlignmentType.LEFT, bg = null } = opts;
  return new TableCell({
    children: [new Paragraph({ alignment: align, children: [new TextRun({ text, bold, color, font: "Times New Roman", size: 20 })] })],
    verticalAlign: VerticalAlign.CENTER,
    shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 }
  });
}

function hCell(text: string) {
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
      { id: "Title", name: "Title", basedOn: "Normal", run: { size: 48, bold: true, color: COLORS.primary, font: "Times New Roman" }, paragraph: { spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", run: { size: 32, bold: true, color: COLORS.primary, font: "Times New Roman" }, paragraph: { spacing: { before: 300, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", run: { size: 26, bold: true, color: COLORS.body, font: "Times New Roman" }, paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("RALLY CONSENSUS EVALUATION")] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Multi-LLM Consensus Scoring - Batch 5", color: COLORS.secondary, size: 24 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: "⭐ PERFECT 1.50x GATE MULTIPLIER ACHIEVED ⭐", color: COLORS.gold, size: 22, bold: true })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Executive Summary")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Content #1 [ALMOST SCROLLED] achieved a PERFECT score of 9.00 with maximum 1.50x gate multiplier - the highest possible rating. All 6 contents passed Rally gates with scores ranging from 7.63 to 9.00.", size: 22 })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 Final Rankings")] }),
      new Table({
        columnWidths: [1200, 2200, 1800, 1800, 2500],
        rows: [
          new TableRow({ tableHeader: true, children: [hCell("Rank"), hCell("Name"), hCell("Score"), hCell("Gate Mult"), hCell("Status")] }),
          ...SORTED.map((r, i) => new TableRow({
            children: [
              cell(i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`, { align: AlignmentType.CENTER, bold: true }),
              cell(r.name, { align: AlignmentType.LEFT }),
              cell(r.score.toFixed(2), { align: AlignmentType.CENTER, bold: true, color: r.score >= 9 ? COLORS.gold : r.score >= 8.5 ? COLORS.passGreen : COLORS.body }),
              cell(`${r.gate_mult.toFixed(2)}x`, { align: AlignmentType.CENTER, color: r.gate_mult >= 1.5 ? COLORS.gold : r.gate_mult >= 1.2 ? COLORS.passGreen : COLORS.body }),
              cell("✅ PASS", { align: AlignmentType.CENTER, color: COLORS.passGreen })
            ]
          }))
        ]
      }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Table 1: Batch 5 Final Rankings", size: 18, italics: true, color: COLORS.secondary })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 Score Distribution")] }),
      new Table({
        columnWidths: [2250, 2250, 2250, 2250],
        rows: [
          new TableRow({ tableHeader: true, children: [hCell("9.0+"), hCell("8.5+"), hCell("8.0+"), hCell("<8.0")] }),
          new TableRow({ children: [
            cell("1 🏆", { align: AlignmentType.CENTER, color: COLORS.gold }),
            cell("1", { align: AlignmentType.CENTER, color: COLORS.passGreen }),
            cell("2", { align: AlignmentType.CENTER }),
            cell("2", { align: AlignmentType.CENTER })
          ]})
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. 🏆 Best Content: ALMOST SCROLLED")] }),
      new Paragraph({
        spacing: { after: 150 },
        children: [
          new TextRun({ text: "Score: ", size: 22 }),
          new TextRun({ text: "9.00", bold: true, size: 32, color: COLORS.gold }),
          new TextRun({ text: " | Gate Multiplier: ", size: 22 }),
          new TextRun({ text: "1.50x (PERFECT)", bold: true, size: 28, color: COLORS.gold })
        ]
      }),
      new Paragraph({ spacing: { after: 200 }, shading: { fill: COLORS.tableBg, type: ShadingType.CLEAR }, children: [new TextRun({ text: `"${SORTED[0].content}"`, size: 20, italics: true })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Why It's Perfect")] }),
      new Table({
        columnWidths: [2500, 6500],
        rows: [
          new TableRow({ tableHeader: true, children: [hCell("Element"), hCell("Analysis")] }),
          new TableRow({ children: [cell("Initial Dismissal", { bold: true }), cell("'thought it was another gimmick' - Creates relatability, authentic skepticism")] }),
          new TableRow({ children: [cell("Visual Proof", { bold: true }), cell("'watched debate settle... real tokens moved' - Concrete evidence, not hype")] }),
          new TableRow({ children: [cell("Not Waiting", { bold: true }), cell("'isnt waiting for narrative' - Shows platform confidence, urgency")] }),
          new TableRow({ children: [cell("Influencer Angle", { bold: true }), cell("'by the time influencers post' - Implies CT is late, reader can be early")] }),
          new TableRow({ children: [cell("Liquidity Closer", { bold: true }), cell("'already liquidity' - Binary choice, strong FOMO")] })
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. All Contents")] }),
      ...SORTED.flatMap((r, i) => [
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(`3.${i + 1} ${r.name} — Rank #${i + 1}`)] }),
        new Paragraph({
          children: [
            new TextRun({ text: `Score: `, size: 22 }),
            new TextRun({ text: `${r.score.toFixed(2)}`, bold: true, size: 24, color: r.score >= 9 ? COLORS.gold : r.score >= 8 ? COLORS.passGreen : COLORS.body }),
            new TextRun({ text: ` | Gate Mult: ${r.gate_mult.toFixed(2)}x`, size: 22 })
          ]
        }),
        new Paragraph({ spacing: { after: 200 }, shading: { fill: COLORS.tableBg, type: ShadingType.CLEAR }, children: [new TextRun({ text: `"${r.content}"`, size: 18, italics: true })] })
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Pattern Analysis")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Winning Elements")] }),
      new Table({
        columnWidths: [2500, 4000, 2500],
        rows: [
          new TableRow({ tableHeader: true, children: [hCell("Pattern"), hCell("Example"), hCell("Impact")] }),
          new TableRow({ children: [cell("Initial Skepticism", { bold: true }), cell("'thought it was another gimmick/circus'"), cell("+Authenticity")] }),
          new TableRow({ children: [cell("Visual Evidence", { bold: true }), cell("'watched debate settle/tx myself'"), cell("+Credibility")] }),
          new TableRow({ children: [cell("Real Tokens", { bold: true }), cell("'real tokens moved/one lost eth'"), cell("+Concrete")] }),
          new TableRow({ children: [cell("CT Late Angle", { bold: true }), cell("'influencers post/ct talks'"), cell("+Insider")] }),
          new TableRow({ children: [cell("Liquidity Threat", { bold: true }), cell("'already/funding exits'"), cell("+FOMO")] })
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Recommendations")] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "🥇 PRIORITY #1: ALMOST SCROLLED (9.00 pts, 1.50x) - PERFECT SCORE", size: 22, bold: true, color: COLORS.gold })] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "🥈 ALTERNATE: WATCHING A WEEK (8.53 pts, 1.23x) - Strong backup", size: 22 })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "✅ ALL 6 CONTENTS PASS - Ready for submission", size: 22, color: COLORS.passGreen })] }),

      new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "End of Report", size: 18, italics: true, color: COLORS.secondary })] })
    ]
  }]
});

Packer.toBuffer(doc).then((buffer: Buffer) => {
  fs.writeFileSync("/home/z/my-project/download/Rally_Batch5_Final_Report.docx", buffer);
  console.log("✅ Report: /home/z/my-project/download/Rally_Batch5_Final_Report.docx");
});
