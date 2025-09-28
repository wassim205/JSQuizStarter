// stats.js
// Statistics UI for the quiz. Renders inside #container and provides a "back to results" using the last saved result data.

import { createEl } from "./utils.js";
import * as Storage from "./storageService.js";

let lastResultData = null;

/**
 * Set the last result data so stats can provide a back button.
 * uiController.showResultUI sets this before calling statesUI.
 */
export function setResultData(resultData) {
  lastResultData = resultData;
}

/**
 * Render statistics UI inside the main #container
 */
export function statesUI() {
  const mainContainer = document.getElementById("container");
  if (!mainContainer) {
    // fallback: create a container
    const body = document.body;
    while (body.firstChild) body.removeChild(body.firstChild);
    const newContainer = createEl("div");
    newContainer.id = "container";
    body.appendChild(newContainer);
  }

  // Clear content safely
  const container = document.getElementById("container");
  while (container.firstChild) container.removeChild(container.firstChild);

  // Top bar: title + optional back button
  const topBar = createEl("div");
  topBar.style.display = "flex";
  topBar.style.justifyContent = "space-between";
  topBar.style.alignItems = "center";
  topBar.style.gap = "12px";
  topBar.style.width = "100%";
  topBar.style.maxWidth = "1000px";
  topBar.style.margin = "0 auto 12px";

  const title = createEl("h1", { text: "STATISTIQUES" });
  title.style.margin = "0";
  topBar.appendChild(title);

  if (lastResultData) {
    const backButton = createEl("button", { text: "🔙 Retour aux résultats", className: "btn btn-secondary" });
    backButton.addEventListener("click", () => {
      // dynamic import to avoid circular top-level imports
      import("./uiController.js").then((ui) => {
        if (typeof ui.showResultUI === "function") {
          ui.showResultUI(lastResultData);
        } else {
          alert("Impossible de retourner aux résultats.");
        }
      });
    });
    topBar.appendChild(backButton);
  }

  container.appendChild(topBar);

  // Load history from storage
  const history = Storage.getHistory() || [];
  if (!history || history.length === 0) {
    container.appendChild(createEl("p", { text: "Aucune donnée statistique disponible. Jouez d'abord à quelques quiz !" }));
    return;
  }

  createGeneralStats(container, history);
  createThemeStats(container, history);
  createTopPlayers(container, history);
  createProgressStats(container, history);

  // rendering charts
  const chartSection = createEl("section");
  chartSection.appendChild(createEl("h2", { text: "📊 Visualisation des Données" }));

  // Create the container that the chart module expects (#stats-charts)
  const chartContainer = createEl("div");
  chartContainer.id = "stats-charts";
  chartContainer.style.width = "100%";
  chartContainer.style.maxWidth = "1000px";
  chartContainer.style.margin = "1rem auto";

  chartSection.appendChild(chartContainer);
  container.appendChild(chartSection);

}

/* ---------- helpers & sections ---------- */

function parseScore(scoreString) {
  if (!scoreString || typeof scoreString !== "string") return 0;
  const parts = scoreString.split("/");
  if (parts.length !== 2) return 0;
  const numerator = parseInt(parts[0]) || 0;
  const denominator = parseInt(parts[1]) || 0;
  return denominator > 0 ? numerator / denominator : 0;
}

function createGeneralStats(container, history) {
  const section = createEl("section");
  section.appendChild(createEl("h2", { text: "📊 Statistiques Générales" }));

  const totalGames = history.length;
  const totalPlayers = new Set(history.map((g) => g.username)).size;
  const averageScore = history.reduce((s, g) => s + parseScore(g.score), 0) / totalGames;
  const totalTimePlayed = history.reduce((s, g) => s + (g.elapsedMs || 0), 0);

  const statsGrid = createEl("div");
  statsGrid.style.display = "grid";
  statsGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
  statsGrid.style.gap = "1rem";
  statsGrid.style.margin = "1rem 0";
  statsGrid.style.maxWidth = "1000px";
  statsGrid.style.marginLeft = "auto";
  statsGrid.style.marginRight = "auto";

  const statCards = [
    { label: "Parties Jouées", value: totalGames, icon: "🎮" },
    { label: "Joueurs Uniques", value: totalPlayers, icon: "👥" },
    { label: "Score Moyen", value: `${(averageScore * 100).toFixed(1)}%`, icon: "📈" },
    { label: "Temps Total", value: `${Math.round(totalTimePlayed / 1000 / 60)} min`, icon: "⏱️" },
  ];

  statCards.forEach((stat) => {
    const card = createEl("div");
    card.style.border = "1px solid #ccc";
    card.style.borderRadius = "8px";
    card.style.padding = "1rem";
    card.style.textAlign = "center";
    card.style.backgroundColor = "#f9f9f9";
    card.style.minHeight = "88px";

    const icon = createEl("div", { text: stat.icon });
    icon.style.fontSize = "2rem";
    icon.style.marginBottom = "6px";

    const val = createEl("div", { text: String(stat.value) });
    val.style.fontSize = "1.25rem";
    val.style.fontWeight = "700";

    const label = createEl("div", { text: stat.label });
    label.style.color = "#666";
    label.style.marginTop = "6px";

    card.appendChild(icon);
    card.appendChild(val);
    card.appendChild(label);
    statsGrid.appendChild(card);
  });

  section.appendChild(statsGrid);
  container.appendChild(section);
}

function createThemeStats(container, history) {
  const section = createEl("section");
  section.appendChild(createEl("h2", { text: "🎯 Statistiques par Thématique" }));

  const themeStats = history.reduce((acc, game) => {
    const theme = game.theme || "Non spécifié";
    if (!acc[theme]) acc[theme] = { count: 0, totalScore: 0, scores: [] };
    acc[theme].count++;
    const s = parseScore(game.score);
    acc[theme].totalScore += s;
    acc[theme].scores.push(s);
    return acc;
  }, {});

  const table = createEl("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.margin = "1rem 0";
  table.style.maxWidth = "1000px";
  table.style.marginLeft = "auto";
  table.style.marginRight = "auto";

  const headerRow = createEl("tr");
  ["Thématique", "Parties Jouées", "Score Moyen", "Meilleur Score"].forEach((h) => {
    const th = createEl("th", { text: h });
    th.style.border = "1px solid #ddd";
    th.style.padding = "0.75rem";
    th.style.backgroundColor = "#f2f2f2";
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  Object.entries(themeStats).forEach(([theme, stats]) => {
    const row = createEl("tr");
    row.appendChild(createEl("td", { text: theme }));
    const countCell = createEl("td", { text: String(stats.count) });
    countCell.style.textAlign = "center";
    row.appendChild(countCell);

    const avgScore = stats.count > 0 ? (stats.totalScore / stats.count) * 100 : 0;
    row.appendChild(createEl("td", { text: `${avgScore.toFixed(1)}%` }));

    const bestScore = stats.scores.length > 0 ? Math.max(...stats.scores) * 100 : 0;
    row.appendChild(createEl("td", { text: `${bestScore.toFixed(1)}%` }));

    // small styling
    Array.from(row.children).forEach((td) => { td.style.border = "1px solid #ddd"; td.style.padding = "0.75rem"; td.style.textAlign = "center"; });
    row.firstChild.style.textAlign = "";
    table.appendChild(row);
  });

  section.appendChild(table);
  container.appendChild(section);
}

function createTopPlayers(container, history) {
  const section = createEl("section");
  section.appendChild(createEl("h2", { text: "🏆 Classement des Meilleurs Joueurs" }));

  const playerBestScores = history.reduce((acc, game) => {
    const username = game.username || "Anonyme";
    const score = parseScore(game.score);
    if (!acc[username] || score > acc[username].score) acc[username] = { score, theme: game.theme, date: game.date };
    return acc;
  }, {});

  const topPlayers = Object.entries(playerBestScores).map(([username, data]) => ({ username, score: data.score, theme: data.theme, date: data.date })).sort((a, b) => b.score - a.score).slice(0, 5);

  if (topPlayers.length === 0) { section.appendChild(createEl("p", { text: "Aucun joueur à classer pour le moment." })); container.appendChild(section); return; }

  const rankingContainer = createEl("div");
  rankingContainer.style.display = "flex";
  rankingContainer.style.justifyContent = "center";
  rankingContainer.style.gap = "1rem";
  rankingContainer.style.flexWrap = "wrap";
  rankingContainer.style.margin = "1rem 0";

  topPlayers.forEach((player, idx) => {
    const playerCard = createEl("div");
    playerCard.style.border = "2px solid";
    playerCard.style.borderRadius = "8px";
    playerCard.style.padding = "1rem";
    playerCard.style.textAlign = "center";
    playerCard.style.width = "150px";

    if (idx === 0) { playerCard.style.borderColor = "#FFD700"; playerCard.style.backgroundColor = "#FFF9C4"; }
    else if (idx === 1) { playerCard.style.borderColor = "#C0C0C0"; playerCard.style.backgroundColor = "#F5F5F5"; }
    else { playerCard.style.borderColor = "#CD7F32"; playerCard.style.backgroundColor = "#F8E4C8"; }

    playerCard.appendChild(createEl("div", { text: idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉" }));
    playerCard.appendChild(createEl("div", { text: player.username }));
    playerCard.appendChild(createEl("div", { text: `${(player.score * 100).toFixed(1)}%` }));
    playerCard.appendChild(createEl("div", { text: player.theme || "Non spécifié" }));
    playerCard.appendChild(createEl("div", { text: player.date ? new Date(player.date).toLocaleDateString() : "" }));

    rankingContainer.appendChild(playerCard);
  });

  section.appendChild(rankingContainer);
  container.appendChild(section);
}

function createProgressStats(container, history) {
  const section = createEl("section");
  section.appendChild(createEl("h2", { text: "📈 Progression dans le Temps" }));

  const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sortedHistory.length < 2) { section.appendChild(createEl("p", { text: "Pas assez de données pour afficher la progression." })); container.appendChild(section); return; }

  const firstGame = sortedHistory[0];
  const lastGame = sortedHistory[sortedHistory.length - 1];
  const firstScore = parseScore(firstGame.score) * 100;
  const lastScore = parseScore(lastGame.score) * 100;
  const scoreImprovement = lastScore - firstScore;

  const progressInfo = createEl("div");
  progressInfo.style.padding = "1rem";
  progressInfo.style.backgroundColor = "#f0f8ff";
  progressInfo.style.borderRadius = "8px";
  progressInfo.style.margin = "1rem 0";
  progressInfo.style.maxWidth = "1000px";
  progressInfo.style.marginLeft = "auto";
  progressInfo.style.marginRight = "auto";

  progressInfo.appendChild(createEl("p", { text: `Première partie: ${firstScore.toFixed(1)}% (${new Date(firstGame.date).toLocaleDateString()})` }));
  progressInfo.appendChild(createEl("p", { text: `Dernière partie: ${lastScore.toFixed(1)}% (${new Date(lastGame.date).toLocaleDateString()})` }));
  progressInfo.appendChild(createEl("p", { text: `Progression: ${scoreImprovement >= 0 ? "+" : ""}${scoreImprovement.toFixed(1)}%` }));

  section.appendChild(progressInfo);

  const recentGames = sortedHistory.slice(-5).reverse();
  const recentTable = createEl("table");
  recentTable.style.width = "100%";
  recentTable.style.borderCollapse = "collapse";
  recentTable.style.maxWidth = "1000px";
  recentTable.style.marginLeft = "auto";
  recentTable.style.marginRight = "auto";

  const headerRow = createEl("tr");
  ["Date", "Joueur", "Thème", "Score", "Temps"].forEach((h) => {
    const th = createEl("th", { text: h });
    th.style.border = "1px solid #ddd";
    th.style.padding = "0.5rem";
    th.style.backgroundColor = "#f2f2f2";
    headerRow.appendChild(th);
  });
  recentTable.appendChild(headerRow);

  recentGames.forEach((game) => {
    const row = createEl("tr");
    const cells = [
      game.date ? new Date(game.date).toLocaleDateString() : "N/A",
      game.username || "Anonyme",
      game.theme || "Non spécifié",
      game.score || "0/0",
      game.elapsedMs ? `${Math.round(game.elapsedMs / 1000)}s` : "N/A",
    ];
    cells.forEach((c) => {
      const td = createEl("td", { text: String(c) });
      td.style.border = "1px solid #ddd";
      td.style.padding = "0.5rem";
      row.appendChild(td);
    });
    recentTable.appendChild(row);
  });

  section.appendChild(recentTable);
  container.appendChild(section);
}
