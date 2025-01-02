import { ConfigService } from '@nestjs/config';

const createConfigProvider = <T>(key: string, type: 'string' | 'number' = 'string') => {
  return {
    provide: key,
    useFactory: (configService: ConfigService) => {
      const value = configService.getOrThrow<T>(key);
      return type === 'number' ? Number(value) : value;
    },
    inject: [ConfigService],
  };
};

export const SERVER_URL_PROVIDER = createConfigProvider<string>('SERVER_URL');
export const NODE_ENV_PROVIDER = createConfigProvider<string>('NODE_ENV');
export const PORT_PROVIDER = createConfigProvider<number>('PORT', 'number');
export const MYSQL_ROOT_PASSWORD_PROVIDER = createConfigProvider<string>('MYSQL_ROOT_PASSWORD');
export const MYSQL_DATABASE_PROVIDER = createConfigProvider<string>('MYSQL_DATABASE');
export const MYSQL_HOST_PROVIDER = createConfigProvider<string>('MYSQL_HOST');
export const MYSQL_PORT_PROVIDER = createConfigProvider<number>('MYSQL_PORT', 'number');
export const MYSQL_USERNAME_PROVIDER = createConfigProvider<string>('MYSQL_USERNAME');
export const MYSQL_PASSWORD_PROVIDER = createConfigProvider<string>('MYSQL_PASSWORD');
export const ADMIN_NAME_PROVIDER = createConfigProvider<string>('ADMIN_NAME');
export const ADMIN_PASSWORD_PROVIDER = createConfigProvider<string>('ADMIN_PASSWORD');
export const JWT_SECRET_KEY_PROVIDER = createConfigProvider<string>('JWT_SECRET_KEY');
