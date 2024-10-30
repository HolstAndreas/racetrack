let countdownInterval = null;
let TIMER = null;

const handleResponse = async (response) => {
    const contentType = response.headers.get("content-type");
    let data;

    try {
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }
    } catch (error) {
        console.error("Parse error:", error);
        throw new Error("Failed to parse response");
    }

    if (!response.ok) {
        throw new Error(
            data.message || data || `HTTP error! status: ${response.status}`
        );
    }

    return data;
};

const fetchRace = async () => {
    try {
        const response = await fetch(`/api/currentrace`);
        const data = await handleResponse(response);
        if (data.status === "success") {
            return data.data[0];
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(err);
    }
};

const fetchDriver = async (id) => {
    try {
        const response = await fetch(`/api/drivers/${id}`);
        const data = await handleResponse(response);
        return data;
    } catch (error) {
        console.error(`Error fetching driver ${id}:`, error);
    }
};

window.loadRaceInfo = async () => {
    // Get initial race data
    const race = await fetchRace();
    if (race) {
        document.getElementById("raceId").textContent = race.id;
        document.getElementById("status").textContent = race.status;

        // Set up car button click handlers
        for (let i = 1; i <= 8; i++) {
            const btn = document.getElementById(`car-btn${i}`);
            if (race.drivers[i - 1]) {
                const driver = await fetchDriver(race.drivers[i - 1]);
                if (driver && driver.data) {
                    const { car, id } = driver.data;
                    btn.addEventListener("click", () =>
                        window.registerLapTime(id)
                    );
                    btn.textContent = `${car}`;
                }
            } else {
                btn.textContent = `X`;
            }

            // Disable buttons for cars not in race
            if (i > race.drivers?.length) {
                btn.disabled = true;
                btn.classList.add("disabled");
            } else {
                if (btn.classList.contains("disabled")) {
                    btn.classList.remove("disabled");
                    btn.disabled = false;
                }
            }
        }
        disableButtons(race.mode, race.status);
    } else {
        alert("No current race.");
    }
};

const disableButtons = (raceMode, raceStatus) => {
    const buttonsDiv = document.getElementById("buttonsDiv");
    if (raceMode === "FINISH" || raceStatus !== "STARTED") {
        // if (!buttonsDiv.classList.includes("disabled")) {
        //   buttonsDiv.classList.add("disabled");
        // }
        buttonsDiv.disabled = true;
    } else {
        buttonsDiv.disabled = false;
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await window.loadRaceInfo();
    } catch (err) {
        alert(err);
    }
});
