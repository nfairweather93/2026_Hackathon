// === FACULTY NAMES WILL NEED FILLED WITH OTHER NAMES LATER BROSKIES === \
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
]

const input = document.getElementById("facultySearch");
const suggestions = document.getElementById("suggestions");

// vars yippee
let activeIndex = -1;
let currentMatches = [];

function normalize(s) {
  return (s ?? "").toLowerCase().trim();
}

function getMatches(query){
    const q = normalize(query);
    if (!q) return [];
    // Simple "contains" match.
    return FACULTY_NAMES
    .filter(name => normalize(name).includes(q))
    .slice(0, 12); //Limits results to 12
}

function renderList(matches){
    suggestions.innerHTML = "";
    activeIndex = -1;
    currentMatches = matches;

    if (matches.length === 0){
        suggestions.classList.add("hidden");
        return;
    }

    matches.forEach((name, idx) =>{
        const row = document.createElement("div");
        row.className = "suggestion";
        row.textContent = name;

        row.addEventListener("mousedown", (e) => {
            // mousedown fills before input loses focus
            e.preventDefault();
            selectName(idx);
        });

        suggestions.appendChild(row);
    });

    suggestions.classList.remove("hidden");
}

function setActive(index){
    const rows = suggestions.querySelectorAll(".suggestion");
    rows.forEach(r  => r.classList.remove("active"));

    if (index >= 0 && index < rows.length){
        rows[index].classList.add("active");
        activeIndex = index;

        // Keep the active row visible
        rows[index].scrollIntoView({ block: "nearest"});
    }
}

function selectName(index){
    const name = currentMatches[index];
    if (!name) return;
    input.value = name;
    suggestions.classList.add("hidden");
}

input.addEventListener("input", () => {
    const matches = getMatches(input.value);
    renderList(matches);
});

input.addEventListener("keydown", (e) =>{
    if(suggestions.classList.contains("hidden")) return;

    if(e.key === "ArrowDown"){
        e.preventDefault();
        setActive(Math.min(activeIndex + 1, currentMatches.length -1)); 
    } else if(e.key === "ArrowUp"){
        e.preventDefault();
        setActive(Math.max(activeIndex - 1, 0));
    } else if(e.key === "Enter"){
        if(activeIndex >= 0){
            e.preventDefault();
            selectName(activeIndex);
        }
    } else if(e.key === "Escape"){
        suggestions.classList.add("hidden");
    }
});

// Suggestions should hide if click outside
document.addEventListener("click", (e) => {
    if(!e.target.closest(".searchWrap")){
        suggestions.classList.add("hidden");
    }
});

// Show matches when focusing (if there is text)
input.addEventListener("focus", () => {
    const matches = getMatches(input.value);
    renderList(matches);
});