// search.ts

const FACULTY_NAMES: string[] = [
  "Grant Rynders",
  "Nathan Fairweather",
  "John Doe",
  "Jane Smith",
  "Michael Johnson",
  "Emily Davis",
  "David Wilson",
  "Sarah Brown",
  "James Taylor",
  "Jessica Miller"
];

// Type assertions for DOM elements
const input = document.getElementById("facultySearch") as HTMLInputElement | null;
const suggestions = document.getElementById("suggestions") as HTMLDivElement | null;
const form = document.getElementById("searchForm") as HTMLFormElement | null;
const button = document.getElementById("searchButton") as HTMLButtonElement | null;
const errorBox = document.getElementById("searchError") as HTMLDivElement | null;

let activeIndex: number = -1;
let currentMatches: string[] = [];

function normalize(s?: string): string {
  return (s ?? "").toLowerCase().trim();
}

function isValidName(name: string): boolean {
  const q = normalize(name);
//   return (q && FACULTY_NAMES.some(n => normalize(n) === q));
  return true;
}

function setValidUI(valid: boolean): void {
  if (!button || !errorBox) return;

  button.disabled = !valid;
  if (valid) {
    errorBox.classList.add("hidden");
    errorBox.textContent = "";
  }
}

function showError(msg: string): void {
  if (!errorBox) return;

  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
}

function getMatches(query: string): string[] {
  const q = normalize(query);
  if (!q) return [];
  return FACULTY_NAMES
    .filter(name => normalize(name).includes(q))
    .slice(0, 12);
}

function renderList(matches: string[]): void {
  if (!suggestions || !input) return;

  suggestions.innerHTML = "";
  activeIndex = -1;
  currentMatches = matches;

  if (matches.length === 0) {
    suggestions.classList.add("hidden");
    return;
  }

  matches.forEach((name, idx) => {
    const row = document.createElement("div");
    row.className = "suggestion";
    row.textContent = name;

    row.addEventListener("mousedown", (e) => {
      e.preventDefault();
      selectName(idx);
    });

    suggestions.appendChild(row);
  });

  suggestions.classList.remove("hidden");
}

function setActive(index: number): void {
  if (!suggestions) return;

  const rows = suggestions.querySelectorAll<HTMLDivElement>(".suggestion");
  rows.forEach(r => r.classList.remove("active"));

  if (index >= 0 && index < rows.length) {
    rows[index].classList.add("active");
    activeIndex = index;
    rows[index].scrollIntoView({ block: "nearest" });
  }
}

function selectName(index: number): void {
  if (!input || !suggestions) return;

  const name = currentMatches[index];
  if (!name) return;

  input.value = name;
  suggestions.classList.add("hidden");
  setValidUI(true);
}

// Event listeners
input?.addEventListener("input", () => {
  renderList(getMatches(input.value));
  setValidUI(isValidName(input.value));
});

input?.addEventListener("keydown", (e: KeyboardEvent) => {
  if (!suggestions || suggestions.classList.contains("hidden")) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    setActive(Math.min(activeIndex + 1, currentMatches.length - 1));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setActive(Math.max(activeIndex - 1, 0));
  } else if (e.key === "Enter") {
    if (activeIndex >= 0) {
      e.preventDefault();
      selectName(activeIndex);
    }
  } else if (e.key === "Escape") {
    suggestions.classList.add("hidden");
  }
});

form?.addEventListener("submit", (e: Event) => {
  if (!input) return;

  if (!isValidName(input.value)) {
    e.preventDefault();
    setValidUI(false);
    showError("Pick a valid faculty name from the list.");
  }
});

document.addEventListener("click", (e: MouseEvent) => {
  if (!suggestions) return;

  const target = e.target as HTMLElement;
  if (!target.closest(".searchWrap")) {
    suggestions.classList.add("hidden");
  }
});

input?.addEventListener("focus", () => {
  renderList(getMatches(input.value));
});
