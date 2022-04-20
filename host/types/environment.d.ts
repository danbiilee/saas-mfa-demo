declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production';
    readonly PUBLIC_URL: string;
    readonly SAAS_FE_MF_NAME_APP1: string;
    readonly SAAS_FE_MF_NAME_APP2: string;
    readonly SAAS_FE_MF_URL_APP1: string;
    readonly SAAS_FE_MF_URL_APP2: string;
  }
}
