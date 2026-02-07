# 💸 Wright State Faculty Budget Balancer 🐺

The **Wright State Faculty Budget Balancer** is a web-application used to compare *faculty salary information* to *Rate my Professor* statistics to determine whether or not a faculty member is underpaid, fairly paid, or overpaid. 

This project aims to make faculty salary analysis more transparent (and a little entertaining).

## 🤓 Contributors
- Nathan Fairweather (fairweather.3@wright.edu)
- Grant Rynders (rynders.3@wright.edu)

---

## 🚀 Features
- Search for Wright State professors by name
- Displays public salary information
- Pulls *Rate My Professor* ratings (Overall score, difficulty, %students would take again)
- Labels professors as:
    - Underpaid
    - Fairly Paid
    - Overpaid
- Simple dashboard UI with charts and statistics

---

## Run Instructions

- Start the app:
```bash
docker compose up --build
```
>*Note: When the app is built and taken down, the sqlite database is wiped and rebuilt because all the data used is static/uneditable.*
- Stop the app:
```bash
docker compose down -v
```
- Visit the app at: [`http:/localhost:5000`](http:/localhost:5000)
---

## 🧠 How It Works

The program takes two main inputs:
### 1. Public Salary Data
Collected from publicly available government salary datasets.

### 2. Rate My Professor Data
Uses Rate My Professor scores such as:
- Overall Rating
- Difficulty Ranking
- Would Take Again%
- Number of Reviews

---

## 📈 Calculation Logic (Simplified)
A professor's salary is weighted in comparison to their Rate My Professor attributes. Positive scores up the salary on a percentile scale, while negative scores drop it.

`Note: This is not meant to be a perfect scientific model (sadly). It's a hackthon project, not an HR department`

---
## ⚙️ Tech Stack
- App Summary:
    - Server: Flask
    - Database: SQLite3
    - Webpages: HTML, CSS, JavaScript
---
