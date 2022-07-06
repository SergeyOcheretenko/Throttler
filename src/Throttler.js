'use strict';

class Throttler {
    constructor(config) {
        this.ms = config.ms;
        this.requests = config.requests;
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