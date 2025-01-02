declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_URL: string;
    NODE_ENV: 'development' | 'production';
    PORT: number;
    MYSQL_ROOT_PASSWORD: string;
    MYSQL_DATABASE: string;
    MYSQL_HOST: string;
    MYSQL_PORT: number;
    MYSQL_USERNAME: string;
    MYSQL_PASSWORD: string;
    ADMIN_NAME: string;
    ADMIN_PASSWORD: string;
    JWT_SECRET_KEY: string;
  }
}
