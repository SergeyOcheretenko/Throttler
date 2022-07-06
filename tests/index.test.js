'use strict';

const { test1, test2, test3 } = require('./functions');

jest.setTimeout(15000);

function fillArray(number) {
    const array = [];
    for (let i = 1; i <= number; i++) {
        array.push(i);
    }
    return array;
}

test('Fast logging', async () => {
    const answer = fillArray(9);
    return test1().then((array) => {
        expect(array).toEqual(answer);
    });
});

test('Hitting the 30 ms window', async () => {
    const answer = fillArray(14);
    return test2().then((array) => {
        expect(array).toEqual(answer);
    });
});

test('Request sessions', async () => {
    const answer = fillArray(12);
    answer.push('value1', 'value2');
    return test3().then((array) => {
        expect(array).toEqual(answer);
    });
});