const quotes = [
  { text: `"Our calculations are simply the best. Trust me, bro."`, author: "Grant Rynders, 2026" },
  { text: `"Budgeting is just vibes with numbers."`, author: "Nathan Fairweather, 2026" },
  { text: `"If the pie chart looks scary, you're spending too much."`, author: "Aiden Cox, 1952" },
  { text: `"Overpaid? Underpaid? Let's start drama with data."`, author: "Pibble, 2026" },
  { text: `"That professor makes HOW MUCH?`, author: "Every Student Ever, 2026"},
  {text: `"The numbers don't lie, but we might.."`, author: "Hackathon Ethics Committee, 2026"},
  {text: `"Wow, this is the coolest website I've ever seen!"`, author: "Some cool person, just now"},
  {text: `"Education is priceless. This salary, however, is not"`, author: "Joe Herman, 2026"},
  {text: `"Some people teach for passion. Others teach for the bag."`, author: "Anonymous, 2026"}
];

let currentIndex = 0;

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");

function rotateQuote() {
  quoteText.style.opacity = 0;
  quoteAuthor.style.opacity = 0;

  setTimeout(() => {
    currentIndex = (currentIndex + 1) % quotes.length;
    quoteText.textContent = quotes[currentIndex].text;
    quoteAuthor.textContent = quotes[currentIndex].author;

    quoteText.style.opacity = 1;
    quoteAuthor.style.opacity = 1;
  }, 500);
}

setInterval(rotateQuote, 8000); // change every 8 seconds
