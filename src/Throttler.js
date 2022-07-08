'use strict';

class Throttler {
    constructor({ ms, requests }) {
        this.configValidation(ms, requests);
        this.ms = ms;
        this.maxRequests = requests;
        this.stackRequests = 0;
        this.promiseStack = [];
        this.cleanerStarted = false;
    }

    configValidation(ms, request) {
        if (ms < 0) {
            throw new Error('Unable to set the time less than 0ms');
        }
        if (request <= 0) {
            throw new Error('Unable to set a limit of 0 requests or less');
        }
        return;
    }

    startCleaner() {
        if (!this.cleanerStarted) {
            this.cleanerStarted = true;
            this.cleanerId = setInterval(() => {
                this.stackRequests = 0;
                for (const resolve of this.promiseStack) {
                    resolve();
                    this.stackRequests++;
                    if (this.stackRequests === this.maxRequests) {
                        break;
                    }
                }
                this.promiseStack = this.promiseStack.slice(this.stackRequests);
                if (this.stackRequests === 0) {
                    this.cleanerStarted = false;
                    return clearInterval(this.cleanerId);
                }
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
        return new Promise((resolve) => {
            this.promiseStack.push(resolve);
            this.startCleaner();
            this.tryToResolveImmediately();
        });
    }
}

module.exports = Throttler;
// export default Throttler;