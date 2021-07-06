import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { DeviceDto } from '../dto/device.dto';
import { DeviceStatus } from '../enums/device-status.enum';

export type DeviceDocument = Device & Document;

@Schema()
export class Device {
  constructor(dto: DeviceDto) {
    if (dto) {
      this.uid = dto.uid;
      this.vendor = dto.vendor;
      this.created_at = dto.createdAt;
      this.status = dto.status;
      this.gatewayId = dto.gatewayId;
    }
  }

  id!: string;

  @Prop({ required: true, type: String })
  uid!: string;

  @Prop({ required: true, type: String })
  vendor!: string;

  @Prop({ type: Date, default: () => Date.now() })
  created_at?: string;

  @Prop({
    type: String,
    required: true,
    enum: [DeviceStatus.online, DeviceStatus.offline],
    default: DeviceStatus.online,
  })
  status!: DeviceStatus;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Gateway',
  })
  gatewayId!: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
