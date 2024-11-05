export class Race {
  constructor(drivers) {
    this.id = 0;
    this.startTime = new Date();
    this.drivers = drivers;
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
    return `Race { id: ${this.id}, startTime: ${
      this.startTime
    }, drivers: ${JSON.stringify(this.drivers)}, remainingTime: ${
      this.remainingTime
    }, status: ${this.status}, mode: ${this.mode} }`;
  }

  startRace() {
    this.status = "Started";
    this.mode = "Safe";
    this.countdown();
    const start = new Date();
    this.startTime = start.toLocaleString("en-GB");
  }

  countdown() {
    var timer = setInterval(() => {
      if (this.remainingTime === 0) {
        clearInterval(timer);
        this.mode = "Finish";
      }
      this.remainingTime--;
    }, 1000);
  }

  changeMode(mode) {
    this.mode = mode;
  }

  endRace() {
    this.changeStatus("Finish");
    this.changeMode("Danger");
  }
}

export default Race;
