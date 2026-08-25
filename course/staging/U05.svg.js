      case "U05": return `
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three selectors routing question classes: just-in-time, graph, canonical">
  <style>.u05t{font-family:'JetBrains Mono',monospace;font-size:11px;fill:#2c2a26}.u05h{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;fill:#2e6b8a}.u05s{font-family:'JetBrains Mono',monospace;font-size:10px;fill:#6b6459}</style>
  <text x="20" y="26" class="u05h">ONE QUESTION CLASS → ONE SELECTOR (replay grid)</text>
  <!-- question sources -->
  <rect x="20" y="50" width="180" height="44" rx="6" fill="none" stroke="#2e6b8a" stroke-width="1.5"/>
  <text x="30" y="69" class="u05t">relational Q2</text>
  <text x="30" y="84" class="u05s">"what's in review &amp; why?"</text>
  <rect x="20" y="120" width="180" height="44" rx="6" fill="none" stroke="#2e6b8a" stroke-width="1.5"/>
  <text x="30" y="139" class="u05t">canonical Q4</text>
  <text x="30" y="154" class="u05s">"what's the eligibility rule?"</text>
  <rect x="20" y="190" width="180" height="44" rx="6" fill="none" stroke="#2e6b8a" stroke-width="1.5"/>
  <text x="30" y="209" class="u05t">sparse lookup Q1</text>
  <text x="30" y="224" class="u05s">"criteria of 72148?"</text>
  <!-- selectors -->
  <rect x="330" y="50" width="200" height="44" rx="6" fill="#2e6b8a" opacity="0.12"/>
  <text x="340" y="69" class="u05h">graph</text>
  <text x="340" y="84" class="u05s">subgraph + [EXTRACTED] edges</text>
  <rect x="330" y="120" width="200" height="44" rx="6" fill="#2e6b8a" opacity="0.12"/>
  <text x="340" y="139" class="u05h">okf</text>
  <text x="340" y="154" class="u05s">one canonical policy file</text>
  <rect x="330" y="190" width="200" height="44" rx="6" fill="#2e6b8a" opacity="0.12"/>
  <text x="340" y="209" class="u05h">jit</text>
  <text x="340" y="224" class="u05s">identifiers + on-demand loader</text>
  <!-- routes -->
  <path d="M200 72 H 330" stroke="#2e6b8a" stroke-width="2" fill="none" marker-end="url(#u05a)"/>
  <path d="M200 142 H 330" stroke="#2e6b8a" stroke-width="2" fill="none" marker-end="url(#u05a)"/>
  <path d="M200 212 H 330" stroke="#2e6b8a" stroke-width="2" fill="none" marker-end="url(#u05a)"/>
  <!-- receipts -->
  <text x="560" y="76" class="u05t">437 tok ✓  (naive: 1,697)</text>
  <text x="560" y="146" class="u05t">186 tok ✓  (graph: 1,054!)</text>
  <text x="560" y="216" class="u05t">143 tok ✓  (naive: 1,694)</text>
  <text x="20" y="278" class="u05s">misroute penalty: canonical→graph = 5.7x the tokens at equal correctness · source: bench/results/fullgrid-compact.csv (replay)</text>
  <defs><marker id="u05a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#2e6b8a"/></marker></defs>
</svg>`;
