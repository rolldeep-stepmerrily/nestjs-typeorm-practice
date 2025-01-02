import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import Joi from 'joi';

import { AppController } from './app.controller';
import { ConfigProviderModule } from './common/config-provider';
import { HttpLoggerMiddleware } from './common/middlewares';
import { DatabaseModule } from './database';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SERVER_URL: Joi.string().required(),
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        PORT: Joi.number().default(3000),
        MYSQL_ROOT_PASSWORD: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USERNAME: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        ADMIN_NAME: Joi.string().required(),
        ADMIN_PASSWORD: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
      }),
      isGlobal: true,
      envFilePath: '.env',
      validationOptions: { abortEarly: true },
    }),
    ConfigProviderModule,
    DatabaseModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
