$(document).ready(function () {
    const players_old = [
        { name: "Aiesh", attack: 8, defence: 7 },
        { name: "Zaid", attack: 7, defence: 5 },
        { name: "Shoaib", attack: 6, defence: 7 },
        { name: "Aman", attack: 9, defence: 9 },
        { name: "Abdullah", attack: 7, defence: 4 },
        { name: "Jayant", attack: 9, defence: 8 },
        { name: "Osman", attack: 9, defence: 7 },
        { name: "Wisam", attack: 6, defence: 4 },
        { name: "Rohail", attack: 8, defence: 6 },
        { name: "Affan", attack: 7, defence: 7 },
        { name: "Hammad", attack: 5, defence: 5 },
        { name: "Imam", attack: 7, defence: 5 },
        { name: "Hassan", attack: 7, defence: 7 },
        { name: "Moin", attack: 6, defence: 6 },
        { name: "Saad", attack: 6, defence: 7 },
        { name: "Salim", attack: 7, defence: 7 },
        { name: "Waeel", attack: 4, defence: 5 },
        { name: "Basil", attack: 4, defence: 4 },
        { name: "Turab", attack: 9, defence: 9 },
        { name: "Anees", attack: 8, defence: 7 },
        { name: "Hussain", attack: 5, defence: 5 },
        { name: "Roshan", attack: 7, defence: 7 },
        { name: "Majd", attack: 8, defence: 7 },
        { name: "Yahya", attack: 3, defence: 3 },
        { name: "Mohammed", attack: 4, defence: 4 },
        { name: "Mahd", attack: 4, defence: 4 },
        { name: "Owais", attack: 7, defence: 7 },
        { name: "Arham", attack: 7, defence: 7 },
        { name: "Ebrahim", attack: 3, defence: 3 },
        { name: "Hamza", attack: 6, defence: 6 },
        { name: "Muqtadir", attack: 5, defence: 5 },
        { name: "Anas", attack: 5, defence: 5 },
        { name: "Zain", attack: 7, defence: 5 },
        { name: "Faizan", attack: 5, defence: 5 }
    ];

    const players = [
        { name: "Aiesh", attack: 8, defence: 7 },
        { name: "Zaid", attack: 7, defence: 6 },
        { name: "Shoaib", attack: 6, defence: 7 },
        { name: "Aman", attack: 9, defence: 9 },
        { name: "Abdullah", attack: 8, defence: 4 },
        { name: "Jayant", attack: 9, defence: 8 },
        { name: "Osman", attack: 9, defence: 7 },
        { name: "Wisam", attack: 6, defence: 4 },
        { name: "Rohail", attack: 8, defence: 6 },
        { name: "Affan", attack: 6, defence: 6 },
        { name: "Hammad", attack: 4, defence: 4 },
        { name: "Imam", attack: 7, defence: 6 },
        { name: "Hassan", attack: 7, defence: 7 },
        { name: "Moin", attack: 6, defence: 6 },
        { name: "Saad", attack: 6, defence: 7 },
        { name: "Salim", attack: 7, defence: 7 },
        { name: "Waeel", attack: 4, defence: 5 },
        { name: "Basil", attack: 4, defence: 4 },
        { name: "Turab", attack: 9, defence: 9 },
        { name: "Anees", attack: 8, defence: 7 },
        { name: "Hussain", attack: 5, defence: 5 },
        { name: "Roshan", attack: 7, defence: 7 },
        { name: "Majd", attack: 8, defence: 7 },
        { name: "Yahya", attack: 4, defence: 4 },
        { name: "Mohammed", attack: 4, defence: 4 },
        { name: "Mahd", attack: 4, defence: 4 },
        { name: "Owais", attack: 7, defence: 7 },
        { name: "Arham", attack: 7, defence: 7 },
        { name: "Ebrahim", attack: 3, defence: 3 },
        { name: "Hamza", attack: 6, defence: 6 },
        { name: "Muqtadir", attack: 5, defence: 5 },
        { name: "Anas", attack: 5, defence: 5 },
        { name: "Zain", attack: 7, defence: 5 },
        { name: "Faizan", attack: 5, defence: 5 }
    ];

    function formatSkillWithChange(currentSkill, oldSkill) {
        if (!oldSkill || currentSkill === oldSkill) {
            return currentSkill;
        }
        return `${currentSkill} <span class="text-xs ${oldSkill > currentSkill ? 'text-red-500' : 'text-green-500'}">(${oldSkill})</span>`;
    }

    // Function to display the players sorted by average skill (highest to lowest)
    function renderPlayerList() {
        $('#playerList tbody').empty();

        // Calculate average skill and sort players
        const rankedPlayers = players.map(player => {
            const oldStats = players_old.find(p => p.name === player.name) || {};
            return {
                ...player,
                oldAttack: oldStats.attack,
                oldDefence: oldStats.defence,
                avgSkill: (player.attack + player.defence) / 2
            };
        }).sort((a, b) => b.avgSkill - a.avgSkill);

        // Assign ranks considering ties
        let currentRank = 1;
        let currentSkill = rankedPlayers[0]?.avgSkill;
        let skipCount = 0;

        rankedPlayers.forEach((player, index) => {
            // If this player's skill is different from the previous one,
            // update the rank to account for all previous ties
            if (player.avgSkill !== currentSkill) {
                currentRank = currentRank + skipCount + 1;
                currentSkill = player.avgSkill;
                skipCount = 0;
            } else if (index > 0) {
                // Count how many players are tied
                skipCount++;
            }

            // Only render if player is not already in a team
            if ($(".team-players").find("[data-name='" + player.name + "']").length === 0) {
                $('#playerList tbody').append(`
                    <tr class="draggable hover:bg-gray-50" data-name="${player.name}" data-attack="${player.attack}" data-defence="${player.defence}">
                        <td class="border border-gray-200 px-1 py-2 text-center">${currentRank}</td>
                        <td class="border border-gray-200 px-1 py-2 text-center">${player.name}</td>
                        <td class="border border-gray-200 px-1 py-2 text-center">
                            ${formatSkillWithChange(player.attack, player.oldAttack)}
                        </td>
                        <td class="border border-gray-200 px-1 py-2 text-center">
                            ${formatSkillWithChange(player.defence, player.oldDefence)}
                        </td>
                        <td class="border border-gray-200 px-1 py-2 text-center">
                            <button class="add-to-team px-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded mx-1 transition-all duration-200" data-team="1">1</button>
                            <button class="add-to-team px-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded mx-1 transition-all duration-200" data-team="2">2</button>
                            <button class="add-to-team px-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded mx-1 transition-all duration-200" data-team="3">3</button>
                        </td>
                    </tr>
                `);
            }
        });
    }

    // Initial render of the player list
    renderPlayerList();

    // Handle button click to assign players to teams
    $(document).on('click', '.add-to-team', function () {
        let playerRow = $(this).closest('tr');
        let playerName = playerRow.data('name');
        let playerAttack = parseFloat(playerRow.data('attack'));
        let playerDefence = parseFloat(playerRow.data('defence'));
        let teamNum = $(this).data('team');
        let selectedTeam = $("#team" + teamNum + " .team-players");

        // Check if the player is already in a team
        if ($(".team-players").find("[data-name='" + playerName + "']").length) {
            alert(playerName + " is already assigned to a team.");
            return;
        }

        // Add the player to the selected team
        selectedTeam.append(`
            <div class="player flex justify-between items-center bg-gray-300 p-1 rounded mb-1" 
                data-name="${playerName}" 
                data-attack="${playerAttack}" 
                data-defence="${playerDefence}">
                <div class="leading-tight">
                    <span class="block">${playerName}</span>
                    <span class="text-xs">(A: ${playerAttack}, D: ${playerDefence})</span>
                </div>
                <button class="remove-player mx-2 text-red-500 hover:text-red-700 font-bold">×</button>
            </div>
        `);

        // Remove the player from the available list
        playerRow.remove();

        // Recalculate the team averages
        updateAverageSkill();
    });

    // Function to remove players from teams
    $(document).on("click", ".remove-player", function () {
        let playerDiv = $(this).closest(".player");

        // Remove the player from the team
        playerDiv.remove();

        // Return the player to the available list and re-sort it
        renderPlayerList();

        // Recalculate the team averages
        updateAverageSkill();
    });

    // Function to update team average skills
    function updateAverageSkill() {
        for (let i = 1; i <= 3; i++) {
            let teamPlayers = $("#team" + i + " .team-players .player");
            let totalAttack = 0;
            let totalDefence = 0;

            teamPlayers.each(function () {
                totalAttack += parseFloat($(this).data("attack"));
                totalDefence += parseFloat($(this).data("defence"));
            });

            let avgAttack = (teamPlayers.length > 0) ? (totalAttack / teamPlayers.length).toFixed(2) : "0.00";
            let avgDefence = (teamPlayers.length > 0) ? (totalDefence / teamPlayers.length).toFixed(2) : "0.00";
            let avgSkill = (teamPlayers.length > 0) ? ((totalAttack + totalDefence) / (2 * teamPlayers.length)).toFixed(2) : "0.00";

            $("#team" + i + " .avg-skill").text(`Average: ${avgSkill}`);
            $("#team" + i + " .avg-skill-details").text(`(A: ${avgAttack}, D: ${avgDefence})`);
        }

        // Check for skill differences between teams
        checkSkillDifference();
    }

    // Function to check if the average skill difference is too large
    function checkSkillDifference() {
        let team1Avg = parseFloat($("#team1 .avg-skill").text().split(':')[1].split('(')[0]);
        let team2Avg = parseFloat($("#team2 .avg-skill").text().split(':')[1].split('(')[0]);
        let team3Avg = parseFloat($("#team3 .avg-skill").text().split(':')[1].split('(')[0]);

        let skillDifference12 = Math.abs(team1Avg - team2Avg);
        let skillDifference13 = Math.abs(team1Avg - team3Avg);
        let skillDifference23 = Math.abs(team2Avg - team3Avg);

        if (skillDifference12 > 0.3 || skillDifference13 > 0.3 || skillDifference23 > 0.3) {
            $("#warning").removeClass("hidden");
        } else {
            $("#warning").addClass("hidden");
        }
    }

    // Clear all teams and reset the player list
    $("#clearAll").click(function () {
        $(".team-players").empty(); // Clear all teams
        renderPlayerList(); // Reset and re-sort the player list
        updateAverageSkill(); // Update team averages
    });

    // Function to extract names from the roster
    function extractNames(rosterText) {
        const lines = rosterText.split('\n');
        const names = [];
        let startReading = false;

        // Helper function to find full name from prefix
        function findMatchingName(prefix) {
            prefix = prefix.toLowerCase();
            // Find exact match first
            const exactMatch = players.find(p => p.name.toLowerCase() === prefix);
            if (exactMatch) return prefix;

            // Find prefix match
            const prefixMatch = players.find(p => p.name.toLowerCase().startsWith(prefix));
            if (prefixMatch) return prefixMatch.name.toLowerCase();

            // If no match found, return the original prefix
            return prefix;
        }

        for (const line of lines) {
            if (line.toLowerCase().includes('volleyball roster')) {
                startReading = true;
                continue;
            }
            if (line.toLowerCase().includes('waitlist')) {
                break;
            }
            if (startReading) {
                const match = line.match(/(([A-Za-z])+)/);
                if (match) {
                    const extractedName = match[1].toLowerCase();
                    const actualName = findMatchingName(extractedName);
                    names.push(actualName);
                }
            }
        }
        return names;
    }

    // Function to create balanced teams
    function createBalancedTeams(names) {
        const availablePlayers = players.filter(player => names.includes(player.name.toLowerCase()));
        const teamCount = 3;
        const teams = [[], [], []];
        const maxTeamSize = 6;

        // Sort players by average skill level (descending)
        availablePlayers.sort((a, b) => ((b.attack + b.defence) / 2) - ((a.attack + a.defence) / 2));

        // Distribute players to teams
        for (let i = 0; i < availablePlayers.length; i++) {
            let teamIndex;
            do {
                teamIndex = Math.floor(Math.random() * teamCount);
            } while (teams[teamIndex].length >= maxTeamSize);

            teams[teamIndex].push(availablePlayers[i]);
        }

        // Fine-tuning: Swap players between teams to balance attack and defence
        function calculateTeamStats(team) {
            return {
                attack: team.reduce((sum, p) => sum + p.attack, 0),
                defence: team.reduce((sum, p) => sum + p.defence, 0)
            };
        }

        function calculateDifference(team1Stats, team2Stats) {
            return Math.abs(team1Stats.attack - team2Stats.attack) +
                Math.abs(team1Stats.defence - team2Stats.defence);
        }

        function trySwapPlayers(team1, team2, player1Index, player2Index) {
            // Calculate current difference
            const team1StatsBefore = calculateTeamStats(team1);
            const team2StatsBefore = calculateTeamStats(team2);
            const diffBefore = calculateDifference(team1StatsBefore, team2StatsBefore);

            // Perform swap
            [team1[player1Index], team2[player2Index]] =
                [team2[player2Index], team1[player1Index]];

            // Calculate new difference
            const team1StatsAfter = calculateTeamStats(team1);
            const team2StatsAfter = calculateTeamStats(team2);
            const diffAfter = calculateDifference(team1StatsAfter, team2StatsAfter);

            // If not improved, revert swap
            if (diffAfter >= diffBefore) {
                [team1[player1Index], team2[player2Index]] =
                    [team2[player2Index], team1[player1Index]];
                return false;
            }
            return true;
        }

        // Main optimization loop
        const MAX_ITERATIONS = 1000;
        for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
            let improvedThisIteration = false;

            // Try swaps between each pair of teams
            for (let i = 0; i < teamCount - 1; i++) {
                for (let j = i + 1; j < teamCount; j++) {
                    // Try each player combination
                    for (let pi = 0; pi < teams[i].length; pi++) {
                        for (let pj = 0; pj < teams[j].length; pj++) {
                            if (trySwapPlayers(teams[i], teams[j], pi, pj)) {
                                improvedThisIteration = true;
                                break;
                            }
                        }
                        if (improvedThisIteration) break;
                    }
                    if (improvedThisIteration) break;
                }
                if (improvedThisIteration) break;
            }

            // If no improvements were made this iteration, we're done
            if (!improvedThisIteration) break;
        }

        return teams;
    }

    // Handle create teams button click
    $("#createTeams").click(function () {
        const rosterText = $("#rosterInput").val();
        const extractedNames = extractNames(rosterText);

        if (extractedNames.length === 0) {
            alert("No valid names found in the roster. Please check the input.");
            return;
        }

        const balancedTeams = createBalancedTeams(extractedNames);

        // Clear existing teams
        $(".team-players").empty();

        // Add players to teams
        balancedTeams.forEach((team, index) => {
            const teamElement = $(`#team${index + 1} .team-players`);
            team.forEach(player => {
                teamElement.append(`
                    <div class="player flex justify-between items-center bg-gray-300 p-1 rounded mb-1" 
                        data-name="${player.name}" 
                        data-attack="${player.attack}" 
                        data-defence="${player.defence}">
                        <div class="leading-tight">
                            <span class="block">${player.name}</span>
                            <span class="text-xs">(A: ${player.attack}, D: ${player.defence})</span>
                        </div>
                        <button class="remove-player mx-2 text-red-500 hover:text-red-700 font-bold">×</button>
                    </div>
                `);
            });
        });

        // Update average skills and check for warnings
        updateAverageSkill();

        // Clear the player list and re-render it
        renderPlayerList();
    });
});
