import { Middleware } from './composables/route-map.js';
import { VisitOptions } from './types.js';
/**
 * Configuration options for the api-driven resolver.
 */
interface InertiaHandlerOptions {
    prefix?: string;
    version?: string | (() => string | null) | null;
}
/**
 * Creates a pre-configured Fictif Middleware instance that catches routing requests and communicates with a backend using the Inertia.js protocol.
 *
 * This is the "batteries-included" resolver for full-stack applications.
 *
 * @returns A new Middleware<VisitOptions> function to be used in `handle: ` or `use()`.
 */
export declare function createInertiaHandler({ prefix, version, }?: InertiaHandlerOptions): Middleware<VisitOptions>;
export {};
//# sourceMappingURL=router-factories.d.ts.map