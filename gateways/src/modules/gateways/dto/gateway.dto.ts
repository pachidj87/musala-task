import { IsNotEmpty, IsIP, IsNumberString } from 'class-validator';
import { DeviceDto } from 'src/modules/devices/dto/device.dto';
import { Gateway } from '../schemas/gateway.schema';

export class GatewayDto {
  constructor(gateway: Gateway) {
    if (gateway) {
      this.id = gateway.id;
      this.serialNumber = gateway.serial_number;
      this.name = gateway.name;
      this.ipV4Address = gateway.ip_v4_address;

      if (gateway.devices?.length) {
        this.devices = [];

        gateway.devices.forEach((device) => {
          this.devices.push(new DeviceDto(device));
        });
      }
    }
  }

  id?: string;

  @IsNumberString()
  @IsNotEmpty()
  serialNumber: string;

  @IsNotEmpty()
  name: string;

  @IsIP()
  @IsNotEmpty()
  ipV4Address: string;

  devices?: DeviceDto[];
}
