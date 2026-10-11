function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function lines(items) {
  return items.map((item) => `<span>${esc(item)}</span>`).join("");
}

function meter(label, value, note = "", active = false) {
  return `
    <div class="ac-meter ${active ? "ac-active" : ""}" style="--v:${value}">
      <span>${esc(label)}</span>
      <b></b>
      <em>${esc(note)}</em>
    </div>
  `;
}

function node(label, x, y, kind = "small") {
  return `<span class="ac-node ac-${kind}" style="--x:${x};--y:${y}">${esc(label)}</span>`;
}

function statTiles(items = []) {
  return `
    <div class="ac-conf-stats">
      ${items.map(([value, label]) => `
        <div>
          <strong>${esc(value)}</strong>
          <span>${esc(label)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function paperPanel(spec) {
  if (!spec.asset) return "";
  return `
    <figure class="ac-paper-panel">
      <img src="${esc(spec.asset)}" alt="${esc(spec.assetAlt || spec.title)}" />
      <figcaption>${esc(spec.assetCaption || spec.source)}</figcaption>
    </figure>
  `;
}

function renderConferenceConcept(visual, step) {
  if (visual === "method") {
    const items = step.points || ["flood map", "exposure", "direct loss", "MRIO", "ripple / spillover"];
    return `<div class="ac-conf-flow">${items.map((item, index) => `<span class="${index === step.active ? "ac-active" : ""}">${esc(item)}</span>`).join("<b></b>")}</div>`;
  }
  if (visual === "taxonomy") {
    const losses = [
      ["capital", "资产损伤"],
      ["labor", "生产能力下降"],
      ["local indirect", "城内链条卡住"],
      ["ripple", "冲击向外传播"],
      ["spillover", "外部冲击输入"],
    ];
    return `<div class="ac-loss-ledger">${losses.map((item, index) => `<span class="${index === step.active ? "ac-active" : ""}"><em>${esc(item[0])}</em><strong>${esc(item[1])}</strong></span>`).join("")}</div>`;
  }
  if (visual === "national") {
    return `
      <div class="ac-scenario-board">
        ${meter("10-year", 54, "5.37% GDP", step.active === 0)}
        ${meter("500-year", 76, "7.55% GDP", step.active === 1)}
        ${meter("direct", 54, "53.56%", step.active === 2)}
        ${meter("indirect", 46, "46.44%", step.active === 2 || step.active === 3)}
      </div>
    `;
  }
  if (visual === "equity") {
    const pairs = [
      ["Guangzhou", "Chaozhou", "13x absolute / 2x ratio"],
      ["Nanning", "Shanghai", "29.44% / 3.21% labor"],
      ["Beijing", "Baoding", "637.39bn / 4.24% GDP"],
    ];
    return `<div class="ac-equity-board">${pairs.map((pair, index) => `<div class="${index === step.active ? "ac-active" : ""}"><span>${esc(pair[0])}</span><b></b><span>${esc(pair[1])}</span><strong>${esc(pair[2])}</strong></div>`).join("")}</div>`;
  }
  if (visual === "network") {
    return `
      <div class="ac-hub-board">
        ${node("Beijing", 25, 26, step.active === 0 ? "hub active" : "hub")}
        ${node("Shanghai", 70, 38, step.active === 1 ? "hub active" : "hub")}
        ${node("Guangzhou", 63, 72, step.active === 2 ? "mid active" : "mid")}
        ${node("Wuhan", 48, 55, step.active === 2 ? "mid active" : "mid")}
        ${node("Zhengzhou", 43, 42, step.active === 3 ? "mid active" : "mid")}
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <line x1="70" y1="38" x2="20" y2="22" />
          <line x1="70" y1="38" x2="84" y2="18" />
          <line x1="70" y1="38" x2="84" y2="82" />
          <line x1="63" y1="72" x2="54" y2="70" />
          <line x1="48" y1="55" x2="41" y2="62" />
        </svg>
      </div>
    `;
  }
  if (visual === "sector") {
    const sectors = [
      ["other services", "3.33 万亿元"],
      ["heavy manufacturing", "7450 亿元"],
      ["light manufacturing", "10.99%"],
      ["transport + construction", "37% / 25%"],
    ];
    return `<div class="ac-sector-board">${sectors.map((item, index) => `<div class="${index === step.active ? "ac-active" : ""}"><span>${esc(item[0])}</span><strong>${esc(item[1])}</strong></div>`).join("")}</div>`;
  }
  if (visual === "spillover") {
    return `
      <div class="ac-spillover-board">
        <div class="${step.active < 2 ? "ac-active" : ""}"><span>ripple</span><strong>我出事</strong><b></b><strong>别人掉产出</strong></div>
        <div class="${step.active >= 2 ? "ac-active" : ""}"><span>spillover</span><strong>别人出事</strong><b class="ac-back"></b><strong>我被动受损</strong></div>
      </div>
    `;
  }
  if (visual === "policy") {
    const levers = [
      ["供应冗余", "多源供应 / 关键备货"],
      ["通道冗余", "绕行通道 / 分布式仓储"],
      ["快恢复", "停工 24→3 月：-32%"],
      ["劳动力连续性", "恢复 0.7→3.0：-45%"],
    ];
    return `<div class="ac-policy-lab">${levers.map((item, index) => `<div class="${index === step.active ? "ac-active" : ""}"><span>${esc(item[0])}</span><strong>${esc(item[1])}</strong></div>`).join("")}</div>`;
  }
  return "";
}

function renderConference(step, spec) {
  return `
    <div class="ac-conf-board ac-conf-${esc(spec.visual || "generic")}">
      ${paperPanel(spec)}
      <section class="ac-conf-claim">
        <span>${esc(step.tag)}</span>
        <strong>${esc(step.headline)}</strong>
        <p>${esc(step.sub)}</p>
      </section>
      ${renderConferenceConcept(spec.visual, step)}
      ${statTiles(step.stats || spec.stats)}
    </div>
  `;
}

function renderMethod(step) {
  const items = ["inundation", "exposure", "capital", "labor", "MRIO", "recovery", "drivers"];
  return `
    <div class="ac-method-grid">
      ${items.map((item, index) => `
        <div class="ac-method-node ${index === step.active ? "ac-active" : ""}">
          <span>0${index + 1}</span><strong>${esc(item)}</strong>
        </div>
      `).join("")}
    </div>
    <div class="ac-method-card">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
    <div class="ac-evidence-stack">
      ${lines(step.evidence || [])}
    </div>
  `;
}

function renderLoss(step) {
  const losses = [
    ["capital", "资产 / 设备 / 基础设施"],
    ["labor", "人口暴露 / 生产能力"],
    ["local indirect", "城内产业互相拖慢"],
    ["ripple", "冲击传到其他城市"],
  ];
  return `
    <div class="ac-loss-grid">
      ${losses.map(([name, desc], index) => `
        <div class="ac-loss-tile ${index === step.active ? "ac-active" : ""}">
          <span>${esc(name)}</span><strong>${esc(desc)}</strong>
        </div>
      `).join("")}
    </div>
    <div class="ac-loss-focus">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
  `;
}

function renderDirection(step) {
  return `
    <div class="ac-direction-lanes">
      <div class="ac-route ${step.active !== 2 ? "ac-active" : ""}">
        <span>ripple direction</span>
        <strong>我淹了</strong>
        <b></b>
        <strong>别人掉产出</strong>
      </div>
      <div class="ac-route ${step.active === 2 ? "ac-active" : ""}">
        <span>spillover direction</span>
        <strong>别人淹了</strong>
        <b class="ac-back"></b>
        <strong>我被动受损</strong>
      </div>
    </div>
    <div class="ac-direction-copy">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
  `;
}

function renderNational(step) {
  return `
    <div class="ac-national-scale">
      ${meter("10-year", 54, "5.37% GDP", step.active === 0)}
      ${meter("500-year", 76, "7.55% GDP", step.active === 2)}
      ${meter("increase", 41, "+40.73%", step.active === 3)}
    </div>
    <div class="ac-big-number">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.metric)}</strong>
      <p>${esc(step.headline)}</p>
    </div>
    <div class="ac-compact-note">${esc(step.sub)}</div>
  `;
}

function renderShift(step) {
  return `
    <div class="ac-shift-bars">
      ${meter("direct loss", 54, "53.56%", step.active === 5)}
      ${meter("indirect loss", 46, "46.44%", step.active === 5 || step.active === 6)}
      ${meter("industrial + commercial", 72, ">70%", step.active === 7)}
      ${meter("local-indirect increment", 62, "100-200 yr", step.active === 1 || step.active === 2)}
    </div>
    <div class="ac-system-diagram">
      ${["people", "goods", "services", "orders"].map((item, index) => `<span style="--i:${index}">${esc(item)}</span>`).join("")}
    </div>
    <div class="ac-shift-copy">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
  `;
}

function renderCityCompare(step) {
  return `
    <div class="ac-compare-board">
      <div>${meter("Guangzhou", 82, "absolute loss high", step.active === 1 || step.active === 2)}</div>
      <div>${meter("Chaozhou", 45, "loss ratio higher", step.active === 3)}</div>
      <div>${meter("Nanning", 94, "labor loss 29.44%", step.active === 4)}</div>
      <div>${meter("Shanghai", 32, "labor loss 3.21%", step.active === 5)}</div>
    </div>
    <div class="ac-case-copy">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
  `;
}

function renderEvent(step) {
  return `
    <div class="ac-event-split">
      <div class="${step.active < 2 ? "ac-active" : ""}">
        <span>Beijing 2023</span>
        <strong>637.39 亿元</strong>
        <em>1.46% of GDP</em>
      </div>
      <div class="${step.active >= 2 ? "ac-active" : ""}">
        <span>Baoding 2023</span>
        <strong>169.95 亿元</strong>
        <em>4.24% of GDP</em>
      </div>
    </div>
    <div class="ac-case-copy">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
  `;
}

function renderDrivers(step) {
  const factors = ["low elevation", "dense rivers", "heavy rainfall", "GDP per capita", "population density", "public capital income"];
  return `
    <div class="ac-factor-matrix">
      ${factors.map((item, index) => `<span class="${index === step.active ? "ac-active" : ""}">${esc(item)}</span>`).join("")}
    </div>
    <div class="ac-r2-card">
      <span>random forest</span>
      <strong>R² = 0.72</strong>
      <em>自然条件 + 社会经济条件共同解释城市敏感性</em>
    </div>
    <div class="ac-case-copy">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
  `;
}

function renderNetwork(step) {
  return `
    <div class="ac-network-map">
      ${node("Beijing", 34, 28, step.active === 1 || step.active === 2 ? "hub active" : "hub")}
      ${node("Shanghai", 67, 42, step.active === 1 || step.active === 2 || step.active === 3 ? "hub active" : "hub")}
      ${node("Guangzhou", 60, 70, step.active === 4 ? "mid active" : "mid")}
      ${node("Wuhan", 50, 54, step.active === 4 ? "mid active" : "mid")}
      ${node("Zhengzhou", 45, 43, "mid")}
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <line x1="67" y1="42" x2="20" y2="30" />
        <line x1="67" y1="42" x2="80" y2="22" />
        <line x1="67" y1="42" x2="78" y2="78" />
        <line x1="60" y1="70" x2="66" y2="74" />
        <line x1="50" y1="54" x2="52" y2="60" />
      </svg>
    </div>
    <div class="ac-network-stat">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.metric)}</strong>
      <p>${esc(step.headline)}</p>
      ${step.sub ? `<em>${esc(step.sub)}</em>` : ""}
    </div>
  `;
}

function renderRegional(step) {
  return `
    <div class="ac-regional-panels">
      <div class="${step.active <= 1 ? "ac-active" : ""}"><span>Guangzhou</span><strong>Shenzhen 13.9%</strong><em>Foshan 8.88% / spillover 28.01%</em></div>
      <div class="${step.active === 2 ? "ac-active" : ""}"><span>Wuhan</span><strong>top 6 cities > 50%</strong><em>Hubei regional loop</em></div>
      <div class="${step.active >= 3 ? "ac-active" : ""}"><span>Zhengzhou</span><strong>hybrid hub</strong><em>Shanghai / Foshan / Tianjin / Guangzhou / Chongqing</em></div>
    </div>
    <div class="ac-case-copy">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
  `;
}

function renderSector(step) {
  const sectors = [
    ["other services", "3.33 万亿元"],
    ["heavy manufacturing", "7450 亿元"],
    ["high-tech manufacturing", "5370 亿元"],
    ["light manufacturing", "10.99%"],
    ["food processing", "capital 39%"],
    ["textiles", "labor 34%"],
    ["transport + construction", "ripple 37% / 25%"],
  ];
  return `
    <div class="ac-sector-matrix">
      ${sectors.map(([name, value], index) => `<div class="${index === step.active ? "ac-active" : ""}"><span>${esc(name)}</span><strong>${esc(value)}</strong></div>`).join("")}
    </div>
    <div class="ac-case-copy">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
  `;
}

function renderPolicy(step) {
  const policies = [
    ["防输入型中断", "多源供应 / 关键备货 / 采购快切换"],
    ["防输出型中断", "绕行通道 / 分布式仓储 / 跨区域协调"],
    ["保本地恢复", "基本服务 / 区域互助 / 恢复安排"],
    ["风险分担", "保险覆盖供应链中断"],
  ];
  return `
    <div class="ac-policy-board">
      ${policies.map(([name, value], index) => `<div class="${index === step.active ? "ac-active" : ""}"><span>${esc(name)}</span><strong>${esc(value)}</strong></div>`).join("")}
    </div>
    <div class="ac-case-copy">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
  `;
}

function renderRecovery(step) {
  return `
    <div class="ac-recovery-bars">
      ${meter("overproduction 1.2 -> 3.0", 8, "4.36% -> 4.25%", step.active === 0)}
      ${meter("recovery time 24 -> 3 months", 32, "-32%", step.active === 1)}
      ${meter("labor recovery 0.7 -> 3.0", 45, "-45%", step.active === 2)}
    </div>
    <div class="ac-case-copy">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
  `;
}

function renderLimits(step) {
  const limits = [
    "fluvial flooding focus",
    "independent city stress tests",
    "national aggregate is conservative lower bound",
    "multi-city coshock can amplify ripple",
    "Yangtze River Delta coshock warning",
    "long-run substitution not fully endogenous",
    "value: diagnosis, not ranking only",
    "flood map + production network",
  ];
  return `
    <div class="ac-limit-stack">
      ${limits.map((item, index) => `<span class="${index === step.active ? "ac-active" : ""}">${esc(item)}</span>`).join("")}
    </div>
    <div class="ac-case-copy">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
  `;
}

function renderTwoWords(step) {
  return `
    <div class="ac-two-words">
      <div class="${step.active === 1 ? "ac-active" : ""}">
        <span>ripple</span>
        <strong>我出事，别人被我拖累</strong>
      </div>
      <div class="${step.active === 2 ? "ac-active" : ""}">
        <span>spillover</span>
        <strong>别人出事，我被动受损</strong>
      </div>
    </div>
    <div class="ac-case-copy">
      <span>${esc(step.tag)}</span>
      <strong>${esc(step.headline)}</strong>
      <p>${esc(step.sub)}</p>
    </div>
  `;
}

const renderers = {
  method: renderMethod,
  loss: renderLoss,
  direction: renderDirection,
  national: renderNational,
  shift: renderShift,
  cityCompare: renderCityCompare,
  event: renderEvent,
  drivers: renderDrivers,
  network: renderNetwork,
  regional: renderRegional,
  sector: renderSector,
  policy: renderPolicy,
  recovery: renderRecovery,
  limits: renderLimits,
  twoWords: renderTwoWords,
  conference: renderConference,
};

function renderChapter(spec, stepIndex) {
  const step = spec.steps[stepIndex] || spec.steps.at(-1);
  const renderer = renderers[spec.kind] || renderMethod;
  return `
    <article class="ac-scene ac-${spec.kind}">
      <header class="ac-header">
        <p>${esc(spec.kicker)}</p>
        <h1>${esc(spec.title)}</h1>
      </header>
      <section class="ac-visual">
        ${renderer(step, spec)}
      </section>
      <aside class="ac-innovation">
        <span>${esc(spec.innovationLabel)}</span>
        <strong>${esc(spec.innovation)}</strong>
      </aside>
      <div class="ac-source">${esc(spec.source)}</div>
    </article>
  `;
}

export const academicChapterSpecs = [
  {
    id: "method-stack",
    title: "方法创新：把洪水图接入生产网络",
    kicker: "method contribution",
    kind: "conference",
    visual: "method",
    asset: "./public/assets/paper-crops/extfig4-method-framework.png",
    assetAlt: "Extended Data Fig. 4 methodological framework",
    assetCaption: "原文 Extended Data Fig.4：淹没叠加、直接损失和经济恢复模块",
    innovationLabel: "core innovation 01",
    innovation: "不是只画水深图，而是把城市淹没、资产/人口暴露和 flood risk-extended MRIO 串成一台损失引擎",
    source: "Framework integrates flood map, land use, population, direct capital/labor loss, recovery, local indirect loss, ripple and spillover.",
    stats: [["306", "Chinese cities"], ["6", "return periods"], ["MRIO", "production network"], ["R² 0.72", "drivers"]],
    narrations: [
      "第一条创新，是把洪水风险从一张淹没图，接到一张城市生产网络图上。",
      "作者不是只算哪里被淹，而是叠加土地利用、人口和城市经济结构。",
      "直接损失之后，模型继续进入恢复模块和 MRIO 网络，追踪生产瓶颈。",
      "所以 306 座城市在这里不是点位，而是一个个会互相传导冲击的经济节点。",
    ],
    steps: [
      { active: 0, tag: "from hazard to economy", headline: "水深图只是入口，不是结论", sub: "原文把 flood map、land use、population 叠成城市级暴露层。", points: ["flood map", "land use", "population", "direct loss", "MRIO"], stats: [["306", "城市"], ["10-500y", "六档情景"], ["WorldPop", "100m人口"], ["8类", "用地损伤曲线"]] },
      { active: 1, tag: "direct damage", headline: "直接损失被拆成资本和劳动力两条通道", sub: "资产看水深损伤曲线，人看人口暴露和生产能力下降。", points: ["inundation", "capital", "labor", "recovery", "indirect"], stats: [["capital", "资产损伤"], ["labor", "生产能力"], ["recovery", "恢复过程"], ["overproduction", "临时超产"]] },
      { active: 3, tag: "network engine", headline: "MRIO 负责回答：冲击会沿供应链走到哪里", sub: "受灾城市的生产瓶颈会传给上下游，不再停留在行政边界内。", points: ["city shock", "bottleneck", "orders", "MRIO", "ripple"], stats: [["local indirect", "城内卡顿"], ["ripple", "向外传播"], ["spillover", "外部输入"], ["network", "全国生产链"]] },
      { active: 4, tag: "diagnostic model", headline: "这套框架的价值是诊断，而不是简单排名", sub: "它能说明哪个城市、哪个行业、哪条供应链路径更容易把水灾放大。", points: ["hazard", "exposure", "loss", "propagation", "policy"], stats: [["R²=0.72", "随机森林解释力"], ["natural", "水文地形"], ["socioeconomic", "资产人口产业"], ["policy", "分区分业治理"]] },
    ],
  },
  {
    id: "loss-grammar",
    title: "一张账本：五个必须分清的概念",
    kicker: "loss grammar",
    kind: "conference",
    visual: "taxonomy",
    asset: "./public/assets/paper-abstract-crop.png",
    assetAlt: "Paper abstract crop",
    assetCaption: "原文摘要：local direct damages、cascading supply-chain effects 与 spillover indicator",
    innovationLabel: "concept innovation",
    innovation: "把洪水损失从“直接损失”扩展为资本、劳动、本地间接、ripple 和 spillover 的方向性账本",
    source: "Direct losses include capital and labor; indirect losses include local-indirect and ripple; spillover measures passive losses in nonflooded cities.",
    stats: [["53.56%", "direct"], ["46.44%", "indirect"], ["ripple", "我淹了影响谁"], ["spillover", "别人淹了我损多少"]],
    narrations: [
      "顶会汇报里最容易讲乱的，是损失概念。这里需要先建一张账本。",
      "资本和劳动力是直接损失，本地间接是城市内部生产链条卡住。",
      "ripple 是冲击从受灾城市向外传播，spillover 是非受淹城市被动承受冲击。",
      "这篇文章真正新的地方，就是把这两个方向都放进城市级风险评估。",
    ],
    steps: [
      { active: 0, tag: "visible damage", headline: "资本损失：建筑、设备、基础设施被水损伤", sub: "这是传统洪水损失里最容易被看见的一层。", stats: [["capital", "直接"], ["water depth", "损伤函数"], ["assets", "建筑设备"], ["infrastructure", "基础设施"]] },
      { active: 1, tag: "human production", headline: "劳动力损失：人被积水影响，生产能力下降", sub: "论文把人口暴露直接接到经济产出，而不是只算财产损失。", stats: [["labor", "直接"], ["population", "暴露"], ["depth", "影响概率"], ["output", "产出下降"]] },
      { active: 2, tag: "local network", headline: "本地间接损失：城内产业互相拖慢", sub: "不是资产坏了，而是订单、投入品和服务在本地循环里卡住。", stats: [["local", "城内"], ["indirect", "生产链"], ["commerce", "本地服务"], ["recovery", "恢复时间"]] },
      { active: 4, tag: "direction matters", headline: "ripple 和 spillover 是同一网络的两个方向", sub: "ripple 看“我影响谁”；spillover 看“谁让我受损”。", stats: [["outbound", "ripple"], ["inbound", "spillover"], ["nonflooded", "非受淹城市"], ["indicator", "本文新指标"]] },
    ],
  },
  {
    id: "national-spatial-pattern",
    title: "全国图景：总量上升，结构更关键",
    kicker: "national footprint",
    kind: "conference",
    visual: "national",
    asset: "./public/assets/paper-crops/fig1-loss-maps.png",
    assetAlt: "Figure 1 spatial distribution of flood-induced losses",
    assetCaption: "原文 Fig.1：10 年与 500 年情景下，总损失、资本、劳动、本地间接和 ripple 的空间分布",
    innovationLabel: "stress-test finding",
    innovation: "从 10 年到 500 年，总损失增加 40.73%；但真正的风险转折是直接损失与间接损失几乎五五开",
    source: "10-year: 5.37% GDP / 4.27 trillion CNY; 500-year: 7.55% GDP / 6.01 trillion CNY; direct 53.56%, indirect 46.44%.",
    stats: [["5.37%", "10-year GDP footprint"], ["7.55%", "500-year GDP footprint"], ["+40.73%", "increase"], ["46.44%", "indirect loss"]],
    narrations: [
      "全国尺度上，10 年一遇情景已经对应 GDP 的 5.37%，约 4.27 万亿元。",
      "到 500 年一遇，经济足迹升到 GDP 的 7.55%，约 6.01 万亿元。",
      "但更关键的是结构：直接损失 53.56%，间接损失 46.44%，已经接近五五开。",
      "所以原文 Fig.1 的重点不是颜色更深，而是淹没图正在变成生产网络图。",
    ],
    steps: [
      { active: 0, tag: "10-year baseline", headline: "10 年一遇：已经是 4.27 万亿元量级", sub: "这里的一遇是重现期压力测试情景，不是历史频率预测。", stats: [["5.37%", "GDP"], ["4.27万亿", "CNY"], ["306", "独立城市压力测试"], ["lower bound", "保守下界"]] },
      { active: 1, tag: "500-year stress", headline: "500 年一遇：总经济足迹升到 6.01 万亿元", sub: "总量增加 40.73%，但空间差异和损失结构比单个总数更有解释力。", stats: [["7.55%", "GDP"], ["6.01万亿", "CNY"], ["+40.73%", "较10年"], ["nonlinear", "非线性"]] },
      { active: 2, tag: "half the story", headline: "只看直接损失，会漏掉接近半个经济故事", sub: "间接损失占 46.44%，说明淹没区不是损失的真实边界。", stats: [["53.56%", "直接损失"], ["46.44%", "间接损失"], ["32.08%", "local indirect"], ["14.36%", "ripple"]] },
      { active: 3, tag: "spatial reading", headline: "严重情景下，损失从资产修复转向系统恢复", sub: "100-200 年阶段，本地间接损失成为增量损失的重要来源。", stats: [["20-50y", "总损失增长最快"], ["100-200y", "本地间接接管"], ["industry", "资本通道"], ["commerce", "劳动/本地间接"]] },
    ],
  },
  {
    id: "equity-and-sensitivity",
    title: "城市公平：富城亏得多，弱城承压更重",
    kicker: "urban inequality",
    kind: "conference",
    visual: "equity",
    asset: "./public/assets/paper-crops/fig2-city-rankings.png",
    assetAlt: "Figure 2 top ten cities by loss category",
    assetCaption: "原文 Fig.2：按损失额与损失率排序的城市对照，颜色表示人均 GDP",
    innovationLabel: "equity finding",
    innovation: "同一类洪水压力下，绝对损失和 loss-to-GDP 暴露出两套完全不同的城市脆弱性",
    source: "Guangzhou capital loss is 13x Chaozhou, but Chaozhou loss ratio is nearly 2x; Nanning labor loss ratio is 29.44%.",
    stats: [["4x", "广州/潮州人均GDP"], ["13x", "广州/潮州资本损失"], ["~2x", "潮州相对压力"], ["29.44%", "南宁劳动损失率"]],
    narrations: [
      "第二个大结论是公平问题：富城市亏得多，但弱势城市承压更重。",
      "广州人均 GDP 是潮州的 4 倍，资本损失是潮州的 13 倍。",
      "可一旦换成 GDP 比例，潮州的资本损失率接近广州两倍。",
      "2023 年京津冀极端降雨也旁证了这个逻辑：北京绝对损失大，保定相对压力更高。",
    ],
    steps: [
      { active: 0, tag: "two rankings", headline: "金额排序和压力排序，不是在讲同一个风险", sub: "Fig.2 同时画 loss value 和 loss ratio，就是为了避免只按大城市金额判断。", stats: [["loss value", "绝对损失"], ["loss ratio", "GDP压力"], ["GDP color", "发展水平"], ["emerging risk", "新上榜城市"]] },
      { active: 0, tag: "Guangzhou versus Chaozhou", headline: "广州亏得多，潮州更疼", sub: "广州资本损失是潮州 13 倍，但潮州损失率接近广州两倍。", stats: [["Guangzhou", "绝对损失高"], ["Chaozhou", "相对压力高"], ["13x", "资本损失"], ["~2x", "损失率"]] },
      { active: 1, tag: "labor vulnerability", headline: "劳动力损失把弱势城市推到前台", sub: "南宁劳动损失率 29.44%，而广州和上海只有 3.79% 和 3.21%。", stats: [["Nanning", "29.44%"], ["Guangzhou", "3.79%"], ["Shanghai", "3.21%"], ["labor", "社会脆弱性"]] },
      { active: 2, tag: "real-event reference", headline: "现实旁证：北京金额大，保定压力大", sub: "2023 极端降雨中，北京 637.39 亿元/1.46% GDP；保定 169.95 亿元/4.24% GDP。", stats: [["Beijing", "637.39亿元"], ["1.46%", "GDP"], ["Baoding", "169.95亿元"], ["4.24%", "GDP"]] },
    ],
  },
  {
    id: "hub-typology",
    title: "供应链枢纽：不是所有大城市都用同一种方式传播风险",
    kicker: "network typology",
    kind: "conference",
    visual: "network",
    asset: "./public/assets/paper-crops/fig3-hub-maps.png",
    assetAlt: "Figure 3 hub maps for ripple and spillover",
    assetCaption: "原文 Fig.3：北京、上海、广州、武汉、郑州的 spillover 与 ripple 空间分布",
    innovationLabel: "network finding",
    innovation: "城市枢纽被分成全国分散型、区域闭环型和混合型；风险治理必须看传播形态，而不只是看城市等级",
    source: "Shanghai ripple effects reach 497 billion CNY, more than 9x Beijing's 53 billion CNY; Guangzhou/Wuhan are regional, Zhengzhou hybrid.",
    stats: [["497亿元", "上海 ripple"], ["53亿元", "北京 ripple"], ["13.9%", "深圳占广州ripple"], ["28.01%", "佛山占广州spillover"]],
    narrations: [
      "供应链部分需要讲成类型学，而不是再列一串城市名。",
      "北京和上海是全国分散型枢纽，但上海的涟漪损失达到 497 亿元，是北京 53 亿元的 9 倍多。",
      "广州和武汉更像区域闭环，影响主要锁在本省或城市群。",
      "郑州是混合型：它会影响本省，也高度依赖上海、佛山、天津、广州、重庆等外部节点。",
    ],
    steps: [
      { active: 0, tag: "type I", headline: "北京和上海：全国分散型枢纽", sub: "冲击会跨省扩散，但同为全国型，传播强度仍然差异巨大。", stats: [["Beijing", "national hub"], ["Shanghai", "national hub"], ["dispersed", "跨省扩散"], ["type I", "全国型"]] },
      { active: 1, tag: "Shanghai outlier", headline: "上海 ripple = 497 亿元，是北京 9 倍多", sub: "上海同时是消费中心、制造节点和物流节点，冲击更容易外溢。", stats: [["Shanghai", "497亿元"], ["Beijing", "53亿元"], ["9x", "强度差"], ["retail+manufacturing", "双重角色"]] },
      { active: 2, tag: "regional loops", headline: "广州和武汉：风险更多锁在区域内部", sub: "广州 ripple 中深圳占 13.9%、佛山 8.88%；武汉前六个相关城市贡献超过一半 spillover。", stats: [["Guangzhou", "区域闭环"], ["Shenzhen", "13.9%"], ["Foshan", "8.88% / 28.01%"], ["Wuhan", "省内圈层"]] },
      { active: 3, tag: "hybrid Zhengzhou", headline: "郑州：混合型枢纽，既输出也吸收冲击", sub: "上海、佛山、天津、广州、重庆都可能把上游中断传到郑州。", stats: [["Zhengzhou", "hybrid"], ["external inputs", "外部输入"], ["Henan", "本省影响"], ["logistics", "中原节点"]] },
    ],
  },
  {
    id: "sector-amplifiers",
    title: "行业放大器：谁会把洪水变成全国生产冲击",
    kicker: "sectoral propagation",
    kind: "conference",
    visual: "sector",
    asset: "./public/assets/paper-crops/fig4-transport-supplychains.png",
    assetAlt: "Figure 4 transport supply chain impacts",
    assetCaption: "原文 Fig.4：交通设备与交通运输部门的上下游 ripple / spillover 链条",
    innovationLabel: "sector insight",
    innovation: "政策不能只问哪里会淹，还要问哪些行业会把冲击传出去、传给谁",
    source: "Other services total loss: 3.33 trillion CNY; heavy manufacturing 745 billion, high-tech 537 billion; transport and construction contribute 37% and 25% of total ripple effects.",
    stats: [["3.33万亿", "其他服务业"], ["7450亿", "重制造"], ["10.99%", "轻制造损失率"], ["37%/25%", "交通/建筑ripple"]],
    narrations: [
      "行业层面是这篇文章最适合转成政策语言的地方。",
      "其他服务业总损失最高，重制造和高技术制造也很高；但按损失率看，轻制造最敏感。",
      "交通运输和建筑分别贡献全国总 ripple effects 的 37% 和 25%。",
      "这意味着，防洪不只是修堤和排水，还要保护那些会把本地停摆变成全国停摆的行业通道。",
    ],
    steps: [
      { active: 0, tag: "largest absolute loss", headline: "其他服务业总损失最高：3.33 万亿元", sub: "服务活动密集，城市停摆会快速转成消费、办公和生活服务损失。", stats: [["other services", "3.33万亿"], ["heavy manufacturing", "7450亿"], ["high-tech", "5370亿"], ["commercial", "本地间接高"]] },
      { active: 1, tag: "manufacturing network", headline: "制造业不是只损坏设备，而是牵动更长供应链", sub: "重制造和高技术制造金额高，加工食品与重制造资本损失占比最高。", stats: [["processed food", "capital 39%"], ["heavy manufacturing", "capital 38%"], ["high-tech", "5370亿"], ["supply chain", "长链条"]] },
      { active: 2, tag: "relative sensitivity", headline: "轻制造损失率最高：10.99%", sub: "相对脆弱性不等于绝对金额最大，这正是城市水文经济风险的难点。", stats: [["light manufacturing", "10.99%"], ["textiles", "labor 34%"], ["labor channel", "劳动通道"], ["ratio", "相对风险"]] },
      { active: 3, tag: "ripple conduit", headline: "交通运输和建筑，是 ripple 的关键通道", sub: "交通运输贡献全国总 ripple effects 的 37%，建筑贡献 25%。", stats: [["transport", "37% ripple"], ["construction", "25% ripple"], ["logistics", "绕行能力"], ["redundancy", "通道冗余"]] },
    ],
  },
  {
    id: "spillover-dashboard",
    title: "外溢风险：非受淹城市也有洪水账单",
    kicker: "spillover indicator",
    kind: "conference",
    visual: "spillover",
    asset: "./public/assets/paper-crops/extfig2-spillover-maps.png",
    assetAlt: "Extended Data Figure 2 spillover maps",
    assetCaption: "原文 Extended Data Fig.2：10 年与 500 年情景下 spillover impact 与 value-added loss",
    innovationLabel: "indicator innovation",
    innovation: "spillover indicator 把“没有被淹但被供应链拖累”的城市脆弱性显性化",
    source: "Cities susceptible to spillover include Shanghai, Guangzhou, Tianjin, Nanjing and Beijing; top spillover cities are shown in Extended Data Fig.3.",
    stats: [["Shanghai", "高 spillover"], ["Guangzhou", "高 spillover"], ["Tianjin", "高 spillover"], ["nonflooded", "被动受损"]],
    narrations: [
      "外溢风险是这篇论文最应该被记住的概念之一。",
      "ripple 讲的是受灾城市把冲击传出去；spillover 讲的是非受淹城市从外部吸收冲击。",
      "上海、广州、天津、南京、北京这类高度连接城市，可能没有本地淹没，也会承受供应链损失。",
      "这让城市防洪从本地工程问题，变成跨城市生产网络的共同治理问题。",
    ],
    steps: [
      { active: 0, tag: "outbound risk", headline: "ripple：我被淹，别人掉产出", sub: "这是从受灾城市出发，追踪冲击向外传播。", stats: [["origin", "受灾城市"], ["path", "供应链"], ["effect", "外部产出损失"], ["policy", "防输出中断"]] },
      { active: 2, tag: "inbound risk", headline: "spillover：别人被淹，我被动受损", sub: "这解释了为什么非受淹城市也需要关心别处的洪水。", stats: [["receiver", "非受淹城市"], ["upstream", "供应商"], ["logistics", "物流依赖"], ["policy", "防输入中断"]] },
      { active: 2, tag: "hub vulnerability", headline: "越连接，越可能被外部洪水拖住", sub: "上海、广州、天津、南京、北京等枢纽城市，是典型的被动风险承载者。", stats: [["Shanghai", "trade hub"], ["Guangzhou", "manufacturing"], ["Tianjin", "port/logistics"], ["Nanjing/Beijing", "regional centers"]] },
      { active: 3, tag: "governance shift", headline: "治理逻辑从“保护本地”变成“保护网络”", sub: "供应商多元化、关键库存和跨区域应急协议，都是 spillover 视角下的防洪措施。", stats: [["diversification", "多源供应"], ["inventory", "关键备货"], ["coordination", "跨区协调"], ["insurance", "中断保险"]] },
    ],
  },
  {
    id: "conference-takeaway",
    title: "顶会式结论：洪水风险是一张城市生产网络图",
    kicker: "synthesis for discussion",
    kind: "conference",
    visual: "policy",
    asset: "./public/assets/paper-crops/extfig3-spillover-bars.png",
    assetAlt: "Extended Data Figure 3 top spillover cities",
    assetCaption: "原文 Extended Data Fig.3：spillover impact 前十城市与损失率对照",
    innovationLabel: "final synthesis",
    innovation: "本文最强的贡献不是给城市排危险榜，而是把城市水文风险、经济脆弱性和供应链治理放到同一个诊断框架里",
    source: "Limit: fluvial flooding and independent city stress tests; national aggregate is a conservative lower bound; multi-city coshocks may amplify ripple losses.",
    stats: [["24→3月", "-32% indirect"], ["0.7→3.0", "-45% indirect"], ["coshock", "可放大涟漪"], ["not ranking", "是诊断框架"]],
    narrations: [
      "最后收束成一句话：洪水风险已经不是一张淹没地图，而是一张城市生产网络图。",
      "政策上，全国型枢纽要防输入型中断，物流门户要防输出型中断，区域枢纽要保本地恢复。",
      "敏感性分析显示，缩短恢复时间和加快劳动力恢复，比单纯提高超额生产能力更有效。",
      "也要讲清边界：这是河流洪水、独立城市压力测试，全国合计是保守下界，多城市共同冲击可能更强。",
    ],
    steps: [
      { active: 0, tag: "policy translation", headline: "从城市排名，转向风险角色诊断", sub: "同样是高风险城市，可能是输入脆弱、输出放大、区域闭环或混合型枢纽。", stats: [["input risk", "防供应中断"], ["output risk", "防物流中断"], ["regional loop", "保本地恢复"], ["hybrid", "双向治理"]] },
      { active: 1, tag: "network resilience", headline: "韧性建设的对象，不只是排水系统", sub: "还包括供应商冗余、绕行通道、分布式仓储和跨区域恢复协议。", stats: [["supplier", "多元化"], ["corridor", "绕行"], ["warehouse", "分布式"], ["coordination", "跨区恢复"]] },
      { active: 2, tag: "recovery levers", headline: "快恢复比临时多生产更管用", sub: "恢复时间 24 个月压到 3 个月，间接损失约降 32%；劳动力恢复速度提高，约降 45%。", stats: [["overproduction", "4.36→4.25%"], ["duration", "-32%"], ["labor recovery", "-45%"], ["continuity", "人员回归"]] },
      { active: 3, tag: "critical caveat", headline: "结论要强，但边界也要清楚", sub: "本文主要研究河流洪水；每座城市独立压力测试；多城市共同冲击可能显著放大 ripple。", stats: [["fluvial", "灾种边界"], ["independent", "单城压力测试"], ["lower bound", "保守下界"], ["Yangtze Delta", "共同冲击风险"]] },
    ],
  },
];

export function createAcademicChapter(spec) {
  return {
    id: spec.id,
    title: spec.title,
    narrations: spec.narrations,
    render: (step) => renderChapter(spec, step),
  };
}
