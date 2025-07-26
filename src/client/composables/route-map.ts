import { EventEmitter } from "./events.js";

// --- CORE TYPES ---

export type RequestObject = {
    method?: string;
    path?: string;
    hostname?: string;
    params?: Record<string, string>;
    [key: string]: any;
};

export type NextFunction<T extends RequestObject> = (req: T) => Promise<any>;
export type Handler<T extends RequestObject> = (req: T, ...params: string[]) => any;
export type Middleware<T extends RequestObject> = (req: T, next: NextFunction<T>) => any;
export type VerboseMiddleware = { [method: string]: string[] | string };

export interface Route<T extends RequestObject> {
    method: string;
    pattern: RegExp;
    domainPattern?: RegExp;
    paramNames: string[];
    domainParamNames: string[];
    handler: Handler<T>;
    name?: string;
    middleware: string[];
    originalPath: string;
    isFallback: boolean;
    isScopedMiddleware: boolean;
    constraints: Record<string, string>;
}

export interface RouteMapOptions<T extends RequestObject> {
    caseSensitive?: boolean;
    strict?: boolean; // Differentiate '/path' and '/path/'
    handle?: Middleware<T> | Middleware<T>[];
}

export interface RouteMatchResult<T extends RequestObject> {
    route: Route<T>;
    params: Record<string, string>;
    args: string[];
}

// --- ROUTE BUILDER ---

class RouteBuilder<T extends RequestObject> {
    constructor(public route: Route<T>) {}

    name(name: string): this {
        this.route.name = name;
        return this;
    }

    middleware(middleware: string | string[] | VerboseMiddleware): this {
        if (typeof middleware === 'string') {
            this.route.middleware.push(middleware);
        } else if (Array.isArray(middleware)) {
            this.route.middleware.push(...middleware);
        } else if(typeof middleware === 'object') {
            // Verbose, method-specific middleware
            const key = this.route.method;
            const applicable = middleware[key] || middleware.all;
            if(applicable) {
                this.route.middleware.push(...(Array.isArray(applicable) ? applicable : [applicable]));
            }
        }
        return this;
    }

    where(param: string, regex: string): this {
        this.route.constraints[param] = regex.startsWith('^') ? regex : `^${regex}$`;
        return this;
    }
}

// --- ROUTE GROUP ---

export class RouteGroup<T extends RequestObject> extends EventEmitter {
    protected _routes: Route<T>[];
    protected _middlewares: Record<string, Middleware<T>>;
    protected _fallbackHandler: Route<T> | null;

    private _prefix = "";
    private _namePrefix = "";
    private _domain = "";
    private _middlewareStack: string[] = [];
    private _parent: RouteGroup<T> | null;

    constructor(parent: RouteGroup<T> | null = null) {
        super();
        this._parent = parent;

        if (parent) {
            this._routes = parent._routes;
            this._middlewares = parent._middlewares;
            this._fallbackHandler = parent._fallbackHandler;
        } else {
            this._routes = [];
            this._middlewares = {};
            this._fallbackHandler = null;
        }
    }

    group(callback: (registrant: RouteGroup<T>) => void): void {
        const group = new RouteGroup(this);
        callback(group);
    }

    prefix(prefix: string): this { this._prefix = prefix.replace(/\/$/, ""); return this; }
    name(name: string): this { this._namePrefix = name.endsWith('.') ? name : name + '.'; return this; }
    domain(domain: string): this { this._domain = domain; return this; }
    applyMiddleware(...names: string[]): this { this._middlewareStack.push(...names); return this; }

    get(path: string, handler: Handler<T>): RouteBuilder<T> { return this._addRoute("get", path, handler); }
    post(path: string, handler: Handler<T>): RouteBuilder<T> { return this._addRoute("post", path, handler); }
    put(path: string, handler: Handler<T>): RouteBuilder<T> { return this._addRoute("put", path, handler); }
    delete(path: string, handler: Handler<T>): RouteBuilder<T> { return this._addRoute("delete", path, handler); }
    patch(path: string, handler: Handler<T>): RouteBuilder<T> { return this._addRoute("patch", path, handler); }
    all(path: string, handler: Handler<T>): RouteBuilder<T> { return this._addRoute("all", path, handler); }
    any(path: string, handler: Handler<T>): RouteBuilder<T> { return this.all(path, handler); }

    view(path: string, handler: Handler<T>): RouteBuilder<T> { return this.get(path, handler); }

    redirect(path: string, destination: string, status = 302): RouteBuilder<T> {
        return this.all(path, () => ({ redirect: { to: destination, status } }));
    }

    fallback(handler: Handler<T>): RouteBuilder<T> {
        const route = this._addRoute('all', '.*', handler);
        route.route.isFallback = true;
        this._fallbackHandler = route.route;
        return route;
    }

    private _addResourceRoutes(name: string, controller: Record<string, Handler<T>>, apiOnly: boolean) {
        const resourceName = name.replace(/^\//, '');
        const methods = apiOnly
            ? ['index', 'store', 'show', 'update', 'destroy']
            : ['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'];

        if (methods.includes('index') && controller.index) this.get(`/${resourceName}`, controller.index).name(`${resourceName}.index`);
        if (methods.includes('create') && controller.create) this.get(`/${resourceName}/create`, controller.create).name(`${resourceName}.create`);
        if (methods.includes('store') && controller.store) this.post(`/${resourceName}`, controller.store).name(`${resourceName}.store`);
        if (methods.includes('show') && controller.show) this.get(`/${resourceName}/:id`, controller.show).name(`${resourceName}.show`);
        if (methods.includes('edit') && controller.edit) this.get(`/${resourceName}/:id/edit`, controller.edit).name(`${resourceName}.edit`);
        if (methods.includes('update') && controller.update) {
            this.put(`/${resourceName}/:id`, controller.update).name(`${resourceName}.update`);
            this.patch(`/${resourceName}/:id`, controller.update);
        }
        if (methods.includes('destroy') && controller.destroy) this.delete(`/${resourceName}/:id`, controller.destroy).name(`${resourceName}.destroy`);
    }

    resource(name: string, controller: Record<string, Handler<T>>): void { this._addResourceRoutes(name, controller, false); }
    apiResource(name: string, controller: Record<string, Handler<T>>): void { this._addResourceRoutes(name, controller, true); }

    private _buildPattern(path: string, paramNames: string[]): RegExp {
        const patternStr = "^" + path
            .replace(/(\/?)\*/g, "($1.*)?")
            .replace(/:(\w+)\?/g, '(?:/([^/]+))?')
            .replace(/:(\w+)/g, (_, name) => {
                paramNames.push(name);
                return "([^/]+)";
            }) + (this.getOptions().strict ? "" : "/?$");
        return new RegExp(patternStr, this.getOptions().caseSensitive ? '' : 'i');
    }

    protected _addRoute(method: string, path: string, handler: Handler<T>): RouteBuilder<T> {
        const fullPath = this._prefix + (path.startsWith("/") || path === "" ? path : "/" + path);
        const paramNames: string[] = [];
        const domainParamNames: string[] = [];
        const fullDomain = this._domain || (this._parent?._domain ?? '');

        const route: Route<T> = {
            method: method.toLowerCase(),
            pattern: this._buildPattern(fullPath, paramNames),
            domainPattern: fullDomain ? this._buildPattern(fullDomain.replace(/\./g, '\\.'), domainParamNames) : undefined,
            paramNames,
            domainParamNames,
            handler,
            originalPath: fullPath,
            middleware: [...this._middlewareStack],
            name: this._namePrefix,
            constraints: {},
            isFallback: false,
            isScopedMiddleware: false,
        };
        this._routes.push(route);
        const builder = new RouteBuilder(route);
        if (this._namePrefix) builder.route.name = this._namePrefix + (builder.route.name || '');
        return builder;
    }

    protected getOptions(): RouteMapOptions<T> { return this._parent ? this._parent.getOptions() : {}; }
}

// --- THE MAIN ROUTE MAP CLASS ---

export class RouteMap<T extends RequestObject> extends RouteGroup<T> {
    private _options: RouteMapOptions<T>;
    private _current: RouteMatchResult<T> | null = null;
    private _globalMiddleware: Middleware<T>[] = [];
    private _lookupCache = new Map<string, RouteMatchResult<T> | null>();

    constructor(options: RouteMapOptions<T> = {}) {
        super(null);
        this._options = { caseSensitive: false, strict: false, ...options };
        if (options.handle) {
            const handlers = Array.isArray(options.handle) ? options.handle : [options.handle];
            handlers.forEach(h => this.use(h));
        }
    }

    protected getOptions(): RouteMapOptions<T> { return this._options; }
    current(): RouteMatchResult<T> | null { return this._current; }

    middleware(name: string, middleware: Middleware<T>): this { this._middlewares[name] = middleware; return this; }

    use(path: string | Middleware<T>, middleware?: Middleware<T>): this {
        if (typeof path === 'function') {
            this._globalMiddleware.push(path);
        } else if (middleware) {
            const route = this._addRoute('all', path.replace(/\/$/, '') + '/(.*)', () => {});
            route.route.isScopedMiddleware = true;
            const name = middleware.name || `scoped_${this._routes.length}`;
            this.middleware(name, middleware);
            route.middleware(name);
        }
        return this;
    }

    route(name: string, params: Record<string, any> = {}): string {
        const route = this._routes.find((r) => r.name === name);
        if (!route) throw new Error(`[RouteMap] Route with name "${name}" not found.`);
        let path = route.originalPath;
        const allParams = { ...params };

        [...route.paramNames, ...route.domainParamNames].forEach(key => {
            if (allParams[key] === undefined && !route.originalPath.includes(`:${key}?`)) {
                throw new Error(`[RouteMap] Missing required parameter "${key}" for route "${name}".`);
            }
            if (allParams[key] !== undefined) {
                path = path.replace(`:${key}?`, String(allParams[key])).replace(`:${key}`, String(allParams[key]));
            }
        });
        return path.replace(/\/:\w+\?/g, "");
    }

    public clearCache(): void { this._lookupCache.clear(); }

    private _findMatch(req: T): RouteMatchResult<T> | null {
        const method = (req.method || "get").toLowerCase();
        let path = req.path || '/';
        if (!this._options.strict && path.length > 1) path = path.replace(/\/$/, '');
        const hostname = req.hostname || '';

        const cacheKey = `${method}::${hostname}::${path}`;
        if (this._lookupCache.has(cacheKey)) return this._lookupCache.get(cacheKey)!;

        const potentialRoutes = this._routes.filter(r => !r.isFallback && !r.isScopedMiddleware && (r.method === method || r.method === 'all'));

        for (const route of potentialRoutes) {
            const domainMatch = route.domainPattern ? hostname.match(route.domainPattern) : true;
            if (!domainMatch) continue;

            const pathMatch = path.match(route.pattern);
            if (pathMatch) {
                const domainParams = domainMatch && Array.isArray(domainMatch) ? route.domainParamNames.reduce((acc, name, i) => ({ ...acc, [name]: domainMatch[i+1] }), {}) : {};
                const pathParams = route.paramNames.reduce((acc, name, i) => ({ ...acc, [name]: pathMatch[i+1] }), {});
                const allParams = {...domainParams, ...pathParams};

                let constraintsMet = true;
                for (const key in route.constraints) {
                    // @ts-ignore
                    if (allParams[key] && !new RegExp(route.constraints[key]).test(allParams[key])) {
                        constraintsMet = false;
                        break;
                    }
                }
                if (!constraintsMet) continue;

                const result = { route, params: allParams, args: pathMatch.slice(1).map(p => p || '') };
                this._lookupCache.set(cacheKey, result);
                return result;
            }
        }
        this._lookupCache.set(cacheKey, null);
        return null;
    }

    public async dispatch(req: T): Promise<any> {
        this.emit('beforeDispatch', req);
        this._current = null;

        const resolveRoute = async (finalReq: T): Promise<any> => {
            const matched = this._findMatch(finalReq);

            if (!matched && !this._fallbackHandler) {
                return undefined; // Nothing matched, no fallback
            }

            const activeRoute = matched ? matched.route : this._fallbackHandler!;
            const routeArgs = matched ? matched.args : [];
            const routeParams = matched ? matched.params : {};

            this._current = { route: activeRoute, params: routeParams, args: routeArgs };
            finalReq.params = routeParams;

            const pipeline: Middleware<T>[] = [];
            const added = new Set<Middleware<T>>();
            const add = (mwName: string) => { const mw = this._middlewares[mwName]; if (mw && !added.has(mw)) { added.add(mw); pipeline.push(mw); }};

            activeRoute.middleware.forEach(add);

            const executeLocal = (index: number): Promise<any> => {
                if (index < pipeline.length) {
                    return pipeline[index](finalReq, () => executeLocal(index + 1));
                }
                return activeRoute.handler(finalReq, ...routeArgs);
            };
            return executeLocal(0);
        };

        const globalPipeline: Middleware<T>[] = [];
        const addedToGlobal = new Set<Middleware<T>>();
        const addGlobal = (mw: Middleware<T>) => { if (mw && !addedToGlobal.has(mw)) { addedToGlobal.add(mw); globalPipeline.push(mw); }};

        this._globalMiddleware.forEach(addGlobal);
        this._routes.filter(r => r.isScopedMiddleware && (req.path || '/').match(r.pattern)).forEach(r => {
             r.middleware.forEach(name => addGlobal(this._middlewares[name]));
        });

        const executeGlobal = (index: number): Promise<any> => {
            if (index < globalPipeline.length) {
                return globalPipeline[index](req, () => executeGlobal(index + 1));
            }
            return resolveRoute(req);
        };

        const result = await executeGlobal(0);
        this.emit('afterDispatch', { req, result });
        return result;
    }
}