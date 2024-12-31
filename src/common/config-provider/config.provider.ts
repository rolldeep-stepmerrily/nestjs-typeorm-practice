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
export const ADMIN_NAME_PROVIDER = createConfigProvider<string>('ADMIN_NAME');
export const ADMIN_PASSWORD_PROVIDER = createConfigProvider<string>('ADMIN_PASSWORD');
