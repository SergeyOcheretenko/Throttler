'use strict';

class Throttler {
    constructor({ ms, requests }) {
        this.ms = ms;
        this.requests = requests;
        this.stack = 0;
        setInterval(() => {
            this.stack = 0;
        }, ms);
    }

    async acquire() {
        return new Promise((resolve, reject) => {
            const waitForCondition = () => {
                if (this.stack < this.requests) {
                    this.stack++;
                    return resolve();
                }
                setTimeout(waitForCondition, 30);
            };
            return waitForCondition();
        });
    }
}

module.exports = Throttler;
// export default Throttler;