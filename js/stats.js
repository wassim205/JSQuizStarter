import { createEl } from "./utils.js";
import * as Storage from "./storageService.js";

export function statesUI() {
    const container = document.body;
    container.innerHTML = '';
    
    // Main title
    const title = createEl("h1", { text: "STATISTIQUES" });
    title.style.color = "red";
    container.appendChild(title);
    
    // Get history data
    let history = Storage.getHistory();
    
    // Display message if no data available
    if (history.length === 0) {
        const noDataMessage = createEl("p", { 
            text: "Aucune donnée statistique disponible. Jouez d'abord à quelques quiz !" 
        });
        container.appendChild(noDataMessage);
        return;
    }
    
    // Create dashboard sections
    createGeneralStats(container, history);
    createThemeStats(container, history);
    createTopPlayers(container, history);
    createProgressStats(container, history);
}

// Function to parse score string (e.g., "5/10") to a numeric value
function parseScore(scoreString) {
    if (!scoreString || typeof scoreString !== 'string') return 0;
    
    const parts = scoreString.split('/');
    if (parts.length !== 2) return 0;
    
    const numerator = parseInt(parts[0]);
    const denominator = parseInt(parts[1]);
    
    return denominator > 0 ? numerator / denominator : 0;
}

// Function to calculate percentage from score string
function scoreToPercentage(scoreString) {
    return parseScore(scoreString) * 100;
}

// 1. General statistics section
function createGeneralStats(container, history) {
    const section = createEl("section");
    section.appendChild(createEl("h2", { text: "📊 Statistiques Générales" }));
    
    // Calculate general stats using array methods
    const totalGames = history.length;
    const totalPlayers = new Set(history.map(game => game.username)).size;
    const averageScore = history.reduce((sum, game) => sum + parseScore(game.score), 0) / totalGames;
    const totalTimePlayed = history.reduce((sum, game) => sum + (game.elapsedMs || 0), 0);
    
    const statsGrid = createEl("div");
    statsGrid.style.display = "grid";
    statsGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
    statsGrid.style.gap = "1rem";
    statsGrid.style.margin = "1rem 0";
    
    // Create stat cards
    const statCards = [
        { label: "Parties Jouées", value: totalGames, icon: "🎮" },
        { label: "Joueurs Uniques", value: totalPlayers, icon: "👥" },
        { label: "Score Moyen", value: `${(averageScore * 100).toFixed(1)}%`, icon: "📈" },
        { label: "Temps Total", value: `${Math.round(totalTimePlayed / 1000 / 60)} min`, icon: "⏱️" }
    ];
    
    statCards.forEach(stat => {
        const card = createEl("div");
        card.style.border = "1px solid #ccc";
        card.style.borderRadius = "8px";
        card.style.padding = "1rem";
        card.style.textAlign = "center";
        card.style.backgroundColor = "#f9f9f9";
        
        card.innerHTML = `
            <div style="font-size: 2rem;">${stat.icon}</div>
            <div style="font-size: 1.5rem; font-weight: bold;">${stat.value}</div>
            <div style="color: #666;">${stat.label}</div>
        `;
        
        statsGrid.appendChild(card);
    });
    
    section.appendChild(statsGrid);
    container.appendChild(section);
}

// 2. Statistics by theme section
function createThemeStats(container, history) {
    const section = createEl("section");
    section.appendChild(createEl("h2", { text: "🎯 Statistiques par Thématique" }));
    
    // Group games by theme using reduce
    const themeStats = history.reduce((acc, game) => {
        const theme = game.theme || "Non spécifié";
        if (!acc[theme]) {
            acc[theme] = {
                count: 0,
                totalScore: 0,
                scores: []
            };
        }
        
        acc[theme].count++;
        const scoreValue = parseScore(game.score);
        acc[theme].totalScore += scoreValue;
        acc[theme].scores.push(scoreValue);
        
        return acc;
    }, {});
    
    // Create table for theme statistics
    const table = createEl("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.margin = "1rem 0";
    
    // Table header
    const headerRow = createEl("tr");
    ["Thématique", "Parties Jouées", "Score Moyen", "Meilleur Score"].forEach(headerText => {
        const th = createEl("th", { text: headerText });
        th.style.border = "1px solid #ddd";
        th.style.padding = "0.75rem";
        th.style.backgroundColor = "#f2f2f2";
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    // Table rows for each theme
    Object.entries(themeStats).forEach(([theme, stats]) => {
        const row = createEl("tr");
        
        // Theme name
        const themeCell = createEl("td", { text: theme });
        themeCell.style.border = "1px solid #ddd";
        themeCell.style.padding = "0.75rem";
        row.appendChild(themeCell);
        
        // Games count
        const countCell = createEl("td", { text: stats.count });
        countCell.style.border = "1px solid #ddd";
        countCell.style.padding = "0.75rem";
        countCell.style.textAlign = "center";
        row.appendChild(countCell);
        
        // Average score
        const avgScore = (stats.totalScore / stats.count) * 100;
        const avgCell = createEl("td", { text: `${avgScore.toFixed(1)}%` });
        avgCell.style.border = "1px solid #ddd";
        avgCell.style.padding = "0.75rem";
        avgCell.style.textAlign = "center";
        row.appendChild(avgCell);
        
        // Best score
        const bestScore = Math.max(...stats.scores) * 100;
        const bestCell = createEl("td", { text: `${bestScore.toFixed(1)}%` });
        bestCell.style.border = "1px solid #ddd";
        bestCell.style.padding = "0.75rem";
        bestCell.style.textAlign = "center";
        row.appendChild(bestCell);
        
        table.appendChild(row);
    });
    
    section.appendChild(table);
    container.appendChild(section);
}

// 3. Top players section
function createTopPlayers(container, history) {
    const section = createEl("section");
    section.appendChild(createEl("h2", { text: "🏆 Classement des Meilleurs Joueurs" }));
    
    // Calculate best scores per player using reduce and map
    const playerBestScores = history.reduce((acc, game) => {
        const username = game.username;
        const score = parseScore(game.score);
        
        if (!acc[username] || score > acc[username].score) {
            acc[username] = {
                score: score,
                theme: game.theme,
                date: game.date
            };
        }
        
        return acc;
    }, {});
    
    // Convert to array and sort by score (descending)
    const topPlayers = Object.entries(playerBestScores)
        .map(([username, data]) => ({
            username,
            score: data.score,
            theme: data.theme,
            date: data.date
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Top 3 only
    
    if (topPlayers.length === 0) {
        section.appendChild(createEl("p", { text: "Aucun joueur à classer pour le moment." }));
        container.appendChild(section);
        return;
    }
    
    // Create ranking display
    const rankingContainer = createEl("div");
    rankingContainer.style.display = "flex";
    rankingContainer.style.justifyContent = "center";
    rankingContainer.style.gap = "1rem";
    rankingContainer.style.flexWrap = "wrap";
    rankingContainer.style.margin = "1rem 0";
    
    const podium = [
        { position: 2, style: "silver" },
        { position: 1, style: "gold" },
        { position: 3, style: "bronze" }
    ];
    
    podium.forEach((podiumSpot, index) => {
        if (index >= topPlayers.length) return;
        
        const player = topPlayers[index];
        const playerCard = createEl("div");
        playerCard.style.border = "2px solid";
        playerCard.style.borderRadius = "8px";
        playerCard.style.padding = "1rem";
        playerCard.style.textAlign = "center";
        playerCard.style.width = "150px";
        
        // Style based on position
        if (podiumSpot.style === "gold") {
            playerCard.style.borderColor = "#FFD700";
            playerCard.style.backgroundColor = "#FFF9C4";
        } else if (podiumSpot.style === "silver") {
            playerCard.style.borderColor = "#C0C0C0";
            playerCard.style.backgroundColor = "#F5F5F5";
        } else {
            playerCard.style.borderColor = "#CD7F32";
            playerCard.style.backgroundColor = "#F8E4C8";
        }
        
        playerCard.innerHTML = `
            <div style="font-size: 2rem;">${index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>
            <div style="font-weight: bold; font-size: 1.2rem;">${player.username}</div>
            <div style="font-size: 1.5rem; color: #2E7D32;">${(player.score * 100).toFixed(1)}%</div>
            <div style="font-size: 0.8rem; color: #666;">${player.theme || "Non spécifié"}</div>
            <div style="font-size: 0.7rem; color: #999;">${new Date(player.date).toLocaleDateString()}</div>
        `;
        
        rankingContainer.appendChild(playerCard);
    });
    
    section.appendChild(rankingContainer);
    container.appendChild(section);
}

// 4. Progress over time section
function createProgressStats(container, history) {
    const section = createEl("section");
    section.appendChild(createEl("h2", { text: "📈 Progression dans le Temps" }));
    
    // Sort history by date
    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (sortedHistory.length < 2) {
        section.appendChild(createEl("p", { text: "Pas assez de données pour afficher la progression." }));
        container.appendChild(section);
        return;
    }
    
    // Calculate progress statistics
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
    
    progressInfo.innerHTML = `
        <p><strong>Première partie:</strong> ${firstScore.toFixed(1)}% (${new Date(firstGame.date).toLocaleDateString()})</p>
        <p><strong>Dernière partie:</strong> ${lastScore.toFixed(1)}% (${new Date(lastGame.date).toLocaleDateString()})</p>
        <p><strong>Progression:</strong> <span style="color: ${scoreImprovement >= 0 ? '#2E7D32' : '#D32F2F'}">${scoreImprovement >= 0 ? '+' : ''}${scoreImprovement.toFixed(1)}%</span></p>
    `;
    
    section.appendChild(progressInfo);
    
    // Recent games table
    const recentGamesTitle = createEl("h3", { text: "5 Dernières Parties" });
    section.appendChild(recentGamesTitle);
    
    const recentGames = sortedHistory.slice(-5).reverse(); // Last 5 games, most recent first
    
    const recentTable = createEl("table");
    recentTable.style.width = "100%";
    recentTable.style.borderCollapse = "collapse";
    
    // Table header
    const headerRow = createEl("tr");
    ["Date", "Joueur", "Thème", "Score", "Temps"].forEach(headerText => {
        const th = createEl("th", { text: headerText });
        th.style.border = "1px solid #ddd";
        th.style.padding = "0.5rem";
        th.style.backgroundColor = "#f2f2f2";
        headerRow.appendChild(th);
    });
    recentTable.appendChild(headerRow);
    
    // Table rows
    recentGames.forEach(game => {
        const row = createEl("tr");
        
        [game.date ? new Date(game.date).toLocaleDateString() : "N/A", 
         game.username || "Anonyme", 
         game.theme || "Non spécifié", 
         game.score || "0/0", 
         game.elapsedMs ? `${Math.round(game.elapsedMs / 1000)}s` : "N/A"
        ].forEach(cellText => {
            const td = createEl("td", { text: cellText });
            td.style.border = "1px solid #ddd";
            td.style.padding = "0.5rem";
            row.appendChild(td);
        });
        
        recentTable.appendChild(row);
    });
    
    section.appendChild(recentTable);
    container.appendChild(section);
}