// src/client/composables/endpoint.ts

import { type Ref, type ComputedRef } from 'vue';

type HeaderValue = string | Ref<string> | ComputedRef<string> | (() => string | Promise<string>);
type HeadersObject = Record<string, HeaderValue>;

interface EndpointOptions {
    base?: string;
    headers?: HeadersObject;
    global?: boolean;
}

interface RequestOptions extends Omit<RequestInit, 'headers' | 'body' | 'method'> {
    headers?: HeadersObject;
    method?: string;
    body?: Record<string, any>;
}

export interface EndpointInstance {
    request: (path: string, options?: RequestOptions) => Promise<any>;
    get: (path: string, options?: RequestOptions) => Promise<any>;
    post: (path: string, options?: RequestOptions) => Promise<any>;
    put: (path: string, options?: RequestOptions) => Promise<any>;
    delete: (path: string, options?: RequestOptions) => Promise<any>;
    fetch: (path: string, options?: RequestOptions) => Promise<any>;
}

let globalEndpointInstance: EndpointInstance | null = null;

// --- Helper Functions ---
function isRefLike(value: any): value is Ref | ComputedRef {
    return value && typeof value === 'object' && 'value' in value;
}

function hasFiles(data: Record<string, any>): boolean {
    return Object.values(data).some(value => value instanceof File || value instanceof Blob);
}

function objectToFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        }
    }
    return formData;
}

async function resolveHeaders(headers: HeadersObject): Promise<Record<string, string>> {
    const resolved: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
        if (typeof value === 'function') {
            resolved[key] = await value();
        } else if (isRefLike(value)) {
            resolved[key] = value.value;
        } else {
            resolved[key] = String(value);
        }
    }
    return resolved;
}

function getCsrfTokenFromCookie(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
        try {
            return decodeURIComponent(match[1]);
        } catch {
            return '';
        }
    }
    return '';
}




function createEndpointInstance(options: EndpointOptions = {}): EndpointInstance {
    const config = {
        base: options.base || (typeof window !== 'undefined' ? window.location.origin : '/'),
        headers: options.headers || {},
    };

    const fetch = async (path: string, options: RequestOptions = {}): Promise<any> => {
        const method = (options.method || 'get').toLowerCase();
        const data = options.body || {};
        let finalMethod = method;
        let body: BodyInit | undefined;
        let finalHeaders = { ...(await resolveHeaders(config.headers)), ...(await resolveHeaders(options.headers || {})) };

        finalHeaders['X-XSRF-TOKEN'] = getCsrfTokenFromCookie();

        let url = path.startsWith('http') ? path : `${config.base!.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

        if (method === 'get' && Object.keys(data).length) {
            const queryParams = new URLSearchParams(data as Record<string, string>).toString();
            url += (url.includes('?') ? '&' : '?') + queryParams;
        }

        if (method !== 'get') {
            if (hasFiles(data)) {
                body = objectToFormData(data);
                if (['put', 'patch', 'delete'].includes(method)) {
                    (body as FormData).append('_method', method.toUpperCase());
                    finalMethod = 'post';
                }
            } else {
                body = JSON.stringify(data);
                if (!finalHeaders['Content-Type']) {
                    finalHeaders['Content-Type'] = 'application/json';
                }
            }
        }

        const response = await window.fetch(url, {
            ...options,
            method: finalMethod.toUpperCase(),
            headers: finalHeaders,
            body,
        });

        if (!response.ok) {
            // Throw a structured error that can be caught and inspected
            throw {
                response,
                data: await response.json().catch(() => null)
            };
        }

        return response;
    };

    const fetchAndParse = async (path: string, fetchOptions: RequestOptions, method?: string) => {
        if(method) fetchOptions['method'] = method;
        const response = await fetch(path, fetchOptions);

        if (!response.ok) {
            // Throw a more informative error object
            const errorPayload = {
                status: response.status,
                statusText: response.statusText,
                url: response.url,
            };
            throw new Error(`Fictif endpoint error: ${JSON.stringify(errorPayload)}`);
        }

        if (response.headers.get('Content-Type')?.includes('application/json')) {
            return response.json();
        }

        return response;
    };

    return {
        get: (path, options) => fetchAndParse(path, options || {}, 'get'),
        post: (path, options) => fetchAndParse(path, options || {}, 'post'),
        put: (path, options) => fetchAndParse(path, options || {}, 'put'),
        delete: (path, options) => fetchAndParse(path, options || {}, 'delete'),
        request: (path, options) => fetchAndParse(path, options || {}),
        fetch: (path, options) => fetch(path, options || {}),
    };
}

export function useEndpoint(options?: EndpointOptions): EndpointInstance {
    if (options) {
        const instance = createEndpointInstance(options);
        if (options.global && !globalEndpointInstance) {
            globalEndpointInstance = instance;
        }
        return instance;
    }
    if (globalEndpointInstance) {
        return globalEndpointInstance;
    }
    return createEndpointInstance();
}