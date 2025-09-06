/// <reference types="vite/client" />
/** biome-ignore-all lint/nursery/useConsistentTypeDefinitions: interfaces are used to override the vite types */
/** biome-ignore-all lint/correctness/noUnusedVariables: interface overrides the vite types */

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
