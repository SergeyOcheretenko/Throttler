'use strict';

const Throttler = require('./Throttler');

const throttler = new Throttler({ ms: 3000, requests: 6 });

function request(...args) {
    console.log(args.join(' '));
}

async function throttledRequest(...args) {
    await throttler.acquire();
    return request(...args);
}

for (let i = 1; i <= 15; i++) {
    throttledRequest(`${i} started`);
}
