import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { Device, DeviceSchema } from './schemas/device.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Device.name,
        useFactory: () => {
          const schema = DeviceSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-paginate'));

          return schema;
        },
      },
    ]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
