import { chapters } from "./registry/chapters.js";

const STORAGE_KEY = "web-video-stress-cascade-step-v1";
const app = document.querySelector("#app");
const totalSteps = chapters.reduce((sum, chapter) => sum + chapter.narrations.length, 0);

let globalStep = Number(localStorage.getItem(STORAGE_KEY) || 0);
if (!Number.isFinite(globalStep)) globalStep = 0;
globalStep = Math.max(0, Math.min(globalStep, totalSteps - 1));
let stageScale = 1;

function updateStageScale() {
  stageScale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  const shell = document.querySelector(".stage-shell");
  if (shell) shell.style.transform = `scale(${stageScale})`;
}

function locate(step) {
  let offset = 0;
  for (const chapter of chapters) {
    const next = offset + chapter.narrations.length;
    if (step < next) return { chapter, localStep: step - offset, offset };
    offset = next;
  }
  return { chapter: chapters[chapters.length - 1], localStep: chapters.at(-1).narrations.length - 1, offset };
}

function setStep(next) {
  globalStep = Math.max(0, Math.min(next, totalSteps - 1));
  localStorage.setItem(STORAGE_KEY, String(globalStep));
  render();
}

function render() {
  const { chapter, localStep } = locate(globalStep);
  app.innerHTML = `
    <main class="shell" aria-live="polite">
      <div class="stage-shell">
        <section class="stage-frame" id="stage">
          ${chapter.render(localStep)}
        </section>
      </div>
      <nav class="progress-rail" data-no-advance>
        <button class="step-button" id="prev" aria-label="上一步">‹</button>
        <div class="progress-track" id="track">
          <div class="progress-fill" style="width:${((globalStep + 1) / totalSteps) * 100}%"></div>
        </div>
        <button class="step-button" id="next" aria-label="下一步">›</button>
        <span class="step-readout">${globalStep + 1} / ${totalSteps}</span>
      </nav>
    </main>
  `;

  document.querySelector("#stage").addEventListener("click", (event) => {
    if (event.target.closest("[data-no-advance]")) return;
    setStep(globalStep + 1);
  });
  document.querySelector("#prev").addEventListener("click", () => setStep(globalStep - 1));
  document.querySelector("#next").addEventListener("click", () => setStep(globalStep + 1));
  document.querySelector("#track").addEventListener("click", (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    setStep(Math.floor(ratio * totalSteps));
  });
  updateStageScale();
}

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === " ") setStep(globalStep + 1);
  if (event.key === "ArrowLeft") setStep(globalStep - 1);
  if (event.key.toLowerCase() === "r") setStep(0);
});
window.addEventListener("resize", updateStageScale);

render();
