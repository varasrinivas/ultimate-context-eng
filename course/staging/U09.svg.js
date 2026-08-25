      case "U09": return `
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sub-agent isolation: messy window stays behind, memo crosses; break-even arithmetic">
  <style>.u09t{font-family:'JetBrains Mono',monospace;font-size:11px;fill:#2c2a26}.u09h{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;fill:#b8860b}.u09s{font-family:'JetBrains Mono',monospace;font-size:10px;fill:#6b6459}</style>
  <text x="20" y="26" class="u09h">ISOLATE — the mess stays, the memo crosses</text>
  <!-- sub-agent window (messy) -->
  <rect x="20" y="50" width="300" height="160" rx="8" fill="#b8860b" opacity="0.10" stroke="#b8860b" stroke-width="1.5"/>
  <text x="32" y="72" class="u09t">sub-agent window (clean at start)</text>
  <text x="32" y="96" class="u09s">40 records read · dead ends · re-reads</text>
  <text x="32" y="112" class="u09s">tool dumps · irrelevant members</text>
  <text x="32" y="128" class="u09s">…the archive room mess…</text>
  <rect x="32" y="146" width="230" height="44" rx="4" fill="#b8860b" opacity="0.35"/>
  <text x="40" y="164" class="u09t">MEMO ≤ 1,500 tok</text>
  <text x="40" y="180" class="u09s">PA-1001 APPROVED · PA-1004 REVIEW</text>
  <!-- threshold -->
  <path d="M340 60 V 200" stroke="#c0392b" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="330" y="222" class="u09s" fill="#c0392b">only the memo crosses</text>
  <path d="M264 168 H 400" stroke="#b8860b" stroke-width="2.5" marker-end="url(#u09a)"/>
  <!-- parent window -->
  <rect x="410" y="90" width="330" height="120" rx="8" fill="none" stroke="#2e6b8a" stroke-width="1.5"/>
  <text x="422" y="112" class="u09t">parent window</text>
  <text x="422" y="132" class="u09s">memo + question — exploration never lands here,</text>
  <text x="422" y="148" class="u09s">so later turns never re-carry it</text>
  <text x="422" y="176" class="u09t">single question: 1,805 vs naive 1,696 — a TAX</text>
  <text x="422" y="194" class="u09t">deep parallel session: the tax inverts</text>
  <text x="20" y="250" class="u09s">honest accounting: sub-call tokens billed to the tool layer — the receipt shows isolation's price · replay grid, synthetic-pre-recording</text>
  <text x="20" y="270" class="u09s">alignment: compaction ↔ continuity · notes ↔ milestones · sub-agents ↔ parallel exploration [ANTHROPIC-CE]</text>
  <defs><marker id="u09a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#b8860b"/></marker></defs>
</svg>`;
