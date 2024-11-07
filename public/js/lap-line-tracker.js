import raceStore from "./store/race-store.js";

export const updateRaceInfo = async (race) => {
  if (race) {
    // Set up car button click handlers
    for (let i = 1; i <= 8; i++) {
      const btn = document.getElementById(`car-btn${i}`);
      const driver = race.drivers[i - 1];
      if (driver) {
        const { car, id } = driver;
        btn.innerHTML =
          car ||
          `<i class="fa-solid fa-triangle-exclamation" style="color: #FFD43B;"></i>`;
        btn.onclick = async () => {
          try {
            const response = await fetch("/api/laptimes/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                driverId: id,
                currentTimestamp: new Date().toISOString(),
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || "Failed to register lap time");
            }
          } catch (error) {
            console.error("Error registering lap time:", error);
            alert(error);
          }
        };
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
    disableButtons();
  } else {
    alert("No current race.");
  }
};

const disableButtons = () => {
  const buttonsDiv = document.getElementById("buttonsDiv");
  if (raceStore.data.currentRace.status !== "STARTED") {
    buttonsDiv.disabled = true;
  } else {
    buttonsDiv.disabled = false;
  }
};
