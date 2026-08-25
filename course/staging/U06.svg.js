      case "U06": return `
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Static-first ordering and the cache prefix boundary">
  <style>.u06t{font-family:'JetBrains Mono',monospace;font-size:11px;fill:#2c2a26}.u06h{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;fill:#2e6b8a}.u06s{font-family:'JetBrains Mono',monospace;font-size:10px;fill:#6b6459}</style>
  <text x="20" y="26" class="u06h">CLEAN PREFIX vs DIRTY PREFIX — same tokens, different bill</text>
  <!-- CLEAN row -->
  <text x="20" y="60" class="u06t">CLEAN</text>
  <rect x="90" y="44" width="150" height="26" rx="4" fill="#2e6b8a" opacity="0.55"/>
  <text x="98" y="61" class="u06s" fill="#fff">system + tools</text>
  <rect x="242" y="44" width="130" height="26" rx="4" fill="#2e6b8a" opacity="0.35"/>
  <text x="250" y="61" class="u06s">canonical policy</text>
  <rect x="374" y="44" width="110" height="26" rx="4" fill="#b8860b" opacity="0.45"/>
  <text x="382" y="61" class="u06s">per-question</text>
  <path d="M372 36 V 78" stroke="#c0392b" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="378" y="88" class="u06s" fill="#c0392b">cache boundary — everything left of here hits</text>
  <text x="500" y="61" class="u06t">→ cache read ~90% discount</text>
  <!-- DIRTY row -->
  <text x="20" y="140" class="u06t">DIRTY</text>
  <rect x="90" y="124" width="60" height="26" rx="4" fill="#c0392b" opacity="0.65"/>
  <text x="94" y="141" class="u06s" fill="#fff">14:02:07</text>
  <rect x="152" y="124" width="150" height="26" rx="4" fill="#2e6b8a" opacity="0.55"/>
  <text x="160" y="141" class="u06s" fill="#fff">system + tools</text>
  <rect x="304" y="124" width="130" height="26" rx="4" fill="#2e6b8a" opacity="0.35"/>
  <text x="312" y="141" class="u06s">canonical policy</text>
  <rect x="436" y="124" width="110" height="26" rx="4" fill="#b8860b" opacity="0.45"/>
  <text x="444" y="141" class="u06s">per-question</text>
  <path d="M150 116 V 158" stroke="#c0392b" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="156" y="168" class="u06s" fill="#c0392b">boundary now at char 8 — nothing meaningful hits</text>
  <text x="560" y="141" class="u06t">→ 0% hits, no error</text>
  <!-- rent framing -->
  <rect x="20" y="200" width="720" height="72" rx="6" fill="none" stroke="#2e6b8a" stroke-width="1.5"/>
  <text x="32" y="224" class="u06t">static surface = rent on EVERY call:  prompt altitude · minimal toolset (jit pays ~90 tok for its loader,</text>
  <text x="32" y="242" class="u06t">earns it back 10x on retrieved) · canonical few-shot · then static-first so the cache pays the rent</text>
  <text x="32" y="262" class="u06s">cached mode: ~731 tok input each call, cost falls as cache-read badge climbs · replay grid, synthetic-pre-recording</text>
</svg>`;
