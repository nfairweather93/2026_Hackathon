// search.js

const FACULTY_NAMES = [
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

const input = document.getElementById("facultySearch");
const suggestions = document.getElementById("suggestions");
const form = document.getElementById("searchForm");
const button = document.getElementById("searchButton");
const errorBox = document.getElementById("searchError");

let activeIndex = -1;
let currentMatches = [];

function normalize(s) { return (s ?? "").toLowerCase().trim(); }

function isValidName(name){
  const q = normalize(name);
  return q && FACULTY_NAMES.some(n => normalize(n) === q);
}

function setValidUI(valid){
  button.disabled = !valid;
  if (valid){
    errorBox.classList.add("hidden");
    errorBox.textContent = "";
  }
}

function showError(msg){
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
}

function getMatches(query){
  const q = normalize(query);
  if (!q) return [];
  return FACULTY_NAMES
    .filter(name => normalize(name).includes(q))
    .slice(0, 12);
}

function renderList(matches){
  suggestions.innerHTML = "";
  activeIndex = -1;
  currentMatches = matches;

  if (matches.length === 0){
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

function setActive(index){
  const rows = suggestions.querySelectorAll(".suggestion");
  rows.forEach(r => r.classList.remove("active"));

  if (index >= 0 && index < rows.length){
    rows[index].classList.add("active");
    activeIndex = index;
    rows[index].scrollIntoView({ block: "nearest" });
  }
}

function selectName(index){
  const name = currentMatches[index];
  if (!name) return;
  input.value = name;
  suggestions.classList.add("hidden");
  setValidUI(true);
}

input.addEventListener("input", () => {
  renderList(getMatches(input.value));
  setValidUI(isValidName(input.value));
});

input.addEventListener("keydown", (e) => {
  if (suggestions.classList.contains("hidden")) return;

  if (e.key === "ArrowDown"){
    e.preventDefault();
    setActive(Math.min(activeIndex + 1, currentMatches.length - 1));
  } else if (e.key === "ArrowUp"){
    e.preventDefault();
    setActive(Math.max(activeIndex - 1, 0));
  } else if (e.key === "Enter"){
    if (activeIndex >= 0){
      e.preventDefault();
      selectName(activeIndex);
    }
  } else if (e.key === "Escape"){
    suggestions.classList.add("hidden");
  }
});

form.addEventListener("submit", (e) => {
  if (!isValidName(input.value)){
    e.preventDefault();
    setValidUI(false);
    showError("Pick a valid faculty name from the list.");
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".searchWrap")){
    suggestions.classList.add("hidden");
  }
});

input.addEventListener("focus", () => {
  renderList(getMatches(input.value));
});
