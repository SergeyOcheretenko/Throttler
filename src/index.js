'use strict';

const Throttler = require('./Throttler');

const throttler = new Throttler({ ms: 2000, requests: 5 });

function request(...args) {
    console.log(args);
    return args;
}

async function throttledRequest(...args) {
    await throttler.acquire();
    return request(...args);
}

async function main() {
    console.time('throttled');
    for (let i = 1; i <= 16; i++) {
        await throttledRequest(i);
    }
    console.timeEnd('throttled');
}

main();

module.exports = throttledRequest;