"""Rebuild business-plan.html from business-plan.md (needs: pip install markdown).

Styling and the header live in tools/page-template.html. After building, republish
business-plan.html to https://claude.ai/artifact/9SzQ8nCgufqyQATZJtx4qe.
"""
import re, pathlib, markdown

ROOT = pathlib.Path(__file__).resolve().parent.parent
src = (ROOT / 'business-plan.md').read_text(encoding='utf-8')

# drop the H1 + intro line (the page header replaces them)
src = re.sub(r'^# .*?\n', '', src, count=1)
src = src.replace('The numbers come from [landed_cost.py](landed_cost.py), so you can rerun them when prices change.',
                  'Numbers come from a landed-cost calculator calibrated to a real Websource quote.')

body = markdown.Markdown(extensions=['tables', 'fenced_code', 'toc', 'sane_lists']).convert(src)

body = body.replace('✅', '<span class="tag ok" title="Verified">✓</span>')
body = body.replace('⚠️', '<span class="tag warn" title="Estimate or unverified">!</span>')
body = body.replace('☐ ', '<span class="box" aria-label="Open"></span>')
body = body.replace('☑ ', '<span class="box done" aria-label="Done">✓</span>')
body = body.replace('◐ ', '<span class="box half" aria-label="In progress"></span>')
body = body.replace('<table>', '<div class="table-wrap"><table>').replace('</table>', '</table></div>')
body = body.replace('<hr />', '')
body = re.sub(r'<a href="(http[^"]+)"', r'<a href="\1" target="_blank" rel="noopener"', body)

# wrap each h2 section and build the contents list
parts = re.split(r'(?=<h2 )', body)
intro, secs = parts[0], parts[1:]
toc, out = [], [f'<div class="intro">{intro}</div>']
for s in secs:
    m = re.match(r'<h2 id="([^"]+)">(.*?)</h2>', s)
    toc.append(f'<li><a href="#{m.group(1)}">{re.sub("<[^>]+>", "", m.group(2))}</a></li>')
    out.append(f'<section>{s}</section>')

tpl = (ROOT / 'tools' / 'page-template.html').read_text(encoding='utf-8')
html = tpl.replace('{{TOC}}', '\n'.join(toc)).replace('{{BODY}}', '\n'.join(out))
(ROOT / 'business-plan.html').write_text(html, encoding='utf-8')
print(len(html), 'bytes;', len(secs), 'sections')
