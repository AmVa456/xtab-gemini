/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GEMINI_API_KEY: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_DASHBOARD_ENABLED: string
  readonly VITE_DASHBOARD_API_URL: string
  readonly VITE_DASHBOARD_API_KEY: string
  readonly VITE_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
