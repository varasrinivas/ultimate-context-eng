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

# The standalone walkthrough quick-reference sits one level down, matching the
# spec-driven-development course's courses/<slug>/walkthrough/index.html layout.
def copy_walkthrough(repo: Path, out: Path, label: str) -> None:
    src = repo / "walkthrough" / "index.html"
    if not src.exists():
        print(f"{label}: no walkthrough page (skipped)")
        return
    dst = out / "walkthrough"
    dst.mkdir(parents=True, exist_ok=True)
    shutil.copy(src, dst / "index.html")
    print(f"{label}: walkthrough page ({src.stat().st_size / 1024:.0f} kB)")

copy_walkthrough(KG, kg_out, "knowledge-graph")

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
copy_walkthrough(UCE, uce_out, "uce")

# ---- kit index (successor link) -> courses/context-engineering/index.html --
ce_out = OUT / "courses" / "context-engineering"
ce_out.mkdir(parents=True)
t, n = rewrite((KIT / "course" / "index.html").read_text(encoding="utf-8"),
               [("../../ultimate-context-eng/course/index.html", "../ultimate-context-eng/index.html")])
(ce_out / "index.html").write_text(t, encoding="utf-8")
print(f"context-engineering/index.html: {n} links rewritten")
copy_walkthrough(KIT, ce_out, "context-engineering")

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

# ---- landing ---------------------------------------------------------------
# The catalog landing page is no longer generated here. Its source of truth is
# learnings-hub/agenticai/index.html (grouped tracks + learning path), deployed
# separately to the bucket root. Copy it in so dist/ is a faithful preview.
LANDING = Path("D:/work/ai-workspace/tutorials/repo/learnings-hub/agenticai/index.html")
if LANDING.exists():
    shutil.copy(LANDING, OUT / "index.html")
    print("landing: copied from learnings-hub/agenticai (edit it there)")
else:
    print("landing: source not found, skipped")

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
