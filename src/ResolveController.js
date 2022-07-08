'use strict';

class ResolveController {
    constructor() {
        this.collection = {};
    }

    getMaxPriority() {
        const collectionKeys = Object.keys(this.collection).map(Number);
        return Math.max.apply(null, collectionKeys);
    }

    saveResolve(resolve, priority) {
        if (!this.collection[priority]) {
            this.collection[priority] = [];
        }
        this.collection[priority].push(resolve);
    }

    getResolve() {
        const maxPriority = this.getMaxPriority();
        const resolve = this.collection[maxPriority].shift();
        if (this.collection[maxPriority].length === 0) {
            delete this.collection[maxPriority];
        }
        return resolve;
    }
}