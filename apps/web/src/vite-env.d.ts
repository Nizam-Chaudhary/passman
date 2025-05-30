/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly BE_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
