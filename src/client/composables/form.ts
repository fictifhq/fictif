// src/client/composables/form.ts

import { reactive, ref, watch, toRefs, computed, isRef, type Ref } from 'vue';
import { useRouter } from './router.js';

type FormMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
type FormDataType = Record<string, any>;

interface FormOptions<T extends FormDataType> {
    onStart?: () => void;
    onSuccess?: (page: any) => void;
    onError?: (errors: Record<string, string>) => void;
    onFinish?: () => void;
    preserveScroll?: boolean;
    preserveState?: boolean;
    replace?: boolean;
    only?: (keyof T)[];
}

export function useForm<T extends FormDataType>(initialData: T | (() => T)) {
    const resolvedInitialData = typeof initialData === 'function' ? initialData() : initialData;
    const data = reactive({ ...resolvedInitialData });
    const originalData = JSON.parse(JSON.stringify(resolvedInitialData)); // Deep clone

    const errors = reactive<Record<string, string>>({});
    const processing = ref(false);
    const wasSuccessful = ref(false);
    const isDirty = ref(false);

    watch(data, () => {
        isDirty.value = JSON.stringify(data) !== JSON.stringify(originalData);
    }, { deep: true });

    const clearErrors = (...fields: (keyof T)[]) => {
        if (fields.length === 0) {
            Object.keys(errors).forEach(key => delete errors[key]);
        } else {
            fields.forEach(field => delete errors[field as string]);
        }
    };

    const reset = (...fields: (keyof T)[]) => {
        if (fields.length === 0) {
            Object.assign(data, JSON.parse(JSON.stringify(originalData)));
        } else {
            fields.forEach(field => {
                (data as any)[field] = originalData[field as string];
            });
        }
        isDirty.value = false;
        clearErrors();
    };

    const router = useRouter();

    const submit = (method: FormMethod, url: string, options: FormOptions<T> = {}) => {
        const visitOptions = {
            method,
            body: { ...data },
            ...(options as any),
        };

        processing.value = true;
        wasSuccessful.value = false;
        options.onStart?.();
        clearErrors();

        const handleSuccess = (payload: { page: any }) => {
            wasSuccessful.value = true;
            isDirty.value = false;
            Object.assign(originalData, JSON.parse(JSON.stringify(data)));
            options.onSuccess?.(payload.page);
        };

        const handleError = (payload: { error: any }) => {
            const error = payload.error;
            if (error?.response?.status === 422) {
                const validationErrors = error.response.data?.errors || {};
                Object.assign(errors, validationErrors);
                options.onError?.(errors);
            }
        };

        const handleFinish = () => {
            processing.value = false;
            router.off('push', handleSuccess);
            router.off('error', handleError);
            options.onFinish?.();
        };

        router.once('push', handleSuccess);
        router.once('error', handleError);
        router.visit(url, visitOptions).finally(handleFinish);
    };

    // Build the final form object with field refs + controls
    const form = reactive({
        ...toRefs(data),
        errors,
        isDirty,
        processing,
        wasSuccessful,
        submit,
        get: (url: string, options?: FormOptions<T>) => submit('get', url, options),
        post: (url: string, options?: FormOptions<T>) => submit('post', url, options),
        put: (url: string, options?: FormOptions<T>) => submit('put', url, options),
        patch: (url: string, options?: FormOptions<T>) => submit('patch', url, options),
        delete: (url: string, options?: FormOptions<T>) => submit('delete', url, options),
        reset,
        clearErrors,
    });

    return form;
}
