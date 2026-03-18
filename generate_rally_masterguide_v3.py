#!/usr/bin/env python3
"""
Rally.fun Ultimate Master Guide PDF Generator V3
With Realistic Goal Setting Framework - Correct Mindset
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Preformatted
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))

registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')

OUTPUT_PATH = '/home/z/my-project/download/Rally_Ultimate_Master_Guide_V3.pdf'

# Colors
PRIMARY_COLOR = colors.HexColor('#1F4E79')
SECONDARY_COLOR = colors.HexColor('#2E7D32')
ACCENT_COLOR = colors.HexColor('#C0392B')
LIGHT_BG = colors.HexColor('#F5F5F5')
TABLE_HEADER = colors.HexColor('#1F4E79')
TABLE_ROW_ALT = colors.HexColor('#E8F4F8')

def create_styles():
    styles = getSampleStyleSheet()
    
    styles.add(ParagraphStyle(name='CoverTitle', fontName='Times New Roman', fontSize=36, leading=44, alignment=TA_CENTER, textColor=PRIMARY_COLOR, spaceAfter=20))
    styles.add(ParagraphStyle(name='CoverSubtitle', fontName='Times New Roman', fontSize=18, leading=24, alignment=TA_CENTER, textColor=colors.HexColor('#555555'), spaceAfter=12))
    styles.add(ParagraphStyle(name='PartTitle', fontName='Times New Roman', fontSize=22, leading=28, alignment=TA_LEFT, textColor=PRIMARY_COLOR, spaceBefore=24, spaceAfter=16))
    styles.add(ParagraphStyle(name='SectionTitle', fontName='Times New Roman', fontSize=16, leading=22, alignment=TA_LEFT, textColor=SECONDARY_COLOR, spaceBefore=18, spaceAfter=10))
    styles.add(ParagraphStyle(name='SubSection', fontName='Times New Roman', fontSize=13, leading=18, alignment=TA_LEFT, textColor=colors.HexColor('#333333'), spaceBefore=12, spaceAfter=8))
    styles.add(ParagraphStyle(name='CustomBody', fontName='Times New Roman', fontSize=11, leading=16, alignment=TA_LEFT, textColor=colors.black, spaceBefore=4, spaceAfter=8))
    styles.add(ParagraphStyle(name='BulletText', fontName='Times New Roman', fontSize=11, leading=15, alignment=TA_LEFT, textColor=colors.black, leftIndent=20, spaceBefore=2, spaceAfter=2))
    styles.add(ParagraphStyle(name='CodeBlock', fontName='DejaVuSans', fontSize=9, leading=12, alignment=TA_LEFT, textColor=colors.black, backColor=LIGHT_BG, leftIndent=10, rightIndent=10, spaceBefore=8, spaceAfter=8))
    styles.add(ParagraphStyle(name='Important', fontName='Times New Roman', fontSize=11, leading=16, alignment=TA_LEFT, textColor=ACCENT_COLOR, spaceBefore=8, spaceAfter=8))
    styles.add(ParagraphStyle(name='TableHeader', fontName='Times New Roman', fontSize=10, leading=14, alignment=TA_CENTER, textColor=colors.white))
    styles.add(ParagraphStyle(name='TableCell', fontName='Times New Roman', fontSize=10, leading=14, alignment=TA_LEFT, textColor=colors.black))
    styles.add(ParagraphStyle(name='TableCellCenter', fontName='Times New Roman', fontSize=10, leading=14, alignment=TA_CENTER, textColor=colors.black))
    
    return styles

def create_table(data, col_widths, has_header=True):
    table = Table(data, colWidths=col_widths)
    style_commands = [
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]
    if has_header:
        style_commands.append(('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER))
        style_commands.append(('TEXTCOLOR', (0, 0), (-1, 0), colors.white))
        for i in range(1, len(data)):
            style_commands.append(('BACKGROUND', (0, i), (-1, i), TABLE_ROW_ALT if i % 2 == 0 else colors.white))
    table.setStyle(TableStyle(style_commands))
    return table

def build_pdf():
    styles = create_styles()
    story = []
    
    # ==================== COVER PAGE ====================
    story.append(Spacer(1, 80))
    story.append(Paragraph("RALLY.FUN", styles['CoverTitle']))
    story.append(Paragraph("ULTIMATE MASTER GUIDE", styles['CoverTitle']))
    story.append(Spacer(1, 30))
    story.append(Paragraph("Complete AI System Reference", styles['CoverSubtitle']))
    story.append(Paragraph("From Zero to Top 1% Leaderboard", styles['CoverSubtitle']))
    story.append(Spacer(1, 40))
    story.append(Paragraph("Version 3.2 - With Correct Goal Setting Mindset", styles['CoverSubtitle']))
    story.append(Spacer(1, 20))
    story.append(Paragraph("Generated by Z.ai", styles['CoverSubtitle']))
    story.append(PageBreak())
    
    # ==================== TABLE OF CONTENTS ====================
    story.append(Paragraph("<b>TABLE OF CONTENTS</b>", styles['PartTitle']))
    story.append(Spacer(1, 20))
    
    toc_items = [
        ("PART 1: QUICK START PROMPT", "Ready-to-use prompt for new AI sessions"),
        ("PART 2: REALISTIC GOAL SETTING", "Correct mindset: Try to beat, accept results"),
        ("PART 3: WHAT YOU CAN VS CANNOT CONTROL", "Focus effort correctly"),
        ("PART 4: RALLY SCORING SYSTEM", "Complete 11 metrics documentation"),
        ("PART 5: GATE OPTIMIZATION", "Pro-level strategies for each gate"),
        ("PART 6: G4 ORIGINALITY MASTERY", "The #1 differentiator explained"),
        ("PART 7: G4 CHECKLIST KONKRET", "Yes/No checklist for 2.0 score"),
        ("PART 8: G4 STUCK RECOVERY", "Troubleshooting guide"),
        ("PART 9: AI DETECTION EVASION", "Complete kill list"),
        ("PART 10: INFORMATION VERIFICATION", "Ensure accuracy, avoid disqualification"),
        ("PART 11: WEB RESEARCH METHODOLOGY", "How to search for project info"),
        ("PART 12: CLAIM VERIFICATION CHECKLIST", "Verify before posting"),
        ("PART 13: COMPLETE WORKFLOW", "Step-by-step participation guide"),
        ("PART 14: CAMPAIGN PARTICIPATION", "From 'I want to join' to ready"),
        ("PART 15: SCORING SIMULATION", "Predict score before posting"),
        ("PART 16: PRE-SUBMISSION VALIDATION", "Final checklist"),
        ("PART 17: API ACCESS GUIDE", "Complete Rally API documentation"),
        ("PART 18: CONTENT TEMPLATES", "Proven winning templates"),
        ("PART 19: BEFORE/AFTER EXAMPLES", "Real content with score analysis"),
        ("PART 20: X-FACTOR DIFFERENTIATORS", "Stand out from competition"),
        ("PART 21: COMMON MISTAKES & FIXES", "Anti-patterns to avoid"),
        ("PART 22: DECISION TREES", "Logic flowcharts"),
        ("APPENDIX A: QUICK REFERENCE CARDS", "One-page cheat sheets"),
        ("APPENDIX B: COMPLETE CHECKLISTS", "All checklists compiled"),
        ("APPENDIX C: FORMULA REFERENCE", "All formulas in one place"),
    ]
    
    for part, desc in toc_items:
        story.append(Paragraph(f"<b>{part}</b>", styles['CustomBody']))
        story.append(Paragraph(f"    {desc}", styles['BulletText']))
    
    story.append(PageBreak())
    
    # ==================== PART 1: QUICK START PROMPT ====================
    story.append(Paragraph("<b>PART 1: QUICK START PROMPT</b>", styles['PartTitle']))
    story.append(Paragraph("Ready-to-Use Prompt for New AI Sessions", styles['SectionTitle']))
    
    quick_start_prompt = """
You are a Rally.fun Content Optimization Expert.

## CORE MINDSET (CRITICAL):
- TARGET: Always aim to BEAT Top 10
- EFFORT: Maximize every metric you control
- ACCEPTANCE: Results may vary, effort doesn't
- KEY: The TRY matters more than the outcome

## YOUR KNOWLEDGE:

### Rally Scoring System (11 Metrics):
- 4 Gates (0-2 each): Alignment, Accuracy, Compliance, Originality
- 2 Quality (0-5 each): Engagement Potential, Technical Quality
- 5 Engagement (dynamic): RT, Likes, Replies, QR, FR

### Gate Multiplier Formula:
M_gate = 1 + 0.5 x (g_star - 1)
- All gates = 2.0 -> M_gate = 1.5x (MAXIMUM)
- Any gate = 0 -> DISQUALIFIED

### G4 Originality Checklist (Score 2.0 requires ALL):
[ ] Casual hook opening (ngl, tbh, honestly)
[ ] Parenthetical aside (embarrassing to admit)
[ ] 3+ contractions (don't, can't, it's)
[ ] Sentence fragments
[ ] Personal angle/story
[ ] Conversational ending (tbh, worth checking)
[ ] NO em dashes, smart quotes, AI phrases

### Information Verification (MANDATORY):
1. Fetch campaign details via API
2. Research project: website, Twitter, docs
3. Extract key facts: what, who, when, where
4. Verify EVERY claim you plan to make
5. If uncertain, ask user or omit
6. NEVER fabricate or assume information

### Content Workflow:
1. Fetch campaign + research project
2. Extract requirements (hashtags, mentions)
3. Analyze Top 10 for patterns
4. Generate content aiming to BEAT Top 10
5. Verify all facts
6. Simulate score
7. Iterate until MAXIMIZED
8. Accept whatever result comes

### Kill List (NEVER USE):
- Em dashes -> Use hyphens or commas
- Smart quotes -> Straight quotes
- AI phrases (delve, realm, embark) -> Casual alternatives
- Generic openings -> Start mid-thought
- Perfect grammar -> Natural casual style

## WHEN USER SAYS: "I want to join [campaign]"
1. RESEARCH thoroughly (MANDATORY)
2. VERIFY all information
3. GENERATE content aiming to BEAT Top 10
4. MAXIMIZE all metrics you control
5. ACCEPT result, LEARN for next time
"""
    story.append(Preformatted(quick_start_prompt, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 2: REALISTIC GOAL SETTING ====================
    story.append(Paragraph("<b>PART 2: REALISTIC GOAL SETTING</b>", styles['PartTitle']))
    story.append(Paragraph("The Correct Mindset for Every Content Creation", styles['SectionTitle']))
    
    story.append(Paragraph(
        "This is the MOST IMPORTANT section. Understanding the correct mindset will determine "
        "your long-term success on Rally.fun. Many people get this wrong and either give up too early "
        "or set unrealistic expectations that lead to disappointment.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>2.1 The Correct Mindset Framework</b>", styles['SubSection']))
    
    mindset_framework = """
THE CORRECT MINDSET (MEMORIZE THIS):
====================================

TARGET:  Always aim to BEAT Top 10
EFFORT:  Maximize every metric you control
ACCEPT:  Whatever result comes
LEARN:   From every outcome
REPEAT:  With improved knowledge

KEY INSIGHT:
============
"The TRY matters more than the outcome.
You control effort, not results."

WHY THIS MATTERS:
================
- Top 10 may already be optimized
- Engagement metrics are unpredictable
- Algorithm timing is uncontrollable
- BUT: You CAN control quality component
- Maximum effort = Maximum learning = Maximum growth
"""
    story.append(Preformatted(mindset_framework, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>2.2 Wrong vs Correct Mindset</b>", styles['SubSection']))
    
    mindset_compare = [
        [Paragraph('<b>WRONG Mindset</b>', styles['TableHeader']),
         Paragraph('<b>CORRECT Mindset</b>', styles['TableHeader'])],
        [Paragraph('"Cannot beat Top 10, so why try hard?"', styles['TableCell']),
         Paragraph('"I will TRY to beat Top 10 with max effort"', styles['TableCell'])],
        [Paragraph('"Top 10 already maxed out, just match them"', styles['TableCell']),
         Paragraph('"I will MAXIMIZE everything I control"', styles['TableCell'])],
        [Paragraph('"Just create content, results don\'t matter"', styles['TableCell']),
         Paragraph('"Results matter, but effort matters more"', styles['TableCell'])],
        [Paragraph('"If I don\'t beat Top 10, I failed"', styles['TableCell']),
         Paragraph('"If I didn\'t try my best, I failed"', styles['TableCell'])],
        [Paragraph('"Same score as Top 10 = same quality"', styles['TableCell']),
         Paragraph('"Same score = good, improvement = better"', styles['TableCell'])],
    ]
    story.append(create_table(mindset_compare, [7.5*cm, 7.5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>2.3 The Goal Hierarchy</b>", styles['SubSection']))
    
    goal_hierarchy = [
        [Paragraph('<b>Level</b>', styles['TableHeader']),
         Paragraph('<b>Goal</b>', styles['TableHeader']),
         Paragraph('<b>Under Your Control?</b>', styles['TableHeader'])],
        [Paragraph('MINIMUM', styles['TableCell']),
         Paragraph('Pass all gates (G1-G4 > 0)', styles['TableCell']),
         Paragraph('YES', styles['TableCellCenter'])],
        [Paragraph('GOOD', styles['TableCell']),
         Paragraph('All gates >= 1.5', styles['TableCell']),
         Paragraph('YES', styles['TableCellCenter'])],
        [Paragraph('ELITE', styles['TableCell']),
         Paragraph('All gates = 2.0', styles['TableCell']),
         Paragraph('YES', styles['TableCellCenter'])],
        [Paragraph('MAXIMUM', styles['TableCell']),
         Paragraph('Gates = 2.0, EP = 5, TQ = 5', styles['TableCell']),
         Paragraph('YES', styles['TableCellCenter'])],
        [Paragraph('BEAT TOP 10', styles['TableCell']),
         Paragraph('Score > Top 10', styles['TableCell']),
         Paragraph('PARTIALLY (quality yes, engagement no)', styles['TableCellCenter'])],
        [Paragraph('TOP 1', styles['TableCell']),
         Paragraph('Rank #1', styles['TableCell']),
         Paragraph('PARTIALLY (requires viral engagement)', styles['TableCellCenter'])],
    ]
    story.append(create_table(goal_hierarchy, [3*cm, 6*cm, 6*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>2.4 Why 'Beat Top 10' is Still the Target</b>", styles['SubSection']))
    
    story.append(Paragraph(
        "Even though you cannot fully control the outcome, 'Beat Top 10' should ALWAYS be your target. "
        "Here is why:",
        styles['CustomBody']
    ))
    
    why_beat = [
        [Paragraph('<b>Reason</b>', styles['TableHeader']),
         Paragraph('<b>Explanation</b>', styles['TableHeader'])],
        [Paragraph('Maximizes Effort', styles['TableCell']),
         Paragraph('Aiming high forces you to push limits on every metric', styles['TableCell'])],
        [Paragraph('Drives Learning', styles['TableCell']),
         Paragraph('Each attempt teaches you what works and what does not', styles['TableCell'])],
        [Paragraph('Builds Habits', styles['TableCell']),
         Paragraph('Consistent high standards become automatic', styles['TableCell'])],
        [Paragraph('Creates Possibility', styles['TableCell']),
         Paragraph('You cannot win if you do not try; trying creates chance', styles['TableCell'])],
        [Paragraph('Respects Competition', styles['TableCell']),
         Paragraph('Top 10 earned their spot; trying to beat them respects their achievement', styles['TableCell'])],
    ]
    story.append(create_table(why_beat, [4*cm, 11*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>2.5 Acceptance Framework</b>", styles['SubSection']))
    
    acceptance_framework = """
AFTER SUBMISSION - ACCEPT THE RESULT:
=====================================

IF Score > Top 10:
  -> Celebrate! You achieved the goal.
  -> Analyze what worked.
  -> Apply learnings to next campaign.

IF Score = Top 10:
  -> Excellent! You matched elite quality.
  -> Engagement was the difference.
  -> Try different timing/angle next time.

IF Score < Top 10:
  -> Accept. You gave maximum effort.
  -> Identify specific gaps.
  -> Improve for next time.
  -> DO NOT beat yourself up.

KEY REALIZATION:
===============
Top 10 may have:
- Larger following
- Better timing
- More engagement from community
- Luck

You cannot control these.
What you CAN control: Your effort, your learning, your improvement.

"Comparison is the thief of joy.
Progress is the source of fulfillment."
"""
    story.append(Preformatted(acceptance_framework, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 3: WHAT YOU CAN VS CANNOT CONTROL ====================
    story.append(Paragraph("<b>PART 3: WHAT YOU CAN VS CANNOT CONTROL</b>", styles['PartTitle']))
    story.append(Paragraph("Focus Your Effort Where It Matters", styles['SectionTitle']))
    
    story.append(Paragraph(
        "Understanding what you can and cannot control is essential for maintaining the right mindset. "
        "This section provides a clear breakdown so you know exactly where to focus your energy.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>3.1 What You CAN Control</b>", styles['SubSection']))
    
    can_control = [
        [Paragraph('<b>Metric</b>', styles['TableHeader']),
         Paragraph('<b>Target</b>', styles['TableHeader']),
         Paragraph('<b>How to Achieve</b>', styles['TableHeader'])],
        [Paragraph('G1 Alignment', styles['TableCell']),
         Paragraph('2.0', styles['TableCellCenter']),
         Paragraph('Match campaign goal perfectly, use correct terminology', styles['TableCell'])],
        [Paragraph('G2 Accuracy', styles['TableCell']),
         Paragraph('2.0', styles['TableCellCenter']),
         Paragraph('Verify all facts against official sources', styles['TableCell'])],
        [Paragraph('G3 Compliance', styles['TableCell']),
         Paragraph('2.0', styles['TableCellCenter']),
         Paragraph('Include all required hashtags and mentions', styles['TableCell'])],
        [Paragraph('G4 Originality', styles['TableCell']),
         Paragraph('2.0', styles['TableCellCenter']),
         Paragraph('Apply all checklist items, use authentic voice', styles['TableCell'])],
        [Paragraph('EP Potential', styles['TableCell']),
         Paragraph('4.5-5.0', styles['TableCellCenter']),
         Paragraph('Strong hook, good structure, conversation driver', styles['TableCell'])],
        [Paragraph('TQ Quality', styles['TableCell']),
         Paragraph('4.5-5.0', styles['TableCellCenter']),
         Paragraph('Clean formatting, readable, platform-optimized', styles['TableCell'])],
    ]
    story.append(create_table(can_control, [3*cm, 2.5*cm, 9.5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>3.2 What You CANNOT Control</b>", styles['SubSection']))
    
    cannot_control = [
        [Paragraph('<b>Metric</b>', styles['TableHeader']),
         Paragraph('<b>Why Uncontrollable</b>', styles['TableHeader']),
         Paragraph('<b>Strategy</b>', styles['TableHeader'])],
        [Paragraph('Retweets', styles['TableCell']),
         Paragraph('Depends on audience size, timing, virality', styles['TableCell']),
         Paragraph('Create shareable content, hope for best', styles['TableCell'])],
        [Paragraph('Likes', styles['TableCell']),
         Paragraph('Algorithm dependent, audience mood', styles['TableCell']),
         Paragraph('Focus on quality, let engagement happen', styles['TableCell'])],
        [Paragraph('Replies', styles['TableCell']),
         Paragraph('Requires active community participation', styles['TableCell']),
         Paragraph('Ask questions, invite discussion', styles['TableCell'])],
        [Paragraph('QR (Quality of Replies)', styles['TableCell']),
         Paragraph('Depends on who replies', styles['TableCell']),
         Paragraph('Post when active community is online', styles['TableCell'])],
        [Paragraph('FR (Followers of Repliers)', styles['TableCell']),
         Paragraph('Depends on influential accounts engaging', styles['TableCell']),
         Paragraph('Hope for quality engagement', styles['TableCell'])],
    ]
    story.append(create_table(cannot_control, [4*cm, 5.5*cm, 5.5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>3.3 The Control Matrix</b>", styles['SubSection']))
    
    control_matrix = """
CONTROL MATRIX FOR EVERY CONTENT:
================================

BEFORE CREATION:
[ ] I will research the project thoroughly
[ ] I will verify all facts
[ ] I will apply all G4 checklist items
[ ] I will maximize EP and TQ
[ ] I will aim to BEAT Top 10

DURING CREATION:
[ ] Is G1 optimized? Can I improve?
[ ] Is G2 verified? Any unverified claims?
[ ] Is G3 complete? All requirements met?
[ ] Is G4 authentic? All checklist items?
[ ] Is EP maximized? Stronger hook possible?
[ ] Is TQ clean? Better formatting?

AFTER CREATION:
[ ] I gave maximum effort
[ ] I verified all facts
[ ] I applied all techniques
[ ] I aimed to beat Top 10

RESULT ACCEPTANCE:
[ ] Whatever the score, I accept it
[ ] I will learn from this experience
[ ] I will improve next time

THE FORMULA:
===========
Maximum Effort + Right Focus = Best Possible Outcome
Best Possible Outcome + Acceptance = Growth Mindset
Growth Mindset + Consistency = Long-term Success
"""
    story.append(Preformatted(control_matrix, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 4: RALLY SCORING SYSTEM ====================
    story.append(Paragraph("<b>PART 4: RALLY SCORING SYSTEM (OFFICIAL)</b>", styles['PartTitle']))
    story.append(Paragraph("Complete Documentation of All 11 Metrics", styles['SectionTitle']))
    
    story.append(Paragraph("<b>4.1 The Four Quality Gates</b>", styles['SubSection']))
    
    gates_overview = [
        [Paragraph('<b>Gate</b>', styles['TableHeader']),
         Paragraph('<b>Name</b>', styles['TableHeader']),
         Paragraph('<b>Range</b>', styles['TableHeader']),
         Paragraph('<b>Evaluates</b>', styles['TableHeader'])],
        [Paragraph('G1', styles['TableCellCenter']),
         Paragraph('Content Alignment', styles['TableCell']),
         Paragraph('0-2', styles['TableCellCenter']),
         Paragraph('Match with campaign goal and values', styles['TableCell'])],
        [Paragraph('G2', styles['TableCellCenter']),
         Paragraph('Information Accuracy', styles['TableCell']),
         Paragraph('0-2', styles['TableCellCenter']),
         Paragraph('Factual correctness of all claims', styles['TableCell'])],
        [Paragraph('G3', styles['TableCellCenter']),
         Paragraph('Campaign Compliance', styles['TableCell']),
         Paragraph('0-2', styles['TableCellCenter']),
         Paragraph('Adherence to campaign requirements', styles['TableCell'])],
        [Paragraph('G4', styles['TableCellCenter']),
         Paragraph('Originality & Authenticity', styles['TableCell']),
         Paragraph('0-2', styles['TableCellCenter']),
         Paragraph('Unique perspective and human voice', styles['TableCell'])],
    ]
    story.append(create_table(gates_overview, [2*cm, 4.5*cm, 2.5*cm, 6*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph(
        "<b>CRITICAL: Any gate = 0 means IMMEDIATE DISQUALIFICATION. All gates must score > 0.</b>",
        styles['Important']
    ))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>4.2 Gate Score Impact</b>", styles['SubSection']))
    
    gate_impact = [
        [Paragraph('<b>Gate Scores</b>', styles['TableHeader']),
         Paragraph('<b>g_star</b>', styles['TableHeader']),
         Paragraph('<b>M_gate</b>', styles['TableHeader']),
         Paragraph('<b>vs Baseline</b>', styles['TableHeader'])],
        [Paragraph('2, 2, 2, 2', styles['TableCellCenter']),
         Paragraph('2.0', styles['TableCellCenter']),
         Paragraph('1.5x', styles['TableCellCenter']),
         Paragraph('+50% (MAXIMUM)', styles['TableCell'])],
        [Paragraph('2, 2, 2, 1', styles['TableCellCenter']),
         Paragraph('1.75', styles['TableCellCenter']),
         Paragraph('1.375x', styles['TableCellCenter']),
         Paragraph('+37.5%', styles['TableCell'])],
        [Paragraph('1, 1, 1, 1', styles['TableCellCenter']),
         Paragraph('1.0', styles['TableCellCenter']),
         Paragraph('1.0x', styles['TableCellCenter']),
         Paragraph('Baseline', styles['TableCell'])],
        [Paragraph('Any = 0', styles['TableCellCenter']),
         Paragraph('-', styles['TableCellCenter']),
         Paragraph('0.5x', styles['TableCellCenter']),
         Paragraph('DISQUALIFIED', styles['TableCell'])],
    ]
    story.append(create_table(gate_impact, [3.5*cm, 2.5*cm, 2.5*cm, 6.5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>4.3 Quality Metrics</b>", styles['SubSection']))
    
    quality_metrics = [
        [Paragraph('<b>Metric</b>', styles['TableHeader']),
         Paragraph('<b>Range</b>', styles['TableHeader']),
         Paragraph('<b>Key Factors</b>', styles['TableHeader'])],
        [Paragraph('Engagement Potential (EP)', styles['TableCell']),
         Paragraph('0-5', styles['TableCellCenter']),
         Paragraph('Hook effectiveness, CTA quality, conversation potential', styles['TableCell'])],
        [Paragraph('Technical Quality (TQ)', styles['TableCell']),
         Paragraph('0-5', styles['TableCellCenter']),
         Paragraph('Formatting, readability, platform optimization', styles['TableCell'])],
    ]
    story.append(create_table(quality_metrics, [5*cm, 2.5*cm, 7.5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>4.4 Engagement Metrics</b>", styles['SubSection']))
    
    engagement_metrics = [
        [Paragraph('<b>Metric</b>', styles['TableHeader']),
         Paragraph('<b>Scaling</b>', styles['TableHeader']),
         Paragraph('<b>Description</b>', styles['TableHeader'])],
        [Paragraph('Retweets (RT)', styles['TableCell']),
         Paragraph('log(R+1)', styles['TableCellCenter']),
         Paragraph('Message amplification', styles['TableCell'])],
        [Paragraph('Likes (LK)', styles['TableCell']),
         Paragraph('log(L+1)', styles['TableCellCenter']),
         Paragraph('Audience appreciation', styles['TableCell'])],
        [Paragraph('Replies (RP)', styles['TableCell']),
         Paragraph('log(RP+1)', styles['TableCellCenter']),
         Paragraph('Conversation generation', styles['TableCell'])],
        [Paragraph('Quality of Replies (QR)', styles['TableCell']),
         Paragraph('0-1 AI score', styles['TableCellCenter']),
         Paragraph('AI-evaluated reply quality', styles['TableCell'])],
        [Paragraph('Followers of Repliers (FR)', styles['TableCell']),
         Paragraph('log(F+1)', styles['TableCellCenter']),
         Paragraph('Reach of engaged audience', styles['TableCell'])],
    ]
    story.append(create_table(engagement_metrics, [5*cm, 3*cm, 7*cm]))
    story.append(PageBreak())
    
    # ==================== PART 5: GATE OPTIMIZATION ====================
    story.append(Paragraph("<b>PART 5: GATE OPTIMIZATION</b>", styles['PartTitle']))
    story.append(Paragraph("Strategies for Each Gate", styles['SectionTitle']))
    
    story.append(Paragraph("<b>5.1 Gate 1: Content Alignment (G1)</b>", styles['SubSection']))
    
    g1_strategy = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>How to Execute</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Read campaign goal', styles['TableCell']),
         Paragraph('Understand core message the campaign wants to convey', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Use correct terminology', styles['TableCell']),
         Paragraph('Note specific terms from campaign brief', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Match campaign tone', styles['TableCell']),
         Paragraph('If casual, be casual. If professional, be professional', styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Target correct audience', styles['TableCell']),
         Paragraph('Write for who the campaign wants to reach', styles['TableCell'])],
    ]
    story.append(create_table(g1_strategy, [2*cm, 4*cm, 9*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>5.2 Gate 2: Information Accuracy (G2)</b>", styles['SubSection']))
    
    g2_strategy = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>How to Execute</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Read knowledgeBase', styles['TableCell']),
         Paragraph('Study all provided campaign information', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Research project', styles['TableCell']),
         Paragraph('Check website, Twitter, documentation', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Verify all claims', styles['TableCell']),
         Paragraph('Cross-reference every fact you include', styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Remove unverified claims', styles['TableCell']),
         Paragraph('If cannot verify, do not include', styles['TableCell'])],
    ]
    story.append(create_table(g2_strategy, [2*cm, 4*cm, 9*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>5.3 Gate 3: Campaign Compliance (G3)</b>", styles['SubSection']))
    
    g3_strategy = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>How to Execute</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Extract hashtags', styles['TableCell']),
         Paragraph('Find all required #hashtags in campaign rules', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Extract mentions', styles['TableCell']),
         Paragraph('Find all required @mentions in campaign rules', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Check format requirements', styles['TableCell']),
         Paragraph('Any specific length, media, or style requirements', styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Final verification', styles['TableCell']),
         Paragraph('Re-check all requirements before posting', styles['TableCell'])],
    ]
    story.append(create_table(g3_strategy, [2*cm, 4*cm, 9*cm]))
    story.append(PageBreak())
    
    # ==================== PART 6: G4 ORIGINALITY MASTERY ====================
    story.append(Paragraph("<b>PART 6: G4 ORIGINALITY MASTERY</b>", styles['PartTitle']))
    story.append(Paragraph("The #1 Differentiator", styles['SectionTitle']))
    
    story.append(Paragraph(
        "Gate 4 is the single most important factor that separates top performers from average participants. "
        "Achieving G4 = 2.0 requires specific techniques that make content feel authentically human.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>6.1 G4 Scoring Criteria</b>", styles['SubSection']))
    
    g4_criteria = [
        [Paragraph('<b>Score</b>', styles['TableHeader']),
         Paragraph('<b>Criteria</b>', styles['TableHeader']),
         Paragraph('<b>What AI Detects</b>', styles['TableHeader'])],
        [Paragraph('0 (Fail)', styles['TableCellCenter']),
         Paragraph('Generic AI patterns, no personal voice', styles['TableCell']),
         Paragraph('Template-like, recycled phrases, no perspective', styles['TableCell'])],
        [Paragraph('1 (Pass)', styles['TableCellCenter']),
         Paragraph('Some originality but template structure', styles['TableCell']),
         Paragraph('Has perspective but formulaic', styles['TableCell'])],
        [Paragraph('2 (Excellent)', styles['TableCellCenter']),
         Paragraph('Feels HUMAN-written, unique perspective', styles['TableCell']),
         Paragraph('Fresh angle, personal insights, natural language', styles['TableCell'])],
    ]
    story.append(create_table(g4_criteria, [2.5*cm, 6*cm, 6.5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>6.2 Mandatory Elements for G4 = 2.0</b>", styles['SubSection']))
    
    g4_elements = [
        [Paragraph('<b>#</b>', styles['TableHeader']),
         Paragraph('<b>Element</b>', styles['TableHeader']),
         Paragraph('<b>Example</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Casual hook opening', styles['TableCell']),
         Paragraph('ngl, tbh, honestly, fun story', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Parenthetical aside', styles['TableCell']),
         Paragraph('(embarrassing to admit), (just saying)', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('3+ contractions', styles['TableCell']),
         Paragraph("don't, can't, it's, they're, won't", styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Sentence fragments', styles['TableCell']),
         Paragraph('Not complete. Casual. Works.', styles['TableCell'])],
        [Paragraph('5', styles['TableCellCenter']),
         Paragraph('Personal angle/story', styles['TableCell']),
         Paragraph('sat there for 10 minutes watching...', styles['TableCell'])],
        [Paragraph('6', styles['TableCellCenter']),
         Paragraph('Conversational ending', styles['TableCell']),
         Paragraph('tbh, worth checking, just saying', styles['TableCell'])],
    ]
    story.append(create_table(g4_elements, [1.5*cm, 5*cm, 8.5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>6.3 Kill List - Must NOT Have</b>", styles['SubSection']))
    
    kill_list = [
        [Paragraph('<b>Forbidden</b>', styles['TableHeader']),
         Paragraph('<b>Replace With</b>', styles['TableHeader'])],
        [Paragraph('Em dashes (—)', styles['TableCell']),
         Paragraph('Hyphens (-) or commas', styles['TableCell'])],
        [Paragraph('Smart quotes', styles['TableCell']),
         Paragraph('Straight quotes', styles['TableCell'])],
        [Paragraph('In the world of...', styles['TableCell']),
         Paragraph('Start mid-thought', styles['TableCell'])],
        [Paragraph('delve into, realm, embark', styles['TableCell']),
         Paragraph('dig into, world, start', styles['TableCell'])],
        [Paragraph('revolutionize, transform', styles['TableCell']),
         Paragraph('change, shake up', styles['TableCell'])],
        [Paragraph('Perfect grammar', styles['TableCell']),
         Paragraph('Natural casual style', styles['TableCell'])],
    ]
    story.append(create_table(kill_list, [6*cm, 9*cm]))
    story.append(PageBreak())
    
    # ==================== PART 7: G4 CHECKLIST ====================
    story.append(Paragraph("<b>PART 7: G4 CHECKLIST KONKRET</b>", styles['PartTitle']))
    story.append(Paragraph("Yes/No Checklist for 2.0 Score", styles['SectionTitle']))
    
    g4_checklist = """
G4 VALIDATION CHECKLIST (ALL MUST BE CHECKED):
==============================================

BONUSES (add to base score of 1.0):
[ ] Casual hook opening        +0.15
[ ] Parenthetical aside        +0.15
[ ] 3+ contractions            +0.20
[ ] Sentence fragments         +0.15
[ ] Personal angle/story       +0.20
[ ] Conversational ending      +0.15
                                -----
Total Bonuses:                  _____

PENALTIES (subtract from score):
[ ] Em dashes present          -0.30
[ ] Smart quotes present       -0.20
[ ] AI phrases (each)          -0.20
[ ] Generic opening            -0.30
[ ] Formal ending              -0.20
[ ] Over-explaining            -0.20
                                -----
Total Penalties:                _____

CALCULATION:
Base Score:        1.00
+ Bonuses:        _____
- Penalties:      _____
= Estimated G4:   _____

TARGET: G4 = 2.0 (Cap at maximum)
"""
    story.append(Preformatted(g4_checklist, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 8: G4 STUCK RECOVERY ====================
    story.append(Paragraph("<b>PART 8: G4 STUCK RECOVERY</b>", styles['PartTitle']))
    story.append(Paragraph("Troubleshooting When Score Won't Increase", styles['SectionTitle']))
    
    stuck_reasons = [
        [Paragraph('<b>Reason</b>', styles['TableHeader']),
         Paragraph('<b>Symptom</b>', styles['TableHeader']),
         Paragraph('<b>Fix</b>', styles['TableHeader'])],
        [Paragraph('Missing casual hook', styles['TableCell']),
         Paragraph('Opens with fact or statement', styles['TableCell']),
         Paragraph('Add ngl/tbh/honestly at the start', styles['TableCell'])],
        [Paragraph('No parenthetical aside', styles['TableCell']),
         Paragraph('No conversational asides', styles['TableCell']),
         Paragraph('Add (embarrassing to admit) or (just saying)', styles['TableCell'])],
        [Paragraph('Too few contractions', styles['TableCell']),
         Paragraph('Only 1-2 contractions', styles['TableCell']),
         Paragraph("Add more: don't, can't, it's, they're", styles['TableCell'])],
        [Paragraph('No personal story', styles['TableCell']),
         Paragraph('Generic without specificity', styles['TableCell']),
         Paragraph('Add specific time/place: "sat there for 10 minutes"', styles['TableCell'])],
        [Paragraph('Formal ending', styles['TableCell']),
         Paragraph('Ends with statement or link drop', styles['TableCell']),
         Paragraph('Add tbh or conversational question', styles['TableCell'])],
        [Paragraph('Hidden AI patterns', styles['TableCell']),
         Paragraph('Still using AI phrases subtly', styles['TableCell']),
         Paragraph('Scan for: really, actually, important, key', styles['TableCell'])],
    ]
    story.append(create_table(stuck_reasons, [4*cm, 5*cm, 6*cm]))
    story.append(PageBreak())
    
    # ==================== PART 9: AI DETECTION EVASION ====================
    story.append(Paragraph("<b>PART 9: AI DETECTION EVASION</b>", styles['PartTitle']))
    story.append(Paragraph("Complete Kill List and Solutions", styles['SectionTitle']))
    
    ai_detection = [
        [Paragraph('<b>Category</b>', styles['TableHeader']),
         Paragraph('<b>AI Pattern</b>', styles['TableHeader']),
         Paragraph('<b>Human Alternative</b>', styles['TableHeader'])],
        [Paragraph('Punctuation', styles['TableCell']),
         Paragraph('Em dashes (—)', styles['TableCell']),
         Paragraph('Regular hyphens (-) or commas', styles['TableCell'])],
        [Paragraph('Punctuation', styles['TableCell']),
         Paragraph('Smart quotes', styles['TableCell']),
         Paragraph('Straight quotes', styles['TableCell'])],
        [Paragraph('Opening', styles['TableCell']),
         Paragraph('In the world of...', styles['TableCell']),
         Paragraph('Start mid-thought', styles['TableCell'])],
        [Paragraph('Phrase', styles['TableCell']),
         Paragraph('delve into, realm, embark on', styles['TableCell']),
         Paragraph('dig into, world, start', styles['TableCell'])],
        [Paragraph('Phrase', styles['TableCell']),
         Paragraph('revolutionize, transform', styles['TableCell']),
         Paragraph('change, shake up', styles['TableCell'])],
        [Paragraph('Structure', styles['TableCell']),
         Paragraph('Over-explaining', styles['TableCell']),
         Paragraph('Trust the reader', styles['TableCell'])],
        [Paragraph('Structure', styles['TableCell']),
         Paragraph('Perfect grammar', styles['TableCell']),
         Paragraph('Natural casual style', styles['TableCell'])],
    ]
    story.append(create_table(ai_detection, [3*cm, 5*cm, 7*cm]))
    story.append(PageBreak())
    
    # ==================== PART 10: INFORMATION VERIFICATION ====================
    story.append(Paragraph("<b>PART 10: INFORMATION VERIFICATION PROTOCOL</b>", styles['PartTitle']))
    story.append(Paragraph("Ensure Accuracy, Avoid Disqualification", styles['SectionTitle']))
    
    story.append(Paragraph(
        "<b>CRITICAL: G2 = 0 means IMMEDIATE DISQUALIFICATION. You MUST verify all information before including it in your content.</b>",
        styles['Important']
    ))
    story.append(Spacer(1, 12))
    
    verif_steps = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>How to Execute</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Fetch campaign detail', styles['TableCell']),
         Paragraph('GET /campaigns/{address} - read all available info', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Read knowledgeBase', styles['TableCell']),
         Paragraph('Extract all facts, figures, dates, features', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Search project website', styles['TableCell']),
         Paragraph('Find official URL, read about page, docs', styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Check project Twitter/X', styles['TableCell']),
         Paragraph('Find official handle, recent announcements', styles['TableCell'])],
        [Paragraph('5', styles['TableCellCenter']),
         Paragraph('Verify specific claims', styles['TableCell']),
         Paragraph('Cross-reference each fact you plan to use', styles['TableCell'])],
        [Paragraph('6', styles['TableCellCenter']),
         Paragraph('Document sources', styles['TableCell']),
         Paragraph('Note where each fact came from', styles['TableCell'])],
    ]
    story.append(create_table(verif_steps, [2*cm, 4*cm, 9*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>Red Flags - Do NOT Proceed Without Verification:</b>", styles['SubSection']))
    
    red_flags = [
        "Specific dates (launched yesterday, coming next week)",
        "Specific numbers (TVL, users, volume)",
        "Chain/platform claims (on Ethereum, on Base)",
        "Feature claims (has X feature, supports Y)",
        "Partnership claims (partnered with X, integrated with Y)",
        "Token information (token name, symbol, price)",
    ]
    for flag in red_flags:
        story.append(Paragraph(f"• {flag}", styles['BulletText']))
    
    story.append(PageBreak())
    
    # ==================== PART 11: WEB RESEARCH ====================
    story.append(Paragraph("<b>PART 11: WEB RESEARCH METHODOLOGY</b>", styles['PartTitle']))
    story.append(Paragraph("How to Search for Project Information", styles['SectionTitle']))
    
    research_priority = [
        [Paragraph('<b>Priority</b>', styles['TableHeader']),
         Paragraph('<b>Source</b>', styles['TableHeader']),
         Paragraph('<b>What to Find</b>', styles['TableHeader'])],
        [Paragraph('1 (Highest)', styles['TableCellCenter']),
         Paragraph('Campaign knowledgeBase', styles['TableCell']),
         Paragraph('Official campaign info, rules, verified facts', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Project official website', styles['TableCell']),
         Paragraph('Product info, team, roadmap, features', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Project Twitter/X', styles['TableCell']),
         Paragraph('Recent updates, announcements, community', styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Documentation/Whitepaper', styles['TableCell']),
         Paragraph('Technical details, tokenomics, mechanics', styles['TableCell'])],
        [Paragraph('5', styles['TableCellCenter']),
         Paragraph('Third-party sources', styles['TableCell']),
         Paragraph('News articles, reviews (verify independently)', styles['TableCell'])],
    ]
    story.append(create_table(research_priority, [3*cm, 5*cm, 7*cm]))
    story.append(PageBreak())
    
    # ==================== PART 12: CLAIM VERIFICATION ====================
    story.append(Paragraph("<b>PART 12: CLAIM VERIFICATION CHECKLIST</b>", styles['PartTitle']))
    story.append(Paragraph("Verify Before Posting", styles['SectionTitle']))
    
    claim_template = """
CLAIM VERIFICATION TEMPLATE:
===========================

For each claim in your content:

CLAIM #: ___
Statement: "[your claim]"
Type: [date/number/feature/name/comparison]
Source: [where you found this]
Verified: [YES/NO/PARTIAL]

If VERIFIED = NO:
  Option A: Remove claim
  Option B: Use general language
  Option C: Ask user for confirmation

NEVER: Assume or fabricate information
"""
    story.append(Preformatted(claim_template, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 13-22: Remaining Parts (abbreviated) ====================
    # Content Workflow
    story.append(Paragraph("<b>PART 13: COMPLETE WORKFLOW</b>", styles['PartTitle']))
    
    workflow = """
COMPLETE CONTENT CREATION WORKFLOW:
==================================

STEP 1: SET MINDSET
-> Target: BEAT Top 10
-> Effort: MAXIMUM
-> Acceptance: Whatever result comes

STEP 2: RESEARCH
-> Fetch campaign details
-> Research project (website, Twitter)
-> Verify all facts

STEP 3: ANALYZE
-> Fetch leaderboard
-> Study Top 10 patterns
-> Identify what works

STEP 4: CREATE
-> Apply all G4 checklist items
-> Include verified facts only
-> Add X-factors (story, specifics)

STEP 5: VALIDATE
-> Run G4 checklist
-> Verify all claims
-> Check compliance requirements

STEP 6: ITERATE
-> If G4 < 2.0, revise
-> If claims unverified, remove/verify
-> Until MAXIMIZED

STEP 7: SUBMIT
-> Final verification
-> Post content
-> Accept result

STEP 8: LEARN
-> Monitor performance
-> Identify improvements
-> Apply to next campaign
"""
    story.append(Preformatted(workflow, styles['CodeBlock']))
    story.append(PageBreak())
    
    # Content Templates
    story.append(Paragraph("<b>PART 18: CONTENT TEMPLATES</b>", styles['PartTitle']))
    story.append(Paragraph("Proven Winning Templates", styles['SectionTitle']))
    
    templates = """
TEMPLATE 1: STORY HOOK
======================
ngl (and this is embarrassing to admit) i [specific experience]

@[project]'s [feature]. [specific detail]. [chain/platform].

[personal reaction with numbers/specifics]

[conversational ending with question]

[required hashtags/mentions]

TEMPLATE 2: COUNTER-INTUITIVE INSIGHT
=====================================
unpopular opinion: [common belief] is wrong (hot take but hear me out)

@[project] actually [surprising truth]. here's why:
- [point 1]
- [point 2]

[personal experience backing this up]

[conversational ending] tbh

TEMPLATE 3: EMBARRASSING ADMISSION
==================================
honestly? (and this is embarrassing to admit) i [embarrassing action]

@[project] [key info]. my timeline? nothing. not a peep.

[description with personal angle].

can't believe [personal reaction]. that's [emotion] tbh

[required hashtags/mentions]
"""
    story.append(Preformatted(templates, styles['CodeBlock']))
    story.append(PageBreak())
    
    # X-Factors
    story.append(Paragraph("<b>PART 20: X-FACTOR DIFFERENTIATORS</b>", styles['PartTitle']))
    story.append(Paragraph("Elements That Make Content Memorable", styles['SectionTitle']))
    
    xfactor_table = [
        [Paragraph('<b>X-Factor</b>', styles['TableHeader']),
         Paragraph('<b>Technique</b>', styles['TableHeader']),
         Paragraph('<b>Example</b>', styles['TableHeader'])],
        [Paragraph('Specific Numbers', styles['TableCell']),
         Paragraph('Use exact figures, not estimates', styles['TableCell']),
         Paragraph('"down 47%" not "down a lot"', styles['TableCell'])],
        [Paragraph('Time Specificity', styles['TableCell']),
         Paragraph('Include exact durations', styles['TableCell']),
         Paragraph('"25 minutes watching" not "watched for a while"', styles['TableCell'])],
        [Paragraph('Embarrassing Honesty', styles['TableCell']),
         Paragraph('Admit something relatable', styles['TableCell']),
         Paragraph('"embarrassing to admit i watched for 25 mins"', styles['TableCell'])],
        [Paragraph('Insider Detail', styles['TableCell']),
         Paragraph('Share unique observation', styles['TableCell']),
         Paragraph('"went from 68% to sweating bullets"', styles['TableCell'])],
        [Paragraph('Unexpected Angle', styles['TableCell']),
         Paragraph('Approach from surprising direction', styles['TableCell']),
         Paragraph('Focus on entertainment, not utility', styles['TableCell'])],
    ]
    story.append(create_table(xfactor_table, [4*cm, 5*cm, 6*cm]))
    story.append(PageBreak())
    
    # ==================== APPENDIX A: QUICK REFERENCE ====================
    story.append(Paragraph("<b>APPENDIX A: QUICK REFERENCE CARDS</b>", styles['PartTitle']))
    
    quick_ref = """
MINDSET QUICK CARD:
===================
TARGET:  Beat Top 10
EFFORT:  Maximize everything
ACCEPT:  Whatever result comes
LEARN:   From every outcome

CONTROL QUICK CARD:
===================
CAN Control:  G1-G4, EP, TQ, verified facts
CANNOT:       RT, Likes, Replies, ranking, algorithm

G4 QUICK CARD:
==============
NEEDED FOR 2.0:
[ ] Casual hook (ngl/tbh)
[ ] Parenthetical aside
[ ] 3+ contractions
[ ] Fragments
[ ] Personal angle
[ ] Conversational ending

NEVER USE:
[ ] Em dashes
[ ] Smart quotes
[ ] AI phrases

VERIFICATION QUICK CARD:
========================
BEFORE CONTENT:
[ ] Fetch campaign
[ ] Research project
[ ] Verify all facts

FOR EACH CLAIM:
[ ] Have source?
[ ] Can verify?
[ ] If no: remove/ask

FORMULA QUICK CARD:
===================
M_gate = 1 + 0.5 x (g_star - 1)
Max = 1.5x when all gates = 2.0

Score = M_gate x (Quality + Engagement)
Points = atto / 10^18
"""
    story.append(Preformatted(quick_ref, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== APPENDIX B: COMPLETE CHECKLISTS ====================
    story.append(Paragraph("<b>APPENDIX B: COMPLETE CHECKLISTS</b>", styles['PartTitle']))
    
    master_checklist = """
PRE-SUBMISSION MASTER CHECKLIST:
================================

MINDSET:
[ ] Target: BEAT Top 10
[ ] Effort: MAXIMUM
[ ] Ready to accept any result

INFORMATION VERIFICATION:
[ ] Fetched campaign knowledgeBase
[ ] Researched project website
[ ] Checked project Twitter
[ ] Verified all claims
[ ] No unverified statistics
[ ] No assumed information

GATE 1 - ALIGNMENT:
[ ] Content matches campaign goal
[ ] Correct terminology used
[ ] Brand consistency

GATE 2 - ACCURACY:
[ ] All facts verified against sources
[ ] No misleading claims
[ ] Proper context provided

GATE 3 - COMPLIANCE:
[ ] All required hashtags present
[ ] All required mentions present
[ ] Format requirements met

GATE 4 - ORIGINALITY:
[ ] Casual hook opening
[ ] Parenthetical aside present
[ ] 3+ contractions used
[ ] Sentence fragments included
[ ] Personal angle/story present
[ ] Conversational ending
[ ] NO em dashes
[ ] NO smart quotes
[ ] NO AI phrases

QUALITY:
[ ] Strong hook
[ ] Good structure
[ ] Clean formatting

X-FACTORS (aim for 3+):
[ ] Specific numbers
[ ] Time specificity
[ ] Embarrassing honesty
[ ] Insider detail
[ ] Unexpected angle

FINAL:
[ ] Read aloud test passed
[ ] All claims verified
[ ] Maximum effort given
"""
    story.append(Preformatted(master_checklist, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== APPENDIX C: FORMULA REFERENCE ====================
    story.append(Paragraph("<b>APPENDIX C: FORMULA REFERENCE</b>", styles['PartTitle']))
    
    formula_ref = """
COMPLETE RALLY SCORING FORMULA:
===============================

STEP 1: GATE MULTIPLIER
-----------------------
g_star = (G1 + G2 + G3 + G4) / 4
M_gate = 1 + 0.5 x (g_star - 1)

Maximum M_gate = 1.5x (when all gates = 2.0)
Disqualified if any gate = 0

STEP 2: CAMPAIGN POINTS
-----------------------
Campaign_Points = M_gate x Sum(W[i] x normalized_metrics[i])

Quality Metrics (0-5 each):
- EP: Engagement Potential
- TQ: Technical Quality

Engagement Metrics (log-scaled):
- RT: log(Retweets + 1)
- LK: log(Likes + 1)
- RP: log(Replies + 1)
- QR: Quality of Replies (0-1 AI score)
- FR: log(Followers of Repliers + 1)

STEP 3: DISTRIBUTION
--------------------
S_user = max(user_Q, 0) ^ alpha
share_user = S_user / Sum(S_all_users)
rewards_user = share_user x total_rewards

Alpha values:
- Balanced:  1.0 (~25% to top 10%)
- Default:   3.0 (~90% to top 10%)
- Extreme:   8.0 (~99% to top 10%)

POINTS CONVERSION:
------------------
Display score = atto_points / 10^18

Example:
8143350318841547000 / 10^18 = 8.14

SCORE SCALE:
------------
0-2:   Below average
2-4:   Average
4-6:   Good
6-8:   Top performer
8-10:  Elite
"""
    story.append(Preformatted(formula_ref, styles['CodeBlock']))
    
    # Build PDF
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        title='Rally_Ultimate_Master_Guide_V3',
        author='Z.ai',
        creator='Z.ai',
        subject='Complete Rally.fun guide with Correct Goal Setting Mindset'
    )
    
    doc.build(story)
    print(f"PDF generated: {OUTPUT_PATH}")
    return OUTPUT_PATH

if __name__ == "__main__":
    build_pdf()
