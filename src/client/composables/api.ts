// /composables/api.ts

// --- ENVIRONMENT & TYPE IMPORTS ---
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// --- ISOMORPHIC COOKIE JAR ---
class CookieJar {
    private store = new Map<string, string>();

    constructor() {
        if (isBrowser) {
            this.add(document.cookie);
        }
    }

    public add(cookies: Record<string, string | number> | string): void {
        if (typeof cookies === 'string') {
            cookies.split(';').forEach(cookie => {
                const parts = cookie.match(/([^=]+)=(.*)/);
                if (parts) {
                    const key = parts[1].trim();
                    const value = parts[2].trim();
                    if (key) this.store.set(key, value);
                }
            });
        } else {
            for (const [key, value] of Object.entries(cookies)) {
                this.store.set(key, String(value));
            }
        }
    }

    public get(key: string): string | undefined {
        return this.store.get(key);
    }

    public getRecord(): Record<string, string> {
        return Object.fromEntries(this.store);
    }
}
export const jar = new CookieJar();

// --- PUBLIC TYPES AND CONSTANTS ---
export const errorCodes = {
    ABORTED: 'ABORTED', NETWORK_ERROR: 'NETWORK_ERROR', DEDUPED: 'DEDUPED', TIMEOUT: 'TIMEOUT', CACHE_ERROR: 'CACHE_ERROR'
} as const;

type ErrorCode = typeof errorCodes[keyof typeof errorCodes];
type HeaderValue = string | (() => string | Promise<string>);
type HeaderModifier = (proposedValue?: string) => string | Promise<string>;
type CookieValue = string | (() => string | Promise<string>);
type CookieModifier = (proposedValue?: string) => string | Promise<string>;
type ProgressContext = { abort: () => void };
type Logger = (message: string, details?: any) => void;

type BeforeHook = (request: Request & { options: APIRequestConfig }) => Promise<Response | void> | Response | void;
type AfterHook = (response: Response, data?: any) => Promise<void> | void;
type ErrorHook = (error: EnhancedError, attempt: number, options: APIRequestConfig) => Promise<boolean | void> | boolean | void;

type CacheEntry = { response: Response; at: number; options: APIRequestConfig };
type InFlightRequest = { promise: Promise<any>; abort: () => void; };

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
    extend?: Record<string, Omit<APIRequestConfig, 'extend'> & { inheritOptions?: boolean }>;
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
    onUploadProgress?: (progress: { loaded: number; total: number }, context: ProgressContext) => void;
    /** Provides download progress. */
    onDownloadProgress?: (progress: { loaded: number; total: number }, context: ProgressContext) => void;
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

// --- globalAPI STATE ---
export let globalAPI: API | null = null;
const inFlightRequests = new Map<string, InFlightRequest>();

// --- API CLASS IMPLEMENTATION ---
export class API {
    public options: APIInstanceConfig;
    public cache = new Map<string, CacheEntry>();
    private _extendPatterns = new Map<string, RegExp>();

    constructor(config: APIInstanceConfig & { inheritOptions?: boolean } = {}) {
        if (config.inheritOptions !== false && globalAPI) {
            this.options = this._deepMerge(globalAPI.options, config);
        } else {
            this.options = config;
        }
    }

    public init() { globalAPI = this; }
    public before(hook: BeforeHook) { this.options.before = [...(this.options.before || []), hook]; }
    public after(hook: AfterHook) { this.options.after = [...(this.options.after || []), hook]; }
    public onError(hook: ErrorHook) { this.options.onError = [...(this.options.onError || []), hook]; }

    public get(path: string, config?: APIRequestConfig) { return this.request(path, { ...config, method: 'GET' }); }
    public post(path: string, config?: APIRequestConfig) { return this.request(path, { ...config, method: 'POST' }); }
    public put(path: string, config?: APIRequestConfig) { return this.request(path, { ...config, method: 'PUT' }); }
    public delete(path: string, config?: APIRequestConfig) { return this.request(path, { ...config, method: 'DELETE' }); }
    public patch(path: string, config?: APIRequestConfig) { return this.request(path, { ...config, method: 'PATCH' }); }

    public async request<T = any>(path: string, config: APIRequestConfig = {}): Promise<T> {
        let extendedConfig = { ...config };
        const allExtensions = { ...this.options.extend, ...config.extend };

        for (const pattern in allExtensions) {
            const [matchMethod, matchPath] = pattern.startsWith(':') ? pattern.substring(1).split(':', 2) : [null, pattern];
            const currentMethod = (config.method || 'GET').toUpperCase();
            const regex = this._getPatternRegex(matchPath);
            if (regex.test(path) && (!matchMethod || matchMethod.toUpperCase() === currentMethod)) {
                const extension = allExtensions[pattern];
                extendedConfig = (extension.inheritOptions === false) ? extension : this._deepMerge(extendedConfig, extension);
            }
        }

        const mergedConfig: APIRequestConfig = this._deepMerge({
            baseUrl: '', credentials: 'include', timeout: 10000, retries: 3,
            retryDelay: (a: number) => Math.min(a * 1000, 30000),
            retryCondition: (e: EnhancedError) => (e.response?.status ?? 0) >= 500,
            dedupe: true, debug: undefined, expectsJSON: true, expectsDownloads: false, bodyType: 'auto',
            xsrf: true, xsrfHeader: 'X-XSRF-TOKEN', xsrfCookie: 'XSRF-TOKEN',
            cacheTtl: 0, usesCache: true, followRedirects: 5, caseSensitive: false, strict: false
        }, this.options, extendedConfig);

        const log = (message: string, details?: any) => mergedConfig.debug?.(message, details);

        const manualKey = typeof mergedConfig.key === 'string' ? mergedConfig.key : null;
        const autoKey = this._getAutoKey(mergedConfig, path, log);
        const dedupeKey = manualKey ?? autoKey;

        // Deduplication Logic
        if (mergedConfig.dedupe && dedupeKey) {
            const inFlight = inFlightRequests.get(dedupeKey);
            if (inFlight) {
                if (manualKey) { // Manual key: cancel old, proceed with new
                    log(`[DEDUPED] Aborting previous request for key: ${dedupeKey}`);
                    inFlight.abort();
                    inFlightRequests.delete(dedupeKey);
                } else { // Auto key: reuse in-flight request
                    log(`[DEDUPED] Reusing in-flight request for key: ${dedupeKey}`);
                    return inFlight.promise as Promise<T>;
                }
            }
        }

        // Caching Logic
        if (mergedConfig.usesCache && autoKey && this.cache.has(autoKey)) {
            const entry = this.cache.get(autoKey)!;
            if (Date.now() - entry.at < mergedConfig.cacheTtl!) {
                log(`[CACHE HIT] Using cached response for key: ${autoKey}`);
                return this._processResponse(entry.response.clone(), mergedConfig, log) as Promise<T>;
            }
            this.cache.delete(autoKey);
        }

        const abortController = new AbortController();
        const progressContext = { abort: () => abortController.abort() };

        const requestPromise = new Promise<T>(async (resolve, reject) => {
            const signal = this._mergeSignals(abortController.signal, mergedConfig.signal);

            const timeoutId = (mergedConfig.timeout && mergedConfig.timeout > 0)
                ? setTimeout(() => abortController.abort(this._createError(errorCodes.TIMEOUT, 'Request timed out')), mergedConfig.timeout)
                : null;

            const cleanup = () => { if (timeoutId) clearTimeout(timeoutId); };

            signal.addEventListener('abort', () => {
                cleanup();
                const reason = signal.reason || this._createError(errorCodes.ABORTED, 'Request was aborted');
                // Don't reject if we are being deduped, the new request will take over
                if ((reason as EnhancedError)?.code !== errorCodes.DEDUPED) {
                    reject(reason);
                }
            });

            try {
                let attempts = 0;
                const maxRetries = mergedConfig.retries === true ? Infinity : (mergedConfig.retries || 0);

                while (attempts <= maxRetries) {
                    try {
                        const url = this._buildURL(mergedConfig.baseUrl!, path, mergedConfig.params);
                        const [body, contentType] = this._prepareBody(mergedConfig, log);
                        const headers = await this._prepareHeaders(mergedConfig, contentType);

                        let finalBody: BodyInit | null = body;
                        if (mergedConfig.onUploadProgress && body) {
                            const progressResult = this._addUploadProgress(body, mergedConfig.onUploadProgress, progressContext);
                            if (progressResult) {
                                finalBody = progressResult.body;
                                if(progressResult.total > 0) headers.set('Content-Length', String(progressResult.total));
                            }
                        }

                        const requestOptions: RequestInit = {
                            method: mergedConfig.method || 'GET',
                            headers,
                            body: finalBody,
                            signal,
                            credentials: mergedConfig.credentials,
                            redirect: (mergedConfig.followRedirects === false || mergedConfig.followRedirects === 0) ? 'manual' : 'follow',
                        };
                        const request = this._createRequest(url, requestOptions, mergedConfig);

                        const headersForLog: Record<string, string> = {};
                        request.headers.forEach((value, key) => { headersForLog[key] = value; });
                        log(`[REQUEST] ${request.method} ${request.url}`, { headers: headersForLog });

                        let mockResponse: Response | undefined;
                        if (mergedConfig.before) {
                            for (const hook of mergedConfig.before) {
                                const res = await hook(request);
                                if (res instanceof Response) {
                                    mockResponse = res;
                                    log(`[MOCKED] Request was handled by a 'before' hook.`);
                                    break;
                                }
                            }
                        }

                        const response = mockResponse ?? await fetch(request).catch(e => { throw this._createError(errorCodes.NETWORK_ERROR, e.message) });

                        if (!response.ok) throw await this._createErrorFromResponse(response);

                        if (autoKey && mergedConfig.cacheTtl! > 0) {
                            this.cache.set(autoKey, { response: response.clone(), at: Date.now(), options: mergedConfig });
                        }

                        resolve(await this._processResponse(response, mergedConfig, log) as T);
                        cleanup();
                        return;

                    } catch (error) {
                        const enhancedError = error as EnhancedError;
                        if (signal.aborted) throw enhancedError; // Don't retry if aborted
                        attempts++;

                        let shouldRetry = mergedConfig.retryCondition!(enhancedError);
                        if (mergedConfig.onError) {
                            for (const hook of mergedConfig.onError) {
                                const hookResult = await hook(enhancedError, attempts, mergedConfig);
                                if (hookResult === false) shouldRetry = false;
                            }
                        }

                        if (attempts > maxRetries || !shouldRetry) {
                            cleanup();
                            throw enhancedError;
                        }

                        log(`[RETRY] Attempt ${attempts} failed. Retrying in ${mergedConfig.retryDelay!(attempts)}ms...`, { error: enhancedError.message });
                        await new Promise(res => setTimeout(res, mergedConfig.retryDelay!(attempts)));
                    }
                }
            } catch (error) {
                cleanup();
                reject(error);
            }
        });

        if (mergedConfig.dedupe && dedupeKey) {
            const abort = () => abortController.abort(this._createError(errorCodes.DEDUPED, `Request with key '${dedupeKey}' was superseded.`));
            inFlightRequests.set(dedupeKey, { promise: requestPromise, abort });
            requestPromise.finally(() => { inFlightRequests.delete(dedupeKey); });
        }
        return requestPromise;
    }

    private async _processResponse(response: Response, config: APIRequestConfig, log: Logger) {
        log(`[RESPONSE] ${response.status} ${response.statusText} from ${response.url}`);
        let finalResponse = response.clone();

        if (config.onDownloadProgress) {
            const progressResult = this._addDownloadProgress(finalResponse, config.onDownloadProgress, { abort: () => {} });
            if (progressResult) finalResponse = progressResult;
        }

        const parsedData = await this._parseBody(finalResponse, config);
        if (config.after) {
            for (const hook of config.after) await hook(response.clone(), parsedData);
        }

        return parsedData;
    }

    // --- PRIVATE HELPERS ---
    private _deepMerge(...objects: any[]): any {
        const isObject = (obj: any) => obj && typeof obj === 'object' && !Array.isArray(obj);
        return objects.reduce((prev, obj) => {
            if (!obj) return prev;
            Object.keys(obj).forEach(key => {
                const pVal = prev[key];
                const oVal = obj[key];
                if (Array.isArray(pVal) && Array.isArray(oVal)) prev[key] = [...pVal, ...oVal];
                else if (isObject(pVal) && isObject(oVal)) prev[key] = this._deepMerge(pVal, oVal);
                else prev[key] = oVal;
            });
            return prev;
        }, {});
    }

    private _getPatternRegex(path: string): RegExp {
        if (this._extendPatterns.has(path)) return this._extendPatterns.get(path)!;
        const patternStr = "^" + path.replace(/(\/?)\*/g, "($1.*)?").replace(/:(\w+)(\?)?/g, (_: string, __: string, optional: string) => optional ? '(?:/([^/]+))?' : "([^/]+)") + (this.options.strict ? "" : "/?$");
        const regex = new RegExp(patternStr, this.options.caseSensitive ? '' : 'i');
        this._extendPatterns.set(path, regex);
        return regex;
    }

    private _getAutoKey(config: APIRequestConfig, path: string, log: Logger): string | null {
        if (typeof config.key === 'function') return config.key();
        try {
            const bodyToHash = config.method === 'GET' ? undefined : config.body;
            // A simple sort to make object key order consistent for serialization
            const sortedParams = config.params ? Object.fromEntries(Object.entries(config.params).sort(([a], [b]) => a.localeCompare(b))) : undefined;
            return JSON.stringify({ path, method: config.method, params: sortedParams, body: bodyToHash });
        } catch {
            log(`[WARN] Auto key generation failed for request with non-serializable body. Caching/Deduplication disabled.`);
            return null;
        }
    }

    private _createRequest(url: string, requestInit: RequestInit, apiConfig: APIRequestConfig): Request & { options: APIRequestConfig } {
        const request = new Request(url, requestInit) as Request & { options: APIRequestConfig };
        request.options = apiConfig;
        return request;
    }

    private _buildURL(base: string, path: string, params?: Record<string, any>): string {
        // Temporarily use a dummy base to safely parse the URL
        const dummyBase = 'http://example.com';
        const actualBase = base || dummyBase;

        const url = new URL(path, actualBase);

        // Add search params
        if (params) {
            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(params)) {
                if (Array.isArray(value)) {
                    value.forEach(v => searchParams.append(key, String(v)));
                } else if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            }
            url.search = searchParams.toString();
        }

        // Strip dummy base if we used it (means path was relative and no base was given)
        if (!base) {
            return url.pathname + url.search + url.hash;
        }

        return url.toString();
    }


    private _prepareBody(config: APIRequestConfig, log: Logger): [BodyInit | null, string | null] {
        const { body, bodyType } = config;
        if (!body || typeof body !== 'object' || body instanceof Blob || body instanceof ArrayBuffer || body instanceof URLSearchParams || body instanceof ReadableStream) {
            return [body as BodyInit, null];
        }
        let finalType = bodyType;
        if (bodyType === 'auto') {
            const hasBlob = Object.values(body).some(v => v instanceof Blob);
            finalType = hasBlob ? 'formdata' : 'json';
        }
        if (finalType === 'json') {
            return [JSON.stringify(body), 'application/json'];
        }
        if (finalType === 'formdata') {
            const formData = new FormData();
            for (const [key, value] of Object.entries(body)) formData.append(key, value as any);
            return [formData, null];
        }
        return [body as BodyInit, null];
    }

    private async _prepareHeaders(config: APIRequestConfig, contentType: string | null): Promise<Headers> {
        const headers = new Headers();

        // 1. Process explicit headers from config
        const allHeaders: Record<string, any> = this._deepMerge(this.options.headers, config.headers);
        for (const key in allHeaders) {
            const baseVal = this.options.headers?.[key];
            const reqVal = config.headers?.[key];
            let finalVal: string | undefined;
            if (typeof reqVal === 'function') finalVal = await (reqVal as HeaderModifier)(typeof baseVal === 'string' ? baseVal : undefined);
            else if (typeof baseVal === 'function') finalVal = await (baseVal as HeaderModifier)(typeof reqVal === 'string' ? reqVal : undefined);
            else finalVal = reqVal ?? baseVal;
            if (finalVal !== null && finalVal !== undefined) headers.set(key, finalVal);
        }

        // 2. Process cookies
        const localCookies: Record<string, string> = {};
        // Add cookies from the jar if credentials are 'include'/'same-origin' (for SSR/Node)
        if (config.credentials === 'include' || config.credentials === 'same-origin') {
            Object.assign(localCookies, jar.getRecord());
        }
        // Manually configured cookies always take precedence
        const allCookies = this._deepMerge(this.options.cookies, config.cookies);
        for (const key in allCookies) {
            const baseVal = this.options.cookies?.[key];
            const reqVal = config.cookies?.[key];
            let finalVal: string | undefined;
            if (typeof reqVal === 'function') finalVal = await (reqVal as CookieModifier)(localCookies[key]);
            else if (typeof baseVal === 'function') finalVal = await (baseVal as CookieModifier)(localCookies[key]);
            else finalVal = reqVal ?? baseVal;
            if (finalVal) localCookies[key] = finalVal;
            else delete localCookies[key]; // Allow clearing a cookie
        }
        const finalCookieString = Object.entries(localCookies).map(([k, v]) => `${k}=${v}`).join('; ');
        if (finalCookieString) headers.set('Cookie', finalCookieString);

        // 3. Set Content-Type if determined
        if (contentType && !headers.has('Content-Type')) headers.set('Content-Type', contentType);

        // 4. Set XSRF token, reading directly from the jar
        if (config.xsrf && !headers.has(config.xsrfHeader!)) {
            const token = jar.get(config.xsrfCookie!);
            if (token) headers.set(config.xsrfHeader!, decodeURIComponent(token));
        }
        return headers;
    }

    private _mergeSignals(...signals: (AbortSignal | undefined)[]): AbortSignal {
        const controller = new AbortController();
        for (const signal of signals) {
            if (signal) {
                if (signal.aborted) { controller.abort(signal.reason); break; }
                signal.addEventListener('abort', () => controller.abort(signal.reason));
            }
        }
        return controller.signal;
    }

    private _createError(code: ErrorCode, message: string): EnhancedError {
        const err = new Error(message) as EnhancedError;
        err.code = code;
        return err;
    }

    private async _createErrorFromResponse(response: Response): Promise<EnhancedError> {
        const err = new Error(`Request failed with status ${response.status}`) as EnhancedError;
        err.response = response.clone();
        try {
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) err.data = await response.json();
            else err.data = await response.text();
        } catch { err.data = 'Could not parse error response body.'; }
        return err;
    }

    private async _parseBody(response: Response, config: APIRequestConfig): Promise<any> {
        if (config.expectsDownloads) return response.blob();
        if (response.status === 204 || response.status === 205) return null;
        const contentType = response.headers.get('Content-Type') || '';
        if (config.expectsJSON && contentType.includes('application/json')) return response.json();
        return response.text();
    }

    private _addDownloadProgress(response: Response, onProgress: (p: { loaded: number, total: number }, c: ProgressContext) => void, context: ProgressContext): Response | null {
        const total = parseInt(response.headers.get('Content-Length') || '0', 10);
        if (!response.body) return null;
        let loaded = 0;
        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body!.getReader();
                while(true) {
                    try {
                        const { done, value } = await reader.read();
                        if (done) break;
                        loaded += value.length;
                        onProgress({ loaded, total }, context);
                        controller.enqueue(value);
                    } catch (e) { controller.error(e); break; }
                }
                controller.close();
            },
        });
        return new Response(stream, { headers: response.headers, status: response.status, statusText: response.statusText });
    }

    private _addUploadProgress(body: BodyInit, onProgress: (p: { loaded: number, total: number }, c: ProgressContext) => void, context: ProgressContext): { body: ReadableStream, total: number } | null {
        // Node.js: Handle fs.ReadStream for progress
        if (!isBrowser && typeof (body as any).on === 'function') {
            const stream = body as unknown as any;
            const total = (stream as any).readableLength || 0;
            let loaded = 0;
            stream.on('data', (chunk: any) => {
                loaded += chunk.length;
                onProgress({ loaded, total }, context);
            });
            return { body: stream as any, total };
        }

        const blob = body instanceof Blob ? body : new Blob([body as any]);
        const total = blob.size;
        if (total === 0) return null;
        let loaded = 0;

        const stream = new ReadableStream({
            async start(controller) {
                const reader = blob.stream().getReader();
                while(true) {
                    try {
                        const { done, value } = await reader.read();
                        if (done) break;
                        loaded += value.length;
                        onProgress({ loaded, total }, context);
                        controller.enqueue(value);
                    } catch (e) { controller.error(e); break; }
                }
                controller.close();
            },
        });
        return { body: stream, total };
    }
}

/** Creates a new API instance or retrieves the globalAPI instance. */
export function useAPI(config?: APIInstanceConfig & { inheritOptions?: boolean }): API {
    if (config) return new API(config);
    if (!globalAPI) {
        return new API();
    }
    return globalAPI;
}

/** Creates a new API instance and inits it. */
export function initAPI(config?: APIInstanceConfig & { inheritOptions?: boolean }): API {
    const api = new API(config);
    api.init();
    return api;
}