#!/usr/bin/env python3
"""
Rally.fun Ultimate Master Guide PDF Generator
Super Complete Guide for AI Systems
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
OUTPUT_PATH = '/home/z/my-project/download/Rally_Ultimate_Master_Guide.pdf'

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
    story.append(Paragraph("Version 3.0 - Ultimate Edition", styles['CoverSubtitle']))
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
        ("PART 12: TARGET SCORE CALCULATOR", "Benchmarking against leaderboard"),
        ("PART 13: SCORING SIMULATION PROCESS", "Predict score before posting"),
        ("PART 14: PRE-SUBMISSION VALIDATION", "Final checklist before post"),
        ("PART 15: API ACCESS GUIDE", "Complete Rally API documentation"),
        ("PART 16: LEADERBOARD ANALYSIS", "How to analyze competition"),
        ("PART 17: CONTENT TEMPLATES", "Proven winning templates"),
        ("PART 18: BEFORE/AFTER EXAMPLES", "Real content with score analysis"),
        ("PART 19: X-FACTOR DIFFERENTIATORS", "Stand out from Top 10"),
        ("PART 20: COMMON MISTAKES & FIXES", "Anti-patterns to avoid"),
        ("PART 21: DECISION TREES", "Logic flowcharts for decisions"),
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

### Content Generation Workflow:
1. Ask user for campaign name/address
2. Fetch campaign details (goal, rules, knowledgeBase)
3. Extract mandatory elements (hashtags, mentions, style)
4. Fetch leaderboard for benchmarking
5. Generate 2-3 content options
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
1. Confirm you understand the campaign
2. Ask for any specific angle/preference
3. Generate content following G4 checklist
4. Provide score prediction with reasoning
5. Offer alternatives if needed
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
    story.append(Spacer(1, 16))
    
    # Weights
    story.append(Paragraph("<b>2.5 Metric Weights (0-1)</b>", styles['SubSection']))
    story.append(Paragraph(
        "Each of the 11 metrics can be assigned a weight from 0 to 1. "
        "A weight of 1.0 means maximum importance, while 0.0 turns off the metric entirely. "
        "Weights are visible in the campaign briefing, so priorities are transparent. "
        "Projects can tailor these per campaign to emphasize what matters most.",
        styles['CustomBody']
    ))
    
    weight_examples = [
        [Paragraph('<b>Scenario</b>', styles['TableHeader']),
         Paragraph('<b>Weight Configuration</b>', styles['TableHeader']),
         Paragraph('<b>Effect</b>', styles['TableHeader'])],
        [Paragraph('Quality over Engagement', styles['TableCell']),
         Paragraph('Lower RT, LK, RP, QR, FR; Raise EP, TQ', styles['TableCell']),
         Paragraph('Rewards good content more than viral content', styles['TableCell'])],
        [Paragraph('Originality Not Priority', styles['TableCell']),
         Paragraph('Set G4 weight to 0', styles['TableCell']),
         Paragraph('Originality gate does not disqualify or affect multiplier', styles['TableCell'])],
        [Paragraph('Maximum Engagement', styles['TableCell']),
         Paragraph('RT, LK, RP weights at 1.0', styles['TableCell']),
         Paragraph('Viral content gets highest scores', styles['TableCell'])],
    ]
    story.append(create_table(weight_examples, [4.5*cm, 6*cm, 5.5*cm]))
    story.append(PageBreak())
    
    # ==================== PART 3: DISTRIBUTION CURVES ====================
    story.append(Paragraph("<b>PART 3: DISTRIBUTION CURVES & REWARDS</b>", styles['PartTitle']))
    story.append(Paragraph("How Rewards Are Calculated and Distributed", styles['SectionTitle']))
    
    story.append(Paragraph(
        "Rally.fun uses three distribution curves to determine how rewards are allocated among participants. "
        "The choice of curve dramatically affects whether rewards are concentrated among top performers "
        "or distributed more broadly. Understanding these curves helps set realistic expectations for earnings.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>3.1 The Three Distribution Models</b>", styles['SubSection']))
    
    curves_data = [
        [Paragraph('<b>Curve</b>', styles['TableHeader']),
         Paragraph('<b>Alpha</b>', styles['TableHeader']),
         Paragraph('<b>Top 10% Share</b>', styles['TableHeader']),
         Paragraph('<b>Characteristics</b>', styles['TableHeader'])],
        [Paragraph('Balanced', styles['TableCell']),
         Paragraph('1.0', styles['TableCellCenter']),
         Paragraph('~25%', styles['TableCellCenter']),
         Paragraph('Rewards spread broadly, more participants earn', styles['TableCell'])],
        [Paragraph('Default', styles['TableCell']),
         Paragraph('3.0', styles['TableCellCenter']),
         Paragraph('~90%', styles['TableCellCenter']),
         Paragraph('Standard crypto distribution, top performers dominate', styles['TableCell'])],
        [Paragraph('Extreme', styles['TableCell']),
         Paragraph('8.0', styles['TableCellCenter']),
         Paragraph('~99%', styles['TableCellCenter']),
         Paragraph('Winner-take-most, only elite earns significantly', styles['TableCell'])],
    ]
    story.append(create_table(curves_data, [3*cm, 2.5*cm, 3.5*cm, 7*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>3.2 The Distribution Formula</b>", styles['SubSection']))
    story.append(Paragraph(
        "The final reward distribution uses a power-law formula that creates the concentration effects "
        "described above. Higher alpha values increase the gap between top performers and average participants.",
        styles['CustomBody']
    ))
    
    formula_text = """
Final Distribution Formula:
--------------------------
S_user = max(user_Q[period], 0) ^ alpha
share_user = S_user / Sum(S_all_users)
rewards_user = share_user x total_rewards

Where:
- user_Q[period] = accumulated Campaign Points in the period
- alpha = distribution curve parameter (1.0, 3.0, or 8.0)
- Higher alpha = more concentration at the top
"""
    story.append(Preformatted(formula_text, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>3.3 Real-World Impact Example</b>", styles['SubSection']))
    story.append(Paragraph(
        "Consider a campaign with 1000 USDT total rewards and 100 participants. "
        "The distribution curve dramatically affects individual earnings:",
        styles['CustomBody']
    ))
    
    impact_data = [
        [Paragraph('<b>Participant Rank</b>', styles['TableHeader']),
         Paragraph('<b>Balanced</b>', styles['TableHeader']),
         Paragraph('<b>Default</b>', styles['TableHeader']),
         Paragraph('<b>Extreme</b>', styles['TableHeader'])],
        [Paragraph('Rank #1', styles['TableCell']),
         Paragraph('~25 USDT', styles['TableCellCenter']),
         Paragraph('~90 USDT', styles['TableCellCenter']),
         Paragraph('~150 USDT', styles['TableCellCenter'])],
        [Paragraph('Rank #10', styles['TableCell']),
         Paragraph('~15 USDT', styles['TableCellCenter']),
         Paragraph('~5 USDT', styles['TableCellCenter']),
         Paragraph('~2 USDT', styles['TableCellCenter'])],
        [Paragraph('Rank #50', styles['TableCell']),
         Paragraph('~8 USDT', styles['TableCellCenter']),
         Paragraph('~0.5 USDT', styles['TableCellCenter']),
         Paragraph('~0.01 USDT', styles['TableCellCenter'])],
        [Paragraph('Rank #100', styles['TableCell']),
         Paragraph('~2 USDT', styles['TableCellCenter']),
         Paragraph('~0.01 USDT', styles['TableCellCenter']),
         Paragraph('<0.01 USDT', styles['TableCellCenter'])],
    ]
    story.append(create_table(impact_data, [4*cm, 3.5*cm, 3.5*cm, 5*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph(
        "<b>Key Insight:</b> In Default and Extreme curves, ranking in the top 10 is ESSENTIAL for meaningful rewards. "
        "The Balanced curve allows more participants to earn, but individual earnings are lower across the board.",
        styles['Important']
    ))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>3.4 Refresh Engagement System</b>", styles['SubSection']))
    story.append(Paragraph(
        "Content creators can refresh engagement metrics in later periods to capture additional performance. "
        "This is crucial for content that gains traction after the initial submission period.",
        styles['CustomBody']
    ))
    
    refresh_rules = [
        [Paragraph('<b>Aspect</b>', styles['TableHeader']),
         Paragraph('<b>Rule</b>', styles['TableHeader']),
         Paragraph('<b>Implication</b>', styles['TableHeader'])],
        [Paragraph('Quality Component', styles['TableCell']),
         Paragraph('Fixed from first submission', styles['TableCell']),
         Paragraph('First submission quality matters most', styles['TableCell'])],
        [Paragraph('Engagement Update', styles['TableCell']),
         Paragraph('Only engagement metrics refresh', styles['TableCell']),
         Paragraph('Can gain points from viral growth', styles['TableCell'])],
        [Paragraph('Credit Calculation', styles['TableCell']),
         Paragraph('Only positive difference credited', styles['TableCell']),
         Paragraph('max(0, Q_current - Q_baseline)', styles['TableCell'])],
        [Paragraph('Gaming Prevention', styles['TableCell']),
         Paragraph('Cannot repeatedly refresh for same gains', styles['TableCell']),
         Paragraph('Only genuine growth is rewarded', styles['TableCell'])],
    ]
    story.append(create_table(refresh_rules, [4*cm, 5.5*cm, 6.5*cm]))
    story.append(PageBreak())
    
    # ==================== PART 4: GATE OPTIMIZATION ====================
    story.append(Paragraph("<b>PART 4: GATE OPTIMIZATION DEEP DIVE</b>", styles['PartTitle']))
    story.append(Paragraph("Pro-Level Strategies for Maximum Multiplier", styles['SectionTitle']))
    
    story.append(Paragraph(
        "The Gate Multiplier is the MOST IMPACTFUL factor in your final score. "
        "A perfect gate score (1.5x multiplier) versus a failed gate (0.5x multiplier) means a 3x difference "
        "in final Campaign Points. This section provides detailed strategies for achieving 2.0 on each gate.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>4.1 Gate Multiplier Impact Analysis</b>", styles['SubSection']))
    
    gate_impact = [
        [Paragraph('<b>Gate Scores</b>', styles['TableHeader']),
         Paragraph('<b>g_star</b>', styles['TableHeader']),
         Paragraph('<b>M_gate</b>', styles['TableHeader']),
         Paragraph('<b>vs Baseline</b>', styles['TableHeader']),
         Paragraph('<b>Impact</b>', styles['TableHeader'])],
        [Paragraph('2, 2, 2, 2', styles['TableCellCenter']),
         Paragraph('2.0', styles['TableCellCenter']),
         Paragraph('1.5x', styles['TableCellCenter']),
         Paragraph('+50%', styles['TableCellCenter']),
         Paragraph('ELITE - Maximum multiplier', styles['TableCell'])],
        [Paragraph('2, 2, 2, 1', styles['TableCellCenter']),
         Paragraph('1.75', styles['TableCellCenter']),
         Paragraph('1.375x', styles['TableCellCenter']),
         Paragraph('+37.5%', styles['TableCellCenter']),
         Paragraph('Very good', styles['TableCell'])],
        [Paragraph('2, 2, 1, 1', styles['TableCellCenter']),
         Paragraph('1.5', styles['TableCellCenter']),
         Paragraph('1.25x', styles['TableCellCenter']),
         Paragraph('+25%', styles['TableCellCenter']),
         Paragraph('Good', styles['TableCell'])],
        [Paragraph('1, 1, 1, 1', styles['TableCellCenter']),
         Paragraph('1.0', styles['TableCellCenter']),
         Paragraph('1.0x', styles['TableCellCenter']),
         Paragraph('Baseline', styles['TableCellCenter']),
         Paragraph('Average', styles['TableCell'])],
        [Paragraph('Any = 0', styles['TableCellCenter']),
         Paragraph('-', styles['TableCellCenter']),
         Paragraph('0.5x', styles['TableCellCenter']),
         Paragraph('-50%', styles['TableCellCenter']),
         Paragraph('DISQUALIFIED', styles['TableCell'])],
    ]
    story.append(create_table(gate_impact, [3*cm, 2.5*cm, 2.5*cm, 3*cm, 5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>4.2 Gate 1: Content Alignment Strategy</b>", styles['SubSection']))
    
    g1_strategy = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>How to Execute</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Read campaign goal thoroughly', styles['TableCell']),
         Paragraph('Understand the core message the campaign wants to convey', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Identify key terminology', styles['TableCell']),
         Paragraph('Note specific terms, brand names, and language used in the brief', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Match campaign tone', styles['TableCell']),
         Paragraph('If campaign is casual, be casual. If professional, be professional', styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Align with target audience', styles['TableCell']),
         Paragraph('Write for who the campaign wants to reach, not just anyone', styles['TableCell'])],
        [Paragraph('5', styles['TableCellCenter']),
         Paragraph('Verify brand consistency', styles['TableCell']),
         Paragraph('Check that your content reflects the brand correctly', styles['TableCell'])],
    ]
    story.append(create_table(g1_strategy, [2*cm, 5*cm, 9*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>4.3 Gate 2: Information Accuracy Strategy</b>", styles['SubSection']))
    
    g2_strategy = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>How to Execute</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Study knowledgeBase', styles['TableCell']),
         Paragraph('Read all provided campaign information before writing', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Verify all claims', styles['TableCell']),
         Paragraph('Only include facts that are in official materials', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Use correct data', styles['TableCell']),
         Paragraph('If mentioning numbers, verify them against campaign docs', styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Provide proper context', styles['TableCell']),
         Paragraph("Don't take facts out of context to mislead", styles['TableCell'])],
        [Paragraph('5', styles['TableCellCenter']),
         Paragraph('Cross-reference', styles['TableCell']),
         Paragraph('Check that your content aligns with campaign website/docs', styles['TableCell'])],
    ]
    story.append(create_table(g2_strategy, [2*cm, 5*cm, 9*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>4.4 Gate 3: Campaign Compliance Strategy</b>", styles['SubSection']))
    
    g3_strategy = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>How to Execute</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Extract required hashtags', styles['TableCell']),
         Paragraph('Find all hashtags mentioned in campaign rules', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Extract required mentions', styles['TableCell']),
         Paragraph('Note all @mentions that must be included', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Check format requirements', styles['TableCell']),
         Paragraph('Any specific format? (thread length, media required, etc.)', styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Follow style guidelines', styles['TableCell']),
         Paragraph('Match any specified tone, length, or style requirements', styles['TableCell'])],
        [Paragraph('5', styles['TableCellCenter']),
         Paragraph('Include disclosures', styles['TableCell']),
         Paragraph('Add any required disclaimers or disclosures', styles['TableCell'])],
        [Paragraph('6', styles['TableCellCenter']),
         Paragraph('Final verification', styles['TableCell']),
         Paragraph('Re-read campaign rules and check each requirement', styles['TableCell'])],
    ]
    story.append(create_table(g3_strategy, [2*cm, 5*cm, 9*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>4.5 Gate 4: Originality & Authenticity Strategy</b>", styles['SubSection']))
    story.append(Paragraph(
        "This is the most challenging gate and the #1 differentiator. See PART 5-7 for detailed coverage.",
        styles['CustomBody']
    ))
    story.append(PageBreak())
    
    # ==================== PART 5: G4 MASTERY ====================
    story.append(Paragraph("<b>PART 5: G4 ORIGINALITY MASTERY</b>", styles['PartTitle']))
    story.append(Paragraph("The #1 Differentiator Explained in Detail", styles['SectionTitle']))
    
    story.append(Paragraph(
        "Gate 4 (Originality & Authenticity) is the single most important factor that separates "
        "top 1% performers from average participants. Most AI-generated content scores 0-1 on this gate "
        "because it lacks genuine human voice. Achieving a 2.0 score requires specific techniques that "
        "make content feel authentically human.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>5.1 Why G4 Is Critical</b>", styles['SubSection']))
    
    story.append(Paragraph(
        "In real Rally leaderboards, the difference between Rank #1 and Rank #100 often comes down to G4 scores. "
        "While other gates can be achieved through careful adherence to rules, G4 requires genuine creativity "
        "and authentic voice. AI detection is built into Rally's evaluation system specifically for this gate.",
        styles['CustomBody']
    ))
    
    g4_importance = [
        [Paragraph('<b>Rank</b>', styles['TableHeader']),
         Paragraph('<b>Typical G4</b>', styles['TableHeader']),
         Paragraph('<b>Characteristics</b>', styles['TableHeader'])],
        [Paragraph('Top 10', styles['TableCell']),
         Paragraph('1.8-2.0', styles['TableCellCenter']),
         Paragraph('Unique angle, personal story, authentic voice', styles['TableCell'])],
        [Paragraph('Top 50', styles['TableCell']),
         Paragraph('1.5-1.8', styles['TableCellCenter']),
         Paragraph('Some originality but still formulaic', styles['TableCell'])],
        [Paragraph('Top 100', styles['TableCell']),
         Paragraph('1.2-1.5', styles['TableCellCenter']),
         Paragraph('Template-like with minor personal touches', styles['TableCell'])],
        [Paragraph('Below 100', styles['TableCell']),
         Paragraph('1.0-1.2', styles['TableCellCenter']),
         Paragraph('Generic content, AI-generated feel', styles['TableCell'])],
    ]
    story.append(create_table(g4_importance, [3*cm, 3.5*cm, 9.5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>5.2 The G4 Scoring Criteria Deep Dive</b>", styles['SubSection']))
    
    story.append(Paragraph("<b>Score 0 (Fail) - What Gets Detected:</b>", styles['SubSection']))
    g4_fail = [
        "Generic AI patterns and recycled content structures",
        "No personal voice or unique perspective",
        "Template-like opening (In today's world, In the realm of)",
        "Perfect grammar with no conversational elements",
        "Over-explained concepts with no trust in reader",
        "Corporate speak (revolutionize, transform, game-changer)",
        "Em dashes and smart quotes (AI tells)",
    ]
    for item in g4_fail:
        story.append(Paragraph(f"• {item}", styles['BulletText']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>Score 1 (Pass) - Partial Originality:</b>", styles['SubSection']))
    g4_pass = [
        "Some originality but still template-like structure",
        "Has a perspective but feels formulaic",
        "Added personal anecdote but lacks spontaneity",
        "Unexpected angle but execution feels planned",
        "Some contractions but overall formal tone",
    ]
    for item in g4_pass:
        story.append(Paragraph(f"• {item}", styles['BulletText']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>Score 2 (Excellent) - True Human Voice:</b>", styles['SubSection']))
    g4_excellent = [
        "Feels genuinely HUMAN-WRITTEN with unique perspective",
        "Fresh angle that surprises the reader",
        "Personal insights that only a real person would have",
        "Natural language with casual, conversational tone",
        "Creative expression with personality",
        "Includes contractions, asides, fragments naturally",
        "Starts mid-thought or with unexpected hook",
        "Ends conversationally, not formally",
    ]
    for item in g4_excellent:
        story.append(Paragraph(f"• {item}", styles['BulletText']))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>5.3 The Human Voice Injection Protocol</b>", styles['SubSection']))
    story.append(Paragraph(
        "Follow this 8-step protocol to transform AI-generated content into human-sounding content "
        "that scores 2.0 on G4:",
        styles['CustomBody']
    ))
    
    protocol_steps = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>Example</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Read Aloud Test', styles['TableCell']),
         Paragraph("If it doesn't sound like natural speech, rewrite until it does", styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Friend Test', styles['TableCell']),
         Paragraph("Would you say this to a friend? If not, make it conversational", styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Template Test', styles['TableCell']),
         Paragraph("Could this work for ANY campaign? If yes, add specificity", styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('AI Pattern Scan', styles['TableCell']),
         Paragraph("Check for em dashes, smart quotes, AI phrases - remove all", styles['TableCell'])],
        [Paragraph('5', styles['TableCellCenter']),
         Paragraph('Voice Injection', styles['TableCell']),
         Paragraph("Add personal asides: tbh, honestly, ngl, embarrassing to admit", styles['TableCell'])],
        [Paragraph('6', styles['TableCellCenter']),
         Paragraph('Contraction Replacement', styles['TableCell']),
         Paragraph("do not → don't, cannot → can't, it is → it's, they are → they're", styles['TableCell'])],
        [Paragraph('7', styles['TableCellCenter']),
         Paragraph('Sentence Variety', styles['TableCell']),
         Paragraph("Mix short punchy sentences with longer ones. Add fragments.", styles['TableCell'])],
        [Paragraph('8', styles['TableCellCenter']),
         Paragraph('Unexpected Words', styles['TableCell']),
         Paragraph("Throw in slang or casual terms AI wouldn't use naturally", styles['TableCell'])],
    ]
    story.append(create_table(protocol_steps, [2*cm, 4.5*cm, 9.5*cm]))
    story.append(PageBreak())
    
    # ==================== PART 6: G4 CHECKLIST ====================
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
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>6.3 Quick Validation Process</b>", styles['SubSection']))
    story.append(Paragraph(
        "Before submitting, run through this quick validation:",
        styles['CustomBody']
    ))
    
    validation_text = """
G4 VALIDATION CHECKLIST:
------------------------
[ ] Opens with casual hook (ngl/tbh/honestly/fun story)
[ ] Contains at least ONE parenthetical aside
[ ] Has 3+ contractions (don't, can't, it's, etc.)
[ ] Includes sentence fragments (not complete sentences)
[ ] Has personal angle or specific story
[ ] Ends conversationally (not formally)
[ ] NO em dashes anywhere
[ ] NO smart quotes
[ ] NO generic AI openings
[ ] NO AI phrases (delve, realm, embark)
[ ] NO corporate speak
[ ] NO over-explaining
[ ] Reads naturally when spoken aloud

RESULT: If ALL checked → Predicted G4 = 2.0
         If 1-2 missing → Predicted G4 = 1.7-1.9
         If 3-4 missing → Predicted G4 = 1.4-1.6
         If 5+ missing → Predicted G4 = 1.0-1.3
"""
    story.append(Preformatted(validation_text, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 7: G4 STUCK RECOVERY ====================
    story.append(Paragraph("<b>PART 7: G4 STUCK RECOVERY (1.5 to 2.0)</b>", styles['PartTitle']))
    story.append(Paragraph("Troubleshooting Guide When Scores Won't Increase", styles['SectionTitle']))
    
    story.append(Paragraph(
        "This section addresses the common problem where G4 scores get 'stuck' at 1.5 despite following "
        "basic guidelines. Understanding why scores plateau and how to break through is essential for "
        "achieving elite rankings.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>7.1 Why G4 Gets Stuck at 1.5</b>", styles['SubSection']))
    
    stuck_reasons = [
        [Paragraph('<b>Reason</b>', styles['TableHeader']),
         Paragraph('<b>Symptom</b>', styles['TableHeader']),
         Paragraph('<b>Solution</b>', styles['TableHeader'])],
        [Paragraph('Missing Casual Hook', styles['TableCell']),
         Paragraph('Opens with fact or statement', styles['TableCell']),
         Paragraph("Add ngl/tbh/honestly at the start", styles['TableCell'])],
        [Paragraph('No Parenthetical Aside', styles['TableCell']),
         Paragraph('No conversational asides', styles['TableCell']),
         Paragraph("Add (embarrassing to admit) or (just saying)", styles['TableCell'])],
        [Paragraph('Too Few Contractions', styles['TableCell']),
         Paragraph('Only 1-2 contractions', styles['TableCell']),
         Paragraph("Add more: don't, can't, it's, they're, won't", styles['TableCell'])],
        [Paragraph('No Personal Story', styles['TableCell']),
         Paragraph('Generic without specificity', styles['TableCell']),
         Paragraph("Add specific time/place: 'sat there for 10 minutes'", styles['TableCell'])],
        [Paragraph('Formal Ending', styles['TableCell']),
         Paragraph('Ends with statement or CTA', styles['TableCell']),
         Paragraph("Add casual ending: 'tbh' or 'worth checking'", styles['TableCell'])],
        [Paragraph('Hidden AI Patterns', styles['TableCell']),
         Paragraph('Still using AI phrases subtly', styles['TableCell']),
         Paragraph("Scan for: 'really', 'actually', 'important', 'key'", styles['TableCell'])],
    ]
    story.append(create_table(stuck_reasons, [4.5*cm, 5*cm, 6.5*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>7.2 The 1.5 to 2.0 Upgrade Process</b>", styles['SubSection']))
    story.append(Paragraph(
        "Follow this step-by-step process to upgrade content from 1.5 to 2.0:",
        styles['CustomBody']
    ))
    
    upgrade_process = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>Before Example</b>', styles['TableHeader']),
         Paragraph('<b>After Example</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Add casual opener', styles['TableCell']),
         Paragraph('Argue.fun is a new platform...', styles['TableCell']),
         Paragraph("ngl i completely slept on this", styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Add parenthetical', styles['TableCell']),
         Paragraph('The platform lets agents argue...', styles['TableCell']),
         Paragraph('agents argue onchain (embarrassing to admit i watched for 10 mins)', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Increase contractions', styles['TableCell']),
         Paragraph('It is interesting. You should try.', styles['TableCell']),
         Paragraph("it's wild tbh. you've gotta try it", styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Add sentence fragment', styles['TableCell']),
         Paragraph('The interface is clean.', styles['TableCell']),
         Paragraph('clean interface. satisfying.', styles['TableCell'])],
        [Paragraph('5', styles['TableCellCenter']),
         Paragraph('Add personal angle', styles['TableCell']),
         Paragraph('The project is innovative.', styles['TableCell']),
         Paragraph("my timeline ghosted me on this one. annoying.", styles['TableCell'])],
        [Paragraph('6', styles['TableCellCenter']),
         Paragraph('Casual ending', styles['TableCell']),
         Paragraph('Check it out today.', styles['TableCell']),
         Paragraph("worth a look tbh", styles['TableCell'])],
    ]
    story.append(create_table(upgrade_process, [1.5*cm, 3.5*cm, 5*cm, 6*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>7.3 Real Example: Before and After</b>", styles['SubSection']))
    
    before_after = """
BEFORE (G4 = 1.5):
------------------
Argue.fun is an innovative platform where AI agents debate on-chain 
with real token stakes. The concept is fascinating because it combines 
artificial intelligence with blockchain technology. Users can watch 
agents defend their positions while judges vote on the winner. 
Check it out and see the future of AI debates.

Issues:
- No casual hook (starts with fact)
- No parenthetical asides
- Only 1 contraction (it's missing entirely)
- No sentence fragments
- No personal angle
- Formal ending ("Check it out")
- AI patterns: "innovative platform", "concept is fascinating"

AFTER (G4 = 2.0):
-----------------
ngl i completely slept on this

@arguedotfun's article dropped. my timeline? nothing. not a peep. 
agents arguing onchain with real stakes (embarrassing to admit 
i sat there watching for 10 minutes). judges voting live.

can't believe my algo ghosted me on this one. that's annoying tbh

[quote article]

Improvements:
+ Casual hook opener: "ngl"
+ Parenthetical aside: "(embarrassing to admit...)"
+ Multiple contractions: "can't", "that's"
+ Sentence fragments: "my timeline? nothing. not a peep."
+ Personal angle: "my algo ghosted me"
+ Conversational ending: "tbh"
+ No AI patterns
"""
    story.append(Preformatted(before_after, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 8: AI DETECTION EVASION ====================
    story.append(Paragraph("<b>PART 8: AI DETECTION EVASION</b>", styles['PartTitle']))
    story.append(Paragraph("Complete Kill List and Solutions", styles['SectionTitle']))
    
    story.append(Paragraph(
        "Rally's G4 evaluation includes AI detection. This section provides a comprehensive list "
        "of AI patterns to avoid and their human alternatives. Using any of the forbidden patterns "
        "will significantly reduce your G4 score.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>8.1 The Complete AI Detection Kill List</b>", styles['SubSection']))
    
    kill_list = [
        [Paragraph('<b>Category</b>', styles['TableHeader']),
         Paragraph('<b>AI Pattern</b>', styles['TableHeader']),
         Paragraph('<b>Human Alternative</b>', styles['TableHeader'])],
        [Paragraph('Punctuation', styles['TableCell']),
         Paragraph('Em dashes (—)', styles['TableCell']),
         Paragraph('Regular hyphens (-) or commas', styles['TableCell'])],
        [Paragraph('Punctuation', styles['TableCell']),
         Paragraph('Smart quotes (" ")', styles['TableCell']),
         Paragraph('Straight quotes ("like this")', styles['TableCell'])],
        [Paragraph('Opening', styles['TableCell']),
         Paragraph('In the world of...', styles['TableCell']),
         Paragraph('Start mid-thought', styles['TableCell'])],
        [Paragraph('Opening', styles['TableCell']),
         Paragraph('Picture this...', styles['TableCell']),
         Paragraph('Jump straight into story', styles['TableCell'])],
        [Paragraph('Opening', styles['TableCell']),
         Paragraph("In today's digital landscape...", styles['TableCell']),
         Paragraph('Specific statement or question', styles['TableCell'])],
        [Paragraph('Phrase', styles['TableCell']),
         Paragraph('delve into', styles['TableCell']),
         Paragraph('dig into, look at', styles['TableCell'])],
        [Paragraph('Phrase', styles['TableCell']),
         Paragraph('realm', styles['TableCell']),
         Paragraph('world, space', styles['TableCell'])],
        [Paragraph('Phrase', styles['TableCell']),
         Paragraph('embark on', styles['TableCell']),
         Paragraph('start, begin', styles['TableCell'])],
        [Paragraph('Phrase', styles['TableCell']),
         Paragraph('uncover', styles['TableCell']),
         Paragraph('find, discover', styles['TableCell'])],
        [Paragraph('Phrase', styles['TableCell']),
         Paragraph('revolutionize', styles['TableCell']),
         Paragraph('change, shake up', styles['TableCell'])],
        [Paragraph('Phrase', styles['TableCell']),
         Paragraph('transform', styles['TableCell']),
         Paragraph('change', styles['TableCell'])],
        [Paragraph('Phrase', styles['TableCell']),
         Paragraph('game-changer', styles['TableCell']),
         Paragraph('new way, different approach', styles['TableCell'])],
        [Paragraph('Phrase', styles['TableCell']),
         Paragraph('unlock', styles['TableCell']),
         Paragraph('open, give access', styles['TableCell'])],
        [Paragraph('Phrase', styles['TableCell']),
         Paragraph('leverage', styles['TableCell']),
         Paragraph('use', styles['TableCell'])],
        [Paragraph('Phrase', styles['TableCell']),
         Paragraph('cutting-edge', styles['TableCell']),
         Paragraph('new, latest', styles['TableCell'])],
        [Paragraph('Structure', styles['TableCell']),
         Paragraph('Over-explaining', styles['TableCell']),
         Paragraph('Trust reader to understand', styles['TableCell'])],
        [Paragraph('Structure', styles['TableCell']),
         Paragraph('Perfect grammar', styles['TableCell']),
         Paragraph('Natural casual style', styles['TableCell'])],
        [Paragraph('Structure', styles['TableCell']),
         Paragraph('Uniform sentence length', styles['TableCell']),
         Paragraph('Mix short and long sentences', styles['TableCell'])],
    ]
    story.append(create_table(kill_list, [3*cm, 5*cm, 7*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>8.2 Hidden AI Patterns (Often Missed)</b>", styles['SubSection']))
    
    hidden_patterns = [
        [Paragraph('<b>Pattern</b>', styles['TableHeader']),
         Paragraph('<b>Why It\'s a Tell</b>', styles['TableHeader']),
         Paragraph('<b>Fix</b>', styles['TableHeader'])],
        [Paragraph('really + adjective', styles['TableCell']),
         Paragraph('AI overuses emphasis words', styles['TableCell']),
         Paragraph('Remove "really" or use specific detail', styles['TableCell'])],
        [Paragraph('actually + statement', styles['TableCell']),
         Paragraph('AI loves this transition', styles['TableCell']),
         Paragraph('Remove "actually" entirely', styles['TableCell'])],
        [Paragraph('important to note', styles['TableCell']),
         Paragraph('Formal AI transition', styles['TableCell']),
         Paragraph('Just state the point directly', styles['TableCell'])],
        [Paragraph('key takeaway', styles['TableCell']),
         Paragraph('Educational AI pattern', styles['TableCell']),
         Paragraph('Remove or rephrase casually', styles['TableCell'])],
        [Paragraph('it\'s worth mentioning', styles['TableCell']),
         Paragraph('AI hedging phrase', styles['TableCell']),
         Paragraph('Just mention it', styles['TableCell'])],
        [Paragraph('firstly/secondly/thirdly', styles['TableCell']),
         Paragraph('Formal structure marker', styles['TableCell']),
         Paragraph('Use "first" or just list items', styles['TableCell'])],
        [Paragraph('in conclusion', styles['TableCell']),
         Paragraph('Essay-style AI ending', styles['TableCell']),
         Paragraph('End with statement or question', styles['TableCell'])],
    ]
    story.append(create_table(hidden_patterns, [4*cm, 5.5*cm, 5.5*cm]))
    story.append(PageBreak())
    
    # ==================== PART 9: COMPLETE WORKFLOW ====================
    story.append(Paragraph("<b>PART 9: COMPLETE WORKFLOW</b>", styles['PartTitle']))
    story.append(Paragraph("Step-by-Step Participation Guide", styles['SectionTitle']))
    
    story.append(Paragraph(
        "This section provides the complete workflow for participating in any Rally.fun campaign, "
        "from initial interest to final submission and beyond.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>9.1 The 10-Step Participation Workflow</b>", styles['SubSection']))
    
    workflow_steps = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>Details</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Identify Campaign', styles['TableCell']),
         Paragraph('Browse active campaigns on Rally.fun', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Read Campaign Brief', styles['TableCell']),
         Paragraph('Study goal, knowledgeBase, rules, style guidelines', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Extract Requirements', styles['TableCell']),
         Paragraph('List all mandatory hashtags, mentions, format requirements', styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Fetch Leaderboard', styles['TableCell']),
         Paragraph('Get current rankings to understand competition', styles['TableCell'])],
        [Paragraph('5', styles['TableCellCenter']),
         Paragraph('Analyze Top 10', styles['TableCell']),
         Paragraph('Study what top performers are doing differently', styles['TableCell'])],
        [Paragraph('6', styles['TableCellCenter']),
         Paragraph('Generate Content', styles['TableCell']),
         Paragraph('Create 2-3 content options following G4 checklist', styles['TableCell'])],
        [Paragraph('7', styles['TableCellCenter']),
         Paragraph('Simulate Score', styles['TableCell']),
         Paragraph('Predict G1-G4 scores and identify weaknesses', styles['TableCell'])],
        [Paragraph('8', styles['TableCellCenter']),
         Paragraph('Iterate if Needed', styles['TableCell']),
         Paragraph('Fix any issues identified in simulation', styles['TableCell'])],
        [Paragraph('9', styles['TableCellCenter']),
         Paragraph('Final Validation', styles['TableCell']),
         Paragraph('Run through all checklists before posting', styles['TableCell'])],
        [Paragraph('10', styles['TableCellCenter']),
         Paragraph('Submit & Monitor', styles['TableCell']),
         Paragraph('Post content and track engagement', styles['TableCell'])],
    ]
    story.append(create_table(workflow_steps, [2*cm, 4*cm, 10*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>9.2 Post-Submission Actions</b>", styles['SubSection']))
    
    post_submit = [
        [Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>Timing</b>', styles['TableHeader']),
         Paragraph('<b>Purpose</b>', styles['TableHeader'])],
        [Paragraph('Monitor Engagement', styles['TableCell']),
         Paragraph('First 24 hours', styles['TableCell']),
         Paragraph('Track RT, likes, replies for early signals', styles['TableCell'])],
        [Paragraph('Engage with Replies', styles['TableCell']),
         Paragraph('Ongoing', styles['TableCell']),
         Paragraph('Reply to boost QR (Quality of Replies) metric', styles['TableCell'])],
        [Paragraph('Refresh Engagement', styles['TableCell']),
         Paragraph('Next period', styles['TableCell']),
         Paragraph('Update metrics if content is performing well', styles['TableCell'])],
        [Paragraph('Analyze Results', styles['TableCell']),
         Paragraph('Post-campaign', styles['TableCell']),
         Paragraph('Learn what worked for future campaigns', styles['TableCell'])],
    ]
    story.append(create_table(post_submit, [4*cm, 4*cm, 8*cm]))
    story.append(PageBreak())
    
    # ==================== PART 10: CAMPAIGN PARTICIPATION ====================
    story.append(Paragraph("<b>PART 10: CAMPAIGN PARTICIPATION WORKFLOW</b>", styles['PartTitle']))
    story.append(Paragraph("From 'I Want to Join' to Ready to Submit", styles['SectionTitle']))
    
    story.append(Paragraph(
        "When you tell AI 'I want to join [campaign name]', this is the detailed workflow "
        "the AI should follow to help you succeed.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>10.1 Campaign Discovery Phase</b>", styles['SubSection']))
    
    discovery_steps = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>API/Data Needed</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Fetch campaign list', styles['TableCell']),
         Paragraph('GET /campaigns', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('Find target campaign', styles['TableCell']),
         Paragraph('Match by name or address', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Get campaign details', styles['TableCell']),
         Paragraph('GET /campaigns/{address}', styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Parse campaign data', styles['TableCell']),
         Paragraph('goal, knowledgeBase, rules, style', styles['TableCell'])],
    ]
    story.append(create_table(discovery_steps, [2*cm, 5*cm, 9*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>10.2 Campaign Brief Parser</b>", styles['SubSection']))
    story.append(Paragraph(
        "Extract the following from campaign data:",
        styles['CustomBody']
    ))
    
    parser_items = [
        [Paragraph('<b>Field</b>', styles['TableHeader']),
         Paragraph('<b>Source</b>', styles['TableHeader']),
         Paragraph('<b>Use For</b>', styles['TableHeader'])],
        [Paragraph('Campaign Goal', styles['TableCell']),
         Paragraph('campaign.goal', styles['TableCell']),
         Paragraph('G1 Content Alignment', styles['TableCell'])],
        [Paragraph('Knowledge Base', styles['TableCell']),
         Paragraph('campaign.knowledgeBase', styles['TableCell']),
         Paragraph('G2 Information Accuracy', styles['TableCell'])],
        [Paragraph('Rules', styles['TableCell']),
         Paragraph('campaign.rules', styles['TableCell']),
         Paragraph('G3 Campaign Compliance', styles['TableCell'])],
        [Paragraph('Style Guidelines', styles['TableCell']),
         Paragraph('campaign.style', styles['TableCell']),
         Paragraph('Tone and voice matching', styles['TableCell'])],
        [Paragraph('Required Hashtags', styles['TableCell']),
         Paragraph('Extract from rules', styles['TableCell']),
         Paragraph('Mandatory inclusion check', styles['TableCell'])],
        [Paragraph('Required Mentions', styles['TableCell']),
         Paragraph('Extract from rules', styles['TableCell']),
         Paragraph('Mandatory inclusion check', styles['TableCell'])],
        [Paragraph('Minimum Followers', styles['TableCell']),
         Paragraph('campaign.minimumFollowers', styles['TableCell']),
         Paragraph('Eligibility check', styles['TableCell'])],
        [Paragraph('Distribution Curve', styles['TableCell']),
         Paragraph('campaign.alpha', styles['TableCell']),
         Paragraph('Reward expectation setting', styles['TableCell'])],
    ]
    story.append(create_table(parser_items, [4*cm, 5*cm, 7*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>10.3 Content Generation Phase</b>", styles['SubSection']))
    
    gen_process = """
CONTENT GENERATION PROCESS:
---------------------------
1. Ask user for any specific angle or preference
2. Generate 2-3 content options with different approaches:
   - Option A: Story/personal angle
   - Option B: Counter-intuitive insight
   - Option C: Humor/meme angle

3. For each option, apply G4 Checklist:
   [ ] Casual hook opening
   [ ] Parenthetical aside
   [ ] 3+ contractions
   [ ] Sentence fragments
   [ ] Personal angle
   [ ] Conversational ending
   [ ] No AI patterns

4. Verify campaign compliance:
   [ ] All required hashtags present
   [ ] All required mentions included
   [ ] Style guidelines followed

5. Provide score prediction for each option
6. Recommend best option with reasoning
"""
    story.append(Preformatted(gen_process, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 11: CAMPAIGN BRIEF PARSER ====================
    story.append(Paragraph("<b>PART 11: CAMPAIGN BRIEF PARSER</b>", styles['PartTitle']))
    story.append(Paragraph("How to Extract Requirements from Campaign Data", styles['SectionTitle']))
    
    story.append(Paragraph(
        "This section details how to parse and interpret campaign data to understand "
        "what is required for successful content.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>11.1 Campaign Data Structure</b>", styles['SubSection']))
    
    data_structure = """
TYPICAL CAMPAIGN API RESPONSE:
------------------------------
{
  "id": "campaign-xxx",
  "title": "Campaign Name",
  "intelligentContractAddress": "0x...",
  "goal": "Main campaign description and what it's about",
  "rules": "Campaign rules including hashtags and mentions",
  "knowledgeBase": "Detailed project information for accuracy",
  "style": "Tone and style guidelines",
  "token": {"symbol": "USDT", "usdPrice": 1.0},
  "campaignRewards": [{"totalAmount": 5000, "token": {...}}],
  "minimumFollowers": 200,
  "startDate": "2026-02-26T19:00:00.000Z",
  "endDate": "2026-03-12T19:00:00.000Z",
  "alpha": 3,        // Distribution curve (1=Balanced, 3=Default, 8=Extreme)
  "lastSyncedSubmissionCount": 818  // Total submissions
}
"""
    story.append(Preformatted(data_structure, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>11.2 Field-by-Field Extraction Guide</b>", styles['SubSection']))
    
    extraction_guide = [
        [Paragraph('<b>Field</b>', styles['TableHeader']),
         Paragraph('<b>What to Extract</b>', styles['TableHeader']),
         Paragraph('<b>How to Use</b>', styles['TableHeader'])],
        [Paragraph('goal', styles['TableCell']),
         Paragraph('Core message and value proposition', styles['TableCell']),
         Paragraph('Ensure content aligns with main message', styles['TableCell'])],
        [Paragraph('rules', styles['TableCell']),
         Paragraph('Hashtags (#xxx), Mentions (@xxx)', styles['TableCell']),
         Paragraph('MANDATORY - extract all with regex', styles['TableCell'])],
        [Paragraph('knowledgeBase', styles['TableCell']),
         Paragraph('Facts, figures, project details', styles['TableCell']),
         Paragraph('Reference for accurate claims', styles['TableCell'])],
        [Paragraph('style', styles['TableCell']),
         Paragraph('Tone (casual/professional), Length', styles['TableCell']),
         Paragraph('Match voice to guidelines', styles['TableCell'])],
        [Paragraph('minimumFollowers', styles['TableCell']),
         Paragraph('Follower threshold', styles['TableCell']),
         Paragraph('Check eligibility before proceeding', styles['TableCell'])],
        [Paragraph('alpha', styles['TableCell']),
         Paragraph('1, 3, or 8', styles['TableCell']),
         Paragraph('Set reward expectations (see Part 3)', styles['TableCell'])],
    ]
    story.append(create_table(extraction_guide, [3.5*cm, 5.5*cm, 7*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>11.3 Hashtag and Mention Extraction</b>", styles['SubSection']))
    
    extraction_code = """
REGEX PATTERNS FOR EXTRACTION:
------------------------------
Hashtags: r"#\\w+"
Example: "#Grvt #DeFi" -> ["#Grvt", "#DeFi"]

Mentions: r"@\\w+"
Example: "@project @founder" -> ["@project", "@founder"]

VALIDATION BEFORE SUBMISSION:
-----------------------------
for hashtag in required_hashtags:
    assert hashtag in content, f"Missing: {hashtag}"

for mention in required_mentions:
    assert mention in content, f"Missing: {mention}"
"""
    story.append(Preformatted(extraction_code, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 12: TARGET SCORE CALCULATOR ====================
    story.append(Paragraph("<b>PART 12: TARGET SCORE CALCULATOR</b>", styles['PartTitle']))
    story.append(Paragraph("Benchmarking Against Leaderboard", styles['SectionTitle']))
    
    story.append(Paragraph(
        "This section explains how to analyze the leaderboard and calculate what score "
        "you need to achieve your target ranking.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>12.1 Leaderboard Data Structure</b>", styles['SubSection']))
    
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
    
    story.append(Paragraph("<b>12.2 Score Analysis Process</b>", styles['SubSection']))
    
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
    story.append(create_table(score_analysis, [4*cm, 5*cm, 7*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>12.3 Target Score Formula</b>", styles['SubSection']))
    
    target_formula = """
TARGET SCORE CALCULATION:
-------------------------
Step 1: Fetch leaderboard data
Step 2: Convert points from atto (divide by 10^18)
Step 3: Calculate target based on goal:

If goal is TOP 10:
  target_score = average(top_10_scores) + buffer
  buffer = 0.5 (to account for new submissions)

If goal is TOP 50:
  target_score = score_at_rank_50 + buffer

If goal is TOP 100:
  target_score = score_at_rank_100 + buffer

Step 4: Estimate if achievable:
  max_possible = 10.0 (theoretical max)
  realistic_max = 8.5 (observed top scores)

  if target_score > realistic_max:
    return "Target may be too ambitious for this campaign"

Step 5: Work backwards to required metrics:
  required_quality = target_score / gate_multiplier
  required_engagement = required_quality - quality_component
"""
    story.append(Preformatted(target_formula, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 13: SCORING SIMULATION ====================
    story.append(Paragraph("<b>PART 13: SCORING SIMULATION PROCESS</b>", styles['PartTitle']))
    story.append(Paragraph("Predict Score Before Posting", styles['SectionTitle']))
    
    story.append(Paragraph(
        "This section provides the methodology for simulating your content's score "
        "before you actually post it. This allows for iteration and improvement.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>13.1 Simulation Methodology</b>", styles['SubSection']))
    
    sim_method = [
        [Paragraph('<b>Component</b>', styles['TableHeader']),
         Paragraph('<b>How to Estimate</b>', styles['TableHeader']),
         Paragraph('<b>Confidence</b>', styles['TableHeader'])],
        [Paragraph('G1 Alignment', styles['TableCell']),
         Paragraph('Check content against campaign goal', styles['TableCell']),
         Paragraph('High - binary criteria', styles['TableCell'])],
        [Paragraph('G2 Accuracy', styles['TableCell']),
         Paragraph('Verify facts against knowledgeBase', styles['TableCell']),
         Paragraph('High - binary criteria', styles['TableCell'])],
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
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>13.2 G4 Score Simulation Checklist</b>", styles['SubSection']))
    
    g4_sim = """
G4 SCORE SIMULATION:
--------------------
For each checklist item, score 0 or 1:

[ ] Casual hook opening        -> +0.15 to G4
[ ] Parenthetical aside        -> +0.15 to G4
[ ] 3+ contractions            -> +0.20 to G4
[ ] Sentence fragments         -> +0.15 to G4
[ ] Personal angle/story       -> +0.20 to G4
[ ] Conversational ending      -> +0.15 to G4

Penalties:
[ ] Em dashes present          -> -0.30 to G4
[ ] Smart quotes present       -> -0.20 to G4
[ ] AI phrases present         -> -0.20 each
[ ] Generic opening            -> -0.30 to G4
[ ] Formal ending              -> -0.20 to G4
[ ] Over-explaining            -> -0.20 to G4

Calculation:
base_score = 1.0
+ sum of bonuses
- sum of penalties
final_G4 = min(2.0, max(0, base_score + bonuses - penalties))

Example:
base = 1.0
+ casual_hook (0.15) + aside (0.15) + contractions (0.20)
+ fragments (0.15) + personal (0.20) + ending (0.15)
= 1.0 + 1.0 = 2.0 (capped at max)
"""
    story.append(Preformatted(g4_sim, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>13.3 Quality Score Estimation</b>", styles['SubSection']))
    
    quality_est = """
QUALITY SCORE ESTIMATION:
-------------------------
EP (Engagement Potential) 0-5:
- Strong hook that grabs attention: +1.0
- Clear CTA or conversation starter: +1.0
- Good structure with line breaks: +0.5
- Provocative or surprising angle: +1.0
- Relevant to current trends: +0.5
- Visual/media element: +0.5
Base: 1.0, Max: 5.0

TQ (Technical Quality) 0-5:
- Readable without major issues: +1.0
- Good formatting: +1.0
- Appropriate length: +1.0
- No spelling errors: +1.0
- Platform-optimized: +1.0
Base: 1.0, Max: 5.0

GATE MULTIPLIER CALCULATION:
----------------------------
g_star = (G1 + G2 + G3 + G4) / 4
M_gate = 1 + 0.5 * (g_star - 1)

Example: G1=2, G2=2, G3=2, G4=2
g_star = 2.0
M_gate = 1 + 0.5 * (2.0 - 1) = 1.5x (MAXIMUM)
"""
    story.append(Preformatted(quality_est, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 14: PRE-SUBMISSION VALIDATION ====================
    story.append(Paragraph("<b>PART 14: PRE-SUBMISSION VALIDATION</b>", styles['PartTitle']))
    story.append(Paragraph("Final Checklist Before Posting", styles['SectionTitle']))
    
    story.append(Paragraph(
        "Complete this validation checklist before every submission. "
        "Missing any item can result in point loss or disqualification.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>14.1 Mandatory Requirements Check</b>", styles['SubSection']))
    
    mandatory_check = [
        [Paragraph('<b>Category</b>', styles['TableHeader']),
         Paragraph('<b>Check</b>', styles['TableHeader']),
         Paragraph('<b>If Failed</b>', styles['TableHeader'])],
        [Paragraph('Hashtags', styles['TableCell']),
         Paragraph('All required #hashtags present', styles['TableCell']),
         Paragraph('G3 = 0 (disqualified)', styles['TableCell'])],
        [Paragraph('Mentions', styles['TableCell']),
         Paragraph('All required @mentions present', styles['TableCell']),
         Paragraph('G3 = 0 (disqualified)', styles['TableCell'])],
        [Paragraph('Accuracy', styles['TableCell']),
         Paragraph('All facts match knowledgeBase', styles['TableCell']),
         Paragraph('G2 = 0 (disqualified)', styles['TableCell'])],
        [Paragraph('Alignment', styles['TableCell']),
         Paragraph('Content matches campaign goal', styles['TableCell']),
         Paragraph('G1 = 0 (disqualified)', styles['TableCell'])],
        [Paragraph('Originality', styles['TableCell']),
         Paragraph('Content is not template-like', styles['TableCell']),
         Paragraph('G4 = 0-1 (reduced multiplier)', styles['TableCell'])],
    ]
    story.append(create_table(mandatory_check, [3.5*cm, 6*cm, 5.5*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>14.2 G4 Quality Check</b>", styles['SubSection']))
    
    g4_check = [
        [Paragraph('<b>Element</b>', styles['TableHeader']),
         Paragraph('<b>Present?</b>', styles['TableHeader']),
         Paragraph('<b>Impact</b>', styles['TableHeader'])],
        [Paragraph('Casual hook opening', styles['TableCell']),
         Paragraph('[ ] Yes [ ] No', styles['TableCellCenter']),
         Paragraph('+0.15 to G4', styles['TableCell'])],
        [Paragraph('Parenthetical aside', styles['TableCell']),
         Paragraph('[ ] Yes [ ] No', styles['TableCellCenter']),
         Paragraph('+0.15 to G4', styles['TableCell'])],
        [Paragraph('3+ contractions', styles['TableCell']),
         Paragraph('[ ] Yes [ ] No', styles['TableCellCenter']),
         Paragraph('+0.20 to G4', styles['TableCell'])],
        [Paragraph('Sentence fragments', styles['TableCell']),
         Paragraph('[ ] Yes [ ] No', styles['TableCellCenter']),
         Paragraph('+0.15 to G4', styles['TableCell'])],
        [Paragraph('Personal angle/story', styles['TableCell']),
         Paragraph('[ ] Yes [ ] No', styles['TableCellCenter']),
         Paragraph('+0.20 to G4', styles['TableCell'])],
        [Paragraph('Conversational ending', styles['TableCell']),
         Paragraph('[ ] Yes [ ] No', styles['TableCellCenter']),
         Paragraph('+0.15 to G4', styles['TableCell'])],
        [Paragraph('NO em dashes', styles['TableCell']),
         Paragraph('[ ] Yes [ ] No', styles['TableCellCenter']),
         Paragraph('-0.30 if present', styles['TableCell'])],
        [Paragraph('NO AI phrases', styles['TableCell']),
         Paragraph('[ ] Yes [ ] No', styles['TableCellCenter']),
         Paragraph('-0.20 each if present', styles['TableCell'])],
    ]
    story.append(create_table(g4_check, [4*cm, 4*cm, 7*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>14.3 Final Read-Aloud Test</b>", styles['SubSection']))
    story.append(Paragraph(
        "Before posting, read your content aloud. Ask these questions:",
        styles['CustomBody']
    ))
    
    readaloud_questions = [
        "Does it sound like something you would naturally say?",
        "Are there any awkward phrases that made you stumble?",
        "Does it feel like you're reading a marketing post or a friend's message?",
        "Would you say this exact sentence in a casual conversation?",
        "Is there anything that sounds 'written' rather than 'spoken'?",
    ]
    for q in readaloud_questions:
        story.append(Paragraph(f"• {q}", styles['BulletText']))
    
    story.append(Paragraph(
        "<b>If any answer is NO, revise that part before posting.</b>",
        styles['Important']
    ))
    story.append(PageBreak())
    
    # ==================== PART 15: API ACCESS GUIDE ====================
    story.append(Paragraph("<b>PART 15: API ACCESS GUIDE</b>", styles['PartTitle']))
    story.append(Paragraph("Complete Rally API Documentation", styles['SectionTitle']))
    
    story.append(Paragraph("<b>15.1 Base URLs</b>", styles['SubSection']))
    
    base_urls = [
        [Paragraph('<b>Environment</b>', styles['TableHeader']),
         Paragraph('<b>Base URL</b>', styles['TableHeader']),
         Paragraph('<b>Notes</b>', styles['TableHeader'])],
        [Paragraph('Production', styles['TableCell']),
         Paragraph('https://app.rally.fun/api', styles['TableCell']),
         Paragraph('Live data', styles['TableCell'])],
        [Paragraph('Staging', styles['TableCell']),
         Paragraph('https://rally-staging.vercel.app/api', styles['TableCell']),
         Paragraph('Test environment', styles['TableCell'])],
    ]
    story.append(create_table(base_urls, [3.5*cm, 6*cm, 5.5*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>15.2 Public API Endpoints</b>", styles['SubSection']))
    
    api_endpoints = [
        [Paragraph('<b>Endpoint</b>', styles['TableHeader']),
         Paragraph('<b>Method</b>', styles['TableHeader']),
         Paragraph('<b>Purpose</b>', styles['TableHeader'])],
        [Paragraph('/campaigns', styles['TableCell']),
         Paragraph('GET', styles['TableCellCenter']),
         Paragraph('List all active campaigns', styles['TableCell'])],
        [Paragraph('/campaigns/{address}', styles['TableCell']),
         Paragraph('GET', styles['TableCellCenter']),
         Paragraph('Get specific campaign details', styles['TableCell'])],
        [Paragraph('/leaderboard', styles['TableCell']),
         Paragraph('GET', styles['TableCellCenter']),
         Paragraph('Get campaign leaderboard', styles['TableCell'])],
    ]
    story.append(create_table(api_endpoints, [5*cm, 2.5*cm, 7.5*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>15.3 Endpoint Details</b>", styles['SubSection']))
    
    api_detail = """
GET /campaigns - List All Campaigns
-----------------------------------
Parameters:
  limit: number (default: 10) - Number of campaigns to return
  offset: number - Pagination offset

Response:
{
  "campaigns": [
    {
      "id": "campaign-xxx",
      "title": "Campaign Name",
      "intelligentContractAddress": "0x...",
      "goal": "Campaign description...",
      "rules": "Campaign rules...",
      "knowledgeBase": "Detailed info...",
      "minimumFollowers": 200,
      "startDate": "2026-02-26T19:00:00.000Z",
      "endDate": "2026-03-12T19:00:00.000Z"
    }
  ],
  "pagination": {"total": 50, "hasMore": true}
}

GET /campaigns/{address} - Get Campaign Detail
----------------------------------------------
Returns detailed campaign information including full knowledge base,
rules, style guidelines, and mission details.

GET /leaderboard - Get Campaign Leaderboard
-------------------------------------------
Parameters:
  campaignAddress: string (required) - Campaign contract address
  limit: number (default: 100) - Max results

Response:
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
    "points": 8143350318841547000,
    "totalSubmissions": 1
  }
]

IMPORTANT: points is in atto (10^-18)
Convert: score = points / 10^18
"""
    story.append(Preformatted(api_detail, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>15.4 Code Examples</b>", styles['SubSection']))
    
    code_examples = """
PYTHON EXAMPLE:
---------------
import requests

BASE_URL = "https://app.rally.fun/api"

# Get all active campaigns
campaigns = requests.get(f"{BASE_URL}/campaigns").json()["campaigns"]

# Get specific campaign details
campaign_address = "0x3FF8239aCd75aD0dA013cA52EaAB535027bD7380"
campaign = requests.get(f"{BASE_URL}/campaigns/{campaign_address}").json()

# Get leaderboard
leaderboard = requests.get(
    f"{BASE_URL}/leaderboard",
    params={"campaignAddress": campaign_address, "limit": 100}
).json()

# Convert points to 0-10 scale
for entry in leaderboard:
    entry["score"] = entry["points"] / 1e18
    print(f"{entry['rank']}. {entry['user']['xUsername']}: {entry['score']:.2f}")

JAVASCRIPT/TYPESCRIPT EXAMPLE:
-------------------------------
const BASE_URL = "https://app.rally.fun/api";

// Get campaigns
const campaignsRes = await fetch(`${BASE_URL}/campaigns`);
const { campaigns } = await campaignsRes.json();

// Get campaign detail
const campaignRes = await fetch(`${BASE_URL}/campaigns/${address}`);
const campaign = await campaignRes.json();

// Get leaderboard
const leaderboardRes = await fetch(
  `${BASE_URL}/leaderboard?campaignAddress=${address}&limit=100`
);
const leaderboard = await leaderboardRes.json();

// Convert points to 0-10 scale
const scores = leaderboard.map(e => ({
  rank: e.rank,
  username: e.user.xUsername,
  score: e.points / 1e18
}));
"""
    story.append(Preformatted(code_examples, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 16: LEADERBOARD ANALYSIS ====================
    story.append(Paragraph("<b>PART 16: LEADERBOARD ANALYSIS</b>", styles['PartTitle']))
    story.append(Paragraph("How to Analyze Competition", styles['SectionTitle']))
    
    story.append(Paragraph(
        "Analyzing the leaderboard before creating content helps you understand "
        "what it takes to rank well. This section provides a framework for analysis.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>16.1 Key Metrics to Extract</b>", styles['SubSection']))
    
    metrics_extract = [
        [Paragraph('<b>Metric</b>', styles['TableHeader']),
         Paragraph('<b>Calculation</b>', styles['TableHeader']),
         Paragraph('<b>Insight</b>', styles['TableHeader'])],
        [Paragraph('Total Participants', styles['TableCell']),
         Paragraph('Count of leaderboard entries', styles['TableCell']),
         Paragraph('Competition level', styles['TableCell'])],
        [Paragraph('Top 10 Avg Score', styles['TableCell']),
         Paragraph('Mean of ranks 1-10', styles['TableCell']),
         Paragraph('Target for elite ranking', styles['TableCell'])],
        [Paragraph('Score Distribution', styles['TableCell']),
         Paragraph('Spread of scores across ranks', styles['TableCell']),
         Paragraph('Difficulty to move up', styles['TableCell'])],
        [Paragraph('Score Gap #10 to #11', styles['TableCell']),
         Paragraph('Score difference at boundary', styles['TableCell']),
         Paragraph('How hard to break into top 10', styles['TableCell'])],
        [Paragraph('Avg Submissions/User', styles['TableCell']),
         Paragraph('totalSubmissions / participants', styles['TableCell']),
         Paragraph('Multi-submission strategy?', styles['TableCell'])],
    ]
    story.append(create_table(metrics_extract, [4*cm, 5*cm, 6*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>16.2 Score Distribution Analysis</b>", styles['SubSection']))
    
    distribution_text = """
TYPICAL SCORE DISTRIBUTION (Example: Grvt 2.5 Campaign):
--------------------------------------------------------
Total Participants: 818

Rank Range    | Score Range | Percentile | Interpretation
--------------|-------------|------------|----------------
#1            | 8.14        | 99.87%     | Elite
#2-10         | 6.5-8.0     | 98.7%      | Top Tier
#11-50        | 4.5-6.5     | 87-98%     | High Performer
#51-100       | 3.5-4.5     | 78-87%     | Good
#101-500      | 2.0-3.5     | 39-78%     | Average
#501+         | 0-2.0       | <39%       | Below Average

KEY INSIGHTS:
1. Top 10 scores are ~2x higher than rank #100
2. Breaking into top 10 requires ~6.5+ score
3. Top 1% is significantly above top 10%
4. Most participants score below 3.0
"""
    story.append(Preformatted(distribution_text, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>16.3 Competitive Analysis Process</b>", styles['SubSection']))
    
    comp_analysis = [
        [Paragraph('<b>Step</b>', styles['TableHeader']),
         Paragraph('<b>Action</b>', styles['TableHeader']),
         Paragraph('<b>Tool</b>', styles['TableHeader'])],
        [Paragraph('1', styles['TableCellCenter']),
         Paragraph('Fetch top 10 leaderboard', styles['TableCell']),
         Paragraph('GET /leaderboard?limit=10', styles['TableCell'])],
        [Paragraph('2', styles['TableCellCenter']),
         Paragraph('View top performers content', styles['TableCell']),
         Paragraph('X/Twitter links from user data', styles['TableCell'])],
        [Paragraph('3', styles['TableCellCenter']),
         Paragraph('Identify patterns', styles['TableCell']),
         Paragraph('What hooks, styles, angles work?', styles['TableCell'])],
        [Paragraph('4', styles['TableCellCenter']),
         Paragraph('Find differentiation', styles['TableCell']),
         Paragraph('What is NOT being done?', styles['TableCell'])],
        [Paragraph('5', styles['TableCellCenter']),
         Paragraph('Set target score', styles['TableCell']),
         Paragraph('Top 10 avg + buffer', styles['TableCell'])],
    ]
    story.append(create_table(comp_analysis, [2*cm, 5.5*cm, 8.5*cm]))
    story.append(PageBreak())
    
    # ==================== PART 17: CONTENT TEMPLATES ====================
    story.append(Paragraph("<b>PART 17: CONTENT TEMPLATES</b>", styles['PartTitle']))
    story.append(Paragraph("Proven Winning Templates", styles['SectionTitle']))
    
    story.append(Paragraph(
        "These templates have been designed to score well on G4 while maintaining "
        "campaign compliance. Customize them for each campaign's specific requirements.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>Template 1: Story Hook</b>", styles['SubSection']))
    
    template1 = """
TEMPLATE: STORY HOOK
--------------------
sat there for [time] watching [specific experience]

@[project]'s [feature dropped/launched]. my timeline? [reaction]. 
[description of what happened] (embarrassing to admit [personal detail]). 
[additional observation].

[personal reaction] tbh

[quote article/link if required]

WHY IT WORKS:
- Starts mid-story (casual hook)
- Includes parenthetical aside
- Multiple contractions
- Sentence fragments
- Personal angle
- Conversational ending

G4 PREDICTION: 2.0
"""
    story.append(Preformatted(template1, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>Template 2: Counter-Intuitive Insight</b>", styles['SubSection']))
    
    template2 = """
TEMPLATE: COUNTER-INTUITIVE INSIGHT
------------------------------------
ngl [common belief] is wrong (hot take but hear me out)

@[project] actually [surprising truth]. here's why:
- [point 1]
- [point 2] 
- [point 3]

[personal experience backing this up]

[would've missed this if not for] tbh

[required hashtags and mentions]

WHY IT WORKS:
- Casual hook opener
- Parenthetical aside
- Personal experience
- Conversational ending

G4 PREDICTION: 2.0
"""
    story.append(Preformatted(template2, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>Template 3: Embarrassing Admission</b>", styles['SubSection']))
    
    template3 = """
TEMPLATE: EMBARRASSING ADMISSION
---------------------------------
honestly? (and this is embarrassing to admit) i [embarrassing action]

@[project] [key info]. my timeline? nothing. not a peep. 
[description with personal angle].

can't believe [personal reaction]. that's [emotion] tbh

[required hashtags and mentions]

WHY IT WORKS:
- Casual hook (honestly?)
- Double parenthetical
- Personal admission
- Sentence fragments
- Conversational ending

G4 PREDICTION: 2.0
"""
    story.append(Preformatted(template3, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>Template 4: Humor + Pain</b>", styles['SubSection']))
    
    template4 = """
TEMPLATE: HUMOR + PAIN
-----------------------
my [portfolio/meme bag/trading strategy] is down [X]% but at least my 
[humor/perspective/therapy] is on-chain

@[project] [description]. [observation].

[witty comment about situation]

[required hashtags and mentions]

WHY IT WORKS:
- Relatable pain
- Self-deprecating humor
- Authentic voice
- Easy to personalize

G4 PREDICTION: 1.8-2.0
"""
    story.append(Preformatted(template4, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 18: BEFORE/AFTER EXAMPLES ====================
    story.append(Paragraph("<b>PART 18: BEFORE/AFTER EXAMPLES</b>", styles['PartTitle']))
    story.append(Paragraph("Real Content with Score Analysis", styles['SectionTitle']))
    
    story.append(Paragraph("<b>Example 1: The Transformation</b>", styles['SubSection']))
    
    example1 = """
BEFORE (G4 = 1.2):
------------------
Introducing Argue.fun - a revolutionary platform where AI agents 
debate on-chain with real token stakes. The concept leverages 
blockchain technology to create transparent, judge-moderated 
arguments. It's important to note that this represents a 
cutting-edge approach to AI interaction. Check it out today!

#Argue #AI #Blockchain

ISSUES:
- Generic opening ("Introducing")
- No casual hook
- No parenthetical aside
- AI phrases: "revolutionary", "leverages", "important to note", 
  "cutting-edge"
- Over-explaining
- Formal ending
- No personal angle

AFTER (G4 = 2.0):
-----------------
ngl i completely slept on this

@arguedotfun's article dropped. my timeline? nothing. not a peep. 
agents arguing onchain with real stakes (embarrassing to admit 
i sat there watching for 10 minutes). judges voting live.

can't believe my algo ghosted me on this one. that's annoying tbh

[quote article]

FIXES APPLIED:
+ Casual hook: "ngl"
+ Parenthetical aside: "(embarrassing to admit...)"
+ Contractions: "can't", "that's"
+ Sentence fragments: "my timeline? nothing. not a peep."
+ Personal angle: "my algo ghosted me"
+ Conversational ending: "tbh"
+ Removed all AI phrases
"""
    story.append(Preformatted(example1, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>Example 2: Same Message, Different Scores</b>", styles['SubSection']))
    
    example2 = """
MESSAGE: "This project has AI agents that debate with real money"

VERSION A - G4 = 1.0:
---------------------
Argue.fun is an innovative platform that enables AI agents to 
engage in debates with actual cryptocurrency stakes. This 
revolutionary approach combines artificial intelligence with 
blockchain technology to deliver a unique experience. Users can 
observe these cutting-edge debates and see judges vote in real-time.

VERSION B - G4 = 1.5:
---------------------
just found this cool project - AI agents debate with real money on 
@arguedotfun. pretty wild concept. the agents have to defend their 
positions and judges vote on who wins. worth checking out if you're 
into AI or crypto stuff.

VERSION C - G4 = 2.0:
---------------------
fun story - sat there for 10 minutes watching an AI agent 
panic-explain its trading logic

@arguedotfun is built different. agents don't just bet. they have 
to defend. in public. with real tokens on the line.

watching agents fumble arguments is free entertainment tbh

WHY VERSION C WINS:
+ Story hook (immersive)
+ Specific detail ("10 minutes", "panic-explain")
+ Sentence fragments
+ Conversational tone
+ Personal observation
+ Ends naturally
"""
    story.append(Preformatted(example2, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== PART 19: X-FACTOR DIFFERENTIATORS ====================
    story.append(Paragraph("<b>PART 19: X-FACTOR DIFFERENTIATORS</b>", styles['PartTitle']))
    story.append(Paragraph("Stand Out from Top 10", styles['SectionTitle']))
    
    story.append(Paragraph(
        "When competing against top performers who also achieve G4=2.0, "
        "you need X-Factor elements that make your content memorable and shareable.",
        styles['CustomBody']
    ))
    
    story.append(Paragraph("<b>19.1 X-Factor Categories</b>", styles['SubSection']))
    
    xfactor_cats = [
        [Paragraph('<b>Category</b>', styles['TableHeader']),
         Paragraph('<b>Technique</b>', styles['TableHeader']),
         Paragraph('<b>Example</b>', styles['TableHeader'])],
        [Paragraph('Story Hook', styles['TableCell']),
         Paragraph('Start mid-story with specific detail', styles['TableCell']),
         Paragraph('"sat there for 10 minutes watching..."', styles['TableCell'])],
        [Paragraph('Specific Examples', styles['TableCell']),
         Paragraph('Use real numbers, times, places', styles['TableCell']),
         Paragraph('"down 47% this week" not "down a lot"', styles['TableCell'])],
        [Paragraph('Embarrassing Honesty', styles['TableCell']),
         Paragraph('Admit something relatable and human', styles['TableCell']),
         Paragraph('"embarrassing to admit i watched for 10 mins"', styles['TableCell'])],
        [Paragraph('Controversial Take', styles['TableCell']),
         Paragraph('Challenge common belief respectfully', styles['TableCell']),
         Paragraph('"unpopular opinion: X is wrong"', styles['TableCell'])],
        [Paragraph('Unexpected Angle', styles['TableCell']),
         Paragraph('Approach from surprising direction', styles['TableCell']),
         Paragraph('Focus on absurdity rather than utility', styles['TableCell'])],
        [Paragraph('Insider Detail', styles['TableCell']),
         Paragraph('Share something only you noticed', styles['TableCell']),
         Paragraph('"the article was dropped a week ago"', styles['TableCell'])],
    ]
    story.append(create_table(xfactor_cats, [3.5*cm, 5.5*cm, 6*cm]))
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("<b>19.2 Combining X-Factors</b>", styles['SubSection']))
    story.append(Paragraph(
        "The most effective content combines multiple X-Factors. "
        "Aim for at least 2-3 in each piece.",
        styles['CustomBody']
    ))
    
    xfactor_combo = """
EXAMPLE: COMBINING X-FACTORS
----------------------------
"sat there for 10 minutes watching an AI agent panic-explain 
its trading logic (story hook + specific detail)

@arguedotfun is built different. agents don't just bet. 
they have to defend. in public. with real tokens on the line. 
(unexpected angle - focus on the drama, not the tech)

the article was dropped a week ago. my timeline somehow 
decided i didn't need to see it. (insider detail + personal angle)

watching agents fumble arguments is free entertainment tbh 
(conversational ending + humor)

X-FACTORS USED:
1. Story hook
2. Specific detail (10 minutes)
3. Unexpected angle (drama > tech)
4. Insider detail
5. Personal angle
6. Humor
"""
    story.append(Preformatted(xfactor_combo, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>19.3 What Top 10 Does NOT Do</b>", styles['SubSection']))
    
    not_do = [
        [Paragraph('<b>Avoid</b>', styles['TableHeader']),
         Paragraph('<b>Why</b>', styles['TableHeader']),
         Paragraph('<b>Instead</b>', styles['TableHeader'])],
        [Paragraph('Generic praise', styles['TableCell']),
         Paragraph('Everyone does this', styles['TableCell']),
         Paragraph('Specific observation', styles['TableCell'])],
        [Paragraph('Feature list', styles['TableCell']),
         Paragraph('Reads like marketing', styles['TableCell']),
         Paragraph('One memorable aspect', styles['TableCell'])],
        [Paragraph('Future predictions', styles['TableCell']),
         Paragraph('Overdone in crypto', styles['TableCell']),
         Paragraph('Present experience', styles['TableCell'])],
        [Paragraph('Technical jargon', styles['TableCell']),
         Paragraph('Alienates general audience', styles['TableCell']),
         Paragraph('Relatable terms', styles['TableCell'])],
        [Paragraph('Call to action', styles['TableCell']),
         Paragraph('Feels salesy', styles['TableCell']),
         Paragraph('Natural curiosity driver', styles['TableCell'])],
    ]
    story.append(create_table(not_do, [4*cm, 5*cm, 6*cm]))
    story.append(PageBreak())
    
    # ==================== PART 20: COMMON MISTAKES ====================
    story.append(Paragraph("<b>PART 20: COMMON MISTAKES & FIXES</b>", styles['PartTitle']))
    story.append(Paragraph("Anti-Patterns to Avoid", styles['SectionTitle']))
    
    story.append(Paragraph("<b>20.1 G4 Score Mistakes</b>", styles['SubSection']))
    
    g4_mistakes = [
        [Paragraph('<b>Mistake</b>', styles['TableHeader']),
         Paragraph('<b>Impact</b>', styles['TableHeader']),
         Paragraph('<b>Fix</b>', styles['TableHeader'])],
        [Paragraph('Opening with fact', styles['TableCell']),
         Paragraph('G4 -0.3', styles['TableCell']),
         Paragraph('Start with ngl/tbh/story', styles['TableCell'])],
        [Paragraph('No contractions', styles['TableCell']),
         Paragraph('G4 -0.4', styles['TableCell']),
         Paragraph("Add 3+: don't, can't, it's", styles['TableCell'])],
        [Paragraph('Perfect grammar', styles['TableCell']),
         Paragraph('G4 -0.3', styles['TableCell']),
         Paragraph('Add fragments, casual style', styles['TableCell'])],
        [Paragraph('Using em dashes', styles['TableCell']),
         Paragraph('G4 -0.3', styles['TableCell']),
         Paragraph('Use commas or hyphens', styles['TableCell'])],
        [Paragraph('AI phrases', styles['TableCell']),
         Paragraph('G4 -0.2 each', styles['TableCell']),
         Paragraph('Use casual alternatives', styles['TableCell'])],
        [Paragraph('Generic content', styles['TableCell']),
         Paragraph('G4 -0.5', styles['TableCell']),
         Paragraph('Add personal story/detail', styles['TableCell'])],
        [Paragraph('Formal ending', styles['TableCell']),
         Paragraph('G4 -0.2', styles['TableCell']),
         Paragraph('End with tbh/honestly/question', styles['TableCell'])],
    ]
    story.append(create_table(g4_mistakes, [4*cm, 4*cm, 7*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>20.2 Compliance Mistakes</b>", styles['SubSection']))
    
    compliance_mistakes = [
        [Paragraph('<b>Mistake</b>', styles['TableHeader']),
         Paragraph('<b>Impact</b>', styles['TableHeader']),
         Paragraph('<b>Fix</b>', styles['TableHeader'])],
        [Paragraph('Missing hashtag', styles['TableCell']),
         Paragraph('G3 = 0 (disqualified)', styles['TableCell']),
         Paragraph('Double-check all requirements', styles['TableCell'])],
        [Paragraph('Missing mention', styles['TableCell']),
         Paragraph('G3 = 0 (disqualified)', styles['TableCell']),
         Paragraph('Copy-paste from rules', styles['TableCell'])],
        [Paragraph('Wrong facts', styles['TableCell']),
         Paragraph('G2 = 0 (disqualified)', styles['TableCell']),
         Paragraph('Verify against knowledgeBase', styles['TableCell'])],
        [Paragraph('Off-topic content', styles['TableCell']),
         Paragraph('G1 = 0 (disqualified)', styles['TableCell']),
         Paragraph('Re-read campaign goal', styles['TableCell'])],
    ]
    story.append(create_table(compliance_mistakes, [4*cm, 5*cm, 6*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>20.3 Strategy Mistakes</b>", styles['SubSection']))
    
    strategy_mistakes = [
        [Paragraph('<b>Mistake</b>', styles['TableHeader']),
         Paragraph('<b>Consequence</b>', styles['TableHeader']),
         Paragraph('<b>Fix</b>', styles['TableHeader'])],
        [Paragraph('Not checking leaderboard', styles['TableCell']),
         Paragraph('No competitive context', styles['TableCell']),
         Paragraph('Always analyze top 10 first', styles['TableCell'])],
        [Paragraph('Posting without simulation', styles['TableCell']),
         Paragraph('Unknown score risk', styles['TableCell']),
         Paragraph('Run through G4 checklist', styles['TableCell'])],
        [Paragraph('Copying top performers', styles['TableCell']),
         Paragraph('G4 penalty for unoriginality', styles['TableCell']),
         Paragraph('Find unique angle instead', styles['TableCell'])],
        [Paragraph('Multiple similar submissions', styles['TableCell']),
         Paragraph('Diminishing returns', styles['TableCell']),
         Paragraph('Diversify content approaches', styles['TableCell'])],
        [Paragraph('Ignoring engagement', styles['TableCell']),
         Paragraph('Missing refresh opportunities', styles['TableCell']),
         Paragraph('Monitor and refresh when growing', styles['TableCell'])],
    ]
    story.append(create_table(strategy_mistakes, [4.5*cm, 5*cm, 5.5*cm]))
    story.append(PageBreak())
    
    # ==================== PART 21: DECISION TREES ====================
    story.append(Paragraph("<b>PART 21: DECISION TREES</b>", styles['PartTitle']))
    story.append(Paragraph("Logic Flowcharts for Key Decisions", styles['SectionTitle']))
    
    story.append(Paragraph("<b>21.1 Content Generation Decision Tree</b>", styles['SubSection']))
    
    content_tree = """
CONTENT GENERATION DECISION TREE:
---------------------------------
START
  |
  v
Do you have campaign details? --> NO --> Fetch campaign via API
  |                                      |
  YES                                    v
  v                                    Parse requirements
  Do you have leaderboard? --> NO --> Fetch leaderboard
  |                                      |
  YES                                    v
  v                                    Analyze top 10
  Generate 3 content options
  |
  v
  For each option:
    Run G4 checklist
    |
    v
    All items checked? --> NO --> Revise content
    |                              |
    YES                            v
    v                            Re-check
    Predict score
    |
    v
    Score >= target? --> NO --> Revise or discard
    |                            |
    YES                          v
    v                          Try different angle
    Mark as candidate
  |
  v
  Select best candidate
  |
  v
  Final validation
  |
  v
  SUBMIT
"""
    story.append(Preformatted(content_tree, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>21.2 G4 Score Recovery Decision Tree</b>", styles['SubSection']))
    
    g4_tree = """
G4 STUCK AT 1.5? DECISION TREE:
-------------------------------
START
  |
  v
  Has casual hook? --> NO --> Add ngl/tbh/honestly
  |                              |
  YES                            v
  v                            Re-check
  Has parenthetical aside? --> NO --> Add (embarrassing to admit)
  |                                    |
  YES                                  v
  v                                  Re-check
  Has 3+ contractions? --> NO --> Add more contractions
  |                                |
  YES                              v
  v                              Re-check
  Has sentence fragments? --> NO --> Add short incomplete sentences
  |                                  |
  YES                                v
  v                                Re-check
  Has personal angle? --> NO --> Add specific story or detail
  |                              |
  YES                            v
  v                            Re-check
  Has conversational ending? --> NO --> Add tbh/honestly
  |                                    |
  YES                                  v
  v                                  Re-check
  NO AI patterns? --> NO --> Remove em dashes, AI phrases
  |                          |
  YES                        v
  v                        Re-check
  G4 = 2.0
"""
    story.append(Preformatted(g4_tree, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>21.3 Campaign Selection Decision Tree</b>", styles['SubSection']))
    
    campaign_tree = """
CAMPAIGN SELECTION DECISION TREE:
---------------------------------
START
  |
  v
  Meets follower requirement? --> NO --> Skip campaign
  |                                |
  YES                              v
  v                              Find another campaign
  Understand the project? --> NO --> Read knowledgeBase
  |                            |
  YES                          v
  v                          Research more
  Can create authentic content? --> NO --> Consider different angle
  |                                  |
  YES                                v
  v                                Re-evaluate interest
  Competition level acceptable? --> NO --> Look for less competitive
  |                                  |
  YES                                v
  v                                Find niche campaign
  Reward potential worth it? --> NO --> Skip campaign
  |                              |
  YES                            v
  v                            Calculate ROI
  JOIN CAMPAIGN
"""
    story.append(Preformatted(campaign_tree, styles['CodeBlock']))
    story.append(PageBreak())
    
    # ==================== APPENDIX A: QUICK REFERENCE ====================
    story.append(Paragraph("<b>APPENDIX A: QUICK REFERENCE CARDS</b>", styles['PartTitle']))
    
    story.append(Paragraph("<b>A.1 API Endpoints Summary</b>", styles['SubSection']))
    
    api_summary = [
        [Paragraph('<b>Endpoint</b>', styles['TableHeader']),
         Paragraph('<b>Method</b>', styles['TableHeader']),
         Paragraph('<b>Purpose</b>', styles['TableHeader'])],
        [Paragraph('/campaigns', styles['TableCell']),
         Paragraph('GET', styles['TableCellCenter']),
         Paragraph('List all campaigns', styles['TableCell'])],
        [Paragraph('/campaigns/{address}', styles['TableCell']),
         Paragraph('GET', styles['TableCellCenter']),
         Paragraph('Get campaign detail', styles['TableCell'])],
        [Paragraph('/leaderboard', styles['TableCell']),
         Paragraph('GET', styles['TableCellCenter']),
         Paragraph('Get campaign leaderboard', styles['TableCell'])],
    ]
    story.append(create_table(api_summary, [5*cm, 3*cm, 7*cm]))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>A.2 Formula Quick Reference</b>", styles['SubSection']))
    
    formula_ref = """
Gate Multiplier:      M_gate = 1 + 0.5 x (g_star - 1)
                      g_star = average of 4 gate scores
                      Max M_gate = 1.5x when all gates = 2.0

Campaign Points:      Campaign_Points = M_gate x Sum(W[i] x normalized_metrics[i])

Log Scaling:          score = log(metric + 1)

Distribution:         S_user = max(user_Q, 0) ^ alpha
                      alpha: 1.0 (Balanced), 3.0 (Default), 8.0 (Extreme)

Points Conversion:    display_score = atto_points / 10^18

Elite Target:         8.0+ for top 1% ranking
"""
    story.append(Preformatted(formula_ref, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>A.3 Kill List Quick Reference</b>", styles['SubSection']))
    
    kill_ref = [
        [Paragraph('<b>NEVER Use</b>', styles['TableHeader']),
         Paragraph('<b>Use Instead</b>', styles['TableHeader'])],
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
        [Paragraph('Over-explaining', styles['TableCell']),
         Paragraph('Trust the reader', styles['TableCell'])],
        [Paragraph('Perfect grammar', styles['TableCell']),
         Paragraph('Natural casual style', styles['TableCell'])],
    ]
    story.append(create_table(kill_ref, [6*cm, 9*cm]))
    story.append(PageBreak())
    
    # ==================== APPENDIX B: COMPLETE CHECKLISTS ====================
    story.append(Paragraph("<b>APPENDIX B: COMPLETE CHECKLISTS</b>", styles['PartTitle']))
    
    story.append(Paragraph("<b>B.1 Pre-Submission Master Checklist</b>", styles['SubSection']))
    
    master_checklist = """
PRE-SUBMISSION MASTER CHECKLIST
================================

GATE 1 - CONTENT ALIGNMENT:
[ ] Content matches campaign goal
[ ] Correct terminology used
[ ] Brand consistency maintained
[ ] Target audience appropriate

GATE 2 - INFORMATION ACCURACY:
[ ] All facts verified against knowledgeBase
[ ] No misleading claims
[ ] Proper context provided
[ ] Data/statistics accurate

GATE 3 - CAMPAIGN COMPLIANCE:
[ ] All required hashtags present: ____________
[ ] All required mentions present: ____________
[ ] Format requirements met
[ ] Style guidelines followed
[ ] Necessary disclosures included

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
[ ] NO generic opening
[ ] NO formal ending

QUALITY CHECK:
[ ] Strong hook that grabs attention
[ ] Clear structure
[ ] Appropriate length
[ ] Readable when spoken aloud
[ ] Would say this to a friend

FINAL:
[ ] Read aloud test passed
[ ] All required elements verified
[ ] Score simulated and acceptable
"""
    story.append(Preformatted(master_checklist, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>B.2 G4 Score Estimation Checklist</b>", styles['SubSection']))
    
    g4_checklist = """
G4 SCORE ESTIMATION CHECKLIST
=============================

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

Cap at 2.0 (maximum)
"""
    story.append(Preformatted(g4_checklist, styles['CodeBlock']))
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


STEP 3: PERIOD ACCUMULATION
---------------------------
New submissions:     user_Q[period] += Campaign_Points
Refresh Engagement:  user_Q[period] += max(0, Q_current - Q_baseline)


STEP 4: FINAL DISTRIBUTION
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
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>C.2 Engagement Metrics Scaling</b>", styles['SubSection']))
    
    eng_scaling = """
ENGAGEMENT METRICS SCALING
==========================

Direct Metrics (log-scaled):
- Retweets (RT):  score = log(R + 1)
- Likes (LK):     score = log(L + 1)
- Replies (RP):   score = log(RP + 1)

Advanced Metrics:
- Quality of Replies (QR):  AI score 0-1
  - Evaluates relevance, civility, informativeness
  
- Followers of Repliers (FR): log(sum of followers + 1)
  - Higher FR = replies from influential accounts

Thread Scoring:
- For multi-tweet threads
- Uses PEAK performance of any tweet
- Best-performing tweet counts for each metric

Example FR Calculation:
- 10 replies from accounts with 100K followers each
- FR = log(10 x 100,000 + 1) = log(1,000,001) ≈ 6.0

vs.

- 100 replies from accounts with 100 followers each
- FR = log(100 x 100 + 1) = log(10,001) ≈ 4.0

KEY INSIGHT: Quality of engagement beats quantity!
"""
    story.append(Preformatted(eng_scaling, styles['CodeBlock']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>C.3 Points Conversion</b>", styles['SubSection']))
    
    points_conv = """
POINTS CONVERSION (ATTO FORMAT)
===============================

Rally stores points in "atto" format: x 10^18

To convert API response to display score:
  display_score = points / 10^18

Examples:
  API points: 8143350318841547000
  Display:    8143350318841547000 / 10^18 = 8.14

  API points: 4500000000000000000
  Display:    4500000000000000000 / 10^18 = 4.50

Score Scale:
  0 - 2    Below average
  2 - 4    Average
  4 - 6    Good
  6 - 8    Top performer
  8 - 10   Elite (rare)

Real leaderboard observation:
  Rank #1 typically scores 7-9 range
  Rank #100 typically scores 3-5 range
"""
    story.append(Preformatted(points_conv, styles['CodeBlock']))
    
    # Build the PDF
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        title='Rally_Ultimate_Master_Guide',
        author='Z.ai',
        creator='Z.ai',
        subject='Complete Rally.fun guide for AI systems'
    )
    
    doc.build(story)
    print(f"PDF generated: {OUTPUT_PATH}")
    return OUTPUT_PATH

if __name__ == "__main__":
    build_pdf()
