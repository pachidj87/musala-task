import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GatewaysService } from './gateways.service';
import { GatewaysController } from './gateways.controller';
import { Gateway, GatewaySchema } from './schemas/gateway.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Gateway.name,
        useFactory: () => {
          const schema = GatewaySchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-paginate'));

          return schema;
        },
      },
    ]),
  ],
  controllers: [GatewaysController],
  providers: [GatewaysService],
})
export class GatewaysModule {}
