// const handleResponse = async (response) => {
//     const contentType = response.headers.get("content-type");
//     let data;

//     try {
//         if (contentType && contentType.includes("application/json")) {
//             data = await response.json();
//         } else {
//             data = await response.text();
//         }
//     } catch (error) {
//         console.error("Parse error:", error);
//         throw new Error("Failed to parse response");
//     }

//     if (!response.ok) {
//         throw new Error(
//             data.message || data || `HTTP error! status: ${response.status}`
//         );
//     }

//     return data;
// };

// const fetchRace = async () => {
//     try {
//         const response = await fetch(`/api/currentrace`);
//         const data = await handleResponse(response);
//         if (data.status === "success") {
//             return data.data[0];
//         } else {
//             alert(data.message);
//         }
//     } catch (err) {
//         alert(err);
//     }
// };

// const fetchDriver = async (id) => {
//     try {
//         const response = await fetch(`/api/drivers/${id}`);
//         const data = await handleResponse(response);
//         return data;
//     } catch (error) {
//         console.error(`Error fetching driver ${id}:`, error);
//     }
// };

export const updateRaceInfo = async (race) => {
  if (race) {
    // Set up car button click handlers
    for (let i = 1; i <= 8; i++) {
      const btn = document.getElementById(`car-btn${i}`);
      const driver = race.drivers[i - 1];
      if (driver) {
        const { car, id } = driver;
        btn.onclick = () => {
          window.registerLapTime(id);
          console.log(`PRESSED BUTTON`);
        };
        // const oldListener = btn.getAttribute("data-listener");
        // btn.removeEventListener("click", window[oldListener]);
        // btn.addEventListener("click", () => {
        //   window.registerLapTime(id);
        //   console.log(PRESSED BUTTON);
        // });

        btn.textContent = `${car}`;
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
