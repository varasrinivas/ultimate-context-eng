case "U13": return `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="700" height="400" fill="#f6f3ec" rx="8"/>
      <text x="350" y="30" text-anchor="middle" font-family="Fraunces,serif" font-size="16" font-weight="700" fill="#2c2a26">Two Scales, One Canary, Three Quantities</text>

      <!-- scale 1 -->
      <rect x="55" y="66" width="270" height="98" rx="8" fill="#ffffff" stroke="#2c3e50" stroke-width="1.6"/>
      <text x="190" y="90" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="11" font-weight="700" fill="#2c2a26">instrument 1 &#183; Token Lens</text>
      <text x="190" y="112" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#6b6560">per-call receipt, in the app</text>
      <text x="190" y="132" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">layers sum = input total</text>
      <text x="190" y="150" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">server-side verdict</text>

      <!-- scale 2 -->
      <rect x="375" y="66" width="270" height="98" rx="8" fill="#ffffff" stroke="#2c3e50" stroke-width="1.6"/>
      <text x="510" y="90" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="11" font-weight="700" fill="#2c2a26">instrument 2 &#183; harness</text>
      <text x="510" y="112" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#6b6560">run_campaign.py, outside the app</text>
      <text x="510" y="132" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">independent grading (verify.py)</text>
      <text x="510" y="150" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">FAILED &#8594; savings void</text>

      <!-- reconciliation -->
      <line x1="325" y1="115" x2="375" y2="115" stroke="#2c3e50" stroke-width="1.6"/>
      <rect x="230" y="180" width="240" height="36" rx="18" fill="#4a67410c" stroke="#4a6741" stroke-width="1.6"/>
      <text x="350" y="202" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#4a6741">must agree: 100 cells, 0 disagreements</text>
      <text x="350" y="234" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#c0392b">the day they disagree, trust NEITHER until you know why</text>

      <!-- canary -->
      <rect x="55" y="258" width="270" height="56" rx="8" fill="#b8860b0c" stroke="#b8860b" stroke-width="1.6"/>
      <text x="190" y="280" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="11" font-weight="700" fill="#2c2a26">the canary arm (no fallback)</text>
      <text x="190" y="300" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b6560">broken infra fails LOUDLY here, never politely</text>

      <!-- three quantities -->
      <rect x="375" y="258" width="270" height="56" rx="8" fill="#2c3e500c" stroke="#2c3e50" stroke-width="1.6"/>
      <text x="510" y="278" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#2c2a26">the Three Quantities</text>
      <text x="510" y="296" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#6b6560">mechanical floor &#183; others' sessions &#183; YOUR stack</text>
      <text x="510" y="309" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b6560">never compare across classes unlabeled</text>

      <text x="350" y="352" text-anchor="middle" font-family="Fraunces,serif" font-size="12" fill="#2c2a26">71.5x (their floor) vs 9.1x (your replay) is apples vs invoices</text>
      <text x="350" y="374" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#6b6560">every shipped cell carries its source label: synthetic-pre-recording until YOU record live</text>
    </svg>`;
