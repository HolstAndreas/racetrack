export class Race {
    constructor(drivers) {
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

    changeMode(mode) {
        //Some eventlistener for manual mode change.
        this.mode = mode;
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
