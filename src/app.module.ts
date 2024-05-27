import { Module } from '@nestjs/common';
const ORMConfig = require('./config/typeorm.config')
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import {PropertyModule } from './property/property.module';
import { BrevoModule } from './brevo/brevo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ORMConfig),
    AuthModule,
    PropertyModule,
    BrevoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
