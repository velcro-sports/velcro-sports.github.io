$(document).ready(function () {
    // Sample player data
    const players = [
        { name: "Aiesh", attack: 9, defence: 7 },
        { name: "Zaid", attack: 7, defence: 4 },
        { name: "Shoaib", attack: 6, defence: 8 },
        { name: "Aman", attack: 9, defence: 9 },
        { name: "Abdullah", attack: 7, defence: 4 },
        { name: "Jayant", attack: 9, defence: 8 },
        { name: "Osman", attack: 9, defence: 7 },
        { name: "Wisam", attack: 6, defence: 4 },
        { name: "Rohail", attack: 7, defence: 6 },
        { name: "Affan", attack: 7, defence: 7 },
        { name: "Hammad", attack: 5, defence: 5 },
        { name: "Imam", attack: 7, defence: 4 },
        { name: "Hassan", attack: 6, defence: 6 },
        { name: "Moin", attack: 5, defence: 5 },
        { name: "Saad", attack: 6, defence: 6 },
        { name: "Salim", attack: 7, defence: 7 },
        { name: "Waeel", attack: 4, defence: 4 },
        { name: "Basil", attack: 4, defence: 4 },
        { name: "Turab", attack: 9, defence: 9 },
        { name: "Anees", attack: 8, defence: 8 },
        { name: "Hussain", attack: 5, defence: 5 },
        { name: "Roshan", attack: 7, defence: 7 },
        { name: "Majd", attack: 7, defence: 7 },
        { name: "Yahya", attack: 1, defence: 1 },
        { name: "Mohammed", attack: 4, defence: 4 },
        { name: "Mahd", attack: 4, defence: 4 },
        { name: "Owais", attack: 7, defence: 7 },
        { name: "Arham", attack: 7, defence: 7 },
        { name: "Ebrahim", attack: 3, defence: 3 },
    ];

    // Function to display the players sorted by average skill (highest to lowest)
    function renderPlayerList() {
        $('#playerList tbody').empty();
        players.sort((a, b) => ((b.attack + b.defence) / 2) - ((a.attack + a.defence) / 2)); // Sort by average skill descending

        players.forEach((player, index) => {
            if ($(".team-players").find("[data-name='" + player.name + "']").length === 0) {
                $('#playerList tbody').append(`
                    <tr class="draggable" data-name="${player.name}" data-attack="${player.attack}" data-defence="${player.defence}">
                        <td>${index + 1}</td>
                        <td>${player.name}</td>
                        <td>${player.attack}</td>
                        <td>${player.defence}</td>
                        <td>
                            <button class="add-to-team" data-team="1">1</button>
                            <button class="add-to-team" data-team="2">2</button>
                            <button class="add-to-team" data-team="3">3</button>
                        </td>
                    </tr>
                `);
            }
        });
    }

    console.log("hm...");
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
            <div class="player" data-name="${playerName}" data-attack="${playerAttack}" data-defence="${playerDefence}">
                ${playerName} (A: ${playerAttack}, D: ${playerDefence})
                <button class="remove-player">X</button>
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
        let playerName = playerDiv.data("name");
        let playerAttack = playerDiv.data("attack");
        let playerDefence = playerDiv.data("defence");

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

            $("#team" + i + " .avg-skill").text(`Avg: ${avgSkill} (A: ${avgAttack}, D: ${avgDefence})`);
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

        for (const line of lines) {
            if (line.toLowerCase().includes('volleyball roster')) {
                startReading = true;
                continue;
            }
            if (line.toLowerCase().includes('waitlist:')) {
                break;
            }
            if (startReading) {
                const match = line.match(/(([A-Za-z])+)/);
                if (match) {
                    names.push(match[1].toLowerCase());
                }
            }
        }
        return names;
    }

    // Function to create balanced teams
    function createBalancedTeams(names) {
        const availablePlayers = players.filter(player => names.includes(player.name.toLowerCase()));
        const teamCount = 3;
        const playersPerTeam = Math.floor(availablePlayers.length / teamCount);
        const teams = [[], [], []];

        // Sort players by average skill level (descending)
        availablePlayers.sort((a, b) => ((b.attack + b.defence) / 2) - ((a.attack + a.defence) / 2));

        // Distribute players to teams
        for (let i = 0; i < availablePlayers.length; i++) {
            const teamIndex = i % teamCount;
            teams[teamIndex].push(availablePlayers[i]);
        }

        // Fine-tuning: Swap players between teams to balance attack and defence
        for (let iteration = 0; iteration < 100; iteration++) {
            let improved = false;
            for (let i = 0; i < teamCount; i++) {
                for (let j = i + 1; j < teamCount; j++) {
                    for (let pi = 0; pi < teams[i].length; pi++) {
                        for (let pj = 0; pj < teams[j].length; pj++) {
                            const team1Attack = teams[i].reduce((sum, p) => sum + p.attack, 0);
                            const team1Defence = teams[i].reduce((sum, p) => sum + p.defence, 0);
                            const team2Attack = teams[j].reduce((sum, p) => sum + p.attack, 0);
                            const team2Defence = teams[j].reduce((sum, p) => sum + p.defence, 0);

                            const currentDiff = Math.abs(team1Attack - team2Attack) + Math.abs(team1Defence - team2Defence);

                            // Simulate swap
                            const tempPlayer = teams[i][pi];
                            teams[i][pi] = teams[j][pj];
                            teams[j][pj] = tempPlayer;

                            const newTeam1Attack = teams[i].reduce((sum, p) => sum + p.attack, 0);
                            const newTeam1Defence = teams[i].reduce((sum, p) => sum + p.defence, 0);
                            const newTeam2Attack = teams[j].reduce((sum, p) => sum + p.attack, 0);
                            const newTeam2Defence = teams[j].reduce((sum, p) => sum + p.defence, 0);

                            const newDiff = Math.abs(newTeam1Attack - newTeam2Attack) + Math.abs(newTeam1Defence - newTeam2Defence);

                            if (newDiff < currentDiff) {
                                improved = true;
                            } else {
                                // Revert the swap
                                teams[j][pj] = teams[i][pi];
                                teams[i][pi] = tempPlayer;
                            }

                            if (improved) break;
                        }
                        if (improved) break;
                    }
                    if (improved) break;
                }
                if (improved) break;
            }
            if (!improved) break;
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
                    <div class="player" data-name="${player.name}" data-attack="${player.attack}" data-defence="${player.defence}">
                        ${player.name} (A: ${player.attack}, D: ${player.defence})
                        <button class="remove-player">X</button>
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
