case "U03": return `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="700" height="400" fill="#f6f3ec" rx="8"/>
      <text x="350" y="30" text-anchor="middle" font-family="Fraunces,serif" font-size="16" font-weight="700" fill="#2c2a26">Write: the Handover Sheet, Not the Hallway Tape</text>

      <!-- left: naive history tape -->
      <text x="170" y="64" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#c0392b">NAIVE: history rides along</text>
      <g font-family="JetBrains Mono,monospace" font-size="8.5" fill="#6b6560">
        <rect x="70" y="76"  width="200" height="26" fill="#ffffff" stroke="#d8d2c6" rx="3"/><text x="80" y="93">turn 1: full question + answer</text>
        <rect x="70" y="108" width="200" height="26" fill="#ffffff" stroke="#d8d2c6" rx="3"/><text x="80" y="125">turn 2: full question + answer</text>
        <rect x="70" y="140" width="200" height="26" fill="#ffffff" stroke="#d8d2c6" rx="3"/><text x="80" y="157">turn 3: full question + answer</text>
        <rect x="70" y="172" width="200" height="26" fill="#ffffff" stroke="#d8d2c6" rx="3"/><text x="80" y="189">turn 4 ... (grows every call)</text>
      </g>
      <path d="M 170 206 L 170 232" stroke="#c0392b" stroke-width="1.6" marker-end="url(#arrU03a)"/>
      <rect x="86" y="238" width="168" height="34" fill="#c0392b" opacity="0.85" rx="4"/>
      <text x="170" y="259" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#ffffff">Q9: 1,700 tokens</text>

      <!-- right: notes flow -->
      <text x="530" y="64" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#2e6b8a">NOTES: write, then read back</text>
      <rect x="430" y="76" width="200" height="92" fill="#ffffff" stroke="#2e6b8a" stroke-width="1.6" rx="4"/>
      <text x="530" y="94" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" font-weight="700" fill="#2e6b8a">SESSION NOTE STORE</text>
      <g font-family="JetBrains Mono,monospace" font-size="8" fill="#2c2a26">
        <text x="442" y="112">PA-1001 | APPROVED | 100</text>
        <text x="442" y="128">PA-1004 | MANUAL_REVIEW | 65</text>
        <text x="442" y="144">open: EMG timing for PA-1002</text>
        <text x="442" y="160">member M-2001 = Rosa Delgado</text>
      </g>
      <path d="M 530 172 L 530 232" stroke="#2e6b8a" stroke-width="1.6" marker-end="url(#arrU03b)"/>
      <text x="596" y="196" font-family="JetBrains Mono,monospace" font-size="8" fill="#6b6560">history layer</text>
      <text x="596" y="208" font-family="JetBrains Mono,monospace" font-size="8" fill="#6b6560">&#8594; dropped</text>
      <rect x="446" y="238" width="168" height="34" fill="#2e6b8a" rx="4"/>
      <text x="530" y="259" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#ffffff">Q9: 167 tokens &#183; PASS</text>

      <!-- write discipline strip -->
      <rect x="70" y="296" width="560" height="80" fill="#ffffff" stroke="#d8d2c6" rx="6"/>
      <text x="90" y="318" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#2c2a26">the write discipline:</text>
      <text x="90" y="336" font-family="JetBrains Mono,monospace" font-size="9" fill="#6b6560">1. structured fields, not prose &#183; 2. identifiers always (PA-1004, not "the knee request")</text>
      <text x="90" y="352" font-family="JetBrains Mono,monospace" font-size="9" fill="#6b6560">3. write at the moment of knowing &#183; 4. read back selectively &#183; 5. prune resolved issues</text>
      <text x="90" y="368" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#6b6560">(numbers: replay grid, synthetic-pre-recording)</text>

      <defs>
        <marker id="arrU03a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#c0392b"/></marker>
        <marker id="arrU03b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#2e6b8a"/></marker>
      </defs>
    </svg>`;
