'use strict';

class ResolveController {
    constructor() {
        this.collection = {};
    }

    getActivePriority() {
        const collectionKeys = Object.keys(this.collection).map(Number);
        if (collectionKeys.length === 0) {
            return;
        }
        return Math.max.apply(null, collectionKeys);
    }

    saveResolve(resolve, priority) {
        if (!this.collection[priority]) {
            this.collection[priority] = [];
        }
        this.collection[priority].push(resolve);
    }

    getResolve() {
        const maxPriority = this.getActivePriority();
        if (!maxPriority) {
            return;
        }
        const resolve = this.collection[maxPriority].shift();
        if (this.collection[maxPriority].length === 0) {
            delete this.collection[maxPriority];
        }
        return resolve;
    }
}

module.exports = ResolveController;