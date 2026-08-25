      case "U08": return `
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Session pressure curves: append-only climbs, compaction saw-tooths, notes stays flat">
  <style>.u08t{font-family:'JetBrains Mono',monospace;font-size:11px;fill:#2c2a26}.u08h{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;fill:#b8860b}.u08s{font-family:'JetBrains Mono',monospace;font-size:10px;fill:#6b6459}</style>
  <text x="20" y="26" class="u08h">SESSION PRESSURE — per-call history tokens across 10 asks</text>
  <!-- axes -->
  <path d="M60 250 H 700" stroke="#6b6459" stroke-width="1"/>
  <path d="M60 250 V 50" stroke="#6b6459" stroke-width="1"/>
  <text x="30" y="60" class="u08s">tok</text>
  <text x="680" y="268" class="u08s">call #</text>
  <!-- naive: monotonic climb -->
  <path d="M60 240 L124 225 L188 208 L252 190 L316 170 L380 150 L444 128 L508 106 L572 84 L636 62"
        fill="none" stroke="#c0392b" stroke-width="2.5"/>
  <text x="600" y="56" class="u08t" fill="#c0392b">naive (append-only)</text>
  <!-- compaction: saw-tooth -->
  <path d="M60 240 L124 226 L188 212 L252 236 L316 222 L380 208 L444 234 L508 220 L572 206 L636 232"
        fill="none" stroke="#b8860b" stroke-width="2.5" stroke-dasharray="6 3"/>
  <text x="560" y="196" class="u08t" fill="#b8860b">compaction (case board)</text>
  <!-- notes: flat -->
  <path d="M60 240 L124 239 L188 240 L252 238 L316 240 L380 239 L444 240 L508 238 L572 240 L636 239"
        fill="none" stroke="#2e6b8a" stroke-width="2.5"/>
  <text x="560" y="252" class="u08t" fill="#2e6b8a">notes (~198 median)</text>
  <!-- annotations -->
  <path d="M252 236 L252 246" stroke="#b8860b" stroke-width="1.5"/>
  <text x="200" y="286" class="u08s">↑ compaction events rewrite the board — decisions &amp; open items survive verbatim, chatter is discarded</text>
  <text x="410" y="96" class="u08s" fill="#c0392b">rot bites here — long before the limit [ROT-LIT]</text>
</svg>`;
