/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BE_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

export type Prettify<T> = {
    [K in keyof T]: T[K];
};
