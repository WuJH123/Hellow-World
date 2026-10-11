const cities = [
  [62, 30, "hub"], [68, 35, "hub"], [72, 43, "hub"], [64, 50, "hub"], [57, 45, "mid"],
  [50, 38, "mid"], [47, 53, "mid"], [42, 44, "mid"], [36, 48, "small"], [39, 34, "small"],
  [31, 40, "small"], [28, 55, "small"], [55, 60, "small"], [76, 57, "mid"], [80, 39, "mid"],
  [70, 25, "small"], [58, 24, "small"], [52, 29, "small"], [45, 27, "small"], [35, 31, "small"],
  [30, 64, "small"], [44, 66, "small"], [60, 69, "mid"], [73, 67, "small"], [82, 52, "small"],
];

const flows = [
  [20, 62, 42, 38], [42, 38, 64, 30], [64, 30, 78, 48],
  [30, 44, 56, 58], [56, 58, 82, 66], [46, 62, 70, 42],
  [58, 54, 72, 30], [58, 54, 34, 32], [58, 54, 80, 38],
];

const returnPeriods = [10, 20, 50, 100, 200, 500];

function cityNodes(mode = "network") {
  return cities
    .map(([x, y, kind], index) => `<span class="co-city co-${kind} co-${mode}" style="--x:${x};--y:${y};--i:${index}"></span>`)
    .join("");
}

function flowLines(className = "") {
  return flows
    .map(([x1, y1, x2, y2], index) => `<line class="${className}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="--i:${index}" />`)
    .join("");
}

function pageShell(inner, stepName) {
  return `<article class="co-scene co-${stepName}">${inner}</article>`;
}

function innovationStrip() {
  return `
    <div class="co-innovation-strip">
      <span><b>innovation 01</b> 306 city-by-city stress tests</span>
      <span><b>innovation 02</b> flood risk-extended MRIO</span>
      <span><b>innovation 03</b> spillover indicator for nonflooded cities</span>
    </div>
  `;
}

function innovationCue(label, text) {
  return `<div class="co-innovation-cue"><span>${label}</span><strong>${text}</strong></div>`;
}

export function renderColdopen(step) {
  if (step === 0) {
    return pageShell(
      `
        <div class="co-question-copy">
          <p class="co-kicker">urban flood stress test</p>
          <h1>一座城市被洪水淹了，损失真的只在这里吗？</h1>
          <div class="co-fact-row">
            <span>direct loss is local</span>
            <span>economic shock is networked</span>
          </div>
        </div>
        <div class="co-spread-stage" aria-label="flood impact spreading from one city through supply-chain network">
          <div class="co-map-silhouette"></div>
          <svg class="co-flow-svg co-spread-svg" viewBox="0 0 100 100" aria-hidden="true">${flowLines("co-outbound")}</svg>
          ${cityNodes("spread")}
          <div class="co-flood-core">
            <span>flooded city</span>
            <strong>direct damage</strong>
          </div>
          <div class="co-wave co-wave-1"></div>
          <div class="co-wave co-wave-2"></div>
          <div class="co-wave co-wave-3"></div>
          <div class="co-receiver-tag co-tag-up">upstream suppliers</div>
          <div class="co-receiver-tag co-tag-down">downstream buyers</div>
          <div class="co-loss-taxonomy">
            <span>direct: capital / labor</span>
            <span>local-indirect: city production</span>
            <span>ripple: losses elsewhere</span>
            <span>spillover: passive exposure</span>
          </div>
          <div class="co-local-note">The question is not only where water goes, but where the bill propagates.</div>
        </div>
        ${innovationCue("problem innovation", "from inundation footprint to economic footprint")}
      `,
      "question",
    );
  }

  if (step === 1) {
    return pageShell(
      `
        <div class="co-evidence-wall">
          <img src="./public/assets/paper-title-crop.png" alt="Nature Cities paper title crop" />
        </div>
        <div class="co-thesis-card">
          <p class="co-kicker">paper evidence</p>
          <h2>洪水发生在本地，经济足迹沿供应链外溢。</h2>
          <dl>
            <div><dt>journal</dt><dd>Nature Cities</dd></div>
            <div><dt>published</dt><dd>19 Jan 2026</dd></div>
            <div><dt>unit</dt><dd>306 Chinese cities</dd></div>
          </dl>
        </div>
        <div class="co-gap-card">
          <span>research gap</span>
          <strong>传统洪水评估偏向本地直接损失，容易漏掉供应链级联损失。</strong>
          <em>local direct damage is visible; cascading economic impact is often hidden</em>
        </div>
        ${innovationCue("research gap", "direct damage + indirect propagation in one framework")}
      `,
      "paper",
    );
  }

  if (step === 2) {
    return pageShell(
      `
        <div class="co-china-network">
          <div class="co-map-silhouette"></div>
          ${cityNodes("network")}
          <div class="co-region-band co-band-coast">coastal economic hubs</div>
          <div class="co-region-band co-band-inland">inland loss-to-GDP pressure</div>
          <span class="co-hub-label co-l-shanghai">Shanghai</span>
          <span class="co-hub-label co-l-guangzhou">Guangzhou</span>
          <span class="co-hub-label co-l-zhengzhou">Zhengzhou</span>
        </div>
        <aside class="co-stat-panel">
          <p class="co-kicker">sample frame</p>
          <strong>306</strong>
          <span>Chinese cities</span>
          <em>每座城市既是受灾单元，也是经济网络节点。</em>
        </aside>
        <div class="co-network-legend">
          <span><b></b> national hubs</span>
          <span><b></b> regional hubs</span>
          <span><b></b> exposed nodes</span>
        </div>
        <div class="co-resolution-card">
          <span>schematic based on study frame</span>
          <strong>从全国总量下钻到城市异质性</strong>
          <em>306 cities are treated as distinct economic units embedded in a national supply-chain network</em>
        </div>
        ${innovationCue("scale innovation", "urban-level stress tests across 306 cities")}
      `,
      "cities",
    );
  }

  if (step === 3) {
    return pageShell(
      `
        <div class="co-period-header">
          <p class="co-kicker">scenario design</p>
          <h2>不是一次真实洪水，而是六档城市压力测试。</h2>
          <p>六档重现期不是只看水更深，而是观察损失结构如何从本地直接损失转向供应链级联损失。</p>
        </div>
        <div class="co-period-board">
          ${returnPeriods
            .map((year, index) => `
              <div class="co-period-lane" style="--i:${index}">
                <span>${year}</span>
                <em>year</em>
                <b></b>
              </div>
            `)
            .join("")}
        </div>
        <div class="co-shift-panel">
          <div>
            <span>10-50 year</span>
            <strong>capital damage leads</strong>
          </div>
          <div>
            <span>100-200 year</span>
            <strong>local-indirect losses become central</strong>
          </div>
          <div>
            <span>all severities</span>
            <strong>ripple grows through supply chains</strong>
          </div>
        </div>
        <div class="co-period-source">
          paper design: 10, 20, 50, 100, 200 and 500-year fluvial flood scenarios
        </div>
        ${innovationCue("design innovation", "stress-test severity gradients, not a single historical event")}
      `,
      "periods",
    );
  }

  return pageShell(
    `
      <div class="co-mechanism">
        <div class="co-mech-map">
          <div class="co-map-silhouette"></div>
          <svg class="co-flow-svg co-hot" viewBox="0 0 100 100" aria-hidden="true">
            ${flowLines("co-outbound")}
            ${flowLines("co-inbound")}
          </svg>
          ${cityNodes("cascade")}
          <div class="co-flood-origin">flooded city</div>
          <div class="co-ripple-label">ripple: 我出事，别人掉产出</div>
          <div class="co-spillover-label">spillover: 别人出事，我被动受损</div>
        </div>
        <div class="co-pipeline">
          <div class="co-pipe co-active"><span>hazard</span><strong>water depth</strong></div>
          <div class="co-pipe"><span>exposure</span><strong>assets + people</strong></div>
          <div class="co-pipe"><span>direct loss</span><strong>capital / labor</strong></div>
          <div class="co-pipe"><span>local indirect</span><strong>city production slows</strong></div>
          <div class="co-pipe"><span>flood risk-extended MRIO</span><strong>traces production shocks</strong></div>
          <div class="co-pipe co-ripple"><span>ripple effect</span><strong>downstream propagation</strong></div>
          <div class="co-pipe co-spillover"><span>spillover impact</span><strong>passive loss in nonflooded cities</strong></div>
        </div>
        <div class="co-network-copy">
          <p class="co-kicker">hazard + supply chain</p>
          <h2>把洪水图层和供应链图层叠在一起。</h2>
        </div>
        ${innovationStrip()}
      </div>
    `,
    "network",
  );
}
