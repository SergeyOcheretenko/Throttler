'use strict';

function request(...args) {
    console.log(args.join(' '));
}

async function throttledRequest(...args) {
    // await throttledRequest.acquire();
    return request(...args);
}

throttledRequest('Program started');