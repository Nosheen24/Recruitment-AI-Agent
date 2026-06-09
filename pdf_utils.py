"""
PDF generation helpers using ReportLab.
Produces professional resume and screening-report PDFs.
"""

import io
import re

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer,
    HRFlowable, Table, TableStyle, KeepTogether,
)

# ── Colour palette ─────────────────────────────────────────────────────────────
INDIGO      = HexColor('#6366f1')
INDIGO_DARK = HexColor('#4f46e5')
SLATE_900   = HexColor('#0f172a')
SLATE_700   = HexColor('#334155')
SLATE_500   = HexColor('#64748b')
SLATE_400   = HexColor('#94a3b8')
SLATE_200   = HexColor('#e2e8f0')
SLATE_50    = HexColor('#f8fafc')
EMERALD     = HexColor('#10b981')
RED         = HexColor('#ef4444')
AMBER       = HexColor('#f59e0b')
SKY         = HexColor('#0ea5e9')


def _inline(text: str) -> str:
    """Convert **bold** markdown to ReportLab XML bold tags."""
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'_(.+?)_', r'<i>\1</i>', text)
    # Escape bare ampersands that aren't already entities
    text = re.sub(r'&(?!(?:amp|lt|gt|quot|apos);)', '&amp;', text)
    return text


# ── ─────────────────────────────────────────────────────────────────────────
#   RESUME  PDF
# ── ─────────────────────────────────────────────────────────────────────────

def generate_resume_pdf(markdown_text: str) -> bytes:
    """Convert the AI-generated markdown resume to a polished A4 PDF."""
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=A4,
        leftMargin=2.2*cm, rightMargin=2.2*cm,
        topMargin=2.0*cm, bottomMargin=2.0*cm,
        title="Improved Resume",
    )

    # ── Styles ────────────────────────────────────────────────────────────────
    S = {
        'name': ParagraphStyle(
            'name',
            fontName='Helvetica-Bold', fontSize=22,
            textColor=SLATE_900, alignment=TA_CENTER, spaceAfter=3,
        ),
        'contact': ParagraphStyle(
            'contact',
            fontName='Helvetica', fontSize=9,
            textColor=SLATE_500, alignment=TA_CENTER, spaceAfter=4,
        ),
        'h2': ParagraphStyle(
            'h2',
            fontName='Helvetica-Bold', fontSize=10,
            textColor=INDIGO_DARK, spaceBefore=12, spaceAfter=2,
            leftIndent=0,
        ),
        'h3': ParagraphStyle(
            'h3',
            fontName='Helvetica-Bold', fontSize=9.5,
            textColor=SLATE_700, spaceBefore=6, spaceAfter=2,
        ),
        'body': ParagraphStyle(
            'body',
            fontName='Helvetica', fontSize=9.5,
            textColor=SLATE_700, leading=14, spaceAfter=3,
        ),
        'bullet': ParagraphStyle(
            'bullet',
            fontName='Helvetica', fontSize=9.5,
            textColor=SLATE_700, leading=14,
            leftIndent=14, spaceAfter=2,
        ),
        'contact_block': ParagraphStyle(
            'contact_block',
            fontName='Helvetica', fontSize=9,
            textColor=SLATE_500, alignment=TA_CENTER, spaceAfter=2,
        ),
    }

    story = []
    lines = markdown_text.strip().splitlines()
    i = 0
    name_done = False

    while i < len(lines):
        raw = lines[i]
        line = raw.rstrip()

        # H1 — candidate name (first H1 only)
        if line.startswith('# ') and not name_done:
            story.append(Paragraph(_inline(line[2:].strip()), S['name']))
            name_done = True

        elif line.startswith('# '):
            story.append(Paragraph(_inline(line[2:].strip()), S['h2']))

        # H2 — section header
        elif line.startswith('## '):
            text = line[3:].strip().upper()
            story.append(Spacer(1, 4))
            story.append(HRFlowable(
                width='100%', thickness=0.8,
                color=INDIGO, spaceAfter=3,
            ))
            story.append(Paragraph(text, S['h2']))

        # H3 — job title / institution
        elif line.startswith('### '):
            story.append(Paragraph(_inline(line[4:].strip()), S['h3']))

        # Horizontal rule
        elif re.match(r'^-{3,}$', line.strip()):
            story.append(HRFlowable(width='100%', thickness=0.5, color=SLATE_200, spaceAfter=3))

        # Bullet
        elif line.startswith('- ') or line.startswith('* '):
            story.append(Paragraph('• ' + _inline(line[2:].strip()), S['bullet']))

        # Blank line
        elif line.strip() == '':
            if story and not isinstance(story[-1], Spacer):
                story.append(Spacer(1, 3))

        # Normal text
        else:
            text = _inline(line.strip())
            if not text:
                i += 1
                continue
            # Lines with | separators → contact info style
            if '|' in line and name_done and len(story) <= 6:
                story.append(Paragraph(text, S['contact']))
            elif '@' in line and len(story) <= 6:
                story.append(Paragraph(text, S['contact']))
            else:
                story.append(Paragraph(text, S['body']))

        i += 1

    doc.build(story)
    return buf.getvalue()


# ── ─────────────────────────────────────────────────────────────────────────
#   SCREENING REPORT  PDF
# ── ─────────────────────────────────────────────────────────────────────────

def _score_color(score: int):
    if score >= 75:
        return EMERALD
    if score >= 50:
        return AMBER
    return RED


def generate_screening_report_pdf(data: dict) -> bytes:
    """Generate a professional candidate screening report PDF."""
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=A4,
        leftMargin=2.2*cm, rightMargin=2.2*cm,
        topMargin=2.0*cm, bottomMargin=2.0*cm,
        title="Candidate Screening Report",
    )

    S = {
        'title': ParagraphStyle(
            'title',
            fontName='Helvetica-Bold', fontSize=20,
            textColor=SLATE_900, alignment=TA_CENTER, spaceAfter=4,
        ),
        'subtitle': ParagraphStyle(
            'subtitle',
            fontName='Helvetica', fontSize=9,
            textColor=SLATE_500, alignment=TA_CENTER, spaceAfter=0,
        ),
        'section': ParagraphStyle(
            'section',
            fontName='Helvetica-Bold', fontSize=10,
            textColor=INDIGO_DARK, spaceBefore=14, spaceAfter=4,
        ),
        'body': ParagraphStyle(
            'body',
            fontName='Helvetica', fontSize=9.5,
            textColor=SLATE_700, leading=14, spaceAfter=3,
        ),
        'candidate_name': ParagraphStyle(
            'candidate_name',
            fontName='Helvetica-Bold', fontSize=9.5,
            textColor=SLATE_900, spaceAfter=2,
        ),
        'skill_text': ParagraphStyle(
            'skill_text',
            fontName='Helvetica', fontSize=8.5,
            textColor=SLATE_500, leading=12, spaceAfter=1,
        ),
    }

    results       = data.get('results', [])
    top_n         = int(data.get('top_n', 5))
    total         = int(data.get('total', len(results)))
    skills        = data.get('skills_analyzed', [])
    selected_count = sum(1 for r in results if r.get('selected'))

    story = []

    # ── Header ────────────────────────────────────────────────────────────────
    story.append(Paragraph('Candidate Screening Report', S['title']))
    story.append(Paragraph('Generated by Recruitment AI', S['subtitle']))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width='100%', thickness=1.5, color=INDIGO, spaceAfter=14))

    # ── Summary stats ─────────────────────────────────────────────────────────
    summary_data = [
        ['Total Screened', 'Skills Analyzed', 'Shortlisted', 'Above Cutoff'],
        [str(total), str(len(skills)), str(top_n), str(selected_count)],
    ]
    w = (doc.width) / 4
    sum_tbl = Table(summary_data, colWidths=[w, w, w, w])
    sum_tbl.setStyle(TableStyle([
        ('BACKGROUND',    (0, 0), (-1, 0), SLATE_50),
        ('TEXTCOLOR',     (0, 0), (-1, 0), SLATE_500),
        ('FONTNAME',      (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE',      (0, 0), (-1, 0), 7.5),
        ('ALIGN',         (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN',        (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME',      (0, 1), (-1, 1), 'Helvetica-Bold'),
        ('FONTSIZE',      (0, 1), (-1, 1), 16),
        ('TEXTCOLOR',     (0, 1), (0, 1), SLATE_900),
        ('TEXTCOLOR',     (1, 1), (1, 1), INDIGO),
        ('TEXTCOLOR',     (2, 1), (2, 1), EMERALD),
        ('TEXTCOLOR',     (3, 1), (3, 1), SKY),
        ('BOX',           (0, 0), (-1, -1), 0.5, SLATE_200),
        ('INNERGRID',     (0, 0), (-1, -1), 0.5, SLATE_200),
        ('TOPPADDING',    (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(sum_tbl)
    story.append(Spacer(1, 18))

    # ── Rankings table ────────────────────────────────────────────────────────
    story.append(Paragraph('CANDIDATE RANKINGS', S['section']))
    story.append(HRFlowable(width='100%', thickness=0.5, color=SLATE_200, spaceAfter=6))

    header = [['#', 'Candidate', 'Score', 'Status', 'Matched / Total']]
    rows = []
    for idx, r in enumerate(results):
        rank   = idx + 1
        name   = r.get('filename', f'Candidate {rank}').replace('.pdf', '').replace('.txt', '')
        name   = (name[:32] + '…') if len(name) > 32 else name
        score  = r.get('score', 0)
        sel    = r.get('selected', False)
        m      = len(r.get('strengths', []))
        tot    = m + len(r.get('weaknesses', []))
        rows.append([str(rank), name, f'{score}/100', 'Selected' if sel else 'Not Selected', f'{m}/{tot}'])

    col_w = [1.1*cm, None, 2.2*cm, 3.0*cm, 2.8*cm]
    tbl = Table(header + rows, colWidths=col_w, repeatRows=1)

    ts = [
        ('BACKGROUND',    (0, 0), (-1, 0), INDIGO),
        ('TEXTCOLOR',     (0, 0), (-1, 0), white),
        ('FONTNAME',      (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE',      (0, 0), (-1, 0), 8),
        ('ALIGN',         (0, 0), (0, -1), 'CENTER'),
        ('ALIGN',         (2, 0), (4, -1), 'CENTER'),
        ('VALIGN',        (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTSIZE',      (0, 1), (-1, -1), 8.5),
        ('TOPPADDING',    (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING',   (0, 0), (-1, -1), 7),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 7),
        ('BOX',           (0, 0), (-1, -1), 0.5, SLATE_200),
        ('INNERGRID',     (0, 0), (-1, -1), 0.5, SLATE_200),
    ]
    for idx, r in enumerate(results):
        row    = idx + 1
        is_top = (row <= top_n)
        sel    = r.get('selected', False)
        score  = r.get('score', 0)

        if is_top:
            ts.append(('BACKGROUND', (0, row), (-1, row), HexColor('#eef2ff')))
        elif row % 2 == 0:
            ts.append(('BACKGROUND', (0, row), (-1, row), SLATE_50))

        sc = _score_color(score)
        ts.append(('TEXTCOLOR',  (2, row), (2, row), sc))
        ts.append(('FONTNAME',   (2, row), (2, row), 'Helvetica-Bold'))
        ts.append(('TEXTCOLOR',  (3, row), (3, row), EMERALD if sel else RED))
        ts.append(('FONTNAME',   (3, row), (3, row), 'Helvetica-Bold'))

    tbl.setStyle(TableStyle(ts))
    story.append(tbl)

    # ── Top candidates detail ─────────────────────────────────────────────────
    story.append(Spacer(1, 18))
    story.append(Paragraph(f'TOP {top_n} CANDIDATES — SKILLS DETAIL', S['section']))
    story.append(HRFlowable(width='100%', thickness=0.5, color=SLATE_200, spaceAfter=8))

    for idx, r in enumerate(results[:top_n]):
        name       = r.get('filename', f'Candidate {idx+1}').replace('.pdf', '').replace('.txt', '')
        strengths  = r.get('strengths', [])
        weaknesses = r.get('weaknesses', [])
        score      = r.get('score', 0)
        sc         = _score_color(score)

        block = []
        sc_hex = sc.hexval() if hasattr(sc, 'hexval') else '#334155'
        block.append(Paragraph(
            f'<font color="{sc_hex}">#{idx+1}</font>  {name}  '
            f'<font color="{sc_hex}">{score}/100</font>',
            S['candidate_name'],
        ))
        if strengths:
            s_str = ', '.join(strengths[:10])
            if len(strengths) > 10:
                s_str += f' +{len(strengths)-10} more'
            block.append(Paragraph(
                f'<font color="#10b981"><b>Matched:</b></font>  {s_str}',
                S['skill_text'],
            ))
        if weaknesses:
            w_str = ', '.join(weaknesses[:8])
            if len(weaknesses) > 8:
                w_str += f' +{len(weaknesses)-8} more'
            block.append(Paragraph(
                f'<font color="#ef4444"><b>Missing:</b></font>  {w_str}',
                S['skill_text'],
            ))
        block.append(Spacer(1, 8))
        story.append(KeepTogether(block))

    # ── Skills analyzed footer ────────────────────────────────────────────────
    if skills:
        story.append(Spacer(1, 8))
        story.append(HRFlowable(width='100%', thickness=0.5, color=SLATE_200, spaceAfter=6))
        story.append(Paragraph('SKILLS ANALYZED', S['section']))
        skill_line = ', '.join(skills)
        story.append(Paragraph(skill_line, S['skill_text']))

    doc.build(story)
    return buf.getvalue()
