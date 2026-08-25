case "U12": return `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="700" height="400" fill="#f6f3ec" rx="8"/>
      <text x="350" y="30" text-anchor="middle" font-family="Fraunces,serif" font-size="16" font-weight="700" fill="#2c2a26">The Router: Cheapest Arm Among the CORRECT</text>

      <!-- question classes (left) -->
      <text x="120" y="62" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#6b6560">QUESTION CLASS</text>
      <rect x="45" y="76" width="150" height="34" rx="6" fill="#ffffff" stroke="#2c3e50" stroke-width="1.3"/>
      <text x="120" y="97" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">canonical (Q3,Q4)</text>
      <rect x="45" y="126" width="150" height="34" rx="6" fill="#ffffff" stroke="#2c3e50" stroke-width="1.3"/>
      <text x="120" y="147" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">abstention (Q7,Q8)</text>
      <rect x="45" y="176" width="150" height="34" rx="6" fill="#ffffff" stroke="#2c3e50" stroke-width="1.3"/>
      <text x="120" y="197" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">logic (Q5,Q6)</text>
      <rect x="45" y="226" width="150" height="34" rx="6" fill="#ffffff" stroke="#2c3e50" stroke-width="1.3"/>
      <text x="120" y="247" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">aggregation (Q9,Q10)</text>

      <!-- triage desk -->
      <rect x="255" y="140" width="130" height="60" rx="10" fill="#2c3e5014" stroke="#2c3e50" stroke-width="2"/>
      <text x="320" y="165" text-anchor="middle" font-family="Fraunces,serif" font-size="12" font-weight="700" fill="#2c2a26">routed</text>
      <text x="320" y="184" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b6560">derived from the grid</text>
      <line x1="195" y1="93" x2="253" y2="155" stroke="#2c3e50" stroke-width="1.1"/>
      <line x1="195" y1="143" x2="253" y2="163" stroke="#2c3e50" stroke-width="1.1"/>
      <line x1="195" y1="193" x2="253" y2="177" stroke="#2c3e50" stroke-width="1.1"/>
      <line x1="195" y1="243" x2="253" y2="185" stroke="#2c3e50" stroke-width="1.1"/>

      <!-- arms (right) -->
      <line x1="385" y1="152" x2="443" y2="95" stroke="#4a6741" stroke-width="1.4"/>
      <rect x="445" y="76" width="210" height="36" rx="6" fill="#4a67410c" stroke="#4a6741" stroke-width="1.4"/>
      <text x="550" y="98" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">okf &#183; 186 tok &#183; 100%</text>
      <line x1="385" y1="162" x2="443" y2="140" stroke="#4a6741" stroke-width="1.4"/>
      <rect x="445" y="122" width="210" height="36" rx="6" fill="#4a67410c" stroke="#4a6741" stroke-width="1.4"/>
      <text x="550" y="144" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">okf refusal &#183; 157 tok &#10003;</text>
      <line x1="385" y1="172" x2="443" y2="186" stroke="#4a6741" stroke-width="1.4"/>
      <rect x="445" y="168" width="210" height="36" rx="6" fill="#4a67410c" stroke="#4a6741" stroke-width="1.4"/>
      <text x="550" y="190" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">compressed &#183; passes Q5/Q6</text>
      <line x1="385" y1="182" x2="443" y2="232" stroke="#4a6741" stroke-width="1.4"/>
      <rect x="445" y="214" width="210" height="36" rx="6" fill="#4a67410c" stroke="#4a6741" stroke-width="1.4"/>
      <text x="550" y="236" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#2c2a26">isolated &#183; complete answer</text>

      <!-- disqualified arm -->
      <rect x="445" y="262" width="210" height="36" rx="6" fill="#c0392b0c" stroke="#c0392b" stroke-width="1.4" stroke-dasharray="5,3"/>
      <text x="550" y="280" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#c0392b">compressed on aggregation</text>
      <text x="550" y="293" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#c0392b">208 tok but FAILED Q9 &#8594; ineligible</text>
      <line x1="460" y1="266" x2="640" y2="294" stroke="#c0392b" stroke-width="2"/>
      <line x1="640" y1="266" x2="460" y2="294" stroke="#c0392b" stroke-width="2"/>

      <!-- verdict strip -->
      <rect x="80" y="330" width="540" height="44" rx="8" fill="#2c3e500c" stroke="#2c3e50" stroke-width="1.5"/>
      <text x="350" y="349" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="11" font-weight="700" fill="#2c2a26">routed: 239 median vs naive 1,696 &#8212; 7.1x at 100% correctness</text>
      <text x="350" y="366" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b6560">a FAILED arm is ineligible for its class at ANY price &#183; replay-mode numbers, labeled</text>
    </svg>`;
