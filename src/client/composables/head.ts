// /composables/head.ts

// --- PUBLIC TYPES ---
// Changed HeadOptions.title to title for clarity, as requested before.
type OptionsModifier<T> = string | ((value: T | undefined) => string | null | undefined | Record<string, any>);
type LinkValue = string | Record<string, any>;
type ScriptValue = string | Record<string, any>;

export type HeadOptions = {
    title?: (title: string | undefined) => string;
    description?: OptionsModifier<string>;
    favicon?: OptionsModifier<string>;
    httpEquivMeta?: Record<string, OptionsModifier<any>>;
    propertyMeta?: Record<string, OptionsModifier<any>>;
    namedMeta?: Record<string, OptionsModifier<any>>;
    link?: Record<string, LinkValue | LinkValue[]>;
    script?: ScriptValue[];
    global?: boolean;
};

export type HeadUpdateData = Record<string, any> & {
    reset?: boolean;
    title?: string;
    description?: string;
    favicon?: string;
    children?: Record<string, any>[];
};

type InternalHeadTag = {
    tag: string;
    props: Record<string, any>;
    innerHTML?: string;
};

// --- SINGLETON HOLDER ---
export let global: HeadManager | null = null;

// --- HeadManager CLASS ---
export class HeadManager {
    private options: HeadOptions;
    public lastData: HeadUpdateData = {};
    private managedTagKey: string;

    constructor(options: HeadOptions) {
        this.options = options;
        this.managedTagKey = Math.random().toString(36).substring(7);

        if(this.options.global == undefined || this.options.global ) {
            this.init();
        }
    }

    public init() {
        global = this;
    }

    public update(data: HeadUpdateData) {
        if (data.reset !== false) {
            this.lastData = {};
        }
        this.lastData = { ...this.lastData, ...data };
        const tags = this._compile(this.lastData);
        if (typeof window !== 'undefined' && window.document) {
            this._updateDOM(tags);
        }
    }

    public renderToString(): { headTags: string; bodyTags: string } {
        const tags = this._compile(this.lastData);
        const headTags: string[] = [];
        const bodyTags: string[] = [];
        for (const tag of tags) {
            const str = this._renderTagToString(tag);
            if (tag.props.body) {
                bodyTags.push(str);
            } else {
                headTags.push(str);
            }
        }
        return { headTags: headTags.join('\n    '), bodyTags: bodyTags.join('\n    ') };
    }

    private _compile(data: HeadUpdateData): InternalHeadTag[] {
        const tags: InternalHeadTag[] = [];

        // --- *** THE CORE LOGIC CHANGE STARTS HERE *** ---

        // 1. Title
        // The title template is ALWAYS called. The provided title is passed as an argument, which can be undefined.
        if (this.options.title) {
            const finalTitle = this.options.title(data.title);
            // The template itself can return null/empty to render nothing.
            if (finalTitle) {
                tags.push({ tag: 'title', props: {}, innerHTML: finalTitle });
            }
        } else if (data.title) {
            // Fallback for when no template is optionsured, but a title is provided.
            tags.push({ tag: 'title', props: {}, innerHTML: data.title });
        }

        // Helper to process meta sections by iterating the OPTIONS, not the data.
        const processMetaSection = (
            optionsSection: Record<string, OptionsModifier<any>> | undefined,
            metaType: 'name' | 'property' | 'http-equiv'
        ) => {
            if (!optionsSection) return;

            for (const name in optionsSection) {
                const modifier = optionsSection[name];
                const valueFromData = data[name];

                let content: string | Record<string, any> | null | undefined;
                if (typeof modifier === 'function') {
                    // Always call the function, passing the data value (which could be undefined)
                    content = modifier(valueFromData);
                } else {
                    // If modifier is a static string, use it only if no data is provided.
                    // If data IS provided, it overrides the static string.
                    content = valueFromData !== undefined ? valueFromData : modifier;
                }

                if (content !== null && content !== undefined) {
                    tags.push({ tag: 'meta', props: { [metaType]: name, content: String(content) } });
                }
            }
        };

        // 2. Meta Tags (Description, Named, Property, HTTP-Equiv)
        // Description is treated like any other named meta tag for consistency.
        const namedMetaOptions = { ...this.options.namedMeta };
        if (this.options.description) {
            namedMetaOptions.description = this.options.description;
        }

        processMetaSection(namedMetaOptions, 'name');
        processMetaSection(this.options.propertyMeta, 'property');
        processMetaSection(this.options.httpEquivMeta, 'http-equiv');

        // Favicon works similarly
        if(this.options.favicon) {
            let faviconValue: string | Record<string, any> | null | undefined;
            if (typeof this.options.favicon === 'function') {
                faviconValue = this.options.favicon(data.favicon);
            } else {
                faviconValue = data.favicon !== undefined ? data.favicon : this.options.favicon;
            }
            if (faviconValue) {
                const props = typeof faviconValue === 'string' ? { href: faviconValue } : faviconValue;
                tags.push({ tag: 'link', props: { rel: 'icon', ...props } });
            }
        }

        // --- *** END OF CORE LOGIC CHANGE *** ---

        // 3. Static Injections (Unchanged)
        if (this.options.link) {
            for (const rel in this.options.link) {
                const items = Array.isArray(this.options.link[rel]) ? this.options.link[rel]! : [this.options.link[rel]!];
                items.forEach(item => {
                    const props = typeof item === 'string' ? { href: item } : item;
                    tags.push({ tag: 'link', props: { rel, ...props } });
                });
            }
        }
        if (this.options.script) {
            this.options.script.forEach(item => {
                const props = typeof item === 'string' ? { src: item } : item;
                tags.push({ tag: 'script', props });
            });
        }

        // 4. Dynamic Children from <Head> slots (Unchanged)
        if (data.children) {
            data.children.forEach(child => {
                const { elementTagType, innerHTML, ...props } = child;
                if (elementTagType) {
                    tags.push({ tag: elementTagType, props, innerHTML });
                }
            });
        }
        return tags;
    }

    private _updateDOM(tags: InternalHeadTag[]) {
        const doc = window.document;
        const attrSelector = `[data-fictif-head="${this.managedTagKey}"]`;
        doc.querySelectorAll(attrSelector).forEach(el => el.remove());
        const titleTag = tags.find(t => t.tag === 'title');
        doc.title = titleTag?.innerHTML || '';
        tags.forEach(tag => {
            if (tag.tag === 'title') return;
            const el = doc.createElement(tag.tag);
            el.setAttribute('data-fictif-head', this.managedTagKey);
            for (const [key, value] of Object.entries(tag.props)) {
                if (value === true || value === '') el.setAttribute(key, '');
                else if (value !== false && value !== null && value !== undefined) el.setAttribute(key, String(value));
            }
            if (tag.innerHTML) {
                el.innerHTML = tag.innerHTML;
            }
            const parent = tag.props.body ? doc.body : doc.head;
            parent.appendChild(el);
        });
    }

    private _renderTagToString(tag: InternalHeadTag): string {
        if (tag.tag === 'title') return `<title>${tag.innerHTML}</title>`;
        const attrs = Object.entries(tag.props).map(([key, val]) => {
                if (val === true || val === '') return key;
                if (val === false || val === null || val === undefined) return null;
                return `${key}="${String(val).replace(/"/g, '"')}"`;
            }).filter(Boolean).join(' ');
        const selfClosing = ['meta', 'link', 'base'].includes(tag.tag);
        const finalAttrs = attrs ? ' ' + attrs : '';
        if (selfClosing) return `<${tag.tag}${finalAttrs}>`;
        return `<${tag.tag}${finalAttrs}>${tag.innerHTML || ''}</${tag.tag}>`;
    }
}

export function useHead(options?: HeadOptions): HeadManager {
    if (options) {
        return new HeadManager(options);
    }
    if (!global) throw new Error("[Fictif Head] No global HeadManager initialized.");
    return global;
}