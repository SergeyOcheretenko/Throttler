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

    generateId() {
        const len = this.promiseStack.length;
        if (len === 0) return 1;
        return this.promiseStack[len - 1] + 1;
    }

    async acquire() {
        return new Promise((resolve) => {
            const promiseId = this.generateId();
            this.promiseStack.push(promiseId);
            (function waitForCondition() {
                this.checkTime();
                if (this.stackRequests < this.maxRequests && promiseId === this.promiseStack[0]) {
                    this.stackRequests++;
                    this.promiseStack.shift();
                    return resolve();
                }
                setTimeout(waitForCondition.bind(this), 30);
            }).call(this);
        });
    }
}

module.exports = Throttler;
// export default Throttler;