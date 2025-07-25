// src/client/composables/events.ts

type Listener = (...args: any[]) => any;
type EventMap = Record<string | symbol, Listener[]>;

/**
 * A modern, powerful, async-aware event emitter for the browser,
 * inspired by Node.js EventEmitter and designed for modern web applications.
 * It supports class extension, type-safe event mapping, and async listeners.
 */
export class EventEmitter {
    private _listeners: Map<string | symbol, Listener[]>;
    private static _defaultMaxListeners = 10;

    constructor() {
        this._listeners = new Map();
    }

    /**
     * Registers an event listener to be called when the event is emitted.
     * @param event The name of the event to listen for.
     * @param listener The callback function.
     * @returns The emitter instance for chaining.
     */
    on(event: string | symbol, listener: Listener): this {
        const existing = this._listeners.get(event);
        if (existing) {
            existing.push(listener);
        } else {
            this._listeners.set(event, [listener]);
        }
        this.checkMaxListeners(event);
        return this;
    }

    /**
     * Adds a one-time listener for the event. This listener is invoked only the next
     * time the event is emitted, after which it is removed.
     * @param event The name of the event to listen for.
     * @param listener The callback function.
     * @returns The emitter instance for chaining.
     */
    once(event: string | symbol, listener: Listener): this {
        const onceWrapper = (...args: any[]) => {
            this.off(event, onceWrapper);
            listener(...args);
        };
        // Attach a descriptive property for easier inspection if needed
        (onceWrapper as any).listener = listener;
        this.on(event, onceWrapper);
        return this;
    }

    /**
     * Removes a specific listener for a given event.
     * @param event The name of the event.
     * @param listener The listener function to remove.
     * @returns The emitter instance for chaining.
     */
    off(event: string | symbol, listener: Listener): this {
        const existing = this._listeners.get(event);
        if (existing) {
            const newListeners = existing.filter(l => l !== listener && (l as any).listener !== listener);
            if (newListeners.length) {
                this._listeners.set(event, newListeners);
            } else {
                this._listeners.delete(event);
            }
        }
        return this;
    }

    /**
     * Synchronously calls each of the listeners registered for the event, in the order
     * they were registered, passing the supplied arguments to each.
     *
     * @param event The name of the event to emit.
     * @param args The arguments to pass to the listeners.
     * @returns A promise that resolves with an array of all non-undefined values
     * returned by the listeners.
     */
    async emit<T = any>(event: string | symbol, ...args: any[]): Promise<T[]> {
        const existing = this._listeners.get(event);
        if (!existing || existing.length === 0) {
            // Special case for 'error' event, mimics Node.js behavior
            if (event === 'error') {
                const error = args[0] instanceof Error ? args[0] : new Error('Unhandled error event');
                throw error;
            }
            return [];
        }

        // Create a copy in case listeners modify the array during emission
        const listenersToCall = [...existing];
        const results = listenersToCall.map(l => l(...args));

        const settledResults = await Promise.all(results);
        return settledResults.filter(result => result !== undefined);
    }

    /**
     * Adds the listener function to the beginning of the listeners array for the specified event.
     * @param event The name of the event.
     * @param listener The listener function.
     * @returns The emitter instance for chaining.
     */
    prependListener(event: string | symbol, listener: Listener): this {
        const existing = this._listeners.get(event);
        if (existing) {
            existing.unshift(listener);
        } else {
            this._listeners.set(event, [listener]);
        }
        this.checkMaxListeners(event);
        return this;
    }

    /**
     * Adds a one-time listener function for the event to the beginning of the listeners array.
     * @param event The name of the event.
     * @param listener The listener function.
     * @returns The emitter instance for chaining.
     */
    prependOnceListener(event: string | symbol, listener: Listener): this {
        const onceWrapper = (...args: any[]) => {
            this.off(event, onceWrapper);
            listener(...args);
        };
        (onceWrapper as any).listener = listener;
        this.prependListener(event, onceWrapper);
        return this;
    }

    /**
     * Removes all listeners for a specific event, or all listeners from all events
     * if no event is specified.
     * @param event The optional event name.
     * @returns The emitter instance for chaining.
     */
    removeAllListeners(event?: string | symbol): this {
        if (event) {
            this._listeners.delete(event);
        } else {
            this._listeners.clear();
        }
        return this;
    }

    /**
     * Returns an array listing the events for which the emitter has registered listeners.
     */
    eventNames(): (string | symbol)[] {
        return Array.from(this._listeners.keys());
    }

    /**
     * Returns a copy of the array of listeners for the specified event.
     * @param event The name of the event.
     */
    listeners(event: string | symbol): Listener[] {
        return [...(this._listeners.get(event) || [])];
    }

    /**
     * Returns the number of listeners listening to the specified event.
     * @param event The name of the event.
     */
    listenerCount(event: string | symbol): number {
        return this._listeners.get(event)?.length || 0;
    }

    /**
     * By default, a warning is printed if more than 10 listeners are added for
     * a particular event. This is a useful default that helps in finding memory leaks.
     * @param n The new maximum.
     */
    setMaxListeners(n: number): this {
        EventEmitter._defaultMaxListeners = n;
        return this;
    }

    /**
     * Returns the current max listener value for the emitter.
     */
    getMaxListeners(): number {
        return EventEmitter._defaultMaxListeners;
    }

    private checkMaxListeners(event: string | symbol) {
        const count = this.listenerCount(event);
        const max = this.getMaxListeners();
        if (max > 0 && count > max) {
            console.warn(`[Fictif EventEmitter] Possible memory leak detected. ${count} '${String(event)}' listeners added. Use setMaxListeners() to increase limit.`);
        }
    }
}

/**
 * Convenience factory function to create a new EventEmitter instance.
 */
export function createEmitter(): EventEmitter {
    return new EventEmitter();
}