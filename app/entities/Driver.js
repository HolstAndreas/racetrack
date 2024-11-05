class Driver {
  constructor(id = null, name, car = null, currentRace = null, lapTimes = []) {
    this.id = id;
    this.name = name;
    this.car = car;
    this.currentRace = currentRace;
    this.lapTimes = lapTimes;
  }
  recordLapTime(lapTime) {
    if (lapTime instanceof LapTime) {
      this.lapTimes.push(lapTime);
      if (lapTime.lapTime < this.fastestLap.lapTime) {
        this.fastestLap = lapTime;
      }
    }
  }
  assignCar(car) {
    this.car = car;
  }
}

export default Driver;
