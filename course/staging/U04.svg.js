case "U04": return `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="700" height="400" fill="#f6f3ec" rx="8"/>
      <text x="350" y="30" text-anchor="middle" font-family="Fraunces,serif" font-size="16" font-weight="700" fill="#2c2a26">Select: the Stacks, the Shortlist, and the Desk</text>

      <!-- stacks -->
      <text x="130" y="62" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#6b6560">THE STACKS (free)</text>
      <g fill="#ffffff" stroke="#d8d2c6">
        <rect x="60" y="74"  width="140" height="18" rx="2"/><rect x="60" y="96"  width="140" height="18" rx="2"/>
        <rect x="60" y="118" width="140" height="18" rx="2"/><rect x="60" y="140" width="140" height="18" rx="2"/>
        <rect x="60" y="162" width="140" height="18" rx="2"/><rect x="60" y="184" width="140" height="18" rx="2"/>
        <rect x="60" y="206" width="140" height="18" rx="2"/><rect x="60" y="228" width="140" height="18" rx="2"/>
      </g>
      <text x="130" y="264" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#6b6560">every member, request,</text>
      <text x="130" y="276" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#6b6560">criterion, note...</text>

      <!-- funnel -->
      <path d="M 208 90 L 320 150 L 208 236 Z" fill="#2e6b8a" opacity="0.18"/>
      <text x="252" y="158" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2e6b8a" font-weight="700">retrieve wide</text>
      <path d="M 328 128 L 408 150 L 328 176 Z" fill="#2e6b8a" opacity="0.45"/>
      <text x="366" y="120" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2e6b8a" font-weight="700">rerank narrow</text>

      <!-- desk -->
      <text x="530" y="62" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#6b6560">THE DESK (expensive)</text>
      <rect x="430" y="80" width="200" height="150" fill="#ffffff" stroke="#2e6b8a" stroke-width="2" rx="6"/>
      <g font-family="JetBrains Mono,monospace" font-size="8.5" fill="#2c2a26">
        <rect x="444" y="98"  width="172" height="24" fill="#f6f3ec" stroke="#2e6b8a" rx="3"/><text x="452" y="113">72148 | MRI Lumbar | 3 criteria</text>
        <rect x="444" y="130" width="172" height="24" fill="#f6f3ec" stroke="#2e6b8a" rx="3"/><text x="452" y="145">C-72148-1 | cons. therapy | 40</text>
        <rect x="444" y="162" width="172" height="24" fill="#f6f3ec" stroke="#2e6b8a" rx="3"/><text x="452" y="177">only what the ask touches</text>
      </g>
      <text x="530" y="216" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2e6b8a" font-weight="700">jit on Q1: 143 tokens (naive: 1,694)</text>

      <!-- two postures + the boundary -->
      <rect x="60" y="296" width="280" height="80" fill="#ffffff" stroke="#d8d2c6" rx="6"/>
      <text x="76" y="318" font-family="JetBrains Mono,monospace" font-size="9.5" font-weight="700" fill="#2c2a26">two select postures</text>
      <text x="76" y="336" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#6b6560">budgeted: pre-select by cap, evict whole records</text>
      <text x="76" y="352" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#6b6560">jit: identifiers first, fetch on demand [ANTHROPIC-CE]</text>
      <text x="76" y="368" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#6b6560">(replay grid, synthetic-pre-recording)</text>

      <rect x="360" y="296" width="280" height="80" fill="#ffffff" stroke="#b8860b" rx="6"/>
      <text x="376" y="318" font-family="JetBrains Mono,monospace" font-size="9.5" font-weight="700" fill="#b8860b">the boundary</text>
      <text x="376" y="336" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#6b6560">fuzzy questions &#8594; retrieval</text>
      <text x="376" y="352" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#6b6560">settled facts &#8594; lookup (Q3: okf 186 beats jit 285)</text>
      <text x="376" y="368" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#6b6560">don't rediscover what the org already settled</text>
    </svg>`;
