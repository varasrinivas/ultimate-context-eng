case "U02": return `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="700" height="400" fill="#f6f3ec" rx="8"/>
      <text x="350" y="30" text-anchor="middle" font-family="Fraunces,serif" font-size="16" font-weight="700" fill="#2c2a26">The Graded Baseline Grid</text>
      <text x="350" y="48" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#6b6560">10 modes &#215; 10 questions &#183; tokens AND verdict per cell &#183; replay (synthetic-pre-recording)</text>

      <!-- mode rows: bar = median tokens (correct only), scaled 1805 -> 340px -->
      <g font-family="JetBrains Mono,monospace" font-size="10">
        <text x="150" y="88"  text-anchor="end" fill="#2c2a26">isolated</text><rect x="162" y="78"  width="340" height="14" fill="#d8d2c6"/><text x="508" y="89"  fill="#6b6560" font-size="9">1,805</text>
        <text x="150" y="112" text-anchor="end" fill="#2c2a26">naive</text><rect x="162" y="102" width="319" height="14" fill="#c0392b" opacity="0.75"/><text x="487" y="113" fill="#6b6560" font-size="9">1,696 &#183; 90%!</text>
        <text x="150" y="136" text-anchor="end" fill="#2c2a26">cached</text><rect x="162" y="126" width="138" height="14" fill="#d8d2c6"/><text x="306" y="137" fill="#6b6560" font-size="9">731 (mostly cache reads when warm)</text>
        <text x="150" y="160" text-anchor="end" fill="#2c2a26">budgeted</text><rect x="162" y="150" width="105" height="14" fill="#2e6b8a"/><text x="273" y="161" fill="#6b6560" font-size="9">560</text>
        <text x="150" y="184" text-anchor="end" fill="#2c2a26">graph</text><rect x="162" y="174" width="84" height="14" fill="#2e6b8a"/><text x="252" y="185" fill="#6b6560" font-size="9">444</text>
        <text x="150" y="208" text-anchor="end" fill="#2c2a26">jit</text><rect x="162" y="198" width="47" height="14" fill="#2e6b8a"/><text x="215" y="209" fill="#6b6560" font-size="9">251</text>
        <text x="150" y="232" text-anchor="end" fill="#2c2a26">routed</text><rect x="162" y="222" width="45" height="14" fill="#4a6741"/><text x="213" y="233" fill="#6b6560" font-size="9">239 &#183; 100%</text>
        <text x="150" y="256" text-anchor="end" fill="#2c2a26">compressed</text><rect x="162" y="246" width="44" height="14" fill="#b8860b" opacity="0.75"/><text x="212" y="257" fill="#6b6560" font-size="9">231 &#183; 90%!</text>
        <text x="150" y="280" text-anchor="end" fill="#2c2a26">notes</text><rect x="162" y="270" width="37" height="14" fill="#2e6b8a"/><text x="205" y="281" fill="#6b6560" font-size="9">198</text>
        <text x="150" y="304" text-anchor="end" fill="#2c2a26">okf</text><rect x="162" y="294" width="35" height="14" fill="#4a6741"/><text x="203" y="305" fill="#6b6560" font-size="9">186 &#183; cheapest correct</text>
      </g>

      <!-- the two FAIL callouts -->
      <rect x="530" y="96" width="150" height="52" fill="#ffffff" stroke="#c0392b" rx="4"/>
      <text x="605" y="114" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#c0392b">naive &#215; Q7: FAIL</text>
      <text x="605" y="127" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="8" fill="#6b6560">fabricated DOB</text>
      <text x="605" y="140" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="8" fill="#6b6560">(disclosed synthetic)</text>
      <rect x="530" y="240" width="150" height="52" fill="#ffffff" stroke="#b8860b" rx="4"/>
      <text x="605" y="258" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#b8860b">compressed &#215; Q9: FAIL</text>
      <text x="605" y="271" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="8" fill="#6b6560">dropped PA-1004</text>
      <text x="605" y="284" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="8" fill="#6b6560">savings VOID</text>

      <!-- methodology footer -->
      <rect x="60" y="326" width="580" height="50" fill="#ffffff" stroke="#d8d2c6" rx="6"/>
      <text x="350" y="346" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#2c2a26">median of fresh sessions &#183; two graders must agree (app stamp = harness verdict) &#183; the canary rule</text>
      <text x="350" y="362" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="8.5" fill="#6b6560">cheapest CORRECT per class beats cheapest overall &#8212; a FAIL voids the number</text>
    </svg>`;
