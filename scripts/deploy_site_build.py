"""Build site-adjusted copies of both new courses (+ touched parent pages
+ landing cards) for agenticai.varasrinivas.com. Local repo-relative links
are rewritten to the site's courses/<slug>/ layout. Upload happens separately."""
import re
import shutil
from pathlib import Path

SCRATCH = Path(__file__).parent
OUT = SCRATCH / "dist"
KG = Path(r"D:\work\ai-workspace\tutorials\repo\knowledge-graph")
UCE = Path(r"D:\work\ai-workspace\tutorials\repo\ultimate-context-eng")
KIT = Path(r"D:\work\ai-workspace\tutorials\repo\context-eng-kit")
AGENT = Path(r"D:\work\ai-workspace\tutorials\repo\claude-agent-course-final-adv")

if OUT.exists():
    shutil.rmtree(OUT)

def rewrite(text: str, subs) -> tuple[str, int]:
    n = 0
    for a, b in subs:
        c = text.count(a)
        n += c
        text = text.replace(a, b)
    return text, n

# ---- knowledge-graph -> courses/knowledge-graph/ ---------------------------
kg_out = OUT / "courses" / "knowledge-graph"
kg_out.mkdir(parents=True)
kg_subs = [
    ("../../claude-agent-course-final-adv/output/courses/claude-agents/M03B-context-engineering.html",
     "../claude-agents/M03B-context-engineering.html"),
    ("../../claude-agent-course-final-adv/output/courses/opensource/M03B-context-engineering.html",
     "../opensource/M03B-context-engineering.html"),
    ("../../claude-agent-course-final-adv/output/index.html", "../claude-agents/index.html"),
    ("../../ultimate-context-eng/course/index.html", "../ultimate-context-eng/index.html"),
]
total = 0
for f in (KG / "output").glob("*.html"):
    t, n = rewrite(f.read_text(encoding="utf-8"), kg_subs)
    total += n
    (kg_out / f.name).write_text(t, encoding="utf-8")
print(f"knowledge-graph: {len(list(kg_out.glob('*.html')))} pages, {total} links rewritten")

# ---- ultimate-context-eng -> courses/ultimate-context-eng/ -----------------
uce_out = OUT / "courses" / "ultimate-context-eng"
(uce_out / "assets").mkdir(parents=True)
(uce_out / "labs").mkdir()
uce_subs = [
    ("LAB_REPO = '../labs", "LAB_REPO = 'labs"),
    ("../../context-eng-kit/course/index.html", "../context-engineering/index.html"),
    ("../../knowledge-graph/output/", "../knowledge-graph/"),
    ("../../claude-agent-course-final-adv/output/courses/claude-agents/", "../claude-agents/"),
    ("../../claude-agent-course-final-adv/output/courses/opensource/", "../opensource/"),
]
for name in ["index.html", "app-guide.html"]:
    t, n = rewrite((UCE / "course" / name).read_text(encoding="utf-8"), uce_subs)
    (uce_out / name).write_text(t, encoding="utf-8")
    print(f"uce/{name}: {n} links rewritten")
for f in (UCE / "course" / "assets").glob("*.png"):
    shutil.copy(f, uce_out / "assets" / f.name)
for f in (UCE / "labs").glob("*.md"):
    shutil.copy(f, uce_out / "labs" / f.name)
print(f"uce: {len(list((uce_out/'assets').glob('*')))} assets, {len(list((uce_out/'labs').glob('*')))} labs")

# ---- kit index (successor link) -> courses/context-engineering/index.html --
ce_out = OUT / "courses" / "context-engineering"
ce_out.mkdir(parents=True)
t, n = rewrite((KIT / "course" / "index.html").read_text(encoding="utf-8"),
               [("../../ultimate-context-eng/course/index.html", "../ultimate-context-eng/index.html")])
(ce_out / "index.html").write_text(t, encoding="utf-8")
print(f"context-engineering/index.html: {n} links rewritten")

# ---- agent course: index + both M03B variants ------------------------------
ag_subs = [
    ("../../../../knowledge-graph/output/M02B-context-engineering-bridge.html",
     "../knowledge-graph/M02B-context-engineering-bridge.html"),
    ("../../../../knowledge-graph/output/index.html", "../knowledge-graph/index.html"),
]
ca_out = OUT / "courses" / "claude-agents"; ca_out.mkdir(parents=True)
os_out = OUT / "courses" / "opensource"; os_out.mkdir(parents=True)
for src, dst in [
    (AGENT / "output/courses/claude-agents/index.html", ca_out / "index.html"),
    (AGENT / "output/courses/claude-agents/M03B-context-engineering.html", ca_out / "M03B-context-engineering.html"),
    (AGENT / "output/courses/opensource/M03B-context-engineering.html", os_out / "M03B-context-engineering.html"),
]:
    t, n = rewrite(src.read_text(encoding="utf-8"), ag_subs)
    dst.write_text(t, encoding="utf-8")
    print(f"{dst.relative_to(OUT)}: {n} links rewritten")

# ---- landing: two new cards + color vars -----------------------------------
landing = (SCRATCH / "landing.html").read_text(encoding="utf-8")
assert "--kg:" not in landing
landing = landing.replace("--multisdk:", "--kg: #8B5CF6; --uce: #2e6b8a; --multisdk:", 1)

CARDS = '''
  <a href="courses/knowledge-graph/index.html" class="course-card" style="--card-color: var(--kg)">
    <div class="card-icon">🕸️</div>
    <div class="card-tag">New · Applied Pillar</div>
    <div class="card-title">Knowledge Graphs for AI Agents</div>
    <div class="card-desc">From RAG limits to self-updating codebase brains — structural graphs (tree-sitter, Graphify), Google's Open Knowledge Format, MCP serving, and honest multi-arm token benchmarks measured on real repositories.</div>
    <div class="card-meta">
      <span>14 modules</span>
      <span>6 tracks</span>
      <span>2 capstones</span>
      <span>Intermediate–Advanced</span>
    </div>
  </a>

  <a href="courses/ultimate-context-eng/index.html" class="course-card" style="--card-color: var(--uce)">
    <div class="card-icon">🧾</div>
    <div class="card-tag">New · Synthesis Course</div>
    <div class="card-title">Ultimate Context Engineering</div>
    <div class="card-desc">Master the discipline on an app that shows its tokens — MedFlow Copilot's Token Lens itemizes every AI call by layer, cost, and correctness. Ten strategies, thirty labs, and one law: savings only count when the answer is right.</div>
    <div class="card-meta">
      <span>15 modules</span>
      <span>5 tracks</span>
      <span>30 labs</span>
      <span>All levels</span>
    </div>
  </a>
'''
# insert after the context-engineering card's closing </a>
i = landing.index('href="courses/context-engineering/index.html"')
close = landing.index("</a>", i) + len("</a>")
landing = landing[:close] + "\n" + CARDS + landing[close:]
(OUT / "index.html").write_text(landing, encoding="utf-8")
print("landing: 2 cards + 2 color vars added")

files = sorted(p.relative_to(OUT) for p in OUT.rglob("*") if p.is_file())
print(f"\ndist total: {len(files)} files")

# ---------------------------------------------------------------------------
# DEPLOY NOTES (agenticai.varasrinivas.com, CloudFront E204WFPQTUDQ3Q)
# After building dist/, upload with:
#   aws s3 sync dist/courses/knowledge-graph s3://agenticai.varasrinivas.com/courses/knowledge-graph \
#       --exclude "*" --include "*.html" --content-type "text/html; charset=utf-8" --cache-control "public, max-age=300"
#   (same pattern for ultimate-context-eng html; assets as image/png max-age=86400; labs as text/markdown)
#   aws s3 cp dist/index.html s3://agenticai.varasrinivas.com/index.html --content-type "text/html; charset=utf-8"
#   MSYS_NO_PATHCONV=1 aws cloudfront create-invalidation --distribution-id E204WFPQTUDQ3Q \
#       --paths "/" "/index.html" "/courses/knowledge-graph/*" "/courses/ultimate-context-eng/*"
# The landing-card insertion is idempotent-guarded by the "--kg:" assert; for a
# redeploy of courses only, skip the landing section.
# NOTE: build expects scratch-local landing.html (download from the bucket first)
# and writes dist/ next to itself — adjust SCRATCH when running from scripts/.
