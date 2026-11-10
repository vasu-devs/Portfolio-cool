"""Generate the public HTML and PDF resume from src/data/resume.json.

Requires Python and reportlab. No private source documents are inputs.
Run: python scripts/generate-resume.py
"""
import html
import json
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether, HRFlowable

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'src/data/resume.json').read_text(encoding='utf-8'))
esc = html.escape

def bullets(items):
    return '<ul>' + ''.join(f'<li>{esc(x)}</li>' for x in items) + '</ul>'

def tech(item):
    return f'<p class="stack">{esc(item["tech"])}</p>' if item.get('tech') else ''

def title(project):
    name = esc(project['name'])
    return f'<a href="{esc(project["url"])}">{name}</a>' if project.get('url') else name

experience = ''.join(
    f'<article><div class="entry-heading"><h3>{esc(e["role"])} <span class="company">/ {esc(e["company"])}</span></h3><p class="dates">{esc(e["dates"])}</p></div>{bullets(e["bullets"])}{tech(e)}</article>'
    for e in data['experience']
)
projects = ''.join(
    f'<article><div class="entry-heading"><h3>{title(p)} <span class="company">/ {esc(p["label"])}</span></h3></div>{bullets(p["bullets"])}{tech(p)}</article>'
    for p in data['projects']
)
links = ' <span aria-hidden="true">/</span> '.join(f'<a href="{esc(l["url"])}">{esc(l["label"])}</a>' for l in data['links'])
skills = ''.join(f'<p><strong>{esc(s["label"])}:</strong> {esc(s["text"])}</p>' for s in data['skills'])
edu = data['education']
page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Vasudev Siddh - AI engineer. Experience, projects, skills, and education.">
<title>Vasudev Siddh | AI Engineer | Resume</title>
<link rel="canonical" href="https://siddhvasudev.com/resume.html">
<base target="_top">
<script>if (window.self !== window.top) document.documentElement.classList.add('embedded');</script>
<style>
*{{box-sizing:border-box}}:root{{color-scheme:light}}body{{margin:0;background:#e9edf0;color:#16222c;font:16px/1.55 Arial,Helvetica,sans-serif}}a{{color:inherit;text-underline-offset:3px}}.toolbar{{max-width:920px;margin:20px auto;display:flex;gap:12px;align-items:center;padding:0 20px}}.toolbar a,.toolbar button{{font:600 14px/1.3 Arial;padding:12px 17px;border:1px solid #bac6ce;border-radius:7px;text-decoration:none;background:#fff;color:#16222c;cursor:pointer}}.toolbar .download{{background:#123e50;color:white;border-color:#123e50}}a:focus-visible,button:focus-visible{{outline:3px solid #167995;outline-offset:3px}}main{{max-width:880px;margin:0 auto 32px;background:white;padding:44px 48px;box-shadow:0 8px 40px #152a3910}}header{{border-bottom:2px solid #123e50;padding-bottom:19px}}h1{{font-size:36px;line-height:1.1;letter-spacing:-1px;margin:0 0 7px}}.headline{{font-size:18px;color:#123e50;font-weight:600;margin:0 0 12px}}.contact,.links{{font-size:14px;margin:4px 0;overflow-wrap:anywhere}}.links span{{padding:0 5px;color:#91a0aa}}.summary{{margin:19px 0}}h2{{font-size:14px;letter-spacing:1.6px;text-transform:uppercase;color:#123e50;border-bottom:1px solid #d8e1e6;padding-bottom:6px;margin:23px 0 12px}}h3{{font-size:16px;line-height:1.45;margin:0}}.company{{font-weight:400;color:#475966}}.entry-heading{{display:flex;justify-content:space-between;gap:16px;align-items:baseline}}.dates,.stack{{font-size:14px;color:#475966;margin:3px 0}}.dates{{white-space:nowrap}}article{{margin:0 0 15px;break-inside:avoid}}ul{{padding-left:18px;margin:6px 0 0}}li{{padding-left:2px;margin:4px 0}}.skills p{{margin:5px 0}}.education p{{margin:5px 0}}footer{{font-size:12px;color:#637782;margin-top:20px}}@media(max-width:650px){{main{{padding:25px 20px;margin-bottom:0}}h1{{font-size:30px}}.entry-heading{{display:block}}.toolbar{{padding:0 12px;flex-wrap:wrap}}.toolbar a,.toolbar button{{flex:1;text-align:center}}.company{{display:block}}}}
@media print{{@page{{size:A4;margin:12mm}}body{{background:#fff;font-size:9pt;line-height:1.3}}.toolbar{{display:none}}main{{max-width:none;padding:0;margin:0;box-shadow:none}}header{{padding-bottom:9px}}h1{{font-size:24pt}}.headline{{font-size:11pt;margin-bottom:6px}}.contact,.links,.dates,.stack{{font-size:8pt}}.summary{{margin:10px 0}}h2{{font-size:9pt;margin:12px 0 7px;padding-bottom:4px}}h3{{font-size:9pt}}article{{margin-bottom:9px}}li{{margin:2px 0}}.entry-heading{{display:flex}}.company{{display:inline}}footer{{font-size:7pt;margin-top:10px}}a{{text-decoration:none}}}}
.embedded .toolbar{{display:none}}.embedded body{{background:#fff}}.embedded main{{max-width:none;margin:0;box-shadow:none}}
</style></head><body>
<nav class="toolbar" aria-label="Resume actions"><a class="download" href="/resume.pdf" download="Vasudev-Siddh-Resume.pdf">Download PDF</a><button type="button" onclick="window.print()">Print resume</button><a href="/">Portfolio</a></nav>
<main><header><h1>{esc(data['name'])}</h1><p class="headline">{esc(data['headline'])}</p><p class="contact">{esc(data['location'])} / <a href="mailto:{esc(data['email'])}">{esc(data['email'])}</a></p><p class="links">{links}</p></header>
<p class="summary">{esc(data['summary'])}</p>
<section><h2>Experience</h2>{experience}</section>
<section><h2>Projects</h2>{projects}</section>
<section class="skills"><h2>Skills</h2>{skills}</section>
<section class="education"><h2>Education &amp; achievements</h2><div class="entry-heading"><h3>{esc(edu['degree'])}</h3><p class="dates">{esc(edu['dates'])}</p></div><p>{esc(edu['institution'])} / {esc(edu['detail'])}</p><p>{esc(data['recognition'])}</p></section>
<footer>Updated {esc(data['updated'])}</footer></main></body></html>'''
(ROOT / 'public/resume.html').write_text(page, encoding='utf-8')

ink = colors.HexColor('#16222c')
accent = colors.HexColor('#123e50')
muted = colors.HexColor('#475966')

# ATS: one column in reading order, standard section names, real text in a standard font. Helvetica only holds the
# Windows-1252 characters; anything else (an arrow, a star) would print as a box and extract as junk.
json.dumps(data, ensure_ascii=False).encode('cp1252')


def build(k):
    """Write the PDF with every size multiplied by k and return its page count."""
    def style(font, size, leading, color, **space):
        return ParagraphStyle(font + str(size), fontName=font, fontSize=size * k, leading=leading * k, textColor=color, **{a: b * k for a, b in space.items()})
    styles = {
        'name': style('Helvetica-Bold', 22, 26, ink, spaceAfter=3),
        'headline': style('Helvetica-Bold', 11, 14, accent, spaceAfter=6),
        'contact': style('Helvetica', 9, 11, muted),
        'body': style('Helvetica', 10, 12.5, ink, spaceAfter=3),
        'heading': style('Helvetica-Bold', 10, 12, accent, spaceBefore=8, spaceAfter=3),
        'entry': style('Helvetica', 10, 12.5, ink, spaceAfter=1),
        'meta': style('Helvetica', 9, 11, muted, spaceAfter=3),
        'bullet': style('Helvetica', 10, 12.5, ink, leftIndent=9, firstLineIndent=-7, spaceAfter=1.5),
    }
    def p(text, name='body'):
        return Paragraph(text, styles[name])
    def section(title):
        return [p(title.upper(), 'heading'), HRFlowable(width='100%', thickness=.5, color=colors.HexColor('#d8e1e6'), spaceAfter=4 * k)]
    def entry(title, item):
        group = [p(title, 'entry')] + [p('- ' + esc(b), 'bullet') for b in item['bullets']]
        return [KeepTogether(group), Spacer(1, 4 * k)]

    story = [p(esc(data['name']), 'name'), p(esc(data['headline']), 'headline'), p(f'{esc(data["location"])} / <link href="mailto:{esc(data["email"])}">{esc(data["email"])}</link>', 'contact'), p(' / '.join(f'<link href="{esc(l["url"])}">{esc(l["label"])}</link>' for l in data['links']), 'contact'), Spacer(1, 5 * k), HRFlowable(width='100%', thickness=1.2, color=accent)]
    story += [Spacer(1, 6 * k), p(esc(data['summary']))]
    story += section('Experience')
    for e in data['experience']:
        story += entry(f'<b>{esc(e["role"])} / {esc(e["company"])}</b> | {esc(e["dates"])}', e)
    story += section('Projects')
    for item in data['projects']:
        name = f'<link href="{esc(item["url"])}">{esc(item["name"])}</link>' if item.get('url') else esc(item['name'])
        story += entry(f'<b>{name} / {esc(item["label"])}</b> | {esc(item["tech"])}', item)
    story += section('Skills')
    for s in data['skills']:
        story.append(p(f'<b>{esc(s["label"])}:</b> {esc(s["text"])}'))
    story += section('Education & achievements')
    story += [p(f'<b>{esc(edu["degree"])}</b>', 'entry'), p(f'{esc(edu["institution"])} / {esc(edu["dates"])} / {esc(edu["detail"])}', 'meta'), p(esc(data['recognition']))]
    pdf = SimpleDocTemplate(str(ROOT / 'public/resume.pdf'), pagesize=A4, leftMargin=30, rightMargin=30, topMargin=20, bottomMargin=18, title=f'Vasudev Siddh - {data["headline"]} - Resume', author='Vasudev Siddh', subject='Experience, projects, skills and education', keywords='AI engineer, voice agents, LLM, RAG, Python, TypeScript')
    pdf.build(story)
    return pdf.page


# One page: step the type down until it fits (an 8.5pt body is the floor for a readable page).
for k in (1, 0.97, 0.94, 0.91, 0.88, 0.85):
    pages = build(k)
    if pages == 1:
        break
else:
    raise SystemExit(f'The resume needs {pages} pages at the smallest type size; shorten src/data/resume.json.')
print(f'Generated public/resume.html and public/resume.pdf (one page, type scale {k})')
