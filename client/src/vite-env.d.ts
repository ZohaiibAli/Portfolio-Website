/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the contact API, e.g. https://api.example.com */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
