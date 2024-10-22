export class Race {
  constructor(id, drivers) {
    this.id = id;
    this.startTime = undefined;
    this.drivers = drivers; //gets array of drivers from...
    this.remainingTime = 600;
    this.status = STATUS.WAITING;
    this.mode = MODE.DANGER;
  }

  startRace() {
    this.status = STATUS.STARTED;
    this.mode = MODE.SAFE;
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
        this.mode = MODE.FINISH;
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
    this.changeStatus(STATUS.FINISHED);
    this.changeMode(MODE.DANGER);
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
