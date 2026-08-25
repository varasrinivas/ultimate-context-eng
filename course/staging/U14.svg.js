case "U14": return `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="700" height="400" fill="#f6f3ec" rx="8"/>
      <text x="350" y="30" text-anchor="middle" font-family="Fraunces,serif" font-size="16" font-weight="700" fill="#2c2a26">The Capstone Protocol &#8594; The Scorecard</text>

      <!-- protocol pipeline -->
      <rect x="40" y="60" width="95" height="52" rx="7" fill="#ffffff" stroke="#2c3e50" stroke-width="1.4"/>
      <text x="87" y="82" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2c2a26">1 contract</text>
      <text x="87" y="98" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#6b6560">seed verifies</text>
      <rect x="147" y="60" width="95" height="52" rx="7" fill="#ffffff" stroke="#2c3e50" stroke-width="1.4"/>
      <text x="194" y="82" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2c2a26">2 grader</text>
      <text x="194" y="98" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#6b6560">selftest can fail</text>
      <rect x="254" y="60" width="95" height="52" rx="7" fill="#ffffff" stroke="#2c3e50" stroke-width="1.4"/>
      <text x="301" y="82" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2c2a26">3 app</text>
      <text x="301" y="98" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#6b6560">tests green &#183; boot</text>
      <rect x="361" y="60" width="95" height="52" rx="7" fill="#ffffff" stroke="#2c3e50" stroke-width="1.4"/>
      <text x="408" y="82" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2c2a26">4 campaign</text>
      <text x="408" y="98" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#6b6560">100 graded cells</text>
      <rect x="468" y="60" width="95" height="52" rx="7" fill="#ffffff" stroke="#2c3e50" stroke-width="1.4"/>
      <text x="515" y="82" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2c2a26">5 reconcile</text>
      <text x="515" y="98" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#6b6560">0 disagreements</text>
      <rect x="575" y="60" width="95" height="52" rx="7" fill="#ffffff" stroke="#2c3e50" stroke-width="1.4"/>
      <text x="622" y="82" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2c2a26">6 route</text>
      <text x="622" y="98" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#6b6560">re-derive table</text>
      <line x1="135" y1="86" x2="147" y2="86" stroke="#2c3e50" stroke-width="1.4"/>
      <line x1="242" y1="86" x2="254" y2="86" stroke="#2c3e50" stroke-width="1.4"/>
      <line x1="349" y1="86" x2="361" y2="86" stroke="#2c3e50" stroke-width="1.4"/>
      <line x1="456" y1="86" x2="468" y2="86" stroke="#2c3e50" stroke-width="1.4"/>
      <line x1="563" y1="86" x2="575" y2="86" stroke="#2c3e50" stroke-width="1.4"/>
      <text x="350" y="132" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#c0392b">each step gated by the previous &#8212; skip one and the scorecard refuses to render</text>

      <!-- the scorecard -->
      <rect x="150" y="150" width="400" height="180" rx="10" fill="#ffffff" stroke="#2c3e50" stroke-width="2"/>
      <text x="350" y="174" text-anchor="middle" font-family="Fraunces,serif" font-size="13" font-weight="700" fill="#2c2a26">MASTERY SCORECARD</text>
      <line x1="170" y1="184" x2="530" y2="184" stroke="#e0dbd3" stroke-width="1"/>
      <text x="180" y="204" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">1 tokens: routed 239 vs naive 1,696 (7.1x) [replay]</text>
      <text x="180" y="226" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">2 correctness: 100% routed &#183; FAILs named &amp; voided</text>
      <text x="180" y="248" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">3 truth: Q7/Q8 refusals PASS &#183; fidelity asserted</text>
      <text x="180" y="270" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">4 freshness: contract verified &#183; gates timestamped</text>
      <text x="180" y="292" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">5 provenance: every number's quantity class stated</text>
      <text x="350" y="318" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b6560">every line survives the question: "how do you know?"</text>

      <text x="350" y="360" text-anchor="middle" font-family="Fraunces,serif" font-size="12" fill="#2c2a26">tokens &#8595; at 100% key-fact correctness &#8212; never tokens alone</text>
      <text x="350" y="380" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b6560">+ a seams section: two places your stages meet that could fail without an error</text>
    </svg>`;
