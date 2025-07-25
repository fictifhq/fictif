// src/client/types.ts

import type { Component } from 'vue';
import type { RouteMap } from './composables/route-map.ts'

export type PageResult = Record<string, any> & { url: string };
export type ExplictResolveFunction = (
    url: string,
    request: VisitOptions
) => Promise<PageResult | undefined>;

export type ResolveFunction = ExplictResolveFunction
        | RouteMap<VisitOptions>;

export interface RouterOptions {
    resolve: ResolveFunction | ResolveFunction[];
}

/**
 * Represents the structure of a Fictif page object, typically received from the server.
 */
export interface Page {
    component: string | Component;
    props: Record<string, any>;
    url: string;
    version: string | null;
    [key: string]: any;
}

/**
 * Options for a single router visit, used by router.go() and useForm.
 */
export interface VisitOptions {
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
    body?: Record<string, any>;
    headers?: Record<string, string>;
    preserveScroll?: boolean;
    preserveState?: boolean;
    replace?: boolean;
    only?: string[];
    old?: PageResult;
}