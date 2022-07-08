'use strict';

const ResolveController = require('../ResolveController');

class PriorityThrottler {
    constructor({ ms, requests }) {
        this.resolveController = new ResolveController();
        this.configValidation(ms, requests);
        this.ms = ms;
        this.maxRequests = requests;
        this.completedRequests = 0;
        this.cleanerStarted = false;
    }

    configValidation(ms, request) {
        if (ms < 0) {
            throw new Error('Unable to set the time less than 0ms');
        }
        if (request <= 0) {
            throw new Error('Unable to set a limit of 0 requests or less');
        }
    }

    tryToResolve() {
        if (this.completedRequests >= this.maxRequests) {
            return;
        }
        const resolve = this.resolveController.getResolve();
        if (resolve) {
            this.completedRequests++;
            return resolve();
        }
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
            while (this.completedRequests < this.maxRequests && this.resolveController.getActivePriority()) {
                this.tryToResolve();
            }
            if (this.completedRequests === 0) {
                this.stopCleaner();
            }
        }, this.ms);
        this.cleanerStarted = true;
    }

    async acquire(priority) {
        return new Promise((resolve) => {
            this.resolveController.saveResolve(resolve, priority);
            this.startCleaner();
            this.tryToResolve();
        });
    }
}

module.exports = PriorityThrottler;
// export default Throttler;