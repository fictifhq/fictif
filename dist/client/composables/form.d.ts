import { Ref } from 'vue';
import { VisitOptions, Page } from '../types';
type FormMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type FormDataType = Record<string, any>;
type FormErrors = Record<string, string>;
interface Progress {
    percentage: number;
}
interface FormSubmitOptions extends Omit<VisitOptions, 'method' | 'body'> {
    onSuccess?: (page: Page) => void;
    onError?: (errors: FormErrors) => void;
    onStart?: () => void;
    onFinish?: () => void;
    onProgress?: (progress: Progress) => void;
}
interface UseFormOptions<T extends FormDataType> {
    /** A function to transform the form data before it's sent to the server. */
    transform?: (data: T) => object;
    /** The timeout in ms for which the `recentlySuccessful` state remains true. Defaults to 2000ms. */
    successfulTimeout?: number;
}
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
    [key: string]: any;
}
export declare function useForm<T extends FormDataType>(initialData: T | (() => T), options?: UseFormOptions<T>): Form<T>;
export {};
//# sourceMappingURL=form.d.ts.map