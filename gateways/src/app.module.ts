import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { DevicesModule } from './modules/devices/devices.module';
import { GatewaysModule } from './modules/gateways/gateways.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }), // Load config module to parse .env file
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_CONNECTION_URI, // Initialize mongo database connection
      }),
    }),
    GatewaysModule,
    DevicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
