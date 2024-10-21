$(document).ready(function () {
    // Sample player data
    const players = [
        { name: "Aiesh", skill: 4.5 },
        { name: "Zaid", skill: 3.0 },
        { name: "Shoaib", skill: 3.5 },
        { name: "Aman", skill: 4.5 },
        { name: "Abdullah", skill: 3.5 },
        { name: "Jayant", skill: 4.5 },
        { name: "Osman", skill: 4.5 },
        { name: "Wisam", skill: 2.5 },
        { name: "Rohail", skill: 3.5 },
        { name: "Affan", skill: 3.5 },
        { name: "Hammad", skill: 2.5 },
        { name: "Imam", skill: 2.5 },
        { name: "Hassan", skill: 3 },
        { name: "Moin", skill: 2.5 },
        { name: "Saad", skill: 3 },
        { name: "Salim", skill: 3.5 },
        { name: "Waeel", skill: 2 },
        { name: "Basil", skill: 2 },
        { name: "Turab", skill: 4.5 },
        { name: "Anees", skill: 4 },
        { name: "Hussain", skill: 2.5 },
        { name: "Roshan", skill: 3.5 },
        { name: "Majd", skill: 3.5 },
        { name: "Yahya", skill: 0.5 },
        { name: "Mohammed", skill: 2 },
        { name: "Mahd", skill: 2 },
        { name: "Owais", skill: 3.5 },
        { name: "Arham", skill: 3 }
    ];

    // Function to display the players sorted by skill (highest to lowest)
    function renderPlayerList() {
        $('#playerList tbody').empty();
        players.sort((a, b) => b.skill - a.skill); // Sort by skill descending

        players.forEach(player => {
            if ($(".team-players").find("[data-name='" + player.name + "']").length === 0) { // Check if player is not already in a team
                $('#playerList tbody').append(`
                    <tr class="draggable" data-name="${player.name}" data-skill="${player.skill}">
                        <td>${player.name}</td>
                        <td>${player.skill}</td>
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

    // Initial render of the player list
    renderPlayerList();

    // Handle button click to assign players to teams
    $(document).on('click', '.add-to-team', function () {
        let playerRow = $(this).closest('tr');
        let playerName = playerRow.data('name');
        let playerSkill = parseFloat(playerRow.data('skill'));
        let teamNum = $(this).data('team');
        let selectedTeam = $("#team" + teamNum + " .team-players");

        // Check if the player is already in a team
        if ($(".team-players").find("[data-name='" + playerName + "']").length) {
            alert(playerName + " is already assigned to a team.");
            return;
        }

        // Add the player to the selected team
        selectedTeam.append(`
            <div class="player" data-name="${playerName}" data-skill="${playerSkill}">
                ${playerName} (${playerSkill})
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
        let playerSkill = playerDiv.data("skill");

        // Remove the player from the team
        playerDiv.remove();

        // Return the player to the available list and re-sort it
        renderPlayerList();

        // Recalculate the team averages
        updateAverageSkill();
    });

    // Function to update team average skill
    function updateAverageSkill() {
        for (let i = 1; i <= 3; i++) {
            let teamPlayers = $("#team" + i + " .team-players .player");
            let totalSkill = 0;

            teamPlayers.each(function () {
                totalSkill += parseFloat($(this).data("skill"));
            });

            let avgSkill = (teamPlayers.length > 0) ? (totalSkill / teamPlayers.length).toFixed(2) : "0.00";
            $("#team" + i + " .avg-skill").text(avgSkill);
        }

        // Check for skill differences between teams
        checkSkillDifference();
    }

    // Function to check if the average skill difference is too large
    function checkSkillDifference() {
        let team1Avg = parseFloat($("#team1 .avg-skill").text());
        let team2Avg = parseFloat($("#team2 .avg-skill").text());
        let team3Avg = parseFloat($("#team3 .avg-skill").text());

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
        console.log("Extracted names:", names);
        return names;
    }

    // Function to create balanced teams
    function createBalancedTeams(names) {
        // Filter and sort available players by skill (highest to lowest)
        const availablePlayers = players
            .filter(player => names.includes(player.name.toLowerCase()))
            .sort((a, b) => b.skill - a.skill);

        // Initialize teams
        const teams = [[], [], []];

        // Helper function to get team with lowest total skill
        const getLowestSkillTeam = () => {
            return teams.reduce((lowest, current) => {
                const currentSkill = current.reduce((sum, player) => sum + player.skill, 0);
                const lowestSkill = lowest.reduce((sum, player) => sum + player.skill, 0);
                return currentSkill < lowestSkill ? current : lowest;
            });
        };

        // Distribute players to teams
        availablePlayers.forEach(player => {
            const teamToAddTo = getLowestSkillTeam();
            teamToAddTo.push(player);
        });

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
                    <div class="player" data-name="${player.name}" data-skill="${player.skill}">
                        ${player.name} (${player.skill})
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
