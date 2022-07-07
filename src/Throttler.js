'use strict';

class Throttler {
    constructor({ ms, requests }) {
        this.ms = ms;
        this.maxRequests = requests;
        this.stackRequests = 0;
        this.startTracking = Date.now();
        this.promiseStack = [];
    }

    checkTime() {
        if (Date.now() - this.startTracking >= this.ms) {
            this.stackRequests = 0;
            this.startTracking = Date.now();
        }
        return;
    }

    async acquire() {
        return new Promise((resolve) => {
            this.promiseStack.push(resolve);
            (function waitForCondition() {
                this.checkTime();
                if (this.stackRequests < this.maxRequests) {
                    this.stackRequests++;
                    this.promiseStack.shift()();
                    return resolve();
                }
                setTimeout(waitForCondition.bind(this), 30);
            }).call(this);
        });
    }
}

module.exports = Throttler;
// export default Throttler;