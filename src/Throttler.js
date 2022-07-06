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
            (function waitForCondition() {
                this.checkTime();
                if (this.stack < this.requests) {
                    this.stack++;
                    return resolve();
                }
                setTimeout(waitForCondition.bind(this), 30);
            }).call(this);
        });
    }
}

module.exports = Throttler;
// export default Throttler;