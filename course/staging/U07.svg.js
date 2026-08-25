      case "U07": return `
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The compression ladder and the fidelity gate">
  <style>.u07t{font-family:'JetBrains Mono',monospace;font-size:11px;fill:#2c2a26}.u07h{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;fill:#b8860b}.u07s{font-family:'JetBrains Mono',monospace;font-size:10px;fill:#6b6459}</style>
  <text x="20" y="26" class="u07h">THE LADDER, SAFEST FIRST — then the gate (Q9, replay grid)</text>
  <!-- bars: naive -> budgeted -> compressed -->
  <text x="20" y="64" class="u07t">naive</text>
  <rect x="120" y="50" width="480" height="20" rx="3" fill="#b8860b" opacity="0.25"/>
  <text x="608" y="65" class="u07t">1,700 tok ✓</text>
  <text x="20" y="104" class="u07t">budgeted</text>
  <rect x="120" y="90" width="160" height="20" rx="3" fill="#b8860b" opacity="0.45"/>
  <text x="288" y="105" class="u07t">565 tok ✓  (evict whole records)</text>
  <text x="20" y="144" class="u07t">compressed</text>
  <rect x="120" y="130" width="59" height="20" rx="3" fill="#b8860b" opacity="0.7"/>
  <text x="187" y="145" class="u07t">208 tok — 8.2x …</text>
  <!-- fidelity gate -->
  <rect x="390" y="122" width="230" height="70" rx="8" fill="none" stroke="#c0392b" stroke-width="2"/>
  <text x="402" y="144" class="u07h" fill="#c0392b">FIDELITY GATE</text>
  <text x="402" y="162" class="u07s">every load-bearing id must survive</text>
  <text x="402" y="180" class="u07s">PA-1001 ✓   PA-1004 ✗ MISSING</text>
  <path d="M348 140 H 388" stroke="#c0392b" stroke-width="2" marker-end="url(#u07a)"/>
  <!-- verdict -->
  <text x="640" y="150" class="u07h" fill="#c0392b" transform="rotate(-8 640 150)">✗ FAILED</text>
  <text x="628" y="170" class="u07s" fill="#c0392b">SAVINGS VOID</text>
  <!-- ladder legend -->
  <rect x="20" y="216" width="720" height="60" rx="6" fill="none" stroke="#b8860b" stroke-width="1.5"/>
  <text x="32" y="238" class="u07t">1 PRUNE (drop the irrelevant — lossless by removal)   2 EXTRACT VERBATIM (ids, scores, decisions — never paraphrased)</text>
  <text x="32" y="258" class="u07t">3 ABSTRACT (routine remainder only)  →  ASSERT survival — ratio × fidelity, and only the pair is a measurement</text>
  <defs><marker id="u07a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#c0392b"/></marker></defs>
</svg>`;
