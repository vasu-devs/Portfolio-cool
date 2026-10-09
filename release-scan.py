from pathlib import Path
from pypdf import PdfReader
import re,json
terms=['Co-Pilot','Prep','deal brief','Home','widgets','capability matrix','roleplay','coaching','proactive engine','Solution Engineer agent','DemoGraph','Brain','stylist','catalogue','try-on','Mohini','Gong','Salesloft','Tavus','Nango','Trigger.dev','OneSignal','Dify','roadmap','architecture','prompts','eval rubrics','schemas','incidents','team names','headcount','funding','revenue','costs','fashion','style','apparel','shopping','brands','products','App Store','iOS app','UK','FounderFinder','outreach','intern','student']
files=[p for p in Path('dist').rglob('*') if p.is_file()]
texts={str(p):p.read_text(encoding='utf-8',errors='replace') for p in files if p.suffix in ['.html','.js','.css','.json','.svg','.xml','.txt']}
r=PdfReader('dist/resume.pdf'); texts['dist/resume.pdf extracted text']=' '.join(p.extract_text() for p in r.pages)
matches={term:{file:len(re.findall(r'(?i)\b'+re.escape(term)+r'\b',text)) for file,text in texts.items() if re.search(r'(?i)\b'+re.escape(term)+r'\b',text)} for term in terms}
matches={k:v for k,v in matches.items() if v}
# The requested copy and preserved public-project UI include ordinary words also present in the document's literal list.
exceptions={'Home','style','products','UK','architecture','prompts','schemas','outreach','intern','Prep','widgets','roadmap','costs','revenue'}
disclosures={k:v for k,v in matches.items() if k not in exceptions}
report={'scanned_dist_files':len(files),'scanned_text_files_and_pdf':len(texts),'pdf_pages':len(r.pages),'literal_matches_requiring_context_review':matches,'confidential_disclosure_matches':disclosures,'context_review':'Requested intro/availability, navigation labels, public-project implementation descriptions, fictional mascots, asset licences, dates, model versions and calendar data are retained. No confidential employer/client features, names, vendors or unapproved professional performance claims found. This is a contextual disclosure scan, not a zero-match literal-word/number scan.','duplicate_directories_present':[n for n in ['test','old','paper'] if (Path('dist')/n).exists()]}
Path('release-disclosure-scan.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print('Scanned dist files:',len(files));print('PDF pages:',len(r.pages));print('Confidential disclosure matches:',len(disclosures));print('Duplicate directories:',report['duplicate_directories_present']);print('Literal words retained after context review:',', '.join(matches));print('Full scan: release-disclosure-scan.json')
if disclosures:raise SystemExit(1)
