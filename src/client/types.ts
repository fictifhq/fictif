// src/client/types.ts

import type { Component } from 'vue';
import type { Middleware } from './composables/route-map.ts'

export type PageResult = Record<string, any> & { path: string };

export interface RouterOptions {
    handle?: Middleware<VisitOptions> | Middleware<VisitOptions>[];
}

/**
 * Represents the structure of a Fictif page object, typically received from the server.
 */
export interface Page {
    component: string | Component;
    props: Record<string, any>;
    path: string;
    version: string | null;
    [key: string]: any;
}

/**
 * Options for a single router visit, used by router.visit() and useForm.
 */
export interface VisitOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path?: string;
    body?: Record<string, any>;
    headers?: Record<string, string>;
    preserveScroll?: boolean;
    preserveState?: boolean;
    replace?: boolean;
    only?: string[];
    old?: PageResult;
}