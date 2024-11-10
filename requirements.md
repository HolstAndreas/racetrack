AUTOFILL paroolid ära võtta.


✓ The server waits 500ms to respond if an incorrect access key is entered in the interface.
✓ The Front Desk, Race Control and Lap-line Tracker require access codes to function correctly.
✓ The interface re-prompts the user to enter a correct access key when an incorrect access key is inserted.
✓ The environment variable access codes match the accepted access codes entered into the interfaces.
✓ The server will not start unless environment variables are set for interface access keys.

✓ When the race session is ended, the Next Race display shows an additional message to proceed to the paddock.

✓ When the race is started, the following happens:

✓ - The race mode is changed to "Safe"
✓ - The leader board changes to the current race.
✓ - The Next Race screen switches to the subsequent race session.
✓ - The Safety Official sees race mode controls.

✓ The leaderboard shows the remaining time on the timer.
✓ The leaderboard shows the drivers name and car number.
✓ The leaderboard shows the flag color for the current race mode.
✓ The leaderboard is ordered by fastest lap times
✓ The leaderboard shows the fastest lap time for each car.
✓ The leaderboard shows the current lap for each car.
✓ The first lap starts when the car crosses the leader board for the first time.
✓ When the lap button is pressed for a car, the leader board is updated.

✓ If there are no upcoming races, no sessions are displayed.
✓ The race drivers cannot be edited after the race is safe to start.
✓ The receptionist can add new race sessions.
✓ The receptionist can add/edit/remove drivers from a race.
✓ The receptionist can see a list of upcoming races.
✓ The receptionist can delete an upcoming race.
✓ The receptionist can assign drivers to specific cars.
✓ Race sessions disappear from the Front Desk interface once it is safe to start.

✓ The Race Control interface is designed for a mobile interface.
✓ The safety official has one active button, which starts the race when pressed.
✓ When the Safety Official selects "Hazard", the Flag screen is yellow.
✓ When the Safety Official selects "Finish", the Flag screen is chequered.
✓ When the Safety Official selects "Danger", the Flag screen is red.
✓ When the Safety Official selects "Safe", the Flag screen is green.
✓ When the race mode changes to "Finish", `the race controls disappear`, and a button appears to end the race session.
✓ When the Safety Official ends the race session, the next session appears on their interface.
✓ If there is no upcoming race after the last session is ended, the Safety Official sees no upcoming races message.

✓ The lap button for each car has a large tappable area.
✓ The Lap-line Tracker is designed for a tablet, featuring large tappable buttons for each car.
✓ It should work in Landscape or Portrait
✓ When the race session starts, the Lap-Line Observer sees a button for each car.

✓ The countdown timer is 1 minute in dev mode (instead of 10 minutes).
✓ The server can be started in developer mode with npm run dev.
✓ The countdown timer runs for 1 minute instead on 10 minutes.

✓ Communication between interfaces is in real-time. API calls must not be used to send data.
✓ For example, when the race mode is changed by the Safety Official, the flag displays change in real time
✓ Communication between interfaces utilises messages sent via Socket.IO.
✓ Communication between the interfaces certainly does not use a polling convention.

Ä The interfaces are reachable by devices on other networks (not just localhost).
Ä The interfaces must be reachable by devices on other networks. For example, the interface must be reachable from a mobile phone browser, while the server and interfaces are served from a computer.

✓ The Next Race display shows the drivers names, and the cars they're assigned to.
✓ The Next Race display switches to the subsequent race, once the current race is safe to start.
✓ The upcoming race session, is displayed on the Next Race display.

✓ The README.md file at the root of the project describes how to launch the project.
✓ The README.md file at the root of the project has a user guide, describing the core functionality of the user interfaces
✓ It is not possible to have two drivers with the same name.

✓ When the race session is ended, the race mode changes to "Danger".

✓ The buttons disappear or are visibly disabled between races.

✓ The server is written in Node.JS
✓ The server can be started with npm start

✓ The interfaces are reachable via their correct paths.
| Interface | Persona | Route |
| ---------------- | ----------------- | ------------------- |
| Front Desk | Receptionist | `/front-desk` |
| Race Control | Safety Official | `/race-control` |
| Lap-line Tracker | Lap-line Observer | `/lap-line-tracker` |
| Leader Board | Guest | `leader-board` |
| Next Race | Race Driver | `next-race` |
| Race Countdown | Race Driver | `race-countdown` |
| Race Flag | Race Driver | `race-flags` |

✓ The system state is persisted.
✓ When the server is restarted, the system resumes with the exact same. I.e. the race counter continues counting down, and upcoming races are not lost.


