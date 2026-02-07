// search.js
const input = document.getElementById("facultySearch");
const suggestions = document.getElementById("suggestions");
const form = document.getElementById("searchForm");
const button = document.getElementById("searchButton");
const errorBox = document.getElementById("searchError");

let activeIndex = -1;
let currentMatches = [];

function normalize(s) { return (s ?? "").toLowerCase().trim(); }

function isValidName(name){
  if (name)
  {
    return true;
  }
  else
  {
    return false;
  }
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

async function getMatches(query){
  const q = normalize(query);
  if (!q) return [];

  try {
    const response = await fetch(`/api/professors/name?input=${q}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });

    console.log(response.status);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data;
  } 
  catch (err) 
  {
    console.error(err);
    return [];
  }
}

function openSuggestions(){
  suggestions.classList.remove("hidden");
}

function closeSuggestions(){
  suggestions.classList.add("hidden");
}

function renderList(matches){
  suggestions.innerHTML = "";
  activeIndex = -1;
  currentMatches = matches;

  if (matches.length === 0){
    closeSuggestions();
    return;
  }
  Array(matches)[0].forEach((full_name, idx) => {
    const row = document.createElement("div");
    row.className = "suggestion";
    row.textContent = `${full_name}`;

    row.addEventListener("mousedown", (e) => {
      e.preventDefault();
      selectName(idx);
    });

    suggestions.appendChild(row);
  });

  openSuggestions();
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
  closeSuggestions();
  setValidUI(true);
}

/* -----------------------------
   Input + dropdown logic
------------------------------ */
input.addEventListener("input", async () => {
  let render_matches;
  render_matches = await getMatches(input.value)
  console.log(render_matches)
  renderList(render_matches);
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
    closeSuggestions();
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
    closeSuggestions();
  }
});

input.addEventListener("focus", async () => {
  renderList(await getMatches(input.value));
});
