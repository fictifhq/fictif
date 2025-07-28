import { PageResult, VisitOptions, RouterOptions } from '../types.js';
import { RouteMap, Middleware } from './route-map.js';
declare class ResponseBuilder {
    protected result: Partial<Omit<PageResult, "path">> & {
        path?: string | "==back==";
        redirect?: string;
    };
    component(component: any): this;
    with(props: Record<string, any>): this;
    asPath(path: string): this;
    message(message: string): this;
    error(error: string): this;
    build(): object;
}
/** Builds a standard page response. The PATH will default to the visited path. */
export declare function response(): ResponseBuilder;
/** Builds a standard page response. The PATH will default to the visited path, this function is an alias for `screen(...)` */
export declare function view(component: string): ResponseBuilder;
/** Builds a standard page response. The PATH will default to the visited path. */
export declare function screen(component: string): ResponseBuilder;
/** Builds a response that keeps the user on the same PATH but merges new props. */
export declare function back(): ResponseBuilder;
/** Builds a response that triggers a client-side redirect to a new PATH. */
export declare function redirect(path: string): ResponseBuilder;
export declare let global: Router | null;
export declare function shouldInterceptLink(link: HTMLAnchorElement, event?: MouseEvent): boolean;
export declare class Router extends RouteMap<VisitOptions> {
    private state;
    private options;
    private navigationPrevented;
    private navigating;
    constructor(options?: RouterOptions);
    get result(): PageResult;
    get path(): string;
    init(interceptLinks?: boolean): void;
    preventNavigation(): void;
    visit(path: string, options?: VisitOptions): Promise<void>;
    push(result: PageResult, options?: VisitOptions): Promise<void>;
    private resolve;
}
export declare function useRouter(options?: RouterOptions | Router | Middleware<VisitOptions> | Middleware<VisitOptions>[]): Router;
export declare function createRouter(options?: RouterOptions | Router | Middleware<VisitOptions> | Middleware<VisitOptions>[]): Router;
export declare function initRouter(options?: RouterOptions | Router | Middleware<VisitOptions> | Middleware<VisitOptions>[]): Router;
export {};
//# sourceMappingURL=router.d.ts.map