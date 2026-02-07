function getEfficiencyBlurb(percent) {
  if (percent >= 90) {
    return "Absolute bargain. They’re delivering a ton of value for the pay (faculty efficiency god mode).";
  } else if (percent >= 75) {
    return "Solid deal. Pay seems pretty aligned with performance.";
  } else if (percent >= 60) {
    return "Meh. Not terrible, but the value-to-pay ratio is starting to wobble a bit.";
  } else if (percent >= 40) {
    return "Rough. Pay looks high relative to perceived performance— proceed with budget caution.";
  } else {
    return "Yikes. This is giving 'expensive spreadsheet cell' energy. Efficiency is very low.";
  }
}

function getEfficiencyColor(percent) {
  percent = Math.max(0, Math.min(100, percent));
  const hue = (percent / 100) * 120;     // red -> green
  return `hsl(${hue}, 80%, 45%)`;
}

function animatePie(wrapper) {
  const percentRaw = wrapper.dataset.percent ?? "0";
  let percent = Number(percentRaw);

  if (Number.isNaN(percent)) percent = 0;
  percent = Math.max(0, Math.min(100, percent));

  const progress = wrapper.querySelector(".pieProgress");
  const valueEl = wrapper.querySelector(".pieValue");
  if (!progress || !valueEl) return;

  // Update the summary blurb
  const blurbEl = document.getElementById("effBlurb");
  if (blurbEl) blurbEl.textContent = getEfficiencyBlurb(percent);

  // ✅ Smooth color blend (no glow)
  progress.style.stroke = getEfficiencyColor(percent);
  progress.style.filter = "none";

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
      duration: 4000,
      easing: "cubic-bezier(.2,.9,.2,1)",
      fill: "forwards"
    }
  );

  // Animate number
  const start = performance.now();
  const duration = 1800;

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    valueEl.textContent = `${Math.round(eased * percent)}%`;
    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const prof = params.get("professor");

  if (!prof || !prof.trim()) {
    window.location.href = "index.html";
    return;
  }

  const profNameEl = document.getElementById("profName");
  if (profNameEl) profNameEl.textContent = prof;

  const wrapper = document.querySelector(".pieWrap");
  if (wrapper) animatePie(wrapper);
});
