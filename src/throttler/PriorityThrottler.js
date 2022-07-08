'use strict';

class PriorityThrottler {
    constructor({ ms, requests }) {
        this.configValidation(ms, requests);
        this.ms = ms;
        this.maxRequests = requests;
        this.completedRequests = 0;
        this.stack = [];
        this.priorityStack = [];
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

    cleanPriorityPromises() {
        while (this.completedRequests < this.maxRequests && this.priorityStack.length > 0) {
            const resolve = this.priorityStack.shift();
            resolve();
            this.completedRequests++;
        }
        return;
    }

    cleanUsualPromises() {
        while (this.completedRequests < this.maxRequests && this.stack.length > 0) {
            const resolve = this.stack.shift();
            resolve();
            this.completedRequests++;
        }
        return;
    }

    stopCleaner() {
        this.cleanerStarted = false;
        return clearInterval(this.cleanerId);
    }

    startCleaner() {
        if (this.cleanerStarted) {
            return;
        }
        this.cleanerId = setInterval(() => {
            this.completedRequests = 0;
            this.cleanPriorityPromises();
            this.cleanUsualPromises();
            if (this.completedRequests === 0) {
                this.stopCleaner();
            }
        }, this.ms);
        this.cleanerStarted = true;
        return;
    }

    tryToResolveImmediately() {
        if (this.completedRequests >= this.maxRequests) {
            return;
        }
        const resolve = this.priorityStack.length > 0 
            ? this.priorityStack.shift()
            : this.stack.shift();
        resolve();
        this.completedRequests++;
        return;
    }

    async acquire({ priority = false }) {
        return new Promise((resolve) => {
            if (priority) {
                this.priorityStack.push(resolve);
            } else {
                this.stack.push(resolve);
            }
            this.startCleaner();
            this.tryToResolveImmediately();
        });
    }
}

module.exports = PriorityThrottler;
// export default Throttler;