'use strict';

const Throttler = require('./Throttler');

const throttler = new Throttler({ ms: 10, requests: 0 });

function request(...args) {
    return args;
}

async function throttledRequest(...args) {
    await throttler.acquire();
    return request(...args);
}

module.exports = throttledRequest;