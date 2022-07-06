'use strict';

const throttledRequest = require('../src/index');

async function test1() {
    const array = [];
    for (let i = 1; i <= 9; i++) {
        array.push(...await throttledRequest(i));
    }
    return array;
}

async function test2() {
    const array = [];
    for (let i = 1; i <= 14; i++) {
        await new Promise((resolve) => {
            setTimeout(() => {
                throttledRequest(i).then(requestData => {
                    array.push(...requestData);
                    resolve();
                });
            }, 10 * i);
        })
    }
    return array;
}

async function test3() {
    const array = [];
    for (let i = 1; i <= 12; i++) {
        await new Promise((resolve) => {
            setTimeout(() => {
                throttledRequest(i).then(requestData => {
                    array.push(...requestData);
                    resolve();
                });
            }, 10 * i);
        })
    }
    await new Promise((resolve) => {
        setTimeout(() => {
            throttledRequest('value1').then(requestData => {
                array.push(...requestData);
            });
        }, 300);

        setTimeout(() => {
            throttledRequest('value2').then(requestData => {
                array.push(...requestData);
                resolve();
            });
        }, 1000);
    });
    return array;
}

module.exports = { test1, test2, test3 };