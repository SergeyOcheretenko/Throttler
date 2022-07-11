export class ResolveController {
    // collection: ?

    constructor();
    getActivePriority(): number | undefined;
    saveResolve(resolve: Function, priority: number): void;
    getResolve(): Function | undefined;
}