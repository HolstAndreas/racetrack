export class Race {
  constructor(startTime, drivers) {
    this.id = 0;
    this.startTime = startTime;
    this.drivers = drivers; //gets array of drivers from...
    this.remainingTime = 600;
    this.status = "Waiting";
    this.mode = "Danger";
  }

  getStartTime() {
    return this.startTime;
  }

  getDrivers() {
    return this.drivers;
  }

  toString() {
    return `Race ID$:{this.id} - START:${this.startTime} - DRIVERS:${this.drivers} - TIME:${this.remainingTime} - STATUS:${this.status} - MODE:${this.mode}`;
  }

  startRace() {
    this.status = "Started";
    this.mode = "Safe";
    this.countdown();
    //leaderboard change
    //Next race screen;
    //update start-time?
    const start = new Date();
    this.startTime = start.toLocaleString("en-GB");
  }

  countdown() {
    var timer = setInterval(() => {
      if (remainingTime === 0) {
        clearInterval(timer);
        this.mode = "Finish";
        //make endrace() available?
      }
      this.remainingTime--;
    }, 1000);
  }

  changeMode(change) {
    //Some eventlistener for manual mode change.
    if (change instanceof MODE) {
      this.mode = change;
    }
  }

  endRace() {
    //if (this mode != MODE.FINISH) - button unavailable
    // otherwise some eventlistener activation
    this.changeStatus("Finish");
    this.changeMode("Danger");
  }
}

export default Race;

// CREATE TABLE races (
//     id SERIAL PRIMARY KEY,
//     start_time TIMESTAMP,
//     drivers INTEGER[],
//     remaining_time INTEGER DEFAULT 600,
//     status VARCHAR(50) DEFAULT 'WAITING',
//     mode VARCHAR(50) DEFAULT 'DANGER'
// );
