'use strict';

class Throttler {
    constructor({ ms, requests }) {
        this.ms = ms;
        this.requests = requests;
        this.stack = 1;
        setInterval(() => {
            this.stack = 0;
        }, ms);
    }

    async acquire() {
        return new Promise((resolve, reject) => {
            const waitForCondition = () => {
                if (this.stack === 0) return resolve();
                setTimeout(waitForCondition, 30);
            }

            waitForCondition();
        });
    }
}

module.exports = Throttler;