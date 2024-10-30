import { startRace, raceUpdated } from "./socket/rc.socket.io.js";

let race = {};

document.addEventListener("DOMContentLoaded", async (event) => {
    // Add event listeners to buttons
    document.getElementById("startBtn").addEventListener("click", () => {
        changeStatus("STARTED");
    });
    document
        .getElementById("finishBtn")
        .addEventListener("click", () => changeStatus("FINISHED"));

    // Add event listeners for mode buttons too
    document
        .getElementById("safeButton")
        .addEventListener("click", () => changeMode("SAFE"));
    document
        .getElementById("hazardButton")
        .addEventListener("click", () => changeMode("HAZARD"));
    document
        .getElementById("dangerButton")
        .addEventListener("click", () => changeMode("DANGER"));
    document
        .getElementById("finishButton")
        .addEventListener("click", () => changeMode("FINISH"));
    document
        .getElementById("reset-race")
        .addEventListener("click", () => resetRace());

    race = await getCurrentRace();
});

//temp
const resetRace = async () => {
    try {
        const result = await fetch(`/api/reset-race/${race.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        alert(err);
        return;
    }
    location.reload();
};

export const changeStatus = async (status) => {
    race = await getCurrentRace();
    if (status === race.status) return;
    try {
        const result = await fetch(`/api/race-sessions/${race.id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: status,
            }),
        });
        const data = await handleResponse(result);
        race = data.data;
        if (race.status === "STARTED") {
            await changeMode("SAFE");
            startRace();
        }
        if (status === "FINISHED") {
            await getCurrentRace();
        }
        updateRaceInfo(race);
        raceUpdated(race.id);
    } catch (err) {
        alert(err);
        return;
    }
};

export const changeMode = async (mode) => {
    race = await getCurrentRace();
    if (mode === race.mode) return;
    try {
        await fetch(`/api/race-sessions/${race.id}/mode`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mode: mode,
            }),
        });
        race = await getCurrentRace();
        updateRaceInfo(race);
        raceUpdated(race.id);
    } catch (err) {
        alert(err);
    }
};

window.getCurrentRace = async () => {
    const response = await fetch(`/api/currentrace`);
    const data = await handleResponse(response);
    if (data.status === "success") {
        updateRaceInfo(data.data[0]);
        return data.data[0];
    } else {
        alert(data.message);
    }
};

const updateRaceInfo = (raceData) => {
    race = raceData;
    const raceId = document.getElementById("raceId");
    raceId.innerHTML = raceData.id;
    const drivers = document.getElementById("driver-names");

    Promise.all(
        race.drivers.map(async (driver) => {
            try {
                const result = await fetch(`/api/drivers/${driver}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await handleResponse(result);
                return `<span class="driver-id-box">#${driver}  <i class="fa-solid fa-car ${
                    !data.data.car ? `car-icon" title="Missing Car"` : ""
                }"></i> ${data.data.car || ""}</span>`;
            } catch (err) {
                alert(`Driver ${driver} | ${err}`);
                return "";
            }
        })
    ).then((driverSpans) => {
        drivers.innerHTML = driverSpans.join("");
    });

    const currentMode = document.getElementById("currentMode");
    currentMode.innerHTML = raceData.mode;

    const currentStatus = document.getElementById("currentStatus");
    currentStatus.innerHTML = raceData.status;
    disableButtons();
};

const disableButtons = () => {
    const startRaceButton = document.getElementById("startBtn");
    const endRaceButton = document.getElementById("finishBtn");

    const modeControl = document.getElementById("ctrlButtonDiv");

    if (race.status === "STARTED" && race.mode !== "FINISH") {
        modeControl.disabled = false;
    } else {
        modeControl.disabled = true;
    }

    if (race.status === "WAITING") {
        startRaceButton.disabled = false;
    } else {
        startRaceButton.disabled = true;
    }

    if (race.mode === "FINISH" && race.status === "STARTED") {
        endRaceButton.disabled = false;
    } else {
        endRaceButton.disabled = true;
    }
};

// Utility functions
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
