// src/client/composables/router.ts

import { EventEmitter } from "./events.js";
import { reactive, Reactive } from "vue";
import type {
    PageResult,
    VisitOptions,
    ResolveFunction,
    RouterOptions,
    ExplictResolveFunction,
} from "../types.js";
import { RouteMap } from "./route-map.js";

// --- Chainable Response Helpers ---

class ResponseBuilder {
    // Internally, the result can have a flexible URL.
    protected result: Partial<Omit<PageResult, "url">> & {
        url?: string | "==back==";
        redirect?: string;
    } = {
        // By default, the URL is undefined, signaling the router to use the request path.
        url: undefined,
    };

    component(component: any): this {
        this.result.component = component;
        return this;
    }
    with(props: Record<string, any>): this {
        this.result.props = { ...(this.result.props || {}), ...props };
        return this;
    }
    asUrl(url: string): this {
        this.result.url = url;
        return this;
    }
    message(message: string): this {
        return this.with({
            flash: { ...(this.result.props?.flash || {}), message },
        });
    }
    error(error: string): this {
        return this.with({
            flash: { ...(this.result.props?.flash || {}), error },
        });
    }
    build(): object {
        return this.result;
    }
}

/** Builds a standard page response. The URL will default to the visited path. */
export function response(): ResponseBuilder {
    return new ResponseBuilder();
}

/** Builds a standard page response. The URL will default to the visited path. */
export function view(component: string): ResponseBuilder {
    return new ResponseBuilder().component(component);
}

/** Builds a response that keeps the user on the same URL but merges new props. */
export function back(): ResponseBuilder {
    const builder = new ResponseBuilder();
    builder["result"].component = false; // `false` is the signal to keep the old component
    builder["result"].url = "==back=="; // `==back==` is the signal to keep the old URL
    return builder;
}

/** Builds a response that triggers a client-side redirect to a new URL. */
export function redirect(url: string): ResponseBuilder {
    const builder = new ResponseBuilder();
    builder["result"].redirect = url;
    return builder;
}

// --- Router Implementation ---

let globalRouterInstance: Router | null = null;
let historyInfluencer: Router | null = null;

export function shouldInterceptLink(
    link: HTMLAnchorElement,
    event?: MouseEvent
): boolean {
    if (link.hasAttribute("data-intercept-link")) return true;

    let eventDisallows = false;

    if (event) {
        eventDisallows =
            event.defaultPrevented ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey;
    }

    return !(
        eventDisallows ||
        link.hasAttribute("target") ||
        link.hasAttribute("download") ||
        link.origin !== window.location.origin
    );
}

export class Router extends EventEmitter {
    private state: Reactive<PageResult>;
    private options: RouterOptions;
    private navigationPrevented = false;

    resolveFunctions: ExplictResolveFunction[] = [];

    constructor(options: RouterOptions) {
        super();
        this.options = options;

        const resolvers = Array.isArray(options.resolve)
            ? options.resolve
            : [options.resolve];

        this.resolveFunctions = resolvers.map((r) =>
            typeof r == "function"
                ? r
                : typeof r == "object" && r && typeof r.handle == "function"
                ? r.handle.bind(r)
                : async function () {
                      return undefined;
                  }
        );

        this.state = reactive({
            props: {},
            url: typeof window !== "undefined" ? window.location.pathname : "/",
            component: null,
            version: null,
        });
    }

    public get result(): PageResult {
        return this.state;
    }
    public get url(): string {
        return this.state.url;
    }

    public async init(interceptLinks: boolean = true): Promise<void> {
        if (globalRouterInstance) {
            if (globalRouterInstance != this)
                console.warn(
                    "[Fictif] A global router is already initialized."
                );
            return;
        }
        globalRouterInstance = this;
        historyInfluencer = this;

        window.addEventListener("popstate", (event: PopStateEvent) => {
            if (event.state?.fictif) this.go(event.state.path);
        });

        if (interceptLinks) {
            document.addEventListener("click", (event: MouseEvent) => {
                (async () => {
                    const link = (event.target as Element).closest("a");
                    if (!link) return;

                    const method = (
                        link.getAttribute("method") || "get"
                    ).toLowerCase();

                    if (!link.hasAttribute("download")) {
                        await this.emit("navigation", {
                            url: link.href,
                        });
                    }

                    if (!shouldInterceptLink(link, event)) return;

                    event.preventDefault();
                    this.go(link.href, {
                        only: link.dataset.only?.split(","),
                        preserveScroll: link.hasAttribute(
                            "data-preserve-scroll"
                        ),
                        method: method as any,
                    });
                })();
            });
        }
    }

    public preventNavigation(): void {
        this.navigationPrevented = true;
    }

    public async go(path: string, options: VisitOptions = {}): Promise<void> {
        try {
            path = new URL(path).pathname;
        } catch (error) {}

        this.navigationPrevented = false;
        await this.emit("leaving", { path });
        if (this.navigationPrevented) return;

        await this.emit("navigation", { path });

        try {
            let partialResult = await this.resolveRoute(path, options);

            if (
                typeof partialResult == "object" &&
                partialResult &&
                typeof partialResult.build == "function"
            ) {
                partialResult = partialResult.build();
            }

            // Handle undefined result (no route matched)
            if (!partialResult) {
                await this.emit("error", {
                    path,
                    error: new Error("No route handler returned a result."),
                });
                return;
            }

            // --- REDIRECT HANDLING ---
            if (partialResult.redirect) {
                await this.go(partialResult.redirect, { replace: true });
                return;
            }

            // --- INTELLIGENT URL RESOLUTION ---
            let finalUrl: string;
            if (partialResult.url === "==back==") {
                finalUrl = this.state.url;
            } else if (!partialResult.url) {
                finalUrl = path;
            } else {
                finalUrl = partialResult.url;
            }

            // Build the final, complete PageResult object
            const finalResult: PageResult = {
                ...partialResult,
                url: finalUrl,
            };

            await this.emit("navigated", { page: finalResult });
            await this.push(finalResult, options);
        } catch (error) {
            await this.emit("error", { path, error });
            console.error(
                `[Fictif Router] Failed to resolve route "${path}":`,
                error
            );
        }
    }

    public async push(
        result: PageResult,
        options: VisitOptions = {}
    ): Promise<void> {
        const newProps = { ...this.state.props, ...result.props };
        const newComponent =
            result.component === false
                ? this.state.component
                : result.component;

        // Update state with the final, merged data
        this.state.component = newComponent;
        this.state.props = newProps;
        this.state.url = result.url; // URL is now guaranteed to be a string
        if (result.version) this.state.version = result.version;

        const historyMethod = options.replace ? "replaceState" : "pushState";
        if (historyInfluencer === this) {
            window.history[historyMethod](
                { fictif: true, path: result.url },
                "",
                result.url
            );
        }

        await this.emit("push", { page: this.state, options });
        await this.emit("ready", { page: this.state });
    }

    private async resolveRoute(
        path: string,
        options: VisitOptions = {}
    ): Promise<any> {
        const req = {
            ...options,
            path,
            method: options.method || "get",
            old: this.result,
        };
        for (const resolve of this.resolveFunctions) {
            const result = await resolve(path, req);
            if (result !== undefined) {
                // Return the raw result from the handler, `go` will process it.
                return result;
            }
        }
    }
}

export function createRouterFromResolver(resolve: ResolveFunction | Router): Router {
    if(resolve instanceof Router) {
        return resolve;
    }

    return useRouter({
        resolve,
    });
}

/**
 * Shorthand for creating a Router from a RouteMap.
 *
 * This helper simplifies the setup of route definitions without requiring
 * manual creation and connection of `RouteMap` and `Router` separately.
 *
 * @example
 * ```ts
 * const router = rMap((route) => {
 *   route.get('/', () => view('home'));
 * });
 * ```
 *
 * @param configure - Callback to define routes on the RouteMap.
 * @returns Router instance ready for FictifApp or manual use.
 */
export function rMap(
  configure: (routes: RouteMap<VisitOptions>) => void
): Router {
  const routeMap = new RouteMap<VisitOptions>();
  configure(routeMap);
  return createRouterFromResolver(routeMap);
}


export function useRouter(options?: RouterOptions): Router {
    if (options) {
        return new Router(options);
    }
    if (globalRouterInstance) {
        return globalRouterInstance;
    }
    throw new Error("[Fictif] No global router has been initialized.");
}
