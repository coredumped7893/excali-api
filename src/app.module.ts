import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CanvasModule } from './canvas/canvas.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      host: process.env.DATABASE_HOST || 'localhost',
      username: process.env.DATABASE_USERNAME || 'excali_studio',
      password: process.env.DATABASE_PASSWORD || 'excali_studio',
      database: process.env.DATABASE_NAME || 'excali_studio',
      autoLoadEntities: true,
      logging: 'all',
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    CanvasModule,
    WorkspaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
