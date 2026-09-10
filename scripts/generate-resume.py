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

experience = ''.join(
    f'<article><div class="entry-heading"><h3>{esc(e["role"])} <span class="company">/ {esc(e["company"])}</span></h3><p class="dates">{esc(e["dates"])}</p></div>{bullets(e["bullets"])}</article>'
    for e in data['experience']
)
projects = ''.join(
    f'<article><div class="entry-heading"><h3><a href="{esc(p["url"])}">{esc(p["name"])}</a> <span class="company">/ {esc(p["label"])}</span></h3></div><p class="stack">{esc(p["tech"])}</p>{bullets(p["bullets"])}</article>'
    for p in data['projects']
)
links = ' <span aria-hidden="true">/</span> '.join(f'<a href="{esc(l["url"])}">{esc(l["label"])}</a>' for l in data['links'])
skills = ''.join(f'<p><strong>{esc(s["label"])}:</strong> {esc(s["text"])}</p>' for s in data['skills'])
edu = data['education']
page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Vasudev Siddh - AI and full-stack engineer. Experience, selected open-source projects, skills, and education.">
<title>Vasudev Siddh | AI &amp; Full-Stack Engineer | Resume</title>
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
<section><h2>Selected projects</h2>{projects}</section>
<section class="skills"><h2>Technical skills</h2>{skills}</section>
<section class="education"><h2>Education &amp; recognition</h2><div class="entry-heading"><h3>{esc(edu['degree'])}</h3><p class="dates">{esc(edu['dates'])}</p></div><p>{esc(edu['institution'])} / {esc(edu['detail'])}</p><p>{esc(data['recognition'])}</p></section>
<footer>Updated {esc(data['updated'])}</footer></main></body></html>'''
(ROOT / 'public/resume.html').write_text(page, encoding='utf-8')

ink = colors.HexColor('#16222c')
accent = colors.HexColor('#123e50')
muted = colors.HexColor('#475966')
styles = {
    'name': ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=25, leading=29, textColor=ink, spaceAfter=3),
    'headline': ParagraphStyle('headline', fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=accent, spaceAfter=6),
    'contact': ParagraphStyle('contact', fontName='Helvetica', fontSize=9, leading=11, textColor=muted),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10, leading=12.5, textColor=ink, spaceAfter=3),
    'heading': ParagraphStyle('heading', fontName='Helvetica-Bold', fontSize=10, leading=12, textColor=accent, spaceBefore=9, spaceAfter=4),
    'entry': ParagraphStyle('entry', fontName='Helvetica-Bold', fontSize=10, leading=12.5, textColor=ink, spaceAfter=2),
    'meta': ParagraphStyle('meta', fontName='Helvetica', fontSize=9, leading=11, textColor=muted, spaceAfter=3),
    'bullet': ParagraphStyle('bullet', fontName='Helvetica', fontSize=10, leading=12.5, textColor=ink, leftIndent=9, firstLineIndent=-7, spaceAfter=2),
}
def p(text, style='body'):
    return Paragraph(text, styles[style])
def section(title):
    return [p(title.upper(), 'heading'), HRFlowable(width='100%', thickness=.5, color=colors.HexColor('#d8e1e6'), spaceAfter=5)]
story = [p(esc(data['name']), 'name'), p(esc(data['headline']), 'headline'), p(f'{esc(data["location"])} / <link href="mailto:{esc(data["email"])}">{esc(data["email"])}</link>', 'contact'), p(' / '.join(f'<link href="{esc(l["url"])}">{esc(l["label"])}</link>' for l in data['links']), 'contact'), Spacer(1,8), HRFlowable(width='100%', thickness=1.2, color=accent), Spacer(1,8), p(esc(data['summary']))]
story += section('Experience')
for e in data['experience']:
    group = [p(f'{esc(e["role"])} / {esc(e["company"])}', 'entry'),p(esc(e['dates']), 'meta')]
    group += [p('- '+esc(b), 'bullet') for b in e['bullets']]
    story += [KeepTogether(group), Spacer(1,5)]
story += section('Selected projects')
for item in data['projects']:
    group = [p(f'<link href="{esc(item["url"])}">{esc(item["name"])}</link> / {esc(item["label"])}', 'entry'),p(esc(item['tech']), 'meta')]
    group += [p('- '+esc(b), 'bullet') for b in item['bullets']]
    story += [KeepTogether(group), Spacer(1,4)]
story += section('Technical skills')
for s in data['skills']:
    story.append(p(f'<b>{esc(s["label"])}:</b> {esc(s["text"])}'))
story += section('Education & recognition')
story += [p(esc(edu['degree']), 'entry'), p(f'{esc(edu["institution"])} / {esc(edu["dates"])} / {esc(edu["detail"])}', 'meta'), p(esc(data['recognition']))]
pdf = SimpleDocTemplate(str(ROOT / 'public/resume.pdf'), pagesize=A4, leftMargin=35, rightMargin=35, topMargin=28, bottomMargin=28, title='Vasudev Siddh - AI & Full-Stack Engineer', author='Vasudev Siddh', subject='Experience, selected public projects, technical skills, and education')
pdf.build(story)
print('Generated public/resume.html and public/resume.pdf')
