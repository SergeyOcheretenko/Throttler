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
            return (function waitForCondition() {
                if (this.stack === 0) return resolve();
                setTimeout(waitForCondition.bind(this), 30);
            }).call(this);
        });
    }
}

module.exports = Throttler;