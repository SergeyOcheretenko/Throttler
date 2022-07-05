'use strict';

const Throttler = require('./Throttler');

const throttler = new Throttler({ ms: 1000, requests: 10 });

function request(...args) {
    console.log(args.join(' '));
}

async function throttledRequest(...args) {
    await throttler.acquire();
    return request(...args);
}

throttledRequest('Program started');