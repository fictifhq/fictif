// src/client/composables/head.ts

import { ref, watch, type Ref } from 'vue';

export interface MetaTag {
    [key: string]: string;
}

export interface LinkTag {
    [key: string]: string;
}

export interface HeadData {
    title?: string;
    meta?: MetaTag[];
    links?: LinkTag[];
    favicon?: string; // URL string to favicon
}

interface HeadManager {
    update: (data: HeadData) => void;
    title: Ref<string>;
    meta: Ref<MetaTag[]>;
    links: Ref<LinkTag[]>;
    favicon: Ref<string>;
}

let headManagerInstance: HeadManager | null = null;

function createHeadManager(): HeadManager {
    const title = ref(typeof document !== 'undefined' ? document.title : '');
    const meta = ref<MetaTag[]>([]);
    const links = ref<LinkTag[]>([]);
    const favicon = ref<string>('');

    function update(data: HeadData) {
        if (data.title !== undefined) {
            title.value = data.title;
        }
        if (data.meta !== undefined) {
            meta.value = data.meta;
        }
        if (data.links !== undefined) {
            links.value = data.links;
        }
        if (data.favicon !== undefined) {
            favicon.value = data.favicon;
        }
    }

    watch(title, (newTitle) => {
        if (typeof document !== 'undefined') {
            document.title = newTitle;
        }
    }, { immediate: true });

    watch(meta, (newMeta) => {
        if (typeof document === 'undefined') return;

        document.head.querySelectorAll('[data-fictif-meta]').forEach(el => el.remove());

        newMeta.forEach(tagAttrs => {
            const metaEl = document.createElement('meta');
            metaEl.setAttribute('data-fictif-meta', '');
            Object.entries(tagAttrs).forEach(([key, value]) => metaEl.setAttribute(key, value));
            document.head.appendChild(metaEl);
        });
    }, { deep: true, immediate: true });

    watch(links, (newLinks) => {
        if (typeof document === 'undefined') return;

        document.head.querySelectorAll('[data-fictif-link]').forEach(el => el.remove());

        newLinks.forEach(linkAttrs => {
            const linkEl = document.createElement('link');
            linkEl.setAttribute('data-fictif-link', '');
            Object.entries(linkAttrs).forEach(([key, value]) => linkEl.setAttribute(key, value));
            document.head.appendChild(linkEl);
        });
    }, { deep: true, immediate: true });

    watch(favicon, (href) => {
        if (typeof document === 'undefined') return;

        let iconEl = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');

        if (!iconEl) {
            iconEl = document.createElement('link');
            iconEl.rel = 'icon';
            document.head.appendChild(iconEl);
        }

        iconEl.href = href;
    }, { immediate: true });

    return { update, title, meta, links, favicon };
}

/**
 * Provides reactive management of the document head.
 */
export function useHead(): HeadManager {
    if (!headManagerInstance) {
        headManagerInstance = createHeadManager();
    }
    return headManagerInstance;
}
