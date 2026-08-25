case "U11": return `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="700" height="400" fill="#f6f3ec" rx="8"/>
      <text x="350" y="30" text-anchor="middle" font-family="Fraunces,serif" font-size="16" font-weight="700" fill="#2c2a26">Rot at Two Altitudes</text>

      <!-- altitude 1: the window (top) -->
      <text x="350" y="58" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#b8860b">ALTITUDE 1 &#183; IN THE WINDOW (visible, smells)</text>
      <rect x="80" y="68" width="540" height="64" rx="8" fill="#b8860b0c" stroke="#b8860b" stroke-width="1.4"/>
      <text x="150" y="94" font-family="JetBrains Mono,monospace" font-size="9" fill="#6b6560">turn 3: detour (resolved)</text>
      <text x="150" y="112" font-family="JetBrains Mono,monospace" font-size="9" fill="#6b6560">turn 7: duplicate dump</text>
      <text x="360" y="94" font-family="JetBrains Mono,monospace" font-size="9" fill="#6b6560">turn 9: superseded rule</text>
      <text x="360" y="112" font-family="JetBrains Mono,monospace" font-size="9" fill="#2c2a26" font-weight="700">cure: COMPACTION (U08)</text>

      <!-- altitude 2: below the window -->
      <text x="350" y="164" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#c0392b">ALTITUDE 2 &#183; UNDER THE WINDOW (silent, no smell)</text>
      <rect x="255" y="176" width="190" height="44" rx="8" fill="#ffffff" stroke="#c0392b" stroke-width="2"/>
      <text x="350" y="196" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#2c2a26">bench/seed/dataset.json</text>
      <text x="350" y="212" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b6560">the source of truth</text>

      <!-- derived artifacts -->
      <line x1="350" y1="220" x2="140" y2="262" stroke="#c0392b" stroke-width="1.1"/>
      <line x1="350" y1="220" x2="280" y2="262" stroke="#c0392b" stroke-width="1.1"/>
      <line x1="350" y1="220" x2="420" y2="262" stroke="#c0392b" stroke-width="1.1"/>
      <line x1="350" y1="220" x2="560" y2="262" stroke="#c0392b" stroke-width="1.1"/>
      <rect x="75" y="262" width="130" height="36" rx="6" fill="#c0392b0c" stroke="#c0392b" stroke-width="1.2"/>
      <text x="140" y="284" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2c2a26">answer keys</text>
      <rect x="215" y="262" width="130" height="36" rx="6" fill="#c0392b0c" stroke="#c0392b" stroke-width="1.2"/>
      <text x="280" y="284" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2c2a26">replay fixtures</text>
      <rect x="355" y="262" width="130" height="36" rx="6" fill="#c0392b0c" stroke="#c0392b" stroke-width="1.2"/>
      <text x="420" y="284" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2c2a26">H2 + UI mirrors</text>
      <rect x="495" y="262" width="130" height="36" rx="6" fill="#c0392b0c" stroke="#c0392b" stroke-width="1.2"/>
      <text x="560" y="284" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2c2a26">course tables</text>
      <text x="350" y="322" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#c0392b">a derived fact inherits the SHORTEST shelf life of its dependencies</text>

      <!-- the gate -->
      <rect x="200" y="340" width="300" height="34" rx="17" fill="#4a67410c" stroke="#4a6741" stroke-width="1.6"/>
      <text x="350" y="361" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#4a6741">gate: generate_keys.py &#8594; CONTRACT BROKEN names the blast radius</text>
    </svg>`;
