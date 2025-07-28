// src/client/router-factories.ts

import { useAPI } from "./composables/api.js";
import { type Middleware } from "./composables/route-map.js";
import type { Page, VisitOptions } from "./types.js";

/**
 * Configuration options for the api-driven resolver.
 */
interface InertiaHandlerOptions {
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
 * @returns A new Middleware<VisitOptions> function to be used in `handle: ` or `use()`.
 */
export function createInertiaHandler({
  prefix = "X-Inertia",
  version = null,
  //page,
}: InertiaHandlerOptions = {}): Middleware<VisitOptions> {
  return async (request: VisitOptions, next) => {
    const api = useAPI();

    let currentVersion = "static";

    if (typeof version === "function") {
      currentVersion = version() || "static";
    } else if (typeof version === "string") {
      currentVersion = version;
    } else if (typeof version === "number") {
      currentVersion = String(version);
    } else {
      // Bring the version from the old page state
      if (request.old) currentVersion = request.old.version || "static";
    }

    const headers = {
      "X-Requested-With": "XMLHttpRequest",
      [prefix]: "true",
      // Send the asset version on every visit
      ...(currentVersion && { [prefix + "-Version"]: currentVersion }),
      // Send partial reload headers if specified
      ...(request.only?.length && {
        [prefix + "-Only"]: request.only.join(","),
        //[prefix + '-Partial-Component']: page.value.component as string,
      }),
      ...request.headers,
    };

    try {
      const response = await api.request(request.path || "/", {
        method: request.method,
        body: request.body,
        headers,
      });

      return {
        path: response.url, // For inertia compatibility
        ...response,
      } as Page;
    } catch (error: any) {
      if (!error.response) {
        // Network error = no response object, is the server offline?
        return next(request);
      }

      const response = error.response;

      // inertia version conflict (force reload)
      if (
        response.status === 409 &&
        response.headers.get(prefix + "-Location")
      ) {
        throw new Error("Asset version mismatch, forcing full reload.");
      }

      // redirect responses
      if ([301, 302].includes(response.status)) {
        window.location.href = response.headers.get("Location") || request.path;
        throw new Error("Server-side redirect.");
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
