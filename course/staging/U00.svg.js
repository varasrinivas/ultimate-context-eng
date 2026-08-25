case "U00": return `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="700" height="400" fill="#f6f3ec" rx="8"/>
      <text x="350" y="30" text-anchor="middle" font-family="Fraunces,serif" font-size="16" font-weight="700" fill="#2c2a26">Anatomy of a Token Receipt</text>

      <!-- receipt card -->
      <rect x="170" y="52" width="360" height="322" fill="#ffffff" stroke="#d8d2c6" rx="6"/>
      <line x1="170" y1="88" x2="530" y2="88" stroke="#d8d2c6" stroke-dasharray="4,3"/>
      <text x="190" y="76" font-family="JetBrains Mono,monospace" font-size="11" font-weight="700" fill="#2c2a26">NAIVE</text>
      <text x="510" y="76" text-anchor="end" font-family="JetBrains Mono,monospace" font-size="9" fill="#6b6560">token receipt</text>

      <!-- five-layer stacked bar (proportions from Q1 naive) -->
      <rect x="190" y="100" width="12"  height="16" fill="#4a6741"/>
      <rect x="204" y="100" width="182" height="16" fill="#c0392b"/>
      <rect x="388" y="100" width="60"  height="16" fill="#b8860b"/>
      <rect x="450" y="100" width="48"  height="16" fill="#2e6b8a"/>
      <rect x="500" y="100" width="10"  height="16" fill="#7a4a8c"/>

      <!-- itemized lines -->
      <g font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">
        <rect x="190" y="132" width="8" height="8" fill="#4a6741"/><text x="206" y="140">System</text><text x="510" y="140" text-anchor="end">~500</text>
        <rect x="190" y="152" width="8" height="8" fill="#c0392b"/><text x="206" y="160">Retrieved</text><text x="510" y="160" text-anchor="end">~4,700</text>
        <rect x="190" y="172" width="8" height="8" fill="#b8860b"/><text x="206" y="180">Tool results</text><text x="510" y="180" text-anchor="end">~1,600</text>
        <rect x="190" y="192" width="8" height="8" fill="#2e6b8a"/><text x="206" y="200">History</text><text x="510" y="200" text-anchor="end">~1,900</text>
        <rect x="190" y="212" width="8" height="8" fill="#7a4a8c"/><text x="206" y="220">User turn</text><text x="510" y="220" text-anchor="end">~270</text>
      </g>
      <line x1="190" y1="232" x2="510" y2="232" stroke="#2c2a26" stroke-width="1"/>
      <text x="190" y="250" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#2c2a26">Input total</text>
      <text x="510" y="250" text-anchor="end" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#2c2a26">= sum of layers</text>

      <text x="190" y="274" font-family="JetBrains Mono,monospace" font-size="9" fill="#6b6560">cost · cache read % · latency</text>

      <!-- verdict stamp -->
      <g transform="rotate(-8 350 322)">
        <rect x="272" y="300" width="156" height="40" fill="none" stroke="#4a6741" stroke-width="2.5" rx="4"/>
        <text x="350" y="326" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="14" font-weight="700" fill="#4a6741">&#10003; VERIFIED</text>
      </g>
      <text x="350" y="366" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#6b6560">graded against the answer key &#8212; savings only count when the answer is right</text>

      <!-- side annotations -->
      <text x="88" y="110" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#c0392b">the facts needed</text>
      <text x="88" y="124" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#c0392b">fit in ~40 tokens</text>
      <path d="M 118 118 Q 160 130 186 108" fill="none" stroke="#c0392b" stroke-width="1" stroke-dasharray="3,2"/>
      <text x="612" y="110" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#6b6560">&lt;1% signal:</text>
      <text x="612" y="124" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#6b6560">the course begins</text>
    </svg>`;
