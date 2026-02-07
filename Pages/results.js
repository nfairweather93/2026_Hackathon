// results.js
// - Reads ?professor=... from the URL
// - Redirects back to index.html if missing/blank
// - Displays the professor name in #profName
// - Animates the pie chart based on .pieWrap[data-percent]

function animatePie(wrapper) {
  const percentRaw = wrapper.dataset.percent ?? "0";
  let percent = Number(percentRaw);

  if (Number.isNaN(percent)) percent = 0;
  percent = Math.max(0, Math.min(100, percent));

  const progress = wrapper.querySelector(".pieProgress");
  const valueEl = wrapper.querySelector(".pieValue");

  if (!progress || !valueEl) return;

  // Circle geometry
  const r = progress.r.baseVal.value;
  const circumference = 2 * Math.PI * r;

  // Set up stroke
  progress.style.strokeDasharray = `${circumference}`;
  progress.style.strokeDashoffset = `${circumference}`;

  // Target offset based on percent
  const targetOffset = circumference * (1 - percent / 100);

  // Animate ring
  progress.animate(
    [
      { strokeDashoffset: circumference },
      { strokeDashoffset: targetOffset }
    ],
    {
      duration: 4000, // slow ring
      easing: "cubic-bezier(.2,.9,.2,1)",
      fill: "forwards"
    }
  );

  // Animate number
  const start = performance.now();
  const duration = 1800; // slow-ish number

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    valueEl.textContent = `${Math.round(eased * percent)}%`;
    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

document.addEventListener("DOMContentLoaded", () => {
  // 1) Read professor from query param
  const params = new URLSearchParams(window.location.search);
  const prof = params.get("professor");

  // 2) If missing, kick back to index
  if (!prof || !prof.trim()) {
    window.location.href = "index.html";
    return;
  }

  // 3) Display name above the pie
  const profNameEl = document.getElementById("profName");
  if (profNameEl) profNameEl.textContent = prof;

  // 4) Animate the pie
  const wrapper = document.querySelector(".pieWrap");
  if (wrapper) animatePie(wrapper);
});
