/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ZEFFY_FOUNDING_MEMBER_URL: string
  readonly VITE_ZEFFY_PATRON_URL: string
  readonly VITE_ZEFFY_CHAMPION_URL: string
  readonly VITE_ZEFFY_BUILDER_URL: string
  readonly VITE_SENTRY_DSN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
