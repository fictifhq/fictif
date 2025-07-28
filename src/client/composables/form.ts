import { reactive, ref, watch, toRefs, computed, type Ref } from 'vue';
// We import directly from your provided files.
import { useRouter } from './router';
import type { VisitOptions, Page } from '../types';

// --- UTILITY FUNCTIONS (Using a simple, robust cloner) ---

/**
 * A simple, dependency-free deep-cloning function.
 * Handles plain objects, arrays, Dates, and primitives.
 * For form data, this is almost always sufficient and better than JSON.parse(JSON.stringify).
 * @param obj The object to clone.
 */
function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as any;
    }

    // File objects are not cloned, their reference is kept. This is critical for uploads.
    if (obj instanceof File) {
        return obj;
    }

    if (Array.isArray(obj)) {
        const arrCopy = [] as any[];
        for (let i = 0; i < obj.length; i++) {
            arrCopy[i] = deepClone(obj[i]);
        }
        return arrCopy as any;
    }

    const objCopy = {} as { [key: string]: any };
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            objCopy[key] = deepClone(obj[key]);
        }
    }
    return objCopy as T;
}


// --- TYPE DEFINITIONS ---
// These types align perfectly with your existing system.

type FormMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type FormDataType = Record<string, any>;
type FormErrors = Record<string, string>;

// We create a Progress type as it's not in your core types.
interface Progress {
    percentage: number;
    // You could add other properties like loaded, total if your visit implementation provides them.
}

// These options are passed to the individual `form.post()` calls.
// It extends your router's VisitOptions for full compatibility.
interface FormSubmitOptions extends Omit<VisitOptions, 'method' | 'body'> {
    onSuccess?: (page: Page) => void;
    // We expect the router to emit an object with an 'error' property on failure.
    onError?: (errors: FormErrors) => void;
    onStart?: () => void;
    onFinish?: () => void;
    onProgress?: (progress: Progress) => void;
}

// These options are passed to the `useForm()` composable itself.
interface UseFormOptions<T extends FormDataType> {
    /** A function to transform the form data before it's sent to the server. */
    transform?: (data: T) => object;
    /** The timeout in ms for which the `recentlySuccessful` state remains true. Defaults to 2000ms. */
    successfulTimeout?: number;
}

// The definitive, strongly-typed interface for the returned form object.
export interface Form<T extends FormDataType> {
    data: T;
    isDirty: Ref<boolean>;
    errors: FormErrors;
    hasErrors: Ref<boolean>;
    processing: Ref<boolean>;
    progress: Ref<Progress | null>;
    wasSuccessful: Ref<boolean>;
    recentlySuccessful: Ref<boolean>;
    submit: (method: FormMethod, url: string, options?: FormSubmitOptions) => void;
    get: (url: string, options?: FormSubmitOptions) => void;
    post: (url: string, options?: FormSubmitOptions) => void;
    put: (url: string, options?: FormSubmitOptions) => void;
    patch: (url: string, options?: FormSubmitOptions) => void;
    delete: (url: string, options?: FormSubmitOptions) => void;
    process: <TResult>(callback: () => Promise<TResult>) => Promise<TResult>;
    reset: (...fields: (keyof T)[]) => void;
    clearErrors: (...fields: (keyof T)[]) => void;
    setData: (key: keyof T, value: any) => void;
    // cancel: () => void; // Cancellation needs router support. See note below.
    [key: string]: any;
}


// --- THE COMPOSABLE ---

export function useForm<T extends FormDataType>(
    initialData: T | (() => T),
    options: UseFormOptions<T> = {}
): Form<T> {
    const resolvedInitialData = typeof initialData === 'function' ? initialData() : initialData;

    const data: T = reactive(deepClone(resolvedInitialData)) as T;
    const originalData: T = deepClone(resolvedInitialData);
    const errors: FormErrors = reactive({});

    const processing = ref(false);
    const wasSuccessful = ref(false);
    const recentlySuccessful = ref(false);
    const progress = ref<Progress | null>(null);
    const isDirty = ref(false);

    let recentlySuccessfulTimeoutId: number | null = null;
    const router = useRouter();

    watch(data, () => {
        isDirty.value = JSON.stringify(data) !== JSON.stringify(originalData);
    }, { deep: true });

    const hasErrors = computed(() => Object.keys(errors).length > 0);

    const clearErrors = (...fields: (keyof T)[]) => {
        const fieldsToClear = fields.length > 0 ? fields : Object.keys(errors);
        fieldsToClear.forEach(field => {
            delete errors[field as string];
        });
    };

    const reset = (...fields: (keyof T)[]) => {
        const fieldsToReset = fields.length > 0 ? fields : Object.keys(originalData);
        fieldsToReset.forEach(field => {
            (data as any)[field] = originalData[field as keyof T];
        });
        isDirty.value = false;
        wasSuccessful.value = false;
        recentlySuccessful.value = false;
        if (recentlySuccessfulTimeoutId) clearTimeout(recentlySuccessfulTimeoutId);
        clearErrors();
    };

    const setData = (key: keyof T, value: any) => {
        (data as any)[key] = value;
    };

    const process = async <TResult>(callback: () => Promise<TResult>): Promise<TResult> => {
        processing.value = true;
        try {
            return await callback();
        } finally {
            processing.value = false;
        }
    };

    const submit = (method: FormMethod, url: string, submitOptions: FormSubmitOptions = {}) => {
        // Your router's `visit` method takes `body` for the data.
        const transformedData = options.transform ? options.transform(data) : data;
        const visitOptions: VisitOptions = {
            ...submitOptions,
            method: method,
            body: transformedData,
        };

        processing.value = true;
        wasSuccessful.value = false;
        recentlySuccessful.value = false;
        if (recentlySuccessfulTimeoutId) clearTimeout(recentlySuccessfulTimeoutId);
        clearErrors();
        submitOptions.onStart?.();

        const handleSuccess = (payload: { page: Page }) => {
            Object.assign(originalData, deepClone(data));
            isDirty.value = false;
            wasSuccessful.value = true;
            recentlySuccessful.value = true;
            submitOptions.onSuccess?.(payload.page);

            recentlySuccessfulTimeoutId = window.setTimeout(
                () => (recentlySuccessful.value = false),
                options.successfulTimeout ?? 2000
            );
        };

        const handleError = (payload: { error: any }) => {
            const error = payload.error;
            // You'll need to decide on a consistent error structure from your server.
            // A common pattern is for a 422 response to have an `errors` object in the body.
            // We assume here that if `error.response.data.errors` exists, it contains the validation errors.
            const validationErrors = error?.response?.data?.errors ?? {};
            Object.assign(errors, validationErrors);
            submitOptions.onError?.(errors);
        };

        const handleFinish = () => {
            processing.value = false;
            // Clean up event listeners to prevent memory leaks
            router.off('push', handleSuccess);
            router.off('error', handleError);
            // We can also clean up the finish handler itself
            router.off('ready', handleFinish);
            router.off('navigated', handleFinish);
            submitOptions.onFinish?.();
        };

        // We listen to the router's events just for this single submission.
        router.once('push', handleSuccess);
        router.once('error', handleError);
        // 'ready' or 'navigated' can serve as a `onFinish` signal. 'ready' is good.
        router.once('ready', handleFinish);

        // Let's assume your router needs to be modified to handle progress.
        // If your router's visit method supported an `onProgress` callback, you would pass it here.
        // For now, we will just call the form's onProgress if it exists.
        // visitOptions.onProgress = submitOptions.onProgress;

        router.visit(url, visitOptions).catch(handleError);
    };

    const form = reactive({
        ...toRefs(data),
        data,
        isDirty,
        errors,
        hasErrors,
        processing,
        progress,
        wasSuccessful,
        recentlySuccessful,
        submit,
        get: (url: string, opts: FormSubmitOptions) => submit('GET', url, opts),
        post: (url: string, opts: FormSubmitOptions) => submit('POST', url, opts),
        put: (url: string, opts: FormSubmitOptions) => submit('PUT', url, opts),
        patch: (url: string, opts: FormSubmitOptions) => submit('PATCH', url, opts),
        delete: (url: string, opts: FormSubmitOptions) => submit('DELETE', url, opts),
        process,
        reset,
        clearErrors,
        setData,
    });

    return form as Form<T>;
}