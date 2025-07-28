import { EventEmitter } from './events.js';
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
export type VerboseMiddleware = {
    [method: string]: string[] | string;
};
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
    strict?: boolean;
    handle?: Middleware<T> | Middleware<T>[];
}
export interface RouteMatchResult<T extends RequestObject> {
    route: Route<T>;
    params: Record<string, string>;
    args: string[];
}
declare class RouteBuilder<T extends RequestObject> {
    route: Route<T>;
    constructor(route: Route<T>);
    name(name: string): this;
    middleware(middleware: string | string[] | VerboseMiddleware): this;
    where(param: string, regex: string): this;
}
export declare class RouteGroup<T extends RequestObject> extends EventEmitter {
    protected _routes: Route<T>[];
    protected _middlewares: Record<string, Middleware<T>>;
    protected _fallbackHandler: Route<T> | null;
    private _prefix;
    private _namePrefix;
    private _domain;
    private _middlewareStack;
    private _parent;
    constructor(parent?: RouteGroup<T> | null);
    group(callback: (registrant: RouteGroup<T>) => void): void;
    prefix(prefix: string): this;
    name(name: string): this;
    domain(domain: string): this;
    applyMiddleware(...names: string[]): this;
    get(path: string, handler: Handler<T>): RouteBuilder<T>;
    post(path: string, handler: Handler<T>): RouteBuilder<T>;
    put(path: string, handler: Handler<T>): RouteBuilder<T>;
    delete(path: string, handler: Handler<T>): RouteBuilder<T>;
    patch(path: string, handler: Handler<T>): RouteBuilder<T>;
    all(path: string, handler: Handler<T>): RouteBuilder<T>;
    any(path: string, handler: Handler<T>): RouteBuilder<T>;
    view(path: string, handler: Handler<T>): RouteBuilder<T>;
    redirect(path: string, destination: string, status?: number): RouteBuilder<T>;
    fallback(handler: Handler<T>): RouteBuilder<T>;
    private _addResourceRoutes;
    resource(name: string, controller: Record<string, Handler<T>>): void;
    apiResource(name: string, controller: Record<string, Handler<T>>): void;
    private _buildPattern;
    protected _addRoute(method: string, path: string, handler: Handler<T>): RouteBuilder<T>;
    protected getOptions(): RouteMapOptions<T>;
}
export declare class RouteMap<T extends RequestObject> extends RouteGroup<T> {
    private _options;
    private _current;
    private _globalMiddleware;
    private _lookupCache;
    constructor(options?: RouteMapOptions<T>);
    protected getOptions(): RouteMapOptions<T>;
    current(): RouteMatchResult<T> | null;
    middleware(name: string, middleware: Middleware<T>): this;
    use(path: string | Middleware<T>, middleware?: Middleware<T>): this;
    route(name: string, params?: Record<string, any>): string;
    clearCache(): void;
    private _findMatch;
    dispatch(req: T): Promise<any>;
}
export {};
//# sourceMappingURL=route-map.d.ts.map