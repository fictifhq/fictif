declare class CookieJar {
    private store;
    constructor();
    add(cookies: Record<string, string | number> | string): void;
    get(key: string): string | undefined;
    getRecord(): Record<string, string>;
}
export declare const jar: CookieJar;
export declare const errorCodes: {
    readonly ABORTED: "ABORTED";
    readonly NETWORK_ERROR: "NETWORK_ERROR";
    readonly DEDUPED: "DEDUPED";
    readonly TIMEOUT: "TIMEOUT";
    readonly CACHE_ERROR: "CACHE_ERROR";
};
type ErrorCode = typeof errorCodes[keyof typeof errorCodes];
type HeaderValue = string | (() => string | Promise<string>);
type HeaderModifier = (proposedValue?: string) => string | Promise<string>;
type CookieValue = string | (() => string | Promise<string>);
type CookieModifier = (proposedValue?: string) => string | Promise<string>;
type ProgressContext = {
    abort: () => void;
};
type Logger = (message: string, details?: any) => void;
type BeforeHook = (request: Request & {
    options: APIRequestConfig;
}) => Promise<Response | void> | Response | void;
type AfterHook = (response: Response, data?: any) => Promise<void> | void;
type ErrorHook = (error: EnhancedError, attempt: number, options: APIRequestConfig) => Promise<boolean | void> | boolean | void;
type CacheEntry = {
    response: Response;
    at: number;
    options: APIRequestConfig;
};
/** Configuration for creating an API instance. */
export type APIInstanceConfig = {
    baseUrl?: string;
    headers?: Record<string, HeaderValue | HeaderModifier>;
    cookies?: Record<string, CookieValue | CookieModifier>;
    credentials?: RequestCredentials;
    timeout?: number;
    retries?: number | boolean;
    retryDelay?: (attempt: number) => number;
    retryCondition?: (error: EnhancedError) => boolean;
    dedupe?: boolean;
    debug?: Logger;
    xsrf?: boolean;
    xsrfHeader?: string;
    xsrfCookie?: string;
    before?: BeforeHook[];
    after?: AfterHook[];
    onError?: ErrorHook[];
    extend?: Record<string, Omit<APIRequestConfig, 'extend'> & {
        inheritOptions?: boolean;
    }>;
    followRedirects?: boolean | number;
    caseSensitive?: boolean;
    strict?: boolean;
};
/** Configuration for a single API request, extending the instance config. */
export type APIRequestConfig = APIInstanceConfig & {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    params?: Record<string, any>;
    body?: Record<string, any> | BodyInit;
    bodyType?: 'json' | 'formdata' | 'auto';
    signal?: AbortSignal;
    key?: string | (() => string);
    /** Provides upload progress. Note: Provides total progress for the entire body, not per-field details. */
    onUploadProgress?: (progress: {
        loaded: number;
        total: number;
    }, context: ProgressContext) => void;
    /** Provides download progress. */
    onDownloadProgress?: (progress: {
        loaded: number;
        total: number;
    }, context: ProgressContext) => void;
    expectsJSON?: boolean;
    expectsDownloads?: boolean;
    cacheTtl?: number;
    usesCache?: boolean;
    inheritOptions?: boolean;
};
/** A custom error type that includes the response, data, and an error code. */
export interface EnhancedError extends Error {
    response?: Response;
    data?: any;
    code?: ErrorCode;
}
export declare let globalAPI: API | null;
export declare class API {
    options: APIInstanceConfig;
    cache: Map<string, CacheEntry>;
    private _extendPatterns;
    constructor(config?: APIInstanceConfig & {
        inheritOptions?: boolean;
    });
    init(): void;
    before(hook: BeforeHook): void;
    after(hook: AfterHook): void;
    onError(hook: ErrorHook): void;
    get(path: string, config?: APIRequestConfig): Promise<any>;
    post(path: string, config?: APIRequestConfig): Promise<any>;
    put(path: string, config?: APIRequestConfig): Promise<any>;
    delete(path: string, config?: APIRequestConfig): Promise<any>;
    patch(path: string, config?: APIRequestConfig): Promise<any>;
    request<T = any>(path: string, config?: APIRequestConfig): Promise<T>;
    private _processResponse;
    private _deepMerge;
    private _getPatternRegex;
    private _getAutoKey;
    private _createRequest;
    private _buildURL;
    private _prepareBody;
    private _prepareHeaders;
    private _mergeSignals;
    private _createError;
    private _createErrorFromResponse;
    private _parseBody;
    private _addDownloadProgress;
    private _addUploadProgress;
}
/** Creates a new API instance or retrieves the globalAPI instance. */
export declare function useAPI(config?: APIInstanceConfig & {
    inheritOptions?: boolean;
}): API;
/** Creates a new API instance and inits it. */
export declare function initAPI(config?: APIInstanceConfig & {
    inheritOptions?: boolean;
}): API;
export {};
//# sourceMappingURL=api.d.ts.map