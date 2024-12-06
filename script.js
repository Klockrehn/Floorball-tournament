// script.js

// Lagnamn
const teams = ["Lag Hjärter", "Lag Ruter", "Lag Spader", "Lag Klöver"];

const matches = [
    { id: "1", team1: "Lag Hjärter", team2: "Lag Ruter", score: "" },
    { id: "2", team1: "Lag Spader", team2: "Lag Klöver", score: "" },
    { id: "3", team1: "Lag Hjärter", team2: "Lag Spader", score: "" },
    { id: "4", team1: "Lag Ruter", team2: "Lag Klöver", score: "" },
    { id: "5", team1: "Lag Hjärter", team2: "Lag Klöver", score: "" },
    { id: "6", team1: "Lag Ruter", team2: "Lag Spader", score: "" },
];


// Gruppspelstabell
const standings = teams.map(team => ({
    team,
    matches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
}));

// Funktion för att rendera tabellen
function renderStandings() {
    const standingsTable = document.getElementById("standings");
    standingsTable.innerHTML = "";

    standings
        .sort((a, b) => b.points - a.points) // Sortera efter poäng
        .forEach(stat => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${stat.team}</td>
                <td>${stat.matches}</td>
                <td>${stat.wins}</td>
                <td>${stat.draws}</td>
                <td>${stat.losses}</td>
                <td>${stat.points}</td>
            `;
            standingsTable.appendChild(row);
        });
}

// Funktion för att rendera matcherna
function renderMatches() {
    const matchList = document.getElementById("match-list");
    matchList.innerHTML = "";

    matches.forEach(match => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>Match ${match.id}</td>
            <td>${match.team1}</td>
            <td>${match.team2}</td>
            <td>${match.score || "N/A"}</td>
            <td>
                <input type="text" id="score-${match.id}" placeholder="Ex: 3-2">
                <button onclick="updateMatch('${match.id}')">Spara</button>
            </td>
        `;
        matchList.appendChild(row);
    });
}

// Funktion för att uppdatera matchresultat och tabell
function updateMatch(matchId) {
    const match = matches.find(m => m.id === matchId);
    const scoreInput = document.getElementById(`score-${matchId}`).value;

    if (scoreInput && scoreInput.includes("-")) {
        const [score1, score2] = scoreInput.split("-").map(Number);

        if (!isNaN(score1) && !isNaN(score2)) {
            match.score = `${score1}-${score2}`;

            updateStandings(match.team1, match.team2, score1, score2);
            renderMatches();
            renderStandings();
        } else {
            alert("Ange ett giltigt resultat (t.ex. 3-2).");
        }
    } else {
        alert("Ange ett giltigt resultat (t.ex. 3-2).");
    }
}

// Uppdatera stående baserat på resultat
function updateStandings(team1, team2, score1, score2) {
    const team1Stats = standings.find(s => s.team === team1);
    const team2Stats = standings.find(s => s.team === team2);

    // Uppdatera antalet matcher
    team1Stats.matches++;
    team2Stats.matches++;

    // Uppdatera poäng baserat på resultat
    if (score1 > score2) {
        team1Stats.wins++;
        team1Stats.points += 3;
        team2Stats.losses++;
    } else if (score1 < score2) {
        team2Stats.wins++;
        team2Stats.points += 3;
        team1Stats.losses++;
    } else {
        team1Stats.draws++;
        team2Stats.draws++;
        team1Stats.points++;
        team2Stats.points++;
    }
}

// Initial rendering
renderMatches();
renderStandings();

// Funktion för att sätta upp semifinalerna baserat på användarens val
function setupPlayoff() {
    const team1 = document.getElementById("team1").value;
    const team2 = document.getElementById("team2").value;
    const team3 = document.getElementById("team3").value;
    const team4 = document.getElementById("team4").value;

    // Kontrollera att inga lag är samma
    if (team1 === team2 || team3 === team4 || team1 === team3 || team2 === team4) {
        alert("Inget lag kan spela två gånger i semifinalerna.");
        return;
    }

    // Uppdatera semifinalmatcherna med valda lag
    document.getElementById("semi1").innerText = `${team1} vs ${team2}`;
    document.getElementById("semi2").innerText = `${team3} vs ${team4}`;

    // Reset score fields
    document.getElementById("score-semi1").value = '';
    document.getElementById("score-semi2").value = '';
    document.getElementById("score-final").value = '';
}

// Uppdatera resultatet för en semifinal
function updateSemifinal(semiId) {
    const scoreInput = document.getElementById(`score-semi${semiId}`).value;

    if (scoreInput && scoreInput.includes("-")) {
        const [score1, score2] = scoreInput.split("-").map(Number);

        if (!isNaN(score1) && !isNaN(score2)) {
            // Uppdatera vinnaren för semifinalen
            if (score1 > score2) {
                document.getElementById(`semi${semiId}`).innerText = `${document.getElementById(`semi${semiId}`).innerText.split("vs")[0]} Vinnare`;
            } else if (score2 > score1) {
                document.getElementById(`semi${semiId}`).innerText = `${document.getElementById(`semi${semiId}`).innerText.split("vs")[1]} Vinnare`;
            } else {
                alert("Oavgjort är inte tillåtet i semifinalerna.");
            }

            // Om båda semifinaler är färdiga, sätt upp finalen
            if (document.getElementById("score-semi1").value && document.getElementById("score-semi2").value) {
                setupFinal();
            }
        } else {
            alert("Ange ett giltigt resultat (t.ex. 4-3).");
        }
    } else {
        alert("Ange ett resultat.");
    }
}

// Sätt upp finalen baserat på semifinalvinnarna
function setupFinal() {
    const semi1Winner = document.getElementById("semi1").innerText.split("vs")[0].trim();
    const semi2Winner = document.getElementById("semi2").innerText.split("vs")[0].trim();

    document.getElementById("final-match").innerText = `${semi1Winner} vs ${semi2Winner}`;
}

// Uppdatera resultatet för finalen
function updateFinal() {
    const scoreInput = document.getElementById("score-final").value;

    if (scoreInput && scoreInput.includes("-")) {
        const [score1, score2] = scoreInput.split("-").map(Number);

        if (!isNaN(score1) && !isNaN(score2)) {
            let winner = score1 > score2 ? document.getElementById("final-match").innerText.split("vs")[0].trim() : document.getElementById("final-match").innerText.split("vs")[1].trim();
            alert(`Turneringsvinnare: ${winner}`);
        } else {
            alert("Ange ett giltigt resultat (t.ex. 3-2).");
        }
    } else {
        alert("Ange ett resultat.");
    }
}


