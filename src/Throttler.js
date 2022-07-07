'use strict';

class Throttler {
    constructor({ ms, requests }) {
        this.ms = ms;
        this.maxRequests = requests;
        this.stackRequests = 0;
        this.promiseStack = [];
        this.cleanerStarted = false;
    }

    startCleaner() {
        if (!this.cleanerStarted) {
            this.cleanerStarted = true;
            return setInterval(() => {
                this.stackRequests = 0;
                let resolvedPromises = 0;
                for (const resolve of this.promiseStack) {
                    resolve();
                    if (resolvedPromises === this.maxRequests) break;
                }
                this.stackRequests += resolvedPromises;
                return;
            }, this.ms);
        }
        return;
    }

    tryToResolveImmediately() {
        if (this.stackRequests < this.maxRequests) {
            const resolve = this.promiseStack.shift();
            resolve();
            this.stackRequests++;
        }
        return;
    }

    async acquire() {
        this.startCleaner();
        return new Promise((resolve) => {
            this.promiseStack.push(resolve);
            this.tryToResolveImmediately();
        });
    }
}

module.exports = Throttler;
// export default Throttler;