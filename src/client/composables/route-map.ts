// src/client/composables/route-map.ts

type RequestObject = { method?: string; [key: string]: any };
type NextFunction<T extends RequestObject> = (req: T) => Promise<any>;
type Handler<T extends RequestObject> = (req: T, ...params: string[]) => any;
type Middleware<T extends RequestObject> = (
    req: T,
    next: NextFunction<T>
) => any;

interface Route<T extends RequestObject> {
    method: string;
    pattern: RegExp;
    paramNames: string[];
    handler: Handler<T>;
    name?: string;
    middleware: string[];
    originalPath: string;
}

/**
 * A professional-grade, generic, dependency-free routing engine with named routes,
 * middleware, and groups, inspired by modern backend frameworks like Laravel.
 */
export class RouteMap<T extends RequestObject> {
    private routes: Route<T>[] = [];
    public middlewares: Record<string, Middleware<T>> = {};
    private unnamedMiddleware: Middleware<T>[] = [];

    // --- Configuration ---

    use(middleware: Middleware<T>): this {
        this.unnamedMiddleware.push(middleware);
        return this;
    }

    middleware(name: string, middleware: Middleware<T>): this {
        this.middlewares[name] = middleware;
        return this;
    }

    group(): RouteGroup<T> {
        // The RouteGroup will add routes directly back to this parent instance
        const group = new RouteGroup<T>(this);
        return group;
    }

    // --- Route Registration ---
    get(path: string, handler: Handler<T>): RouteBuilder<T> {
        return this.addRoute("get", path, handler);
    }
    post(path: string, handler: Handler<T>): RouteBuilder<T> {
        return this.addRoute("post", path, handler);
    }
    put(path: string, handler: Handler<T>): RouteBuilder<T> {
        return this.addRoute("put", path, handler);
    }
    delete(path: string, handler: Handler<T>): RouteBuilder<T> {
        return this.addRoute("delete", path, handler);
    }
    patch(path: string, handler: Handler<T>): RouteBuilder<T> {
        return this.addRoute("patch", path, handler);
    }

    public addRoute(
        method: string,
        path: string,
        handler: Handler<T>
    ): RouteBuilder<T> {
        const paramNames: string[] = [];
        const pattern = new RegExp(
            "^" +
                path
                    .replace(/(\/?)\*/g, "($1.*)?")
                    .replace(/:(\w+)/g, (_, name) => {
                        paramNames.push(name);
                        return "([^/]+)";
                    }) +
                "/?$"
        );

        const route: Route<T> = {
            method: method.toLowerCase(),
            pattern,
            paramNames,
            handler,
            originalPath: path,
            middleware: [],
        };
        this.routes.push(route);
        return new RouteBuilder(route);
    }

    // --- Execution ---

    url(name: string, params: Record<string, any> = {}): string {
        const route = this.routes.find((r) => r.name === name);
        if (!route)
            throw new Error(`[RouteMap] Route with name "${name}" not found.`);

        let path = route.originalPath;
        for (const key of route.paramNames) {
            if (params[key] === undefined) {
                throw new Error(
                    `[RouteMap] Missing required parameter "${key}" for route "${name}".`
                );
            }
            path = path.replace(`:${key}`, String(params[key]));
        }
        path = path.replace(/\/:\w+\?/g, "");
        return path;
    }

    public async handle(path: string, req: T): Promise<any> {
        const method = (req.method || "get").toLowerCase();

        for (const route of this.routes) {
            if (route.method !== method) continue;
            const match = path.match(route.pattern);
            if (match) {
                const params = match.slice(1);
                (req as any).params = route.paramNames.reduce(
                    (acc, name, i) => ({ ...acc, [name]: params[i] }),
                    {}
                );

                const middlewareStack = [
                    ...this.unnamedMiddleware,
                    ...route.middleware.map((name) => {
                        const mw = this.middlewares[name];
                        if (!mw)
                            throw new Error(
                                `[RouteMap] Middleware "${name}" not registered.`
                            );
                        return mw;
                    }),
                ];

                const handler = (request: T) =>
                    route.handler(request, ...params);

                const execute = (index: number): Promise<any> => {
                    if (index < middlewareStack.length) {
                        return middlewareStack[index](req, () =>
                            execute(index + 1)
                        );
                    }
                    return handler(req);
                };

                return execute(0);
            }
        }
        return undefined;
    }
}

class RouteBuilder<T extends RequestObject> {
    // Make the property public so it can be accessed by RouteGroup
    public route: Route<T>;

    constructor(route: Route<T>) {
        this.route = route;
    }

    name(name: string): this {
        this.route.name = (this.route.name || '') + name;
        return this;
    }

    middleware(...names: string[]): this {
        this.route.middleware.push(...names);
        return this;
    }
}

class RouteGroup<T extends RequestObject> {
    private _prefix = "";
    private _namePrefix = "";
    private _middlewareStack: string[] = [];

    constructor(private parent: RouteMap<T>) {}

    routes(callback: (router: RouteGroup<T>) => void) {
        callback(this);
    }

    prefix(prefix: string): this {
        this._prefix = prefix.replace(/\/$/, "");
        return this;
    }

    name(name: string): this {
        this._namePrefix = name;
        return this;
    }

    // FIX: Renamed from `middleware` to avoid conflict with RouteMap's `middleware`
    applyMiddleware(...names: string[]): this {
        this._middlewareStack.push(...names);
        return this;
    }

    // --- Route Registration Methods ---
    get(path: string, handler: Handler<T>): RouteBuilder<T> {
        return this.addRoute("get", path, handler);
    }
    post(path: string, handler: Handler<T>): RouteBuilder<T> {
        return this.addRoute("post", path, handler);
    }
    put(path: string, handler: Handler<T>): RouteBuilder<T> {
        return this.addRoute("put", path, handler);
    }
    delete(path: string, handler: Handler<T>): RouteBuilder<T> {
        return this.addRoute("delete", path, handler);
    }
    patch(path: string, handler: Handler<T>): RouteBuilder<T> {
        return this.addRoute("patch", path, handler);
    }

    private addRoute(method: string, path: string, handler: Handler<T>): RouteBuilder<T> {
        const fullPath =
            this._prefix + (path.startsWith("/") ? path : "/" + path);
        const builder = this.parent.addRoute(method, fullPath, handler);

        if (this._namePrefix) {
            // FIX: Access the now public `route` property
            builder.route.name = this._namePrefix + (builder.route.name || "");
        }

        if (this._middlewareStack.length) {
            builder.middleware(...this._middlewareStack);
        }

        return builder;
    }
}
