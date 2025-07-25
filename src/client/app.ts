// src/client/app.ts

import {
    createApp,
    h,
    shallowRef,
    onMounted,
    type App as VueApp,
    type Component,
    createSSRApp,
    computed,
    reactive
} from "vue";
import { useScreens } from "./composables/screens.js";
import { useRouter, Router, createRouterFromResolver, rMap } from "./composables/router.js";
import { createEndpointResolver } from "./router-factories.js";
import Display from "./components/display.vue";
import { MetaTag, useHead, HeadData } from "./composables/head.js";
import { defaults, useProgress } from "./composables/progress.js";
import Curtain from "./components/curtain.vue";
import type { Page, VisitOptions, PageResult, ResolveFunction } from "./types.js";
import { RouteMap } from "./composables/route-map.js";


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
    router?: Router | ResolveFunction;
    initialData?: string | object | undefined;
    copyInitialData?: boolean;
    isSSR?: boolean;
    title?: (title: string) => string;
    meta?: (meta: MetaTag[]) => MetaTag[];
    favicon?: (title: string) => string;
}


export async function createFictifApp(config: FictifAppOptions | Router | RouteMap<any> | ((routes: RouteMap<VisitOptions>) => void) = {}) {
    if(typeof config == 'function') {
        config = {
            router: rMap(config)
        }
    }

    if(config instanceof Router || config instanceof RouteMap) {
        config = {
            router: createRouterFromResolver(config)
        }
    }



    let {
        mountTo = "#app",
        resolve,
        setup,
        progress = {},
        version = 'static',
        router: providedRouter,
        initialData = undefined,
        copyInitialData = true,
        title = (t: string) => t,
        meta = (m: MetaTag[]) => m,
        favicon = (t: string) => t,
        isSSR = undefined
    } = config;



    if(typeof mountTo == 'string') {
        const element = document.querySelector<HTMLElement>(mountTo);

        if(!element) {
            throw new Error(`[Fictif] Given 'mountTo' query selector didnt resolve to an html element, given: "${mountTo}".`);
        }

        mountTo = element;
    }

    if (!mountTo && typeof setup != 'function') {
        // The developer didnt provide us with the mount point and wont mount it manually
        throw new Error(`[Fictif] Didnt receive a root element.`);
    }


    const finalResolve = resolve || useScreens().screen;


    const page = shallowRef<Page>({
                component: '',
                props: {},
                url: location.pathname,
                version
            });


    const head = useHead();

    const progressObj = useProgress();

    if(providedRouter && !(providedRouter instanceof Router)) {
        providedRouter = createRouterFromResolver(providedRouter);
    }

    const router = providedRouter || new Router({
        resolve: createEndpointResolver({})
    });



    // --- BIND CORE EVENT LISTENERS ---
    if (progress != false) {
        progressObj.start();

        let progressTimeout: number | undefined;
        router.on("navigation", () => {
            progressTimeout = window.setTimeout(
                progressObj.start,
                (progress as any)?.delay || 0
            );
        });
        const finishProgress = () => {
            clearTimeout(progressTimeout);
            progressObj.finish();
        };
        router.on("ready", finishProgress);
        router.on("error", finishProgress);
    }

    (async function () {
        router.on(
            "push",
            async ({
                page: newPage,
                options: visitOptions,
            }: {
                page: Page;
                options: VisitOptions;
            }) => {
                // Here, we handle scroll preservation before updating the page
                if (!visitOptions.preserveScroll) {
                    // `visitOptions` needs to be accessible
                    window.scrollTo(0, 0);
                }

                const component =
                    typeof newPage.component === "string"
                        ? await finalResolve(newPage.component)
                        : newPage.component;

                // Handle partial reloads by merging props
                if (visitOptions.only?.length) {
                    const newProps = { ...page.value.props, ...newPage.props };
                    page.value = { ...newPage, props: newProps, component };
                } else {
                    page.value = { ...newPage, component };
                }
            }
        );

        await router.init();

        if(copyInitialData && mountTo && mountTo.dataset.page) initialData = JSON.parse(mountTo.dataset.page);
        else if(typeof initialData == 'string') initialData = JSON.parse(initialData);

        if (initialData) {
            await router.push(initialData as PageResult);
        }else{
            await router.go(location.pathname);
        }
    })();

    // --- CREATE THE ROOT VUE APP ---
    const App = {
        name: "FictifAppRoot",
        setup() {
            onMounted(() => {
                const preCurtain = document.querySelector(".pre-curtain");
                document.body.classList.add("fictif-app-mounted");
                if (preCurtain) {
                    preCurtain.addEventListener("transitionend", () =>
                        preCurtain.remove()
                    );
                    (preCurtain as any).style.opacity = "0";
                }
            });

            return () =>
                h("div", { id: "fictif-root-wrapper" }, [
                    h(Curtain, {
                        show: progressObj.isLoading.value,
                        message: progressObj.message.value,
                        background: progressObj.background.value,
                    }),
                    page.value && typeof page.value.component == "object"
                        ? h(Display, {
                              key: page.value.url,
                              // @ts-ignore
                              screen: page.value.component,
                              headUpdate (data: HeadData) {
                                  head.update({
                                      title: typeof title == 'function' ? title(data.title || '') : data.title,
                                      meta: typeof meta == 'function' ? meta(data.meta || []) : data.meta,
                                      favicon: typeof favicon == 'function' ? favicon(data.favicon || '') : data.favicon,
                                  });
                              },
                              ...page.value.props,
                          })
                        : undefined,
                ]);
        },
    };

    let app: any;

    if (setup) {
        app = setup({ el: mountTo, App });
    } else {
        const isSsr = isSSR || (mountTo && mountTo.hasAttribute("data-server-rendered"));
        app = isSsr ? createSSRApp(App) : createApp(App);
    }

    /* app.provide('page', page);
    app.provide('props', reactive(page.value.props)); */
    if(mountTo) {
        app.mount(mountTo);
    }
}
