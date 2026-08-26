"""render_labs — convert labs/*.md into styled HTML pages for the site.

Kit warm-paper visual language (matches app-guide.html): Fraunces/Inter/
JetBrains Mono, light default + persisted dark toggle, styled code blocks and
tables, a back-to-course link, and an Understand/Build badge.

Usage: python render_labs.py [out_dir]      (default: dist-labs/ next to labs/)
Requires: pip install markdown
"""
from __future__ import annotations

import sys
from pathlib import Path

import markdown

ROOT = Path(__file__).parent.parent
LABS = ROOT / "labs"

SHELL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;0,700;1,300&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
:root {{ --bg:#f6f3ec; --surface:#ffffff; --text:#2c2a26; --muted:#6b6558; --line:#e4ddd0; --accent:{accent}; }}
html[data-theme="dark"] {{ --bg:#17150f; --surface:#211e17; --text:#ece7dc; --muted:#a49a88; --line:#3a352b; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ background:var(--bg); color:var(--text); font-family:Inter,sans-serif; line-height:1.7; font-size:1.0rem; }}
.wrap {{ max-width:860px; margin:0 auto; padding:2rem 1.5rem 4rem; }}
.topbar {{ display:flex; justify-content:space-between; align-items:center; margin-bottom:1.4rem; }}
.topbar a, .topbar button {{ font-family:'JetBrains Mono',monospace; font-size:.82rem; text-decoration:none; border:1px solid var(--line); border-radius:8px; padding:.4rem .75rem; background:var(--surface); color:var(--text); cursor:pointer; }}
.badge {{ display:inline-block; font-family:'JetBrains Mono',monospace; font-size:.72rem; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); border:1px solid var(--accent); border-radius:999px; padding:.2rem .7rem; margin-bottom:.7rem; }}
h1 {{ font-family:Fraunces,serif; font-weight:700; font-size:clamp(1.6rem,3.5vw,2.2rem); line-height:1.2; margin:.3rem 0 1rem; }}
h2 {{ font-family:Fraunces,serif; font-weight:600; font-size:1.35rem; margin:2rem 0 .6rem; border-bottom:1px solid var(--line); padding-bottom:.3rem; }}
h3 {{ font-family:Fraunces,serif; font-weight:600; font-size:1.08rem; margin:1.4rem 0 .4rem; }}
p {{ margin:.6rem 0; }} ul, ol {{ margin:.5rem 0 .8rem 1.5rem; }} li {{ margin:.25rem 0; }}
code {{ font-family:'JetBrains Mono',monospace; font-size:.86em; background:var(--surface); border:1px solid var(--line); border-radius:4px; padding:.06em .32em; }}
pre {{ background:var(--surface); border:1px solid var(--line); border-radius:10px; padding:.9rem 1.1rem; overflow-x:auto; margin:.7rem 0; }}
pre code {{ border:none; background:none; padding:0; font-size:.85rem; }}
table {{ border-collapse:collapse; width:100%; margin:.7rem 0; font-size:.93rem; }}
th, td {{ border:1px solid var(--line); padding:.45rem .65rem; text-align:left; vertical-align:top; }}
th {{ background:var(--surface); font-family:'JetBrains Mono',monospace; font-size:.76rem; text-transform:uppercase; letter-spacing:.05em; }}
blockquote {{ border-left:4px solid var(--accent); padding:.4rem 1rem; margin:.8rem 0; background:var(--surface); border-radius:0 8px 8px 0; color:var(--muted); }}
strong {{ font-weight:600; }} a {{ color:var(--accent); }} hr {{ border:none; border-top:1px solid var(--line); margin:1.5rem 0; }}
</style>
</head>
<body>
<div class="wrap">
<div class="topbar">
  <a href="../index.html">← Course</a>
  <button onclick="var h=document.documentElement;h.dataset.theme=h.dataset.theme==='dark'?'':'dark';try{{localStorage.setItem('lab-theme',h.dataset.theme)}}catch(e){{}}">◐ theme</button>
</div>
<div class="badge">{badge}</div>
{body}
<p style="margin-top:2.5rem"><a href="../index.html">← Back to the course</a> · <a href="../app-guide.html">App guide</a></p>
</div>
<script>try{{var t=localStorage.getItem('lab-theme');if(t)document.documentElement.dataset.theme=t;}}catch(e){{}}</script>
</body>
</html>
"""


def main() -> int:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "dist-labs"
    out.mkdir(parents=True, exist_ok=True)
    md = markdown.Markdown(extensions=["fenced_code", "tables"])
    n = 0
    for f in sorted(LABS.glob("U*.md")):
        text = f.read_text(encoding="utf-8")
        title = text.splitlines()[0].lstrip("# ").strip()
        badge = ("🔍 Understand It — observe & diagnose" if "understand" in f.name
                 else "🛠 Build It with AI — you spec, Claude codes")
        accent = "#4a6741" if "understand" in f.name else "#2e6b8a"
        md.reset()
        body = md.convert(text)
        (out / (f.stem + ".html")).write_text(
            SHELL.format(title=title, badge=badge, body=body, accent=accent),
            encoding="utf-8")
        n += 1
    print(f"rendered {n} labs -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
