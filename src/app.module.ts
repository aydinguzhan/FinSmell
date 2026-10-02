import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { UserCreateEntity } from './users/entities/create-user.entity.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { CorsMiddleware } from './conf/middleware/cors.middleware.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DATABASE_HOST') ?? 'localhost',
        port: Number(configService.get<string>('DATABASE_PORT') ?? 5432),
        username: configService.get<string>('DATABASE_USER') ?? 'finsmell_user',
        password: configService.get<string>('DATABASE_PASSWORD') ?? 'finsmell_dev_password',
        database: configService.get<string>('DATABASE_NAME') ?? 'finsmell_db',
        entities: [UserCreateEntity],
        synchronize: configService.get<string>('DATABASE_SYNCHRONIZE') === 'true',
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes('*');
  }
}
