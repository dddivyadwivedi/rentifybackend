import { Module } from "@nestjs/common";
import { PropertyController } from "./property.controller";
import { PropertyService } from "./property.service";
import { PassportModule } from "@nestjs/passport";
import { BrevoService } from "src/brevo/brevo.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
      PassportModule.register({
        defaultStrategy: process.env.JWT_DEFAULTSTRATEGY,
      }),
      ConfigModule
    ],
    controllers: [PropertyController],
    providers: [PropertyService,BrevoService],
    exports: [],
  })
export class PropertyModule{}