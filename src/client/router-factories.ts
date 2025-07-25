// src/client/router-factories.ts

import { type ShallowRef } from 'vue';
import { PageResult } from './types.js';
import { useEndpoint } from './composables/endpoint.js';
import type { Page, VisitOptions, ResolveFunction } from './types.js';

/**
 * Configuration options for the endpoint-driven resolver.
 */
interface EndpointResolverOptions {
    prefix?: string;
    version?: string | (() => string | null) | null;
    //page: ShallowRef<Page>;
}

/**
 * Creates a pre-configured Fictif Resolver instance that communicates with a backend
 * using the Inertia.js protocol.
 *
 * This is the "batteries-included" resolver for full-stack applications.
 *
 * @param {EndpointResolverOptions} options Configuration for the resolver.
 * @returns A new ResolveFunction function to be used in `resolve: `.
 */
export function createEndpointResolver({
    prefix = 'X-Inertia',
    version = null,
    //page,
}: EndpointResolverOptions = {}): ResolveFunction {
    return async (path: string, options: VisitOptions = {}) => {
            const endpoint = useEndpoint();

            let currentVersion = 'static';

            if(typeof version === 'function') {
                currentVersion = version() || 'static';
            }else if(typeof version === 'string') {
                currentVersion = version;
            }else if(typeof version === 'number') {
                currentVersion = String(version);
            }else{
                // Bring the version from the old page state
                if(options.old) currentVersion = options.old.version || 'static';
            }

            const headers = {
                'X-Requested-With': 'XMLHttpRequest',
                [prefix]: 'true',
                // Send the asset version on every visit
                ...(currentVersion && { [prefix + '-Version']: currentVersion }),
                // Send partial reload headers if specified
                ...(options.only?.length && {
                    [prefix + '-Only']: options.only.join(','),
                    //[prefix + '-Partial-Component']: page.value.component as string,
                }),
                ...options.headers,
            };

            try {
                const response = await endpoint.request(path, {
                    method: options.method,
                    body: options.body,
                    headers,
                });

                return response as Page;
            } catch (error: any) {
                if (!error.response) {
                    // Network error = no response object, is the server offline?
                    return undefined; // anyways, allow other resolvers to take over
                }

                const response = error.response;

                // inertia version conflict (force reload)
                if (response.status === 409 && response.headers.get(prefix + '-Location')) {
                    throw new Error('Asset version mismatch, forcing full reload.');
                }

                // redirect responses
                if ([301, 302].includes(response.status)) {
                    window.location.href = response.headers.get('Location') || path;
                    throw new Error('Server-side redirect.');
                }

                // Validation error: let useForm handle it
                if (response.status === 422) {
                    throw error;
                }

                // Server error (5xx or anything else not handled)
                throw error; // Propagate the error for higher-level handling
            }
        };
}