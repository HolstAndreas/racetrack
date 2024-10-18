import LapTime from "./LapTime.js";

class Driver {
    constructor(id, name, car, currentRace, currentLap, fastestLap, lapTimes) {
        this.id = id;
        this.name = name;
        this.car = car;
        this.currentRace = currentRace;
        this.currentLap = currentLap;
        this.fastestLap = fastestLap;
        this.lapTimes = lapTimes;
    }
    recordLapTime(lapTime) {
        if(lapTime instanceof LapTime) {
            this.lapTimes.push(lapTime);
            if(lapTime.lapTime < this.fastestLap.lapTime) {
                this.fastestLap = lapTime;
            }
        }
    }
    assignCar(car) {
        this.car = car;
    }
}

export default Driver;