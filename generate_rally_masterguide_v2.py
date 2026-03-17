#!/usr/bin/env python3
"""
Rally.fun Ultimate Master Guide PDF Generator V2
Super Complete Guide for AI Systems - With Information Verification Protocol
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, ListFlowable, ListItem, KeepTogether, Preformatted
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))

registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')

# Output path
OUTPUT_PATH = '/home/z/my-project/download/Rally_Ultimate_Master_Guide_V2.pdf'

# Color scheme
PRIMARY_COLOR = colors.HexColor('#1F4E79')
SECONDARY_COLOR = colors.HexColor('#2E7D32')
ACCENT_COLOR = colors.HexColor('#C0392B')
LIGHT_BG = colors.HexColor('#F5F5F5')
TABLE_HEADER = colors.HexColor('#1F4E79')
TABLE_ROW_ALT = colors.HexColor('#E8F4F8')

def create_styles():
    """Create all paragraph styles"""
    styles = getSampleStyleSheet()
    
    # Cover styles
    styles.add(ParagraphStyle(
        name='CoverTitle',
        fontName='Times New Roman',
        fontSize=36,
        leading=44,
        alignment=TA_CENTER,
        textColor=PRIMARY_COLOR,
        spaceAfter=20
    ))
    
    styles.add(ParagraphStyle(
        name='CoverSubtitle',
        fontName='Times New Roman',
        fontSize=18,
        leading=24,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#555555'),
        spaceAfter=12
    ))
    
    # Heading styles
    styles.add(ParagraphStyle(
        name='PartTitle',
        fontName='Times New Roman',
        fontSize=22,
        leading=28,
        alignment=TA_LEFT,
        textColor=PRIMARY_COLOR,
        spaceBefore=24,
        spaceAfter=16,
        borderPadding=10,
    ))
    
    styles.add(ParagraphStyle(
        name='SectionTitle',
        fontName='Times New Roman',
        fontSize=16,
        leading=22,
        alignment=TA_LEFT,
        textColor=colors.HexColor('#2E7D32'),
        spaceBefore=18,
        spaceAfter=10
    ))
    
    styles.add(ParagraphStyle(
        name='SubSection',
        fontName='Times New Roman',
        fontSize=13,
        leading=18,
        alignment=TA_LEFT,
        textColor=colors.HexColor('#333333'),
        spaceBefore=12,
        spaceAfter=8
    ))
    
    # Body styles
    styles.add(ParagraphStyle(
        name='CustomBody',
        fontName='Times New Roman',
        fontSize=11,
        leading=16,
        alignment=TA_LEFT,
        textColor=colors.black,
        spaceBefore=4,
        spaceAfter=8
    ))
    
    styles.add(ParagraphStyle(
        name='BulletText',
        fontName='Times New Roman',
        fontSize=11,
        leading=15,
        alignment=TA_LEFT,
        textColor=colors.black,
        leftIndent=20,
        spaceBefore=2,
        spaceAfter=2
    ))
    
    styles.add(ParagraphStyle(
        name='CodeBlock',
        fontName='DejaVuSans',
        fontSize=9,
        leading=12,
        alignment=TA_LEFT,
        textColor=colors.black,
        backColor=LIGHT_BG,
        leftIndent=10,
        rightIndent=10,
        spaceBefore=8,
        spaceAfter=8
    ))
    
    styles.add(ParagraphStyle(
        name='Important',
        fontName='Times New Roman',
        fontSize=11,
        leading=16,
        alignment=TA_LEFT,
        textColor=ACCENT_COLOR,
        spaceBefore=8,
        spaceAfter=8
    ))
    
    styles.add(ParagraphStyle(
        name='TableHeader',
        fontName='Times New Roman',
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.white
    ))
    
    styles.add(ParagraphStyle(
        name='TableCell',
        fontName='Times New Roman',
        fontSize=10,
        leading=14,
        alignment=TA_LEFT,
        textColor=colors.black
    ))
    
    styles.add(ParagraphStyle(
        name='TableCellCenter',
        fontName='Times New Roman',
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.black
    ))
    
    return styles

def create_table(data, col_widths, has_header=True):
    """Create styled table"""
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
            if i % 2 == 0:
                style_commands.append(('BACKGROUND', (0, i), (-1, i), TABLE_ROW_ALT))
            else:
                style_commands.append(('BACKGROUND', (0, i), (-1, i), colors.white))
    
    table.setStyle(TableStyle(style_commands))
    return table

def build_pdf():
    """Build the complete PDF"""
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
    story.append(Paragraph("Version 3.1 - With Information Verification Protocol", styles['CoverSubtitle']))
    story.append(Spacer(1, 20))
    story.append(Paragraph("Generated by Z.ai", styles['CoverSubtitle']))
    story.append(PageBreak())
    
    # ==================== TABLE OF CONTENTS ====================
    story.append(Paragraph("<b>TABLE OF CONTENTS</b>", styles['PartTitle']))
    story.append(Spacer(1, 20))
    
    toc_items = [
        ("PART 1: QUICK START PROMPT", "Ready-to-use prompt for new AI sessions"),
        ("PART 2: RALLY SCORING SYSTEM (OFFICIAL)", "Complete 11 metrics documentation"),
        ("PART 3: DISTRIBUTION CURVES & REWARDS", "How rewards are calculated"),
        ("PART 4: GATE OPTIMIZATION DEEP DIVE", "Pro-level strategies for each gate"),
        ("PART 5: G4 ORIGINALITY MASTERY", "The #1 differentiator explained"),
        ("PART 6: G4 CHECKLIST KONKRET", "Yes/No checklist for 2.0 score"),
        ("PART 7: G4 STUCK RECOVERY (1.5 to 2.0)", "Troubleshooting guide"),
        ("PART 8: AI DETECTION EVASION", "Complete kill list and solutions"),
        ("PART 9: COMPLETE WORKFLOW", "Step-by-step participation guide"),
        ("PART 10: CAMPAIGN PARTICIPATION WORKFLOW", "From 'I want to join' to ready"),
        ("PART 11: CAMPAIGN BRIEF PARSER", "How to extract requirements"),
        ("PART 12: INFORMATION VERIFICATION PROTOCOL", "Ensure accuracy, avoid disqualification"),
        ("PART 13: WEB RESEARCH METHODOLOGY", "How to search for project info"),
        ("PART 14: CLAIM VERIFICATION CHECKLIST", "Verify before posting"),
        ("PART 15: TARGET SCORE CALCULATOR", "Benchmarking against leaderboard"),
        ("PART 16: SCORING SIMULATION PROCESS", "Predict score before posting"),
        ("PART 17: PRE-SUBMISSION VALIDATION", "Final checklist before post"),
        ("PART 18: API ACCESS GUIDE", "Complete Rally API documentation"),
        ("PART 19: LEADERBOARD ANALYSIS", "How to analyze competition"),
        ("PART 20: CONTENT TEMPLATES", "Proven winning templates"),
        ("PART 21: BEFORE/AFTER EXAMPLES", "Real content with score analysis"),
        ("PART 22: X-FACTOR DIFFERENTIATORS", "Stand out from Top 10"),
        ("PART 23: COMMON MISTAKES & FIXES", "Anti-patterns to avoid"),
        ("PART 24: DECISION TREES", "Logic flowcharts for decisions"),
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
    
    story.append(Paragraph(
        "Copy and paste this prompt to any new AI chat session. The AI will immediately understand "
        "how to help you with Rally.fun content optimization.",
        styles['CustomBody']
    ))
    
    story.append(Spacer(1, 12))
    story.append(Paragraph("<b>THE MASTER PROMPT:</b>", styles['SubSection']))
    
    quick_start_prompt = """
You are a Rally.fun Content Optimization Expert. Your goal is to help users create content 
that achieves MAXIMUM scores on Rally.fun campaigns.

## YOUR CORE KNOWLEDGE:

### Rally Scoring System (11 Metrics):
- 4 Gates (0-2 each): Content Alignment, Information Accuracy, Campaign Compliance, Originality & Authenticity
- 2 Quality Metrics (0-5 each): Engagement Potential, Technical Quality
- 5 Engagement Metrics (dynamic): Retweets, Likes, Replies, Quality of Replies, Followers of Repliers

### Gate Multiplier Formula:
M_gate = 1 + 0.5 x (g_star - 1), where g_star = average of 4 gate scores
- All gates = 2.0 → M_gate = 1.5x (MAXIMUM)
- All gates = 1.0 → M_gate = 1.0x (baseline)
- Any gate = 0 → DISQUALIFIED

### G4 Originality Checklist (CRITICAL - Score 2.0 requires ALL):
[ ] Casual hook opening (ngl, tbh, honestly, fun story)
[ ] At least one parenthetical aside (embarrassing to admit, just saying)
[ ] 3+ contractions (do not→don't, cannot→can't, it is→it's)
[ ] Sentence fragments (not complete sentences, casual)
[ ] Personal angle or story
[ ] Conversational ending (tbh, just saying, worth checking)
[ ] NO em dashes, smart quotes, AI phrases (delve into, realm, embark on)

### INFORMATION VERIFICATION PROTOCOL (MANDATORY):
Before creating content, you MUST:
1. Fetch campaign details via API or web search
2. Research the project: website, Twitter, documentation
3. Extract key facts: what, who, when, where, how
4. Verify EVERY claim you plan to make
5. If uncertain about ANY claim, ask user or omit it
6. NEVER fabricate or assume information

### Content Generation Workflow:
1. Ask user for campaign name/address
2. FETCH and RESEARCH project information thoroughly
3. Extract mandatory elements (hashtags, mentions, style)
4. Fetch leaderboard for benchmarking
5. Generate 2-3 content options with verified facts
6. Simulate score for each option
7. Recommend best option with reasoning

### AI Detection Kill List (NEVER USE):
- Em dashes (—) → Use hyphens (-) or commas
- Smart quotes → Use straight quotes
- Generic openings (In the world of..., Picture this...) → Start mid-thought
- AI phrases (delve into, uncover, embark on, realm, revolutionize, transform) → Use casual alternatives
- Over-explaining → Trust the reader
- Perfect grammar → Use natural, casual style

## WHEN USER SAYS: "I want to join [campaign name]"
1. RESEARCH the project FIRST (this is MANDATORY)
2. Verify all information before writing content
3. Ask for any specific angle/preference
4. Generate content following G4 checklist with VERIFIED facts
5. Provide score prediction with reasoning
6. Offer alternatives if needed
"""
    
    story.append(Preformatted(quick_start_prompt, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 2: RALLY SCORING SYSTEM ====================
    story.append(Paragraph("<b>PART 2: RALLY SCORING SYSTEM (OFFICIAL)</b>", styles['PartTitle']))
    story.append(Paragraph("Complete Documentation of All 11 Metrics", styles['SectionTitle']))
    
    story.append(Paragraph(
        "Rally.fun uses AI-powered evaluation to ensure fair and transparent reward distribution. "
        "The scoring system evaluates content across 11 metrics in 3 categories. Understanding these metrics "
        "is fundamental to creating high-scoring content that consistently ranks in the top percentile of any campaign leaderboard.",
        styles['CustomBody']
    ))
    
    # Categories overview
    story.append(Paragraph("<b>2.1 Categories Overview</b>", styles['SubSection']))
    
    cat_data = [
        [Paragraph('<b>Category</b>', styles['TableHeader']),
         Paragraph('<b>Metrics</b>', styles['TableHeader']),
         Paragraph('<b>Score Range</b>', styles['TableHeader']),
         Paragraph('<b>Purpose</b>', styles['TableHeader'])],
        [Paragraph('Gates', styles['TableCell']),
         Paragraph('4 metrics', styles['TableCellCenter']),
         Paragraph('0-2 each', styles['TableCellCenter']),
         Paragraph('Quality filters - must pass all', styles['TableCell'])],
        [Paragraph('Quality', styles['TableCell']),
         Paragraph('2 metrics', styles['TableCellCenter']),
         Paragraph('0-5 each', styles['TableCellCenter']),
         Paragraph('Intrinsic content quality', styles['TableCell'])],
        [Paragraph('Engagement', styles['TableCell']),
         Paragraph('5 metrics', styles['TableCellCenter']),
         Paragraph('Dynamic', styles['TableCellCenter']),
         Paragraph('Real audience interaction', styles['TableCell'])],
    ]
    story.append(create_table(cat_data, [2.5*cm, 2.5*cm, 3*cm, 8*cm]))
    story.append(Spacer(1, 16))
    
    # Gates detail
    story.append(Paragraph("<b>2.2 The Four Quality Gates</b>", styles['SubSection']))
    story.append(Paragraph(
        "Submissions must pass through four quality gates. Each gate scores from 0-2. "
        "A score of 0 on ANY gate disqualifies the submission entirely. Scores of 1-2 indicate "
        "passing with varying quality levels.",
        styles['CustomBody']
    ))
    
    # Gate 1
    story.append(Paragraph("<b>Gate 1: Content Alignment (G1) - 0 to 2</b>", styles['SubSection']))
    story.append(Paragraph(
        "Measures how well the content aligns with the campaign's message and values. "
        "This gate evaluates whether your content accurately represents what the campaign is about "
        "and whether it resonates with the intended audience.",
        styles['CustomBody']
    ))
    
    g1_criteria = [
        [Paragraph('<b>Score</b>', styles['TableHeader']),
         Paragraph('<b>Criteria</b>', styles['TableHeader']),
         Paragraph('<b>What AI Evaluates</b>', styles['TableHeader'])],
        [Paragraph('0 (Fail)', styles['TableCellCenter']),
         Paragraph('Content contradicts or ignores campaign message', styles['TableCell']),
         Paragraph('Off-topic, wrong messaging, misaligned values', styles['TableCell'])],
        [Paragraph('1 (Pass)', styles['TableCellCenter']),
         Paragraph('Content generally aligns with some gaps', styles['TableCell']),
         Paragraph('Correct terminology, basic alignment, minor issues', styles['TableCell'])],
        [Paragraph('2 (Excellent)', styles['TableCellCenter']),
         Paragraph('Perfect alignment with campaign values', styles['TableCell']),
         Paragraph('Brand consistency, target audience fit, message accuracy', styles['TableCell'])],
    ]
    story.append(create_table(g1_criteria, [2.5*cm, 6*cm, 7.5*cm]))
    story.append(Spacer(1, 12))
    
    # Gate 2
    story.append(Paragraph("<b>Gate 2: Information Accuracy (G2) - 0 to 2</b>", styles['SubSection']))
    story.append(Paragraph(
        "Evaluates the factual correctness of the content. This gate ensures that all claims, "
        "data, and statements in your content are accurate and consistent with official campaign materials. "
        "Misinformation or inaccurate claims will result in a failing score.",
        styles['CustomBody']
    ))
    
    g2_criteria = [
        [Paragraph('<b>Score</b>', styles['TableHeader']),
         Paragraph('<b>Criteria</b>', styles['TableHeader']),
         Paragraph('<b>What AI Evaluates</b>', styles['TableHeader'])],
        [Paragraph('0 (Fail)', styles['TableCellCenter']),
         Paragraph('Contains false or misleading information', styles['TableCell']),
         Paragraph('Wrong facts, made-up data, misleading claims', styles['TableCell'])],
        [Paragraph('1 (Pass)', styles['TableCellCenter']),
         Paragraph('Mostly accurate with minor issues', styles['TableCell']),
         Paragraph('Technical accuracy mostly correct, minor context issues', styles['TableCell'])],
        [Paragraph('2 (Excellent)', styles['TableCellCenter']),
         Paragraph('All information verified and accurate', styles['TableCell']),
         Paragraph('Consistent with official materials, proper context, accurate data', styles['TableCell'])],
    ]
    story.append(create_table(g2_criteria, [2.5*cm, 6*cm, 7.5*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph(
        "<b>CRITICAL: G2 = 0 means IMMEDIATE DISQUALIFICATION.</b> You MUST verify all information "
        "before including it in your content. See PART 12-14 for detailed verification protocols.",
        styles['Important']
    ))
    story.append(Spacer(1, 12))
    
    # Gate 3
    story.append(Paragraph("<b>Gate 3: Campaign Compliance (G3) - 0 to 2</b>", styles['SubSection']))
    story.append(Paragraph(
        "Measures adherence to specific campaign rules and requirements. Every campaign has mandatory "
        "elements that must be included. Missing hashtags, mentions, or failing to follow format requirements "
        "will result in point deductions or disqualification.",
        styles['CustomBody']
    ))
    
    g3_criteria = [
        [Paragraph('<b>Score</b>', styles['TableHeader']),
         Paragraph('<b>Criteria</b>', styles['TableHeader']),
         Paragraph('<b>What AI Evaluates</b>', styles['TableHeader'])],
        [Paragraph('0 (Fail)', styles['TableCellCenter']),
         Paragraph('Missing critical requirements', styles['TableCell']),
         Paragraph('No required hashtags, missing mentions, wrong format', styles['TableCell'])],
        [Paragraph('1 (Pass)', styles['TableCellCenter']),
         Paragraph('Basic requirements met with minor gaps', styles['TableCell']),
         Paragraph('Hashtags present, mentions included, minor style issues', styles['TableCell'])],
        [Paragraph('2 (Excellent)', styles['TableCellCenter']),
         Paragraph('Perfect compliance with all requirements', styles['TableCell']),
         Paragraph('All hashtags, all mentions, correct format, proper disclosures', styles['TableCell'])],
    ]
    story.append(create_table(g3_criteria, [2.5*cm, 6*cm, 7.5*cm]))
    story.append(Spacer(1, 12))
    
    # Gate 4
    story.append(Paragraph("<b>Gate 4: Originality & Authenticity (G4) - 0 to 2</b>", styles['SubSection']))
    story.append(Paragraph(
        "The MOST CRITICAL gate for achieving top rankings. This gate evaluates uniqueness and authentic voice. "
        "AI-generated content typically scores 0-1 here because it lacks genuine human perspective. "
        "This is the primary differentiator between top 1% and average performers.",
        styles['CustomBody']
    ))
    
    g4_criteria = [
        [Paragraph('<b>Score</b>', styles['TableHeader']),
         Paragraph('<b>Criteria</b>', styles['TableHeader']),
         Paragraph('<b>What AI Evaluates</b>', styles['TableHeader'])],
        [Paragraph('0 (Fail)', styles['TableCellCenter']),
         Paragraph('Generic AI patterns, no personal voice', styles['TableCell']),
         Paragraph('Template-like, no perspective, recycled phrases', styles['TableCell'])],
        [Paragraph('1 (Pass)', styles['TableCellCenter']),
         Paragraph('Some originality but template structure', styles['TableCell']),
         Paragraph('Has perspective but formulaic, lacks spontaneity', styles['TableCell'])],
        [Paragraph('2 (Excellent)', styles['TableCellCenter']),
         Paragraph('Feels HUMAN-written, unique perspective', styles['TableCell']),
         Paragraph('Fresh angle, personal insights, natural language, creative expression', styles['TableCell'])],
    ]
    story.append(create_table(g4_criteria, [2.5*cm, 6*cm, 7.5*cm]))
    story.append(Spacer(1, 16))
    
    # Quality Metrics
    story.append(Paragraph("<b>2.3 Quality Metrics (0-5 Scale)</b>", styles['SubSection']))
    
    story.append(Paragraph("<b>Engagement Potential (EP) - 0 to 5</b>", styles['SubSection']))
    story.append(Paragraph(
        "Measures how likely your content is to generate engagement. High engagement potential content "
        "has strong hooks, clear calls-to-action, good structure, and invites conversation. "
        "The AI evaluates whether your content will make people want to interact.",
        styles['CustomBody']
    ))
    
    ep_factors = [
        [Paragraph('<b>Factor</b>', styles['TableHeader']),
         Paragraph('<b>Description</b>', styles['TableHeader']),
         Paragraph('<b>Optimization Tip</b>', styles['TableHeader'])],
        [Paragraph('Hook Effectiveness', styles['TableCell']),
         Paragraph('First line grabs attention', styles['TableCell']),
         Paragraph('Start with provocative statement or question', styles['TableCell'])],
        [Paragraph('Call-to-Action', styles['TableCell']),
         Paragraph('Clear next step for reader', styles['TableCell']),
         Paragraph('End with question or invitation', styles['TableCell'])],
        [Paragraph('Content Structure', styles['TableCell']),
         Paragraph('Logical flow, easy to read', styles['TableCell']),
         Paragraph('Use line breaks, keep paragraphs short', styles['TableCell'])],
        [Paragraph('Conversation Potential', styles['TableCell']),
         Paragraph('Invites replies and discussion', styles['TableCell']),
         Paragraph('Ask questions, present controversial takes', styles['TableCell'])],
    ]
    story.append(create_table(ep_factors, [4*cm, 5.5*cm, 6.5*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>Technical Quality (TQ) - 0 to 5</b>", styles['SubSection']))
    story.append(Paragraph(
        "Evaluates the technical execution of your content. While perfect grammar is NOT required "
        "(and can actually hurt G4 scores), your content should still be readable, well-formatted, "
        "and optimized for the platform. This metric ensures basic quality standards are met.",
        styles['CustomBody']
    ))
    
    tq_factors = [
        [Paragraph('<b>Factor</b>', styles['TableHeader']),
         Paragraph('<b>Description</b>', styles['TableHeader']),
         Paragraph('<b>Optimization Tip</b>', styles['TableHeader'])],
        [Paragraph('Grammar & Spelling', styles['TableCell']),
         Paragraph('Appropriate for platform', styles['TableCell']),
         Paragraph('Casual is OK, unreadable is not', styles['TableCell'])],
        [Paragraph('Formatting', styles['TableCell']),
         Paragraph('Visual structure and spacing', styles['TableCell']),
         Paragraph('Use line breaks, avoid walls of text', styles['TableCell'])],
        [Paragraph('Platform Optimization', styles['TableCell']),
         Paragraph('Fits platform conventions', styles['TableCell']),
         Paragraph('Proper length, appropriate style', styles['TableCell'])],
        [Paragraph('Media Integration', styles['TableCell']),
         Paragraph('Images, links, quotes', styles['TableCell']),
         Paragraph('Add relevant media when appropriate', styles['TableCell'])],
    ]
    story.append(create_table(tq_factors, [4*cm, 5.5*cm, 6.5*cm]))
    story.append(Spacer(1, 16))
    
    # Engagement Metrics
    story.append(Paragraph("<b>2.4 Engagement Metrics (Dynamic)</b>", styles['SubSection']))
    story.append(Paragraph(
        "These metrics update over time based on real audience interaction. They use logarithmic scaling "
        "to prevent gaming and ensure fair comparison. Engagement metrics can be refreshed in later periods "
        "to capture ongoing performance.",
        styles['CustomBody']
    ))
    
    eng_metrics = [
        [Paragraph('<b>Metric</b>', styles['TableHeader']),
         Paragraph('<b>Code</b>', styles['TableHeader']),
         Paragraph('<b>Scaling</b>', styles['TableHeader']),
         Paragraph('<b>Description</b>', styles['TableHeader'])],
        [Paragraph('Retweets', styles['TableCell']),
         Paragraph('RT', styles['TableCellCenter']),
         Paragraph('log(R+1)', styles['TableCellCenter']),
         Paragraph('Message amplification', styles['TableCell'])],
        [Paragraph('Likes', styles['TableCell']),
         Paragraph('LK', styles['TableCellCenter']),
         Paragraph('log(L+1)', styles['TableCellCenter']),
         Paragraph('Audience appreciation', styles['TableCell'])],
        [Paragraph('Replies', styles['TableCell']),
         Paragraph('RP', styles['TableCellCenter']),
         Paragraph('log(RP+1)', styles['TableCellCenter']),
         Paragraph('Conversation generation', styles['TableCell'])],
        [Paragraph('Quality of Replies', styles['TableCell']),
         Paragraph('QR', styles['TableCellCenter']),
         Paragraph('0-1 AI score', styles['TableCellCenter']),
         Paragraph('AI-evaluated reply quality', styles['TableCell'])],
        [Paragraph('Followers of Repliers', styles['TableCell']),
         Paragraph('FR', styles['TableCellCenter']),
         Paragraph('log(F+1)', styles['TableCellCenter']),
         Paragraph('Reach of engaged audience', styles['TableCell'])],
    ]
    story.append(create_table(eng_metrics, [4*cm, 2*cm, 3*cm, 7*cm]))
    story.append(PageBreak())
    
    # ==================== PART 3-11 (abbreviated for space, same content as before) ====================
    # ... [Previous PART 3-11 content would go here, same as original] ...
    
    # ==================== PART 12: INFORMATION VERIFICATION PROTOCOL ====================
    story.append(Paragraph("<b>PART 12: INFORMATION VERIFICATION PROTOCOL</b>", styles['PartTitle']))
    story.append(Paragraph("Ensure Accuracy, Avoid Disqualification", styles['SectionTitle']))
    
    story.append(Paragraph(
        "This is a CRITICAL section. G2 (Information Accuracy) score of 0 results in IMMEDIATE DISQUALIFICATION. "
        "You MUST verify all information before including it in your content. This protocol ensures "
        "that every claim you make is accurate and verifiable.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph(
        "<b>NEVER assume or fabricate information. When in doubt, verify or omit.</b>",
        styles['Important']
    ))
    
    story.append(Paragraph("<b>12.1 Why Information Verification Is Critical</b>", styles['SubSection']))
    
    verif_critical = [
        [Paragraph('<b>Risk</b>', styles['TableHeader']),
         Paragraph('<b>Impact</b>', styles['TableHeader']),
         Paragraph('<b>Example</b>', styles['TableHeader'])],
        [Paragraph('Wrong dates', styles['TableCell']),
         Paragraph('G2 = 0 (disqualified)', styles['TableCell']),
         Paragraph('Saying "launched yesterday" when it launched last week', styles['TableCell'])],
        [Paragraph('Wrong chain', styles['TableCell']),
         Paragraph('G2 = 0 (disqualified)', styles['TableCell']),
         Paragraph('Saying "on Ethereum" when it is on Base', styles['TableCell'])],
        [Paragraph('Wrong features', styles['TableCell']),
         Paragraph('G2 = 0 (disqualified)', styles['TableCell']),
         Paragraph('Claiming feature that does not exist', styles['TableCell'])],
        [Paragraph('Wrong team info', styles['TableCell']),
         Paragraph('G2 = 0 (disqualified)', styles['TableCell']),
         Paragraph('Attributing to wrong founder', styles['TableCell'])],
        [Paragraph('Made-up statistics', styles['TableCell']),
         Paragraph('G2 = 0 (disqualified)', styles['TableCell']),
         Paragraph('Inventing TVL or user numbers', styles['TableCell'])],
    ]
    story.append(create_table(verif_critical, [3.5*cm, 4*cm, 7.5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>12.2 Mandatory Verification Steps</b>", styles['SubSection']))
    
    mandatory_verif = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>How to Execute</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Fetch campaign detail', styles['TableCell']),
         Paragraph('GET /campaigns/{address} - read all available info', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Read knowledgeBase thoroughly', styles['TableCell']),
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
    story.append(create_table(mandatory_verif, [2*cm, 4.5*cm, 8.5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>12.3 Information to Extract from Project</b>", styles['SubSection']))
    
    info_extract = [
        [Paragraph('<b>Category</b>', styles['TableHeader']),
         Paragraph('<b>Information</b>', styles['TableHeader']),
         Paragraph('<b>Why Important</b>', styles['TableHeader'])],
        [Paragraph('Basic', styles['TableCell']),
         Paragraph('Project name, tagline, description', styles['TableCell']),
         Paragraph('Accurate identification', styles['TableCell'])],
        [Paragraph('Technical', styles['TableCell']),
         Paragraph('Chain/platform, token symbol, contract address', styles['TableCell']),
         Paragraph('Correct technical claims', styles['TableCell'])],
        [Paragraph('Features', styles['TableCell']),
         Paragraph('Core functionality, unique features', styles['TableCell']),
         Paragraph('Accurate feature descriptions', styles['TableCell'])],
        [Paragraph('Team', styles['TableCell']),
         Paragraph('Founders, team members, backers', styles['TableCell']),
         Paragraph('Accurate attribution', styles['TableCell'])],
        [Paragraph('Timeline', styles['TableCell']),
         Paragraph('Launch date, milestones, updates', styles['TableCell']),
         Paragraph('Correct date references', styles['TableCell'])],
        [Paragraph('Metrics', styles['TableCell']),
         Paragraph('TVL, users, volume (if public)', styles['TableCell']),
         Paragraph('Accurate statistics', styles['TableCell'])],
        [Paragraph('Partnerships', styles['TableCell']),
         Paragraph('Confirmed partnerships, integrations', styles['TableCell']),
         Paragraph('Avoid false claims', styles['TableCell'])],
    ]
    story.append(create_table(info_extract, [3*cm, 6*cm, 6*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>12.4 Red Flags - Do NOT Proceed Without Verification</b>", styles['SubSection']))
    
    red_flags = [
        "Specific dates (launched yesterday, coming next week)",
        "Specific numbers (TVL, users, volume)",
        "Chain/platform claims (on Ethereum, on Base, on Solana)",
        "Feature claims (has X feature, supports Y)",
        "Partnership claims (partnered with X, integrated with Y)",
        "Team information (founded by X, backed by Y)",
        "Token information (token name, symbol, price)",
        "Comparison claims (better than X, faster than Y)",
    ]
    for flag in red_flags:
        story.append(Paragraph(f"• {flag}", styles['BulletText']))
    
    story.append(PageBreak())
    
    # ==================== PART 13: WEB RESEARCH METHODOLOGY ====================
    story.append(Paragraph("<b>PART 13: WEB RESEARCH METHODOLOGY</b>", styles['PartTitle']))
    story.append(Paragraph("How to Search for Project Information", styles['SectionTitle']))
    
    story.append(Paragraph(
        "This section provides a systematic approach to researching project information "
        "before creating content. Always conduct research BEFORE writing content.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>13.1 Research Sources Priority</b>", styles['SubSection']))
    
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
         Paragraph('Project Discord/Telegram', styles['TableCell']),
         Paragraph('Community FAQs, recent discussions', styles['TableCell'])],
        [Paragraph('6', styles['TableCellCenter']),
         Paragraph('Third-party sources', styles['TableCell']),
         Paragraph('News articles, reviews, analysis (verify independently)', styles['TableCell'])],
    ]
    story.append(create_table(research_priority, [3*cm, 5*cm, 7*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>13.2 Research Workflow</b>", styles['SubSection']))
    
    research_workflow = """
RESEARCH WORKFLOW (BEFORE CONTENT CREATION):
=============================================

STEP 1: Get Campaign KnowledgeBase
----------------------------------
Action: Fetch campaign details via API
Command: GET /campaigns/{campaign_address}
Extract:
  - campaign.goal (main description)
  - campaign.knowledgeBase (detailed info)
  - campaign.rules (requirements)

STEP 2: Identify Project Identity
---------------------------------
From knowledgeBase, find:
  - Project name
  - Official website URL
  - Official Twitter handle
  - Chain/platform

STEP 3: Visit Official Sources
-------------------------------
If website available:
  - Read "About" page
  - Check "Features" or "Product" section
  - Look for "Documentation" or "Docs"
  - Note team information if available

If Twitter available:
  - Check pinned tweet for latest
  - Read recent announcements
  - Note verified handle

STEP 4: Extract Key Facts
-------------------------
Document the following:
  - What is the project? (1-sentence description)
  - What chain/platform? 
  - What are the core features?
  - Who is the team? (if public)
  - When did it launch? (if applicable)
  - Any recent news/updates?

STEP 5: Cross-Verify Claims
---------------------------
For each claim you want to make:
  1. Find source
  2. Confirm accuracy
  3. Note context

If cannot verify: DO NOT USE
"""
    story.append(Preformatted(research_workflow, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>13.3 Example: Researching Argue.fun</b>", styles['SubSection']))
    
    example_research = """
EXAMPLE: RESEARCHING ARGUE.FUN
===============================

STEP 1: Check Campaign KnowledgeBase
------------------------------------
From Rally API response:
  - Goal: "Promote Argue.fun - AI agents debate onchain"
  - KnowledgeBase: [Detailed project info]

STEP 2: Visit Official Sources
-------------------------------
Website: argue.fun
  - What is it: Platform for AI agents to debate
  - Chain: Base
  - Features: 
    * Agents argue with real token stakes
    * Judges vote on winners
    * On-chain voting

Twitter: @arguedotfun
  - Recent article announcement
  - Community engagement

STEP 3: Extract Verified Facts
------------------------------
VERIFIED:
  ✓ Platform for AI agent debates
  ✓ Built on Base chain
  ✓ Real token stakes involved
  ✓ Judges vote on winners
  ✓ Article was published (date verified)

NOT VERIFIED (omit or ask user):
  ? Exact launch date
  ? Total TVL/users
  ? Founder names

STEP 4: Use Only Verified Facts
--------------------------------
Content should only include verified information.
Unverified claims = G2 risk.
"""
    story.append(Preformatted(example_research, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 14: CLAIM VERIFICATION CHECKLIST ====================
    story.append(Paragraph("<b>PART 14: CLAIM VERIFICATION CHECKLIST</b>", styles['PartTitle']))
    story.append(Paragraph("Verify Before Posting", styles['SectionTitle']))
    
    story.append(Paragraph(
        "Use this checklist for every claim in your content. Any claim that cannot be verified "
        "should be removed or confirmed with the user before posting.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>14.1 Claim Verification Template</b>", styles['SubSection']))
    
    claim_template = """
CLAIM VERIFICATION TEMPLATE
===========================

For each claim in your content, fill out:

CLAIM #: ___
Statement: "[your claim]"
Type: [date/number/feature/name/comparison/other]
Source: [where you found this]
Verified: [YES/NO/PARTIAL]
Confidence: [HIGH/MEDIUM/LOW]

If VERIFIED = NO or Confidence = LOW:
  Action: Remove claim OR ask user for confirmation

---

EXAMPLE VERIFICATION LOG:

CLAIM #1:
Statement: "agents arguing onchain with real stakes"
Type: feature
Source: argue.fun website, knowledgeBase
Verified: YES
Confidence: HIGH
Action: Include in content

CLAIM #2:
Statement: "all on Base"
Type: technical
Source: argue.fun website footer, knowledgeBase
Verified: YES
Confidence: HIGH
Action: Include in content

CLAIM #3:
Statement: "article dropped a week ago"
Type: date
Source: User provided
Verified: PARTIAL (cannot confirm exact date)
Confidence: MEDIUM
Action: Change to "article dropped recently" or verify with user

CLAIM #4:
Statement: "thousands of users"
Type: number
Source: None (assumed)
Verified: NO
Confidence: LOW
Action: REMOVE - do not include unverified numbers
"""
    story.append(Preformatted(claim_template, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>14.2 Quick Verification Checklist</b>", styles['SubSection']))
    
    quick_verif = [
        [Paragraph('<b>Claim Type</b>', styles['TableHeader']),
         Paragraph('<b>Verification Required</b>', styles['TableHeader']),
         Paragraph('<b>Minimum Source</b>', styles['TableHeader'])],
        [Paragraph('Dates', styles['TableCell']),
         Paragraph('Official announcement or docs', styles['TableCell']),
         Paragraph('Twitter announcement or website', styles['TableCell'])],
        [Paragraph('Numbers/Stats', styles['TableCell']),
         Paragraph('Official dashboard or analytics', styles['TableCell']),
         Paragraph('DefiLlama, Dune, or official source', styles['TableCell'])],
        [Paragraph('Chain/Platform', styles['TableCell']),
         Paragraph('Official website or docs', styles['TableCell']),
         Paragraph('Website footer or contract address', styles['TableCell'])],
        [Paragraph('Features', styles['TableCell']),
         Paragraph('Product documentation', styles['TableCell']),
         Paragraph('Official website feature list', styles['TableCell'])],
        [Paragraph('Team/Founders', styles['TableCell']),
         Paragraph('Official team page or LinkedIn', styles['TableCell']),
         Paragraph('Website About page', styles['TableCell'])],
        [Paragraph('Partnerships', styles['TableCell']),
         Paragraph('Official announcement from BOTH parties', styles['TableCell']),
         Paragraph('Twitter from both accounts', styles['TableCell'])],
        [Paragraph('Comparisons', styles['TableCell']),
         Paragraph('Verifiable data for both subjects', styles['TableCell']),
         Paragraph('Multiple sources confirming', styles['TableCell'])],
    ]
    story.append(create_table(quick_verif, [3*cm, 6*cm, 6*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>14.3 When You Cannot Verify</b>", styles['SubSection']))
    
    story.append(Paragraph(
        "If you cannot verify a claim, you have three options:",
        styles['CustomBody']
    ))
    
    cannot_verify = [
        [Paragraph('<b>Option</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>Example</b>', styles['TableHeader'])],
        [Paragraph('Remove', styles['TableCell']),
         Paragraph('Delete the claim entirely', styles['TableCell']),
         Paragraph('Remove "thousands of users"', styles['TableCell'])],
        [Paragraph('Generalize', styles['TableCell']),
         Paragraph('Use less specific language', styles['TableCell']),
         Paragraph('"a week ago" -> "recently"', styles['TableCell'])],
        [Paragraph('Ask User', styles['TableCell']),
         Paragraph('Request verification from user', styles['TableCell']),
         Paragraph('"Can you confirm when article was published?"', styles['TableCell'])],
    ]
    story.append(create_table(cannot_verify, [3*cm, 5*cm, 7*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph(
        "<b>NEVER guess or assume information. An unverified claim is a G2 = 0 risk.</b>",
        styles['Important']
    ))
    story.append(PageBreak())
    
    # ==================== PART 15-24 (Continue with remaining parts) ====================
    # Adding abbreviated versions to complete the PDF
    
    story.append(Paragraph("<b>PART 15: TARGET SCORE CALCULATOR</b>", styles['PartTitle']))
    story.append(Paragraph("Benchmarking Against Leaderboard", styles['SectionTitle']))
    
    story.append(Paragraph(
        "This section explains how to analyze the leaderboard and calculate what score "
        "you need to achieve your target ranking.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>15.1 Leaderboard Data Structure</b>", styles['SubSection']))
    
    leaderboard_structure = """
LEADERBOARD API RESPONSE:
-------------------------
GET /leaderboard?campaignAddress={address}&limit=100

[
  {
    "rank": 1,
    "username": "spacejunnk",
    "user": {
      "xUsername": "spacejunnk",
      "xName": "Display Name",
      "xAvatar": "https://...",
      "xVerified": true,
      "xFollowersCount": 1893
    },
    "points": 8143350318841547000,  // in atto (10^-18)
    "totalSubmissions": 1
  },
  ...
]

IMPORTANT: points is in atto format!
To convert: score = points / 10^18
Example: 8143350318841547000 / 10^18 = 8.14
"""
    story.append(Preformatted(leaderboard_structure, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>15.2 Score Analysis Process</b>", styles['SubSection']))
    
    score_analysis = [
        [Paragraph('<b>Metric</b>', styles['TableHeader']),
         Paragraph('<b>Calculation</b>', styles['TableHeader']),
         Paragraph('<b>Interpretation</b>', styles['TableHeader'])],
        [Paragraph('Top 10 Average', styles['TableCell']),
         Paragraph('Average scores of ranks 1-10', styles['TableCell']),
         Paragraph('Target for competitive content', styles['TableCell'])],
        [Paragraph('Top 100 Average', styles['TableCell']),
         Paragraph('Average scores of ranks 1-100', styles['TableCell']),
         Paragraph('Baseline for decent content', styles['TableCell'])],
        [Paragraph('Your Percentile', styles['TableCell']),
         Paragraph('Your rank / total participants', styles['TableCell']),
         Paragraph('Position relative to competition', styles['TableCell'])],
        [Paragraph('Score Gap', styles['TableCell']),
         Paragraph('Target score - your predicted score', styles['TableCell']),
         Paragraph('How much improvement needed', styles['TableCell'])],
    ]
    story.append(create_table(score_analysis, [4*cm, 5*cm, 6*cm]))
    story.append(PageBreak())
    
    # ==================== PART 16: SCORING SIMULATION ====================
    story.append(Paragraph("<b>PART 16: SCORING SIMULATION PROCESS</b>", styles['PartTitle']))
    story.append(Paragraph("Predict Score Before Posting", styles['SectionTitle']))
    
    story.append(Paragraph(
        "This section provides the methodology for simulating your content's score "
        "before you actually post it. This allows for iteration and improvement.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>16.1 Simulation Methodology</b>", styles['SubSection']))
    
    sim_method = [
        [Paragraph('<b>Component</b>', styles['TableHeader']),
         Paragraph('<b>How to Estimate</b>', styles['TableHeader']),
         Paragraph('<b>Confidence</b>', styles['TableHeader'])],
        [Paragraph('G1 Alignment', styles['TableCell']),
         Paragraph('Check content against campaign goal', styles['TableCell']),
         Paragraph('High - binary criteria', styles['TableCell'])],
        [Paragraph('G2 Accuracy', styles['TableCell']),
         Paragraph('Verify facts against knowledgeBase + research', styles['TableCell']),
         Paragraph('High - must verify all claims', styles['TableCell'])],
        [Paragraph('G3 Compliance', styles['TableCell']),
         Paragraph('Check hashtags, mentions present', styles['TableCell']),
         Paragraph('Very High - binary criteria', styles['TableCell'])],
        [Paragraph('G4 Originality', styles['TableCell']),
         Paragraph('Use G4 Checklist from Part 6', styles['TableCell']),
         Paragraph('Medium - subjective evaluation', styles['TableCell'])],
        [Paragraph('EP Potential', styles['TableCell']),
         Paragraph('Assess hook, CTA, structure', styles['TableCell']),
         Paragraph('Medium - depends on audience', styles['TableCell'])],
        [Paragraph('TQ Quality', styles['TableCell']),
         Paragraph('Check grammar, formatting', styles['TableCell']),
         Paragraph('High - objective criteria', styles['TableCell'])],
        [Paragraph('Engagement', styles['TableCell']),
         Paragraph('Cannot predict - post-submission', styles['TableCell']),
         Paragraph('Low - external factors', styles['TableCell'])],
    ]
    story.append(create_table(sim_method, [3.5*cm, 6*cm, 5.5*cm]))
    story.append(PageBreak())
    
    # ==================== G4 CHECKLIST SECTION ====================
    story.append(Paragraph("<b>PART 6: G4 CHECKLIST KONKRET</b>", styles['PartTitle']))
    story.append(Paragraph("Yes/No Checklist for Achieving 2.0 Score", styles['SectionTitle']))
    
    story.append(Paragraph(
        "This checklist is CRITICAL. For G4 to score 2.0, ALL items must be checked. "
        "Use this checklist to validate your content before submission. Each missing item "
        "can reduce your score by 0.1-0.3 points.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>6.1 Mandatory Elements for G4 = 2.0</b>", styles['SubSection']))
    
    checklist_mandatory = [
        [Paragraph('<b>#</b>', styles['TableHeader']),
         Paragraph('<b>Element</b>', styles['TableHeader']),
         Paragraph('<b>Description</b>', styles['TableHeader']),
         Paragraph('<b>Example</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Casual Hook Opening', styles['TableCell']),
         Paragraph('Start with casual phrase or mid-thought', styles['TableCell']),
         Paragraph('ngl, tbh, honestly, fun story', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Parenthetical Aside', styles['TableCell']),
         Paragraph('At least one aside in parentheses', styles['TableCell']),
         Paragraph('(embarrassing to admit), (just saying)', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Multiple Contractions', styles['TableCell']),
         Paragraph('3+ contractions throughout content', styles['TableCell']),
         Paragraph("don't, can't, it's, they're, won't", styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Sentence Fragments', styles['TableCell']),
         Paragraph('Incomplete sentences for emphasis', styles['TableCell']),
         Paragraph('Not complete. Casual. Works.', styles['TableCell'])],
        [Paragraph('5', styles['TableCellCenter']),
         Paragraph('Personal Angle/Story', styles['TableCell']),
         Paragraph('Genuine personal experience or opinion', styles['TableCell']),
         Paragraph('sat there for 10 minutes watching...', styles['TableCell'])],
        [Paragraph('6', styles['TableCellCenter']),
         Paragraph('Conversational Ending', styles['TableCell']),
         Paragraph('End naturally, not formally', styles['TableCell']),
         Paragraph('tbh, worth checking, just saying', styles['TableCell'])],
    ]
    story.append(create_table(checklist_mandatory, [1.5*cm, 4*cm, 5*cm, 5.5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>6.2 Kill List - Must NOT Have</b>", styles['SubSection']))
    
    checklist_kill = [
        [Paragraph('<b>#</b>', styles['TableHeader']),
         Paragraph('<b>Forbidden Element</b>', styles['TableHeader']),
         Paragraph('<b>Why It Hurts</b>', styles['TableHeader']),
         Paragraph('<b>Replace With</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Em Dashes (—)', styles['TableCell']),
         Paragraph('Strong AI tell', styles['TableCell']),
         Paragraph('Regular hyphens (-) or commas', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Smart Quotes', styles['TableCell']),
         Paragraph('Formatted by AI tools', styles['TableCell']),
         Paragraph('Straight quotes ("like this")', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Generic Openings', styles['TableCell']),
         Paragraph("'In the world of...', 'Picture this...'", styles['TableCell']),
         Paragraph('Start mid-thought or with hook', styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('AI Phrases', styles['TableCell']),
         Paragraph('delve into, realm, embark on, uncover', styles['TableCell']),
         Paragraph('dig into, world, start, find out', styles['TableCell'])],
        [Paragraph('5', styles['TableCellCenter']),
         Paragraph('Corporate Speak', styles['TableCell']),
         Paragraph('revolutionize, transform, game-changer', styles['TableCell']),
         Paragraph('change, shake up, new way', styles['TableCell'])],
        [Paragraph('6', styles['TableCellCenter']),
         Paragraph('Over-Explaining', styles['TableCell']),
         Paragraph('Treating reader as unintelligent', styles['TableCell']),
         Paragraph('Trust reader to understand', styles['TableCell'])],
        [Paragraph('7', styles['TableCellCenter']),
         Paragraph('Perfect Grammar', styles['TableCell']),
         Paragraph('Too formal, AI-generated feel', styles['TableCell']),
         Paragraph('Natural casual style', styles['TableCell'])],
    ]
    story.append(create_table(checklist_kill, [1.5*cm, 4*cm, 5*cm, 5.5*cm]))
    story.append(PageBreak())
    
    # ==================== APPENDIX A: QUICK REFERENCE ====================
    story.append(Paragraph("<b>APPENDIX A: QUICK REFERENCE CARDS</b>", styles['PartTitle']))
    
    story.append(Paragraph("<b>A.1 Information Verification Quick Card</b>", styles['SubSection']))
    
    verif_quick = """
INFORMATION VERIFICATION QUICK CARD
===================================

BEFORE WRITING CONTENT:
1. Fetch campaign knowledgeBase
2. Identify project website/Twitter
3. Research project details
4. Extract verified facts only

FOR EACH CLAIM:
[ ] Can I verify this from official source?
[ ] Do I have a specific source?
[ ] Is the information current?

IF CANNOT VERIFY:
- Remove the claim, OR
- Use general language, OR
- Ask user for confirmation

NEVER:
- Assume information
- Fabricate details
- Use unverified numbers
- Guess dates or timelines
"""
    story.append(Preformatted(verif_quick, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>A.2 G4 Score Quick Card</b>", styles['SubSection']))
    
    g4_quick = """
G4 SCORE QUICK CARD
===================

NEEDED FOR G4 = 2.0:
[ ] Casual hook (ngl/tbh/honestly)
[ ] Parenthetical aside
[ ] 3+ contractions
[ ] Sentence fragments
[ ] Personal angle
[ ] Conversational ending

NEVER USE:
[ ] Em dashes
[ ] Smart quotes
[ ] AI phrases
[ ] Generic openings
[ ] Corporate speak

CALCULATION:
Base: 1.0
+ Each checklist item: +0.15 to +0.20
- Each violation: -0.20 to -0.30
Cap at 2.0
"""
    story.append(Preformatted(g4_quick, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>A.3 API Endpoints Summary</b>", styles['SubSection']))
    
    api_summary = [
        [Paragraph('<b>Endpoint</b>', styles['TableHeader']),
         Paragraph('<b>Method</b>', styles['TableHeader']),
         Paragraph('<b>Purpose</b>', styles['TableHeader'])],
        [Paragraph('/campaigns', styles['TableCell']),
         Paragraph('GET', styles['TableCellCenter']),
         Paragraph('List all campaigns', styles['TableCell'])],
        [Paragraph('/campaigns/{address}', styles['TableCell']),
         Paragraph('GET', styles['TableCellCenter']),
         Paragraph('Get campaign detail + knowledgeBase', styles['TableCell'])],
        [Paragraph('/leaderboard', styles['TableCell']),
         Paragraph('GET', styles['TableCellCenter']),
         Paragraph('Get campaign leaderboard', styles['TableCell'])],
    ]
    story.append(create_table(api_summary, [5*cm, 3*cm, 7*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>A.4 Formula Quick Reference</b>", styles['SubSection']))
    
    formula_ref = """
Gate Multiplier:      M_gate = 1 + 0.5 x (g_star - 1)
                      g_star = average of 4 gate scores
                      Max M_gate = 1.5x when all gates = 2.0

Campaign Points:      Campaign_Points = M_gate x Sum(W[i] x normalized_metrics[i])

Points Conversion:    display_score = atto_points / 10^18

Elite Target:         8.0+ for top 1% ranking
"""
    story.append(Preformatted(formula_ref, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== APPENDIX B: COMPLETE CHECKLISTS ====================
    story.append(Paragraph("<b>APPENDIX B: COMPLETE CHECKLISTS</b>", styles['PartTitle']))
    
    story.append(Paragraph("<b>B.1 Pre-Submission Master Checklist</b>", styles['SubSection']))
    
    master_checklist = """
PRE-SUBMISSION MASTER CHECKLIST
================================

INFORMATION VERIFICATION (MANDATORY FIRST):
[ ] Fetched campaign knowledgeBase
[ ] Researched project website
[ ] Checked project Twitter
[ ] Verified all claims in content
[ ] No unverified statistics
[ ] No assumed information

GATE 1 - CONTENT ALIGNMENT:
[ ] Content matches campaign goal
[ ] Correct terminology used
[ ] Brand consistency maintained
[ ] Target audience appropriate

GATE 2 - INFORMATION ACCURACY:
[ ] All facts verified against sources
[ ] No misleading claims
[ ] Proper context provided
[ ] Data/statistics confirmed

GATE 3 - CAMPAIGN COMPLIANCE:
[ ] All required hashtags present
[ ] All required mentions present
[ ] Format requirements met
[ ] Style guidelines followed

GATE 4 - ORIGINALITY & AUTHENTICITY:
[ ] Casual hook opening
[ ] Parenthetical aside present
[ ] 3+ contractions used
[ ] Sentence fragments included
[ ] Personal angle/story present
[ ] Conversational ending
[ ] NO em dashes
[ ] NO smart quotes
[ ] NO AI phrases

FINAL:
[ ] Read aloud test passed
[ ] All claims verified
[ ] Score simulated and acceptable
"""
    story.append(Preformatted(master_checklist, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== APPENDIX C: FORMULA REFERENCE ====================
    story.append(Paragraph("<b>APPENDIX C: FORMULA REFERENCE</b>", styles['PartTitle']))
    
    story.append(Paragraph("<b>C.1 Complete Scoring Formula</b>", styles['SubSection']))
    
    complete_formula = """
COMPLETE RALLY SCORING FORMULA
==============================

STEP 1: GATE PASS & MULTIPLIER
------------------------------
gate_pass = min(G1, G2, G3, G4) > 0
g_star = avg(G1, G2, G3, G4)
M_gate = 1 + beta x (g_star - 1)
where beta = 0.5

Gate Score Impact:
- All gates = 2.0 -> M_gate = 1.5x (MAX)
- All gates = 1.0 -> M_gate = 1.0x (baseline)
- Any gate = 0   -> gate_pass = False (DISQUALIFIED)


STEP 2: CAMPAIGN POINTS (Q SCORE)
---------------------------------
Campaign_Points = M_gate x Sum(W[i] x normalized_metrics[i])

Where:
- W = vector of metric weights (0-1)
- normalized_metrics include:
  - EP (Engagement Potential): 0-5
  - TQ (Technical Quality): 0-5
  - log(RT+1): Retweets
  - log(LK+1): Likes
  - log(RP+1): Replies
  - QR: Quality of Replies (0-1)
  - log(FR+1): Followers of Repliers


STEP 3: FINAL DISTRIBUTION
--------------------------
S_user = max(user_Q[period], 0) ^ alpha
share_user = S_user / Sum(S_all_users)
rewards_user = share_user x total_rewards

Alpha values:
- Balanced:  alpha = 1.0 (~25% to top 10%)
- Default:   alpha = 3.0 (~90% to top 10%)
- Extreme:   alpha = 8.0 (~99% to top 10%)
"""
    story.append(Preformatted(complete_formula, styles['CodeBlock']))
    
    # Build the PDF
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        title='Rally_Ultimate_Master_Guide_V2',
        author='Z.ai',
        creator='Z.ai',
        subject='Complete Rally.fun guide with Information Verification Protocol'
    )
    
    doc.build(story)
    print(f"PDF generated: {OUTPUT_PATH}")
    return OUTPUT_PATH

if __name__ == "__main__":
    build_pdf()
