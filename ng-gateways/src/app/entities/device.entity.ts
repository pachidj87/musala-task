import { DeviceStatus } from '../enums/device-status.enum';

export class Device {
  constructor(device: any) {
    if (device) {
      this.id = device.id;
      this.uid = device.uid;
      this.vendor = device.vendor;
      this.createdAt = device.createdAt;
      this.status = device.status;
      this.gatewayId = device.gatewayId;
    }
  }

  id!: string;

  uid!: string;

  vendor!: string;

  createdAt!: string;

  status!: DeviceStatus;

  gatewayId!: string;
}
