// RESULTS JAVASCRIPT FOR THE PIE CHART

function animatePie(wrapper) {
  const percentRaw = wrapper.dataset.percent ?? "0";
  let percent = Number(percentRaw);

  if (Number.isNaN(percent)) percent = 0;
  percent = Math.max(0, Math.min(100, percent));

  const progress = wrapper.querySelector(".pieProgress");
  const valueEl = wrapper.querySelector(".pieValue");

  // Circle geometry
  const r = progress.r.baseVal.value;
  const circumference = 2 * Math.PI * r;

  // Set up the stroke
  progress.style.strokeDasharray = `${circumference}`;
  progress.style.strokeDashoffset = `${circumference}`;

  // Target offset based on percent
  const targetOffset = circumference * (1 - percent / 100);

  // Animate stroke using Web Animations API
  progress.animate(
    [
      { strokeDashoffset: circumference },
      { strokeDashoffset: targetOffset }
    ],
    {
      duration: 4000,
      easing: "cubic-bezier(.2,.9,.2,1)",
      fill: "forwards"
    }
  );

  // Animate number in the middle
  const start = performance.now();
  const duration = 1800;

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const current = Math.round(eased * percent);
    valueEl.textContent = `${current}%`;
    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// Run on load
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".pieWrap");
  if (wrapper) animatePie(wrapper);
});
