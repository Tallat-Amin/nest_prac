import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [HomeModule, AuthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
