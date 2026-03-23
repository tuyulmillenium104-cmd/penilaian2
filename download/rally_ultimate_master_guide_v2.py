#!/usr/bin/env python3
"""
RALLY.FUN ULTIMATE MASTER GUIDE v2
Complete guide for content creation with G4 Originality & X-Factor Differentiators
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

OUTPUT_PATH = '/home/z/my-project/download/RALLY-FUN-ULTIMATE-MASTER-GUIDE-v2.pdf'

def get_styles():
    styles = getSampleStyleSheet()
    
    styles.add(ParagraphStyle('CoverTitle', fontName='Times New Roman', fontSize=38, 
        leading=46, alignment=TA_CENTER, spaceAfter=20))
    styles.add(ParagraphStyle('CoverSubtitle', fontName='Times New Roman', fontSize=18, 
        leading=24, alignment=TA_CENTER, spaceAfter=12))
    styles.add(ParagraphStyle('ChapterTitle', fontName='Times New Roman', fontSize=20, 
        leading=26, alignment=TA_LEFT, spaceBefore=20, spaceAfter=12, 
        textColor=colors.HexColor('#1F4E79')))
    styles.add(ParagraphStyle('SectionTitle', fontName='Times New Roman', fontSize=14, 
        leading=18, alignment=TA_LEFT, spaceBefore=14, spaceAfter=8,
        textColor=colors.HexColor('#2E75B6')))
    styles.add(ParagraphStyle('SubsectionTitle', fontName='Times New Roman', fontSize=12, 
        leading=15, alignment=TA_LEFT, spaceBefore=10, spaceAfter=6,
        textColor=colors.HexColor('#404040')))
    styles.add(ParagraphStyle('Body', fontName='Times New Roman', fontSize=10, 
        leading=14, alignment=TA_JUSTIFY, spaceBefore=3, spaceAfter=6))
    styles.add(ParagraphStyle('TableHeader', fontName='Times New Roman', fontSize=9, 
        leading=12, alignment=TA_CENTER, textColor=colors.white))
    styles.add(ParagraphStyle('TableCell', fontName='Times New Roman', fontSize=9, 
        leading=12, alignment=TA_LEFT))
    styles.add(ParagraphStyle('TableCellCenter', fontName='Times New Roman', fontSize=9, 
        leading=12, alignment=TA_CENTER))
    
    return styles

def table_style():
    return TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Times New Roman'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ])

def build_pdf():
    doc = SimpleDocTemplate(OUTPUT_PATH, pagesize=A4,
        rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm,
        title='RALLY-FUN-ULTIMATE-MASTER-GUIDE-v2', author='Z.ai', creator='Z.ai',
        subject='Complete guide for Rally.fun content creation')
    
    styles = get_styles()
    story = []
    
    # Cover
    story.append(Spacer(1, 3*cm))
    story.append(Paragraph('<b>RALLY.FUN</b>', styles['CoverTitle']))
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph('<b>ULTIMATE MASTER GUIDE</b>', styles['CoverTitle']))
    story.append(Spacer(1, 1*cm))
    story.append(Paragraph('Version 2.0', styles['CoverSubtitle']))
    story.append(Paragraph('Complete Content Creation System', styles['CoverSubtitle']))
    story.append(Paragraph('with G4 Originality & X-Factor Differentiators', styles['CoverSubtitle']))
    story.append(Spacer(1, 2*cm))
    
    features = ['141-Point Scoring System', '6-Judge Evaluation Process', 'G4 Originality Elements',
                'X-Factor Differentiators', 'Forbidden Punctuation Detection', 'Gate Multiplier Formula']
    for f in features:
        story.append(Paragraph(f'<bullet>&bull;</bullet> {f}', 
            ParagraphStyle('Feature', fontName='Times New Roman', fontSize=11, alignment=TA_CENTER)))
    
    story.append(Spacer(1, 3*cm))
    story.append(Paragraph('Workflow Version: v9.8.2', styles['CoverSubtitle']))
    story.append(PageBreak())
    
    # Chapter 1: Introduction
    story.append(Paragraph('<b>1. Introduction to Rally.fun</b>', styles['ChapterTitle']))
    story.append(Paragraph('''
    Rally.fun is a decentralized content creation platform where creators compete to produce 
    the highest-quality content for various campaigns. This Ultimate Master Guide provides 
    everything you need to create winning content, including the complete 141-point scoring system, 
    G4 Originality elements, and X-Factor differentiators introduced in v9.8.2.
    ''', styles['Body']))
    
    story.append(Paragraph('<b>Key Concepts</b>', styles['SectionTitle']))
    
    concepts = [
        ['Concept', 'Description'],
        ['Gate System', 'Two main gates (Utama & Tambahan) that must be passed'],
        ['G4 Originality', '5 elements: casual hook, parenthetical aside, contractions, personal angle, conversational ending'],
        ['X-Factor', '5 differentiators: specific numbers, time specificity, embarrassing honesty, insider detail, unexpected angle'],
        ['Compliance', '11-point validation including forbidden punctuation check'],
        ['Gate Multiplier', 'Formula M = 1 + 0.5 x (g* - 1), up to +50% bonus'],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCell']) 
        for c in row] for i, row in enumerate(concepts)], colWidths=[3*cm, 12*cm])
    t.setStyle(table_style())
    story.append(t)
    story.append(PageBreak())
    
    # Chapter 2: Scoring System
    story.append(Paragraph('<b>2. Scoring System Overview (141 Points)</b>', styles['ChapterTitle']))
    story.append(Paragraph('''
    The Rally.fun scoring system uses a comprehensive 141-point scale across six judges. 
    All thresholds must be met for content to be accepted.
    ''', styles['Body']))
    
    scores = [
        ['Judge', 'Category', 'Max', 'Pass'],
        ['1', 'Gate Utama', '24', '19'],
        ['2', 'Gate Tambahan', '16', '12'],
        ['3', 'Penilaian Internal', '60', '54'],
        ['4', 'Compliance Check', '11', '11 (all)'],
        ['5', 'Fact Check', '5', '4'],
        ['6', 'Uniqueness', '25', '20'],
        ['TOTAL', '', '141', ''],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCellCenter']) 
        for c in row] for i, row in enumerate(scores)], colWidths=[2*cm, 4*cm, 2*cm, 3*cm])
    t.setStyle(table_style())
    story.append(t)
    story.append(PageBreak())
    
    # Chapter 3: G4 Originality
    story.append(Paragraph('<b>3. G4 Originality Elements</b>', styles['ChapterTitle']))
    story.append(Paragraph('''
    G4 Originality determines whether content sounds authentically human. Include 4+ of the 5 elements 
    for maximum scoring. Each element adds weight to your originality score.
    ''', styles['Body']))
    
    story.append(Paragraph('<b>1. Casual Hook Opening</b>', styles['SubsectionTitle']))
    story.append(Paragraph('''
    Good: "ngl i spent 25 minutes just watching this", "tbh didn't expect this to work", 
    "fun story - i almost scrolled past this"<br/>
    Bad: "Unpopular opinion:", "In today's digital landscape", "Here's the thing"
    ''', styles['Body']))
    
    story.append(Paragraph('<b>2. Parenthetical Aside</b>', styles['SubsectionTitle']))
    story.append(Paragraph('''
    Examples: "(and this is embarrassing to admit)", "(just saying)", "(not gonna lie)", "(for real though)"
    ''', styles['Body']))
    
    story.append(Paragraph('<b>3. Contractions (3+ Required)</b>', styles['SubsectionTitle']))
    story.append(Paragraph('''
    Use: don't, can't, it's, I'm, won't, wouldn't, let's, that's, what's, isn't, haven't
    ''', styles['Body']))
    
    story.append(Paragraph('<b>4. Personal Angle</b>', styles['SubsectionTitle']))
    story.append(Paragraph('''
    Examples: "i sat there for 25 minutes just watching", "my jaw actually dropped", 
    "went from 68% confident to sweating bullets"
    ''', styles['Body']))
    
    story.append(Paragraph('<b>5. Conversational Ending</b>', styles['SubsectionTitle']))
    story.append(Paragraph('''
    Good: "tbh worth checking out", "what do you think?", "just saying"<br/>
    Bad: "In conclusion", "To summarize", "Overall", "Ultimately"
    ''', styles['Body']))
    
    story.append(Paragraph('<b>G4 Scoring</b>', styles['SectionTitle']))
    
    g4_scores = [
        ['Score', 'Requirement'],
        ['4', 'Has 4+ G4 elements present'],
        ['3', 'Has 3 G4 elements present'],
        ['2', 'Has 1-2 G4 elements'],
        ['1', 'No G4 elements, sounds AI-generated'],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCellCenter']) 
        for c in row] for i, row in enumerate(g4_scores)], colWidths=[2*cm, 10*cm])
    t.setStyle(table_style())
    story.append(t)
    story.append(PageBreak())
    
    # Chapter 4: X-Factor
    story.append(Paragraph('<b>4. X-Factor Differentiators</b>', styles['ChapterTitle']))
    story.append(Paragraph('''
    X-Factors set your content apart from competitors. Include 3+ of the 5 X-Factors for maximum scoring.
    ''', styles['Body']))
    
    story.append(Paragraph('<b>1. Specific Numbers</b>', styles['SubsectionTitle']))
    story.append(Paragraph('''
    Bad: "down a lot" | Good: "down 47%"<br/>
    Bad: "millions of users" | Good: "2.3M users"<br/>
    Bad: "significant growth" | Good: "3.5x growth"
    ''', styles['Body']))
    
    story.append(Paragraph('<b>2. Time Specificity</b>', styles['SubsectionTitle']))
    story.append(Paragraph('''
    Bad: "watched for a while" | Good: "watched for 25 minutes"<br/>
    Bad: "took a long time" | Good: "took 3 hours"
    ''', styles['Body']))
    
    story.append(Paragraph('<b>3. Embarrassing Honesty</b>', styles['SubsectionTitle']))
    story.append(Paragraph('''
    Examples: "embarrassing to admit i watched for 25 mins", "not proud of how long i spent", 
    "hate to say it but i was skeptical at first"
    ''', styles['Body']))
    
    story.append(Paragraph('<b>4. Insider Detail</b>', styles['SubsectionTitle']))
    story.append(Paragraph('''
    Examples: "went from 68% to sweating bullets", "watched the counter go from 12 to 847 in like 3 minutes", 
    "refreshed the page 47 times (yes i counted)"
    ''', styles['Body']))
    
    story.append(Paragraph('<b>5. Unexpected Angle</b>', styles['SubsectionTitle']))
    story.append(Paragraph('''
    - Focus on entertainment value instead of utility<br/>
    - Talk about what went wrong instead of what went right<br/>
    - Take the contrarian view on a popular opinion
    ''', styles['Body']))
    story.append(PageBreak())
    
    # Chapter 5: Forbidden Elements
    story.append(Paragraph('<b>5. Forbidden Elements (AI Indicators)</b>', styles['ChapterTitle']))
    story.append(Paragraph('''
    These elements trigger automatic penalties or failures. Avoid them entirely.
    ''', styles['Body']))
    
    story.append(Paragraph('<b>Forbidden Punctuation</b>', styles['SectionTitle']))
    
    forbidden_punct = [
        ['Element', 'Characters', 'Replace With'],
        ['Em Dashes', '- - --', 'Hyphen (-) or comma'],
        ['Smart Quotes', '" " \' \'', 'Straight quotes (" \')'],
        ['Ellipsis Char', '...', 'Three dots (...)'],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCell']) 
        for c in row] for i, row in enumerate(forbidden_punct)], colWidths=[3*cm, 4*cm, 5*cm])
    t.setStyle(table_style())
    story.append(t)
    
    story.append(Paragraph('<b>Forbidden AI Phrases</b>', styles['SectionTitle']))
    story.append(Paragraph('''
    <b>Words:</b> delve, leverage, realm, tapestry, paradigm, landscape, nuance, underscores, 
    pivotal, crucial, embark, journey, explore, unlock, harness<br/><br/>
    <b>Phrases:</b> "picture this", "let's dive in", "in this thread", "key takeaways", 
    "imagine a world", "it goes without saying", "at the end of the day"
    ''', styles['Body']))
    
    story.append(Paragraph('<b>Forbidden Template Openings</b>', styles['SectionTitle']))
    story.append(Paragraph('''
    Never use: "Unpopular opinion:", "Hot take:", "Thread alert:", "Breaking:", 
    "This is your sign", "PSA:", "Reminder that", "Quick thread:", 
    "Hear me out", "Let me explain", "Nobody is talking about", "Story time:"
    ''', styles['Body']))
    story.append(PageBreak())
    
    # Chapter 6: Gate Multiplier
    story.append(Paragraph('<b>6. Gate Multiplier Formula</b>', styles['ChapterTitle']))
    story.append(Paragraph('''
    <b>M<sub>gate</sub> = 1 + 0.5 x (g<sub>*</sub> - 1)</b><br/><br/>
    Where g<sub>*</sub> = average of G1, G2, G3, G4 scores (normalized to 0-2 scale)
    ''', styles['Body']))
    
    multiplier_table = [
        ['Gate Average', 'g*', 'Multiplier', 'Bonus', 'Status'],
        ['All gates = 2.0', '2.0', '1.5x', '+50%', 'MAXIMUM'],
        ['All gates = 1.75', '1.75', '1.375x', '+37.5%', 'EXCELLENT'],
        ['All gates = 1.5', '1.5', '1.25x', '+25%', 'GOOD'],
        ['All gates = 1.0', '1.0', '1.0x', '0%', 'BASELINE'],
        ['Any gate = 0', '0', '0.5x', '-50%', 'DISQUALIFIED'],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCellCenter']) 
        for c in row] for i, row in enumerate(multiplier_table)], 
        colWidths=[3*cm, 2*cm, 2*cm, 2*cm, 3*cm])
    t.setStyle(table_style())
    story.append(t)
    story.append(PageBreak())
    
    # Chapter 7: Judge Breakdown
    story.append(Paragraph('<b>7. Judge Scoring Breakdown</b>', styles['ChapterTitle']))
    
    story.append(Paragraph('<b>7.1 Judge 1: Gate Utama (24 Points)</b>', styles['SectionTitle']))
    
    j1 = [
        ['Criterion', 'Max', 'What to Achieve'],
        ['Hook Quality', '4', 'Opens with casual hook, grabs attention'],
        ['Emotional Impact', '4', 'Evokes 3+ distinct emotions'],
        ['Body Feeling', '4', 'Reader can FEEL the sensation'],
        ['CTA Quality', '4', 'Natural conversational CTA'],
        ['URL Presence', '4', 'URL integrated naturally'],
        ['G4 Originality', '4', 'Has 4+ G4 elements'],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCell']) 
        for c in row] for i, row in enumerate(j1)], colWidths=[3*cm, 1.5*cm, 9*cm])
    t.setStyle(table_style())
    story.append(t)
    story.append(Paragraph('<b>Forbidden Elements Penalty:</b> -1 point per forbidden element', styles['Body']))
    
    story.append(Paragraph('<b>7.2 Judge 2: Gate Tambahan (16 Points)</b>', styles['SectionTitle']))
    
    j2 = [
        ['Criterion', 'Max', 'What to Achieve'],
        ['Fact Quality', '4', 'Evidence layers with SPECIFIC NUMBERS'],
        ['Engagement Hook', '4', 'Invites replies with embarrassing honesty'],
        ['Readability', '4', 'Easy to read, uses contractions naturally'],
        ['X-Factor Diff.', '4', 'Has 4+ X-Factors'],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCell']) 
        for c in row] for i, row in enumerate(j2)], colWidths=[3*cm, 1.5*cm, 9*cm])
    t.setStyle(table_style())
    story.append(t)
    
    story.append(Paragraph('<b>7.3 Judge 3: Penilaian Internal (60 Points)</b>', styles['SectionTitle']))
    
    j3 = [
        ['Criterion', 'Max', 'What to Achieve'],
        ['Content Depth', '10', 'Multiple layers, deep analysis'],
        ['Story Quality', '10', 'Compelling narrative, strong arc'],
        ['Audience Fit', '10', 'Matches target audience needs'],
        ['Emotion Variety', '10', '5+ distinct emotions'],
        ['Evidence Layering', '10', 'All 4 layers: macro, case, personal, expert'],
        ['Anti-Template', '10', 'Completely original, natural flow'],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCell']) 
        for c in row] for i, row in enumerate(j3)], colWidths=[3*cm, 1.5*cm, 9*cm])
    t.setStyle(table_style())
    story.append(t)
    story.append(PageBreak())
    
    story.append(Paragraph('<b>7.4 Judge 4: Compliance Check (11 Checks)</b>', styles['SectionTitle']))
    story.append(Paragraph('ALL 11 checks must pass for content to be accepted.', styles['Body']))
    
    j4 = [
        ['#', 'Check', 'Pass Requirement'],
        ['1', 'Description Alignment', 'Content relates to campaign'],
        ['2', 'Style Compliance', 'Follows style requirements'],
        ['3', 'Knowledge Base Usage', 'Uses knowledge base info'],
        ['4', 'Campaign Rules', 'Follows all rules'],
        ['5', 'Required URL', 'URL included'],
        ['6', 'No Banned Words', 'No promotional language'],
        ['7', 'No AI Patterns', 'Doesn\'t sound AI-generated'],
        ['8', 'No Forbidden Punctuation', 'No em dashes/smart quotes'],
        ['9', 'Evidence Depth', 'Sufficient evidence with numbers'],
        ['10', 'Anti-Template', 'Has G4 elements'],
        ['11', 'Quality Threshold', 'Meets standards with X-Factors'],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCellCenter'] if j==0 else styles['TableCell']) 
        for j, c in enumerate(row)] for i, row in enumerate(j4)], colWidths=[1*cm, 4*cm, 8*cm])
    t.setStyle(table_style())
    story.append(t)
    
    story.append(Paragraph('<b>7.5 Judge 5: Fact Check (5 Points)</b>', styles['SectionTitle']))
    story.append(Paragraph('Claim Accuracy (5 pts): All claims verified, accurate, well-supported', styles['Body']))
    
    story.append(Paragraph('<b>7.6 Judge 6: Uniqueness (25 Points)</b>', styles['SectionTitle']))
    
    j6 = [
        ['Criterion', 'Max', 'What to Achieve'],
        ['Differentiation', '7.5', 'Different from competitors'],
        ['Unique Angle', '5', 'Fresh perspective'],
        ['Emotion Uniqueness', '5', 'Rare emotion combo'],
        ['Template Avoidance', '5', 'No template patterns'],
        ['Rare Combo Bonus', '+2.5', 'Bonus for rare emotions'],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCell']) 
        for c in row] for i, row in enumerate(j6)], colWidths=[3*cm, 1.5*cm, 9*cm])
    t.setStyle(table_style())
    story.append(t)
    story.append(Paragraph('<b>Similarity Penalty:</b> -5 points if similarity > 70%', styles['Body']))
    story.append(PageBreak())
    
    # Chapter 8: Pre-Submission Checklist
    story.append(Paragraph('<b>8. Pre-Submission Validation Checklist</b>', styles['ChapterTitle']))
    
    story.append(Paragraph('<b>G4 Originality Checklist</b>', styles['SectionTitle']))
    story.append(Paragraph('''
    [ ] Opens with casual hook (ngl, tbh, honestly)?<br/>
    [ ] Has parenthetical aside?<br/>
    [ ] Uses 3+ contractions?<br/>
    [ ] Has personal angle?<br/>
    [ ] Ends with conversational tone?
    ''', styles['Body']))
    
    story.append(Paragraph('<b>X-Factor Checklist</b>', styles['SectionTitle']))
    story.append(Paragraph('''
    [ ] Includes specific numbers?<br/>
    [ ] Has time specificity?<br/>
    [ ] Shows embarrassing honesty?<br/>
    [ ] Has insider detail?<br/>
    [ ] Has unexpected angle?
    ''', styles['Body']))
    
    story.append(Paragraph('<b>Forbidden Elements Check</b>', styles['SectionTitle']))
    story.append(Paragraph('''
    [ ] NO em dashes?<br/>
    [ ] NO smart quotes?<br/>
    [ ] NO AI phrases?<br/>
    [ ] NO template openings?<br/>
    [ ] NO formal endings?
    ''', styles['Body']))
    
    story.append(Paragraph('<b>Compliance Checklist</b>', styles['SectionTitle']))
    story.append(Paragraph('''
    [ ] Campaign URL included?<br/>
    [ ] Matches campaign description?<br/>
    [ ] Follows campaign style?<br/>
    [ ] Uses knowledge base correctly?<br/>
    [ ] No banned words?
    ''', styles['Body']))
    story.append(PageBreak())
    
    # Chapter 9: Quick Reference
    story.append(Paragraph('<b>9. Quick Reference Cards</b>', styles['ChapterTitle']))
    
    story.append(Paragraph('<b>G4 Originality Quick Reference</b>', styles['SectionTitle']))
    
    g4_ref = [
        ['Element', 'Keywords/Examples', 'Weight'],
        ['Casual Hook', 'ngl, tbh, honestly, fun story', '+0.15'],
        ['Parenthetical', '(embarrassing to admit), (just saying)', '+0.15'],
        ['Contractions', "don't, can't, it's, I'm (need 3+)", '+0.20'],
        ['Personal Angle', 'I, my, me with experience', '+0.20'],
        ['Conversational End', 'tbh, worth checking, just saying', '+0.15'],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCell']) 
        for c in row] for i, row in enumerate(g4_ref)], colWidths=[3*cm, 7*cm, 2*cm])
    t.setStyle(table_style())
    story.append(t)
    
    story.append(Paragraph('<b>X-Factor Quick Reference</b>', styles['SectionTitle']))
    
    xf_ref = [
        ['X-Factor', 'Bad Example', 'Good Example'],
        ['Specific Numbers', 'down a lot', 'down 47%'],
        ['Time Specificity', 'watched for a while', 'watched for 25 minutes'],
        ['Embarrassing Honesty', '-', 'embarrassing to admit i watched'],
        ['Insider Detail', '-', 'went from 68% to sweating bullets'],
        ['Unexpected Angle', '-', 'focus on what went wrong'],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCell']) 
        for c in row] for i, row in enumerate(xf_ref)], colWidths=[3*cm, 4.5*cm, 5*cm])
    t.setStyle(table_style())
    story.append(t)
    
    story.append(Paragraph('<b>Forbidden Elements Quick Reference</b>', styles['SectionTitle']))
    
    forbid_ref = [
        ['Type', 'Forbidden', 'Replace With'],
        ['Punctuation', '- - -- (em dashes)', '- (hyphen) or , (comma)'],
        ['Punctuation', '" " \' \' (smart quotes)', '" \' (straight quotes)'],
        ['Words', 'delve, leverage, realm, tapestry', '(remove entirely)'],
        ['Openings', 'Unpopular opinion, Hot take', 'ngl, tbh, fun story'],
        ['Endings', 'In conclusion, To summarize', 'tbh, worth checking'],
    ]
    
    t = Table([[Paragraph(c, styles['TableHeader'] if i==0 else styles['TableCell']) 
        for c in row] for i, row in enumerate(forbid_ref)], colWidths=[2.5*cm, 5*cm, 5*cm])
    t.setStyle(table_style())
    story.append(t)
    
    story.append(Spacer(1, 1*cm))
    story.append(Paragraph('''
    <b>Remember:</b> Target to beat the Top 10. Maximum effort. Accept any result and learn. 
    This guide provides all the tools you need to create winning content on Rally.fun.
    ''', styles['Body']))
    
    doc.build(story)
    print(f"PDF created successfully: {OUTPUT_PATH}")

if __name__ == '__main__':
    build_pdf()
