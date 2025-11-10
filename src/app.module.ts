import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";
import { ConfigModule } from "@nestjs/config";
import { EnvConfiguration } from "./common/config/env.config";
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      isGlobal: true,
    }),
    AuthModule,
    ProductsModule,
    PrismaModule,
  ],
})
export class AppModule {}
