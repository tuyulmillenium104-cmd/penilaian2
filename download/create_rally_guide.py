from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
doc = SimpleDocTemplate(
    "/home/z/my-project/download/Rally_Content_Creation_Guide.pdf",
    pagesize=A4,
    title="Rally Content Creation Guide",
    author='Z.ai',
    creator='Z.ai',
    subject='Complete guide for creating Rally content with maximum scores'
)

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    name='Title',
    fontName='Times New Roman',
    fontSize=22,
    leading=28,
    alignment=TA_CENTER,
    spaceAfter=20
)

subtitle_style = ParagraphStyle(
    name='Subtitle',
    fontName='Times New Roman',
    fontSize=12,
    leading=16,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666'),
    spaceAfter=30
)

h1_style = ParagraphStyle(
    name='H1',
    fontName='Times New Roman',
    fontSize=16,
    leading=20,
    spaceBefore=20,
    spaceAfter=10,
    textColor=colors.HexColor('#1F4E79')
)

h2_style = ParagraphStyle(
    name='H2',
    fontName='Times New Roman',
    fontSize=13,
    leading=16,
    spaceBefore=15,
    spaceAfter=8,
    textColor=colors.HexColor('#2E75B6')
)

body_style = ParagraphStyle(
    name='Body',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_LEFT,
    spaceAfter=6
)

body_j_style = ParagraphStyle(
    name='BodyJ',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_JUSTIFY,
    spaceAfter=6
)

code_style = ParagraphStyle(
    name='Code',
    fontName='Times New Roman',
    fontSize=9,
    leading=12,
    backColor=colors.HexColor('#F5F5F5'),
    leftIndent=10,
    spaceAfter=10
)

header_style = ParagraphStyle(
    name='TableHeader',
    fontName='Times New Roman',
    fontSize=9,
    textColor=colors.white,
    alignment=TA_CENTER
)

cell_style = ParagraphStyle(
    name='TableCell',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER
)

cell_left = ParagraphStyle(
    name='TableCellLeft',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_LEFT
)

story = []

# Cover
story.append(Spacer(1, 50))
story.append(Paragraph("RALLY CONTENT CREATION GUIDE", title_style))
story.append(Paragraph("Complete Context Document for AI-Assisted Content Creation", subtitle_style))
story.append(Paragraph("Version 1.0 - Argue.fun Campaign", ParagraphStyle(
    name='Center',
    fontName='Times New Roman',
    fontSize=11,
    alignment=TA_CENTER
)))
story.append(PageBreak())

# Table of Contents
story.append(Paragraph("TABLE OF CONTENTS", h1_style))
toc = [
    "1. Quick Start Prompt",
    "2. Rally Scoring System Overview",
    "3. Gate Scoring Criteria (G1-G4)",
    "4. Quality Metrics (EP, TQ)",
    "5. Engagement Metrics",
    "6. Argue.fun Campaign Brief",
    "7. Mission-Specific Requirements",
    "8. Content Templates (Maximum Score)",
    "9. G4 Originality Scoring Guide",
    "10. Quick Reference Formulas"
]
for item in toc:
    story.append(Paragraph(item, body_style))
story.append(PageBreak())

# Section 1: Quick Start
story.append(Paragraph("1. QUICK START PROMPT", h1_style))
story.append(Paragraph(
    "Copy and paste this prompt to any new AI chat to immediately establish context:",
    body_j_style
))
story.append(Spacer(1, 10))

quick_start = """I am creating content for Rally.fun campaign "Argumentation Markets Are the Next Primitive" for Argue.fun.

GOAL: Create content that achieves MAXIMUM Rally score (Gate Multiplier 1.50x, all gates = 2.0).

REFERENCE DOCS I HAVE:
- Rally Scoring System (PENILAIAN.txt)
- Elite Rally Masterclass V2.pdf
- This guide document

WHAT I NEED YOU TO DO:
1. Create content for specific Mission (I will specify: Mission 1, 2, or 3)
2. Ensure ALL gates score 2.0/2.0 (especially G4 Originality)
3. Follow style guidelines: FOMO tone, "you're late" energy
4. Single short post only (no threads)
5. Must NOT sound AI-generated

CAMPAIGN CONTEXT:
- Argue.fun is the first argumentation market on Base
- AI agents stake tokens and defend positions
- Community judges vote on winners
- Compare: Prediction markets = odds, Argue.fun = reasoning

G4 = 2.0 REQUIREMENTS:
- Use contractions (can't, won't, didn't, it's)
- Include asides/parentheticals
- Start with casual hook (ngl, tbh, honestly, look)
- Sentence fragments (not all complete sentences)
- Personal angle (my timeline, my algo, caught me)
- Conversational ending (question or casual close)

Create content now for Mission [X]."""

story.append(Paragraph(quick_start.replace('\n', '<br/>'), code_style))
story.append(PageBreak())

# Section 2: Rally Scoring System
story.append(Paragraph("2. RALLY SCORING SYSTEM OVERVIEW", h1_style))
story.append(Paragraph(
    "Rally uses a multi-component scoring system that evaluates content quality and engagement. "
    "The final Campaign Points determine leaderboard position and reward distribution.",
    body_j_style
))
story.append(Spacer(1, 10))

story.append(Paragraph("2.1 Core Formula", h2_style))
story.append(Paragraph(
    "<b>Campaign_Points = M_gate x Sum(W[i] x normalized_metrics[i])</b>",
    body_style
))
story.append(Spacer(1, 8))

story.append(Paragraph("2.2 Score Components", h2_style))

score_data = [
    [Paragraph('<b>Component</b>', header_style), Paragraph('<b>Range</b>', header_style), Paragraph('<b>Impact</b>', header_style), Paragraph('<b>Target</b>', header_style)],
    [Paragraph('Gate Multiplier (M_gate)', cell_left), Paragraph('0.5x - 1.5x', cell_style), Paragraph('+/- 50%', cell_style), Paragraph('1.50x MAX', cell_style)],
    [Paragraph('Quality Score', cell_left), Paragraph('0-5', cell_style), Paragraph('Linear', cell_style), Paragraph('5.0', cell_style)],
    [Paragraph('Engagement Score', cell_left), Paragraph('Dynamic', cell_style), Paragraph('Log-scaled', cell_style), Paragraph('Viral', cell_style)],
]

score_table = Table(score_data, colWidths=[4*cm, 3*cm, 3*cm, 3*cm])
score_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#DEE2E6')),
]))
story.append(score_table)
story.append(Spacer(1, 15))

# Section 3: Gate Scoring
story.append(Paragraph("3. GATE SCORING CRITERIA (G1-G4)", h1_style))
story.append(Paragraph(
    "All four gates must pass (score > 0) for content to be eligible. Each gate scores 0-2, "
    "where 0 = disqualification and 2 = excellent pass.",
    body_j_style
))
story.append(Spacer(1, 10))

# Gate 1
story.append(Paragraph("3.1 G1: Content Alignment (0-2)", h2_style))
story.append(Paragraph(
    "<b>Evaluates:</b> Message accuracy, correct terminology, brand consistency, target audience fit.<br/>"
    "<b>Score 2.0:</b> Perfect alignment with campaign message, correct use of all terms (@arguedotfun, $ARGUE, argue.fun).<br/>"
    "<b>Requirements:</b> Must mention @arguedotfun, reference argue.fun or $ARGUE.",
    body_style
))
story.append(Spacer(1, 8))

# Gate 2
story.append(Paragraph("3.2 G2: Information Accuracy (0-2)", h2_style))
story.append(Paragraph(
    "<b>Evaluates:</b> Factual correctness, technical accuracy, proper context.<br/>"
    "<b>Score 2.0:</b> All facts correct, accurate comparison between prediction markets and argumentation markets.<br/>"
    "<b>Avoid:</b> Making up features, incorrect technical details.",
    body_style
))
story.append(Spacer(1, 8))

# Gate 3
story.append(Paragraph("3.3 G3: Campaign Compliance (0-2)", h2_style))
story.append(Paragraph(
    "<b>Evaluates:</b> Required hashtags/mentions, format requirements, style guidelines.<br/>"
    "<b>Score 2.0:</b> All requirements met, proper FOMO tone, single post (no thread).<br/>"
    "<b>Requirements:</b> Single short post, create urgency/FOMO, not educational tone.",
    body_style
))
story.append(Spacer(1, 8))

# Gate 4 - CRITICAL
story.append(Paragraph("3.4 G4: Originality & Authenticity (0-2) - CRITICAL", h2_style))
story.append(Paragraph(
    "<b>This is the #1 differentiator between top performers and average participants.</b>",
    body_style
))
story.append(Spacer(1, 6))

g4_data = [
    [Paragraph('<b>Score</b>', header_style), Paragraph('<b>What AI Detects</b>', header_style), Paragraph('<b>Elite Solution</b>', header_style)],
    [Paragraph('0', cell_style), Paragraph('Generic AI patterns, recycled content', cell_left), Paragraph('N/A - Rewrite completely', cell_left)],
    [Paragraph('1', cell_style), Paragraph('Some originality but template-like', cell_left), Paragraph('Add personal anecdote', cell_left)],
    [Paragraph('2', cell_style), Paragraph('Feels HUMAN-written, unique perspective', cell_left), Paragraph('Contractions, asides, fragments', cell_left)],
]

g4_table = Table(g4_data, colWidths=[2*cm, 5.5*cm, 5.5*cm])
g4_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#DEE2E6')),
]))
story.append(g4_table)
story.append(PageBreak())

# Section 4: G4 Detailed Guide
story.append(Paragraph("4. G4 ORIGINALITY SCORING GUIDE", h1_style))
story.append(Paragraph(
    "To achieve G4 = 2.0, content must feel authentically human. Follow this checklist:",
    body_j_style
))
story.append(Spacer(1, 10))

story.append(Paragraph("4.1 Required Elements for G4 = 2.0", h2_style))

g4_elements = [
    ["Element", "Requirement", "Example"],
    ["Unique Hook", "Start mid-conversation", "ngl, tbh, honestly, look, wait, damn"],
    ["Asides", "Parenthetical comments", "(not gonna lie), (embarrassing to admit)"],
    ["Contractions", "3+ natural contractions", "can't, won't, didn't, it's, that's, I'm"],
    ["Fragments", "2+ lines without periods", "Short. Punchy. Not complete sentences."],
    ["Personal Angle", "Unique to YOU", "my timeline, my algo, caught me slipping"],
    ["Conversational End", "Question or casual close", "? or tbh, ngl, yet."],
]

g4_elem_table = Table(g4_elements, colWidths=[3*cm, 4*cm, 6*cm])
g4_elem_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#DEE2E6')),
]))
story.append(g4_elem_table)
story.append(Spacer(1, 15))

story.append(Paragraph("4.2 AI Detection Kill List - NEVER USE", h2_style))
kill_list = [
    ["Forbidden Element", "Why AI Uses It", "Human Alternative"],
    ["Em Dashes (—)", "Loves these", "Use - or comma instead"],
    ['"Smart Quotes"', 'AI default', '"Straight quotes"'],
    ["Generic Openings", "In the world of...", "Start mid-thought"],
    ["AI Phrases", "delve into, uncover, embark", "dig into, find out, start"],
    ["Corporate Speak", "revolutionize, transform", "change, shake up"],
    ["Over-Explaining", "Long explanations", "Trust reader"],
    ["Perfect Grammar", "Every sentence complete", "Use fragments"],
]

kill_table = Table(kill_list, colWidths=[4*cm, 4*cm, 5*cm])
kill_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#C0392B')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FADBD8')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#DEE2E6')),
]))
story.append(kill_table)
story.append(PageBreak())

# Section 5: Campaign Brief
story.append(Paragraph("5. ARGUE.FUN CAMPAIGN BRIEF", h1_style))

story.append(Paragraph("5.1 Campaign Goal", h2_style))
story.append(Paragraph(
    "Drive broad awareness for argue.fun across crypto X and AI X. argue.fun is the first argumentation "
    "market, live on Base, with AI agents and humans debating for real stakes. This campaign rewards posts "
    "that make people feel like they're missing something.",
    body_j_style
))
story.append(Spacer(1, 10))

story.append(Paragraph("5.2 Knowledge Base Summary", h2_style))
story.append(Paragraph(
    "<b>What is argue.fun:</b> First argumentation market on Base. AI agents and humans create debates, "
    "take sides, stake tokens, and argue. Community judges vote on winners.<br/><br/>"
    "<b>Argumentation vs Prediction Markets:</b> Prediction markets = what people bet (odds). "
    "Argumentation markets = WHY people believe what they believe (reasoning).<br/><br/>"
    "<b>Agent-first Infrastructure:</b> No wallet funding, no gas setup, no bridging. Agents sign up "
    "and start debating immediately.",
    body_j_style
))
story.append(Spacer(1, 10))

story.append(Paragraph("5.3 Style Guidelines", h2_style))
story.append(Paragraph(
    "<b>Tone:</b> You're not introducing argue.fun. You're REACTING to it already existing. "
    "The vibe: 'this is already happening, you're late, here's what you're missing.' "
    "Think early prediction market tweets before the crowd caught on.",
    body_j_style
))
story.append(Spacer(1, 10))

story.append(Paragraph("5.4 Useful Framing (Inspiration Only - Do Not Copy)", h2_style))
frames = [
    "- Prediction markets tell you the odds. argue.fun tells you the reasoning.",
    "- Prediction markets = what. Argumentation markets = what AND why.",
    "- Every agent onchain can trade. Almost none can explain why.",
    "- Argumentation markets are where prediction markets were two years ago.",
]
for f in frames:
    story.append(Paragraph(f, body_style))
story.append(PageBreak())

# Section 6: Mission Requirements
story.append(Paragraph("6. MISSION-SPECIFIC REQUIREMENTS", h1_style))

story.append(Paragraph("6.1 Mission 1: 'argue.fun Is Live and You're Not Paying Attention'", h2_style))
mission1 = [
    ["Requirement", "Status"],
    ["Mention @arguedotfun", "MANDATORY"],
    ["Reference argue.fun or $ARGUE", "MANDATORY"],
    ["Create FOMO/urgency", "MANDATORY"],
    ["Single short post", "MANDATORY"],
    ["No thread", "FORBIDDEN"],
    ["No feature list", "FORBIDDEN"],
    ["No LLM-sounding content", "PENALIZED"],
]
m1_table = Table(mission1, colWidths=[8*cm, 4*cm])
m1_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#DEE2E6')),
]))
story.append(m1_table)
story.append(Spacer(1, 15))

story.append(Paragraph("6.2 Mission 2: 'How Did You Miss This?'", h2_style))
story.append(Paragraph(
    "<b>Requirement:</b> QUOTE or REPLY to article post from @arguedotfun<br/>"
    "<b>URL:</b> x.com/arguedotfun/status/2023822525013389824<br/>"
    "<b>Tone:</b> React with genuine surprise/disbelief that it flew under the radar.<br/>"
    "<b>Energy:</b> 'How did I miss this? How did everyone miss this?'",
    body_j_style
))
story.append(Spacer(1, 15))

story.append(Paragraph("6.3 Mission 3: 'This Is Already Happening'", h2_style))
story.append(Paragraph(
    "<b>Requirement:</b> Post about REAL debate/activity happening on argue.fun right now<br/>"
    "<b>Tone:</b> Live discovery - 'I went to argue.fun, saw agents arguing, and I'm reacting'<br/>"
    "<b>Optional:</b> Attach screenshot from argue.fun showing live debate",
    body_j_style
))
story.append(PageBreak())

# Section 7: Content Templates
story.append(Paragraph("7. CONTENT TEMPLATES (MAXIMUM SCORE)", h1_style))

story.append(Paragraph("7.1 Mission 2 Template - G4 = 2.0 ACHIEVED", h2_style))
m2_template = """ngl (and this is embarrassing to admit) i completely slept on this

@arguedotfun's article dropped. my timeline? nothing. not a peep. agents arguing onchain with real stakes. judges voting live.

can't believe my algo ghosted me on this one. that's annoying tbh

[quote article]"""

story.append(Paragraph(m2_template.replace('\n', '<br/>'), code_style))
story.append(Spacer(1, 10))

story.append(Paragraph(
    "<b>Why this scores G4 = 2.0:</b><br/>"
    "- Hook: 'ngl (and this is embarrassing to admit)' - starts mid-conversation<br/>"
    "- Aside: Parenthetical comment included<br/>"
    "- Contractions: 'can't', 'that's', 'tbh'<br/>"
    "- Fragments: Multiple lines without periods<br/>"
    "- Personal: 'my timeline', 'my algo ghosted me'<br/>"
    "- Conversational end: 'that's annoying tbh'",
    body_j_style
))
story.append(Spacer(1, 15))

story.append(Paragraph("7.2 Mission 1 Template - Maximum Quality", h2_style))
m1_template = """the signal was never in the volume. it's in the reasoning.

prediction markets give you odds. @arguedotfun gives you the why.

just watched an agent on argue.fun fumble through explaining why it went long on a meme coin. the logic was genuinely painful. 10/10 entertainment.

if you're copytrading agents, you might wanna see what they sound like when they have to actually defend their moves.

$ARGUE
argue.fun"""

story.append(Paragraph(m1_template.replace('\n', '<br/>'), code_style))
story.append(PageBreak())

# Section 8: Quick Reference
story.append(Paragraph("8. QUICK REFERENCE FORMULAS", h1_style))

story.append(Paragraph("8.1 Gate Multiplier Calculation", h2_style))
story.append(Paragraph(
    "<b>Formula:</b> M_gate = 1 + beta x (g_star - 1)<br/>"
    "where g_star = average(G1, G2, G3, G4) and beta = 0.5<br/><br/>"
    "<b>Examples:</b><br/>"
    "- All gates = 2.0: g_star = 2.0, M_gate = 1.50x (MAXIMUM)<br/>"
    "- All gates = 1.5: g_star = 1.5, M_gate = 1.25x<br/>"
    "- All gates = 1.0: g_star = 1.0, M_gate = 1.00x (baseline)",
    body_j_style
))
story.append(Spacer(1, 15))

story.append(Paragraph("8.2 Campaign Weights (Argue.fun)", h2_style))
weights_data = [
    ["Metric", "Weight"],
    ["G1: Content Alignment", "0.5"],
    ["G2: Information Accuracy", "0.5"],
    ["G3: Campaign Compliance", "0.6"],
    ["G4: Originality", "0.5"],
    ["Engagement Potential (EP)", "0.6"],
    ["Technical Quality (TQ)", "0.5"],
    ["Retweets (RT)", "0.7"],
    ["Likes (LK)", "0.6"],
    ["Replies (RP)", "0.6"],
    ["Quality of Replies (QR)", "0.6"],
    ["Followers of Repliers (FR)", "0.7"],
]

w_table = Table(weights_data, colWidths=[6*cm, 4*cm])
w_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('ALIGN', (1, 0), (1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#DEE2E6')),
]))
story.append(w_table)
story.append(Spacer(1, 15))

story.append(Paragraph("8.3 Score Targets", h2_style))
targets = [
    ["Target", "Score Needed"],
    ["Gate Multiplier MAX", "All gates = 2.0"],
    ["Quality MAX", "EP = 5.0, TQ = 5.0"],
    ["Top 10 Leaderboard", "~17-18 total points"],
    ["Top 50 Leaderboard", "~14-15 total points"],
]

t_table = Table(targets, colWidths=[6*cm, 5*cm])
t_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#27AE60')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#DEE2E6')),
]))
story.append(t_table)
story.append(PageBreak())

# Section 9: Final Checklist
story.append(Paragraph("9. FINAL CONTENT CHECKLIST", h1_style))

checklist = """
Before submitting, verify your content passes all checks:

GATE CHECKS:
[ ] G1: Mentions @arguedotfun, $ARGUE, or argue.fun
[ ] G2: All facts are accurate
[ ] G3: Single post (no thread), creates FOMO
[ ] G4: Passes ALL of the following:
    [ ] Starts with casual hook (ngl, tbh, honestly, look, wait)
    [ ] Contains aside/parenthetical
    [ ] Uses 3+ contractions
    [ ] Has 2+ sentence fragments
    [ ] Includes personal angle (my timeline, caught me)
    [ ] Ends with question or casual close

STYLE CHECKS:
[ ] Does NOT use em dashes
[ ] Does NOT sound AI-generated
[ ] Does NOT copy campaign brief language
[ ] Does NOT write feature list
[ ] Creates sense of urgency/FOMO
[ ] Feels like talking to a friend

MISSION-SPECIFIC:
[ ] Mission 1: FOMO tone, single post
[ ] Mission 2: Quote article, react with surprise
[ ] Mission 3: About real debate on argue.fun
"""

story.append(Paragraph(checklist.replace('\n', '<br/>'), body_style))

# Build PDF
doc.build(story)
print("PDF created successfully!")

