'use strict';

class Throttler {
    constructor({ ms, requests }) {
        this.ms = ms;
        this.requests = requests;
        this.stack = 0;
        this.startTracking = Date.now();
    }

    checkTime() {
        if (Date.now() - this.startTracking >= this.ms) {
            this.stack = 0;
            this.startTracking = Date.now();
        }
        return;
    }

    async acquire() {
        return new Promise((resolve) => {
            const waitForCondition = () => {
                this.checkTime();
                if (this.stack < this.requests) {
                    this.stack++;
                    return resolve();
                }
                setTimeout(waitForCondition, 30);
            };
            return waitForCondition();
        });
    }
}

module.exports = Throttler;
// export default Throttler;