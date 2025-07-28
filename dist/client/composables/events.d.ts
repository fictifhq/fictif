type Listener = (...args: any[]) => any;
/**
 * A modern, powerful, async-aware event emitter for the browser,
 * inspired by Node.js EventEmitter and designed for modern web applications.
 * It supports class extension, type-safe event mapping, and async listeners.
 */
export declare class EventEmitter {
    private _listeners;
    private static _defaultMaxListeners;
    constructor();
    /**
     * Registers an event listener to be called when the event is emitted.
     * @param event The name of the event to listen for.
     * @param listener The callback function.
     * @returns The emitter instance for chaining.
     */
    on(event: string | symbol, listener: Listener): this;
    /**
     * Adds a one-time listener for the event. This listener is invoked only the next
     * time the event is emitted, after which it is removed.
     * @param event The name of the event to listen for.
     * @param listener The callback function.
     * @returns The emitter instance for chaining.
     */
    once(event: string | symbol, listener: Listener): this;
    /**
     * Removes a specific listener for a given event.
     * @param event The name of the event.
     * @param listener The listener function to remove.
     * @returns The emitter instance for chaining.
     */
    off(event: string | symbol, listener: Listener): this;
    /**
     * Synchronously calls each of the listeners registered for the event, in the order
     * they were registered, passing the supplied arguments to each.
     *
     * @param event The name of the event to emit.
     * @param args The arguments to pass to the listeners.
     * @returns A promise that resolves with an array of all non-undefined values
     * returned by the listeners.
     */
    emit<T = any>(event: string | symbol, ...args: any[]): Promise<T[]>;
    /**
     * Adds the listener function to the beginning of the listeners array for the specified event.
     * @param event The name of the event.
     * @param listener The listener function.
     * @returns The emitter instance for chaining.
     */
    prependListener(event: string | symbol, listener: Listener): this;
    /**
     * Adds a one-time listener function for the event to the beginning of the listeners array.
     * @param event The name of the event.
     * @param listener The listener function.
     * @returns The emitter instance for chaining.
     */
    prependOnceListener(event: string | symbol, listener: Listener): this;
    /**
     * Removes all listeners for a specific event, or all listeners from all events
     * if no event is specified.
     * @param event The optional event name.
     * @returns The emitter instance for chaining.
     */
    removeAllListeners(event?: string | symbol): this;
    /**
     * Returns an array listing the events for which the emitter has registered listeners.
     */
    eventNames(): (string | symbol)[];
    /**
     * Returns a copy of the array of listeners for the specified event.
     * @param event The name of the event.
     */
    listeners(event: string | symbol): Listener[];
    /**
     * Returns the number of listeners listening to the specified event.
     * @param event The name of the event.
     */
    listenerCount(event: string | symbol): number;
    /**
     * By default, a warning is printed if more than 10 listeners are added for
     * a particular event. This is a useful default that helps in finding memory leaks.
     * @param n The new maximum.
     */
    setMaxListeners(n: number): this;
    /**
     * Returns the current max listener value for the emitter.
     */
    getMaxListeners(): number;
    private checkMaxListeners;
}
/**
 * Convenience factory function to create a new EventEmitter instance.
 */
export declare function createEmitter(): EventEmitter;
export {};
//# sourceMappingURL=events.d.ts.map