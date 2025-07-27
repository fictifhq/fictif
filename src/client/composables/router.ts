// src/client/composables/router.ts

import { reactive, Reactive } from "vue";
import type {
    PageResult,
    VisitOptions,
    RouterOptions,
} from "../types.js";

import { RouteMap, Middleware } from "./route-map.js";

// --- Chainable Response Helpers ---

class ResponseBuilder {
    // Internally, the result can have a flexible PATH.
    protected result: Partial<Omit<PageResult, "path">> & {
        path?: string | "==back==";
        redirect?: string;
    } = {
        // By default, the PATH is undefined, signaling the router to use the request path.
        path: undefined,
    };

    component(component: any): this {
        this.result.component = component;
        return this;
    }
    with(props: Record<string, any>): this {
        this.result.props = { ...(this.result.props || {}), ...props };
        return this;
    }
    asPath(path: string): this {
        this.result.path = path;
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

/** Builds a standard page response. The PATH will default to the visited path. */
export function response(): ResponseBuilder {
    return new ResponseBuilder();
}

/** Builds a standard page response. The PATH will default to the visited path, this function is an alias for `screen(...)` */
export function view(component: string): ResponseBuilder {
    return new ResponseBuilder().component(component);
}

/** Builds a standard page response. The PATH will default to the visited path. */
export function screen(component: string): ResponseBuilder {
    return new ResponseBuilder().component(component);
}

/** Builds a response that keeps the user on the same PATH but merges new props. */
export function back(): ResponseBuilder {
    const builder = new ResponseBuilder();
    builder["result"].component = false; // `false` is the signal to keep the old component
    builder["result"].path = "==back=="; // `==back==` is the signal to keep the old PATH
    return builder;
}

/** Builds a response that triggers a client-side redirect to a new PATH. */
export function redirect(path: string): ResponseBuilder {
    const builder = new ResponseBuilder();
    builder["result"].redirect = path;
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

export class Router extends RouteMap<VisitOptions> {
    private state: Reactive<PageResult>;
    private options: RouterOptions;
    private navigationPrevented = false;

    constructor(options: RouterOptions = {}) {
        super({
            handle: options?.handle
        });

        this.options = options || {};

        this.state = reactive({
            props: {},
            path: typeof window !== "undefined" ? window.location.pathname : "/",
            component: null,
            version: null,
        });
    }

    public get result(): PageResult {
        return this.state;
    }
    public get path(): string {
        return this.state.path;
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
            if (event.state?.fictif) this.visit(event.state.path);
        });

        if (interceptLinks) {
            document.addEventListener("click", (event: MouseEvent) => {
                (async () => {
                    const link = (event.target as Element).closest("a");
                    if (!link) return;

                    const method = (
                        link.getAttribute("method") || "get"
                    ).toLowerCase();

                    if (!shouldInterceptLink(link, event)) return;

                    event.preventDefault();
                    this.visit(link.getAttribute('href') || '/', {
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

    public async visit(path: string, options: VisitOptions = {}): Promise<void> {
        this.navigationPrevented = false;
        await this.emit("leaving", { path });
        if (this.navigationPrevented) return;

        await this.emit("navigation", { path });

        try {
            let partialResult = await this.resolve(path, options);

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
                await this.visit(partialResult.redirect, { replace: true });
                return;
            }

            // --- INTELLIGENT PATH RESOLUTION ---
            let finalPath: string;
            if (partialResult.path === "==back==") {
                finalPath = this.state.path;
            } else if (!partialResult.path) {
                finalPath = path;
            } else {
                finalPath = partialResult.path;
            }

            // Build the final, complete PageResult object
            const finalResult: PageResult = {
                ...partialResult,
                path: finalPath,
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
        this.state.path = result.path; // PATH is now guaranteed to be a string
        if (result.version) this.state.version = result.version;

        const historyMethod = options.replace ? "replaceState" : "pushState";
        if (historyInfluencer === this) {
            window.history[historyMethod](
                { fictif: true, path: result.path },
                "",
                result.path
            );
        }

        await this.emit("push", { page: this.state, options });
        await this.emit("ready", { page: this.state });
    }

    private async resolve(
        path: string,
        options: VisitOptions = {}
    ): Promise<any> {
        const req = {
            ...options,
            path,
            method: options.method || "get",
            old: this.result,
        };
        return this.dispatch(req);
    }
}

export function useRouter(options?: RouterOptions | Router  | Middleware<VisitOptions> | Middleware<VisitOptions>[]): Router {
    if(options instanceof Router) {
        return options;
    }

    if(Array.isArray(options) || typeof options == 'function' || typeof options == 'object') {
        return createRouter(options);
    }

    if (globalRouterInstance) {
        return globalRouterInstance;
    }

    throw new Error("[Fictif] No global router has been initialized to be used.");
}

export function createRouter(options?: RouterOptions | Router  | Middleware<VisitOptions> | Middleware<VisitOptions>[]): Router {
    if(options instanceof Router) {
        return options;
    }

    if(Array.isArray(options) || typeof options == 'function') {
        return new Router({
            handle: options
        });
    }


    return new Router(options);
}
