// src/client/app.ts

import {
    createApp,
    h,
    shallowRef,
    onMounted,
    type App as VueApp,
    type Component,
    createSSRApp,
} from "vue";
import { useScreens } from "./composables/screens.js";
import { Router, useRouter } from "./composables/router.js";
import { createInertiaHandler } from "./router-factories.js";
import Display from "./components/display.vue";
import { MetaTag, useHead, HeadData } from "./composables/head.js";
import { defaults, useProgress } from "./composables/progress.js";
import Curtain from "./components/curtain.vue";
import type { Page, VisitOptions, PageResult, RouterOptions } from "./types.js";

type ConfigRouterFunction = (router: Router) => any | Promise<any>;

interface FictifAppOptions {
    mountTo?: string | HTMLElement;
    resolve?: (name: string) => Promise<Component>;
    setup?: ({
        el,
        App,
    }: {
        el: Element;
        App: Component;
    }) => VueApp;
    progress?:
        | false
        | {
              delay?: number;
          };
    version?: string | null;
    router?: RouterOptions | Router | ConfigRouterFunction;
    initialData?: string | object | undefined;
    copyInitialData?: boolean;
    isSSR?: boolean;
    title?: (title: string) => string;
    meta?: (meta: MetaTag[]) => MetaTag[];
    favicon?: (title: string) => string;
}



export async function createFictifApp(config?: FictifAppOptions | Router | ConfigRouterFunction) {
    if(typeof config == 'function') {
        const rtr = new Router();
        await config(rtr); // Handle router setup func

        config = {
            router: rtr
        }
    }

    let {
        mountTo = "#app",
        setup,
        progress = {},
        version = 'static',
        resolve: providedResolve,
        router: providedRouter,
        initialData = undefined,
        copyInitialData = true,
        title = (t: string) => t,
        meta = (m: MetaTag[]) => m,
        favicon = (t: string) => t,
        isSSR = undefined
    } = typeof config == 'object' && config ? config as any : {};

    let router: Router;

    if(providedRouter) {
        router = useRouter(providedRouter);
    }else{
        router = useRouter({
            handle: createInertiaHandler()
        })
    };

    const resolve = providedResolve || useScreens().resolve;

    if(typeof mountTo == 'string') {
        const element = document.querySelector<HTMLElement>(mountTo);

        if(!element) {
            throw new Error(`[Fictif] Given 'mountTo' query selector didnt resolve to an html element, given: "${mountTo}".`);
        }

        mountTo = element;
    }

    if (!mountTo && typeof setup != 'function') {
        // The developer didnt provide us with the mount point and wont mount it manually
        throw new Error(`[Fictif] Didnt receive a root element to mount to.`);
    }

    const renderedPage = shallowRef<Page>({
                component: '',
                props: {},
                url: location.pathname,
                version
            });


    const head = useHead();
    const progressManager = useProgress();

    // --- BIND CORE EVENT LISTENERS ---
    if (progress != false) {
        progressManager.start();

        let progressTimeout: number | undefined;
        router.on("navigation", () => {
            progressTimeout = window.setTimeout(
                progressManager.start,
                (progress as any)?.delay || 0
            );
        });
        const finishProgress = () => {
            clearTimeout(progressTimeout);
            progressManager.finish();
        };
        router.on("ready", finishProgress);
        router.on("error", finishProgress);
    }

    router.on(
        "push",
        async ({
            page,
            options: visitOptions,
        }: {
            page: Page;
            options: VisitOptions;
        }) => {
            // Here, we handle scroll preservation before updating the page
            if (!visitOptions.preserveScroll) {
                window.scrollTo(0, 0);
            }

            const component =
                typeof page.component === "string"
                    ? await resolve(page.component)
                    : page.component;

            // Handle partial reloads by merging props
            if (visitOptions.only?.length) {
                const newProps = { ...page.value.props, ...page.props };
                renderedPage.value = { ...page, props: newProps, component };
            } else {
                renderedPage.value = { ...page, component };
            }
        }
    );

    (async function () {
        await router.init();

        // Getting initial data, e.g. the data-page json in #app in inertia apps
        if(copyInitialData && mountTo && mountTo.dataset.page) initialData = JSON.parse(mountTo.dataset.page);

        // The dev provided us with data
        else if(typeof initialData == 'string') initialData = JSON.parse(initialData);

        if (initialData) {
            await router.push(initialData as PageResult);
        }else{
            // Manual router invoc
            await router.go(location.pathname);
        }
    })();

    // --- CREATE THE ROOT VUE APP ---
    const App = {
        name: "FictifAppRoot",
        setup() {
            onMounted(() => {
                document.body.classList.add("fictif-app-mounted");
            });

            return () =>
                h("div", { id: "fictif-root-wrapper" }, [
                    h(Curtain, {
                        show: progressManager.isLoading.value,
                        message: progressManager.message.value,
                        background: progressManager.background.value,
                    }),
                    renderedPage.value && typeof renderedPage.value.component == "object"
                        ? h(Display, {
                              key: renderedPage.value.url,
                              // @ts-ignore
                              screen: renderedPage.value.component,
                              headUpdate (data: HeadData) {
                                  head.update({
                                      title: typeof title == 'function' ? title(data.title || '') : data.title,
                                      meta: typeof meta == 'function' ? meta(data.meta || []) : data.meta,
                                      favicon: typeof favicon == 'function' ? favicon(data.favicon || '') : data.favicon,
                                  });
                              },
                              ...renderedPage.value.props,
                          })
                        : undefined,
                ]);
        },
    };

    let app: any;

    if (setup) {
        app = setup({ el: mountTo, App });
    } else {
        const isSsr = typeof isSSR == 'boolean' ? isSSR : (mountTo && mountTo.hasAttribute("data-server-rendered"));
        app = isSsr ? createSSRApp(App) : createApp(App);
    }

    if(mountTo) {
        app.mount(mountTo);
    }
}
