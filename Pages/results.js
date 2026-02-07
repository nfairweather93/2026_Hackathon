// results.js
// ------------------------------------------------------------
// RESULTS PAGE LOGIC
// 1) Read professor name from URL: results.html?professor=Full%20Name
// 2) Load the CSV (client-side)
// 3) Find the matching professor row by full_name
// 4) Fill metric boxes
// 5) Compute "efficiency" and animate the pie
//
// REQUIREMENTS:
// - Must run on a local server (Live Server / python http.server etc.)
// - PapaParse must be loaded before this file (see comments above)
// ------------------------------------------------------------

const CSV_URL = "../data/professors.csv";

/* ------------------------------------------------------------
   Small DOM helpers
------------------------------------------------------------ */
const $ = (id) => document.getElementById(id);

function normalize(s) {
  return (s ?? "").toLowerCase().trim();
}

/* ------------------------------------------------------------
   Parsing helpers (CSV values are strings)
------------------------------------------------------------ */
function parseMoney(m) {
  // "$88,605.24" -> 88605.24
  if (!m) return null;
  const num = String(m).replace(/[^0-9.]/g, "");
  const v = parseFloat(num);
  return Number.isFinite(v) ? v : null;
}

function parsePercent(p) {
  // "67%" -> 67
  // "N/A" -> null
  if (!p) return null;
  const s = String(p).trim();
  if (!s) return null;
  if (s.toUpperCase() === "N/A") return null;

  const num = s.replace(/[^0-9.]/g, "");
  const v = parseFloat(num);
  return Number.isFinite(v) ? v : null;
}

function parseRating(r) {
  // "3.5" -> 3.5
  // "N/A" -> null
  if (!r) return null;
  const s = String(r).trim();
  if (!s) return null;
  if (s.toUpperCase() === "N/A") return null;

  const v = parseFloat(s);
  return Number.isFinite(v) ? v : null;
}

/* ------------------------------------------------------------
   Formatting helpers (for display)
------------------------------------------------------------ */
function formatRating(v) {
  return v == null ? "N/A" : v.toFixed(1);
}

function formatPercent(v) {
  return v == null ? "N/A" : `${Math.round(v)}%`;
}

function formatSalary(v) {
  return v == null
    ? "N/A"
    : `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

/* ------------------------------------------------------------
   Pie blurb + animation
------------------------------------------------------------ */
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
  const hue = (percent / 100) * 120; // red -> green
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

  // Update blurb
  const blurbEl = document.getElementById("effBlurb");
  if (blurbEl) blurbEl.textContent = getEfficiencyBlurb(percent);

  // Color
  progress.style.stroke = getEfficiencyColor(percent);
  progress.style.filter = "none";

  // Circle geometry
  const r = progress.r.baseVal.value;
  const circumference = 2 * Math.PI * r;

  progress.style.strokeDasharray = `${circumference}`;
  progress.style.strokeDashoffset = `${circumference}`;

  const targetOffset = circumference * (1 - percent / 100);

  // Animate ring
  progress.animate(
    [{ strokeDashoffset: circumference }, { strokeDashoffset: targetOffset }],
    { duration: 1200, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
  );

  // Animate number
  const start = performance.now();
  const duration = 800;

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    valueEl.textContent = `${Math.round(eased * percent)}%`;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ------------------------------------------------------------
   Efficiency calculation (your harsher low-number penalties)
------------------------------------------------------------ */
function computeEfficiency(row) {
  const rating = parseRating(row.prof_rating);        // 0..5 or null
  const wta = parsePercent(row.would_take_again);     // 0..100 or null
  const diff = parseRating(row.level_of_difficulty);  // ~1..5 or null

  // If we’re missing values, treat them as neutral-ish defaults
  const safeRating = rating ?? 3.0;  // neutral rating
  const safeWta = wta ?? 50;         // neutral WTA
  const safeDiff = diff ?? 3.0;      // neutral difficulty

  // -------------------------
  // 1) Convert raw values to 0..100 subscores
  // -------------------------

  // Rating: 0..5 -> 0..100
  const ratingScore = (safeRating / 5) * 100;

  // Would-take-again already 0..100
  const wtaScore = Math.max(0, Math.min(100, safeWta));

  // Difficulty: 1 is best (100), 5 is worst (0)
  // Linear mapping:
  // diff=1 -> 100
  // diff=3 -> 50
  // diff=5 -> 0
  const diffScore = Math.max(0, Math.min(100, (5 - safeDiff) / 4 * 100));

  // -------------------------
  // 2) Weighted average (simple + explainable)
  // -------------------------
  let base = (
    0.60 * ratingScore +
    0.45 * wtaScore +
    0.25 * diffScore
  );

  // -------------------------
  // 3) Make lows harsher (one knob)
  // -------------------------
  // exponent > 1 makes low scores drop faster
  const harshness = 1.7;
  base = 100 * Math.pow(base / 100, harshness);

  const piePercent = Math.max(0, Math.min(100, Math.round(base)));

  return {
    piePercent,
    rawEfficiency: Math.round(base),
    subscores: {
      ratingScore: Math.round(ratingScore),
      wtaScore: Math.round(wtaScore),
      diffScore: Math.round(diffScore),
    },
  };
}


/* ------------------------------------------------------------
   Fill metric boxes
------------------------------------------------------------ */
function fillMetricBoxes(row) {
  const rating = parseRating(row.prof_rating);
  const wta = parsePercent(row.would_take_again);
  const diff = parseRating(row.level_of_difficulty);
  const salary = parseMoney(row.earnings);

  if ($("overallRating"))
    $("overallRating").textContent = `${formatRating(rating)}/5 Overall Rating ⭐`;

  if ($("wouldTakeAgain"))
    $("wouldTakeAgain").textContent = `${formatPercent(wta)} Would Take Again 💎`;

  if ($("difficultyRating"))
    $("difficultyRating").textContent = `${formatRating(diff)}/5 Difficulty Rating 😡`;

  if ($("startingSalary"))
    $("startingSalary").textContent = `${formatSalary(salary)} Starting Salary 💵`;
}

/* ------------------------------------------------------------
   Error helper (results page doesn't have searchError by default,
   so we fall back to console + alert-style text if needed)
------------------------------------------------------------ */
function showError(msg) {
  console.error("[RESULTS ERROR]", msg);

  // If you *do* have an element for errors, it'll show there.
  const errorBox = $("searchError");
  if (errorBox) {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
    return;
  }

  // Otherwise, create a simple visible message at top of page.
  let existing = document.getElementById("runtimeErrorBox");
  if (!existing) {
    existing = document.createElement("div");
    existing.id = "runtimeErrorBox";
    existing.style.margin = "12px auto";
    existing.style.maxWidth = "900px";
    existing.style.padding = "12px 14px";
    existing.style.borderRadius = "10px";
    existing.style.background = "#ffe9e9";
    existing.style.border = "1px solid #ffb5b5";
    existing.style.fontFamily = "system-ui, sans-serif";
    document.body.prepend(existing);
  }
  existing.textContent = msg;
}

/* ------------------------------------------------------------
   Load CSV and find professor row
------------------------------------------------------------ */
async function loadFacultyRowByName(fullName) {
  // Sanity checks so failures are obvious:
  if (typeof Papa === "undefined") {
    throw new Error(
      "PapaParse is not loaded. Add the CDN <script> for papaparse BEFORE results.js."
    );
  }

  // Bust cache so you see CSV updates immediately during dev
  const url = `${CSV_URL}?v=${Date.now()}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`CSV fetch failed (${resp.status}). Check CSV_URL: ${CSV_URL}`);
  }

  const csvText = await resp.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data || [];
        const target = normalize(fullName);

        // Match against the CSV column "full_name"
        const match = rows.find((r) => normalize(r.full_name) === target);

        resolve(match || null);
      },
      error: (err) => reject(err),
    });
  });
}

/* ------------------------------------------------------------
   MAIN
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const prof = params.get("professor");

  if (!prof || !prof.trim()) {
    window.location.href = "index.html";
    return;
  }

  // Put name in the header
  const profNameEl = $("profName");
  if (profNameEl) profNameEl.textContent = `Professor: ${prof}`;

  const wrapper = document.querySelector(".pieWrap");

  try {
    const row = await loadFacultyRowByName(prof);

    if (!row) {
      showError(`No data found for "${prof}". Make sure full_name matches exactly in CSV.`);
      if (wrapper) {
        wrapper.dataset.percent = "0";
        animatePie(wrapper);
      }
      return;
    }

    fillMetricBoxes(row);

    const result = computeEfficiency(row);

    // Debug (optional): open DevTools Console to see multipliers
    console.log("Matched row:", row);
    console.log("Efficiency calc:", result);

    if (wrapper) {
      wrapper.dataset.percent = String(result.piePercent);
      animatePie(wrapper);
    }
  } catch (err) {
    showError(
      `Could not load results data. ${err?.message || err}. ` +
      `Check PapaParse script + CSV_URL + run a local server.`
    );

    if (wrapper) {
      wrapper.dataset.percent = "0";
      animatePie(wrapper);
    }
  }
});
