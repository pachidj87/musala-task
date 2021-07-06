import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Device } from 'src/modules/devices/schemas/device.schema';
import { GatewayDto } from '../dto/gateway.dto';

export type GatewayDocument = Gateway & Document;

@Schema()
export class Gateway {
  constructor(dto: GatewayDto) {
    this.serial_number = dto.serialNumber;
    this.name = dto.name;
    this.ip_v4_address = dto.ipV4Address;

    if (dto.devices?.length) {
      this.devices = [];

      dto.devices.forEach((deviceDto) => {
        this.devices.push(new Device(deviceDto));
      });
    }
  }

  id?: string;

  @Prop({ required: true, unique: true })
  serial_number!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  ip_v4_address!: string;

  @Prop([
    { type: MongooseSchema.Types.ObjectId, ref: 'Device', autopopulate: true },
  ])
  devices?: Device[];
}

export const GatewaySchema = SchemaFactory.createForClass(Gateway);
