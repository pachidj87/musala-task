export class Gateway {
  constructor(gateway: any) {
    if (gateway) {
      this.serialNumber = gateway.serialNumber;
      this.name = gateway.name;
      this.ipV4Address = gateway.ipV4Address;
    }
  }

  id?: string;

  serialNumber!: string;

  name!: string;

  ipV4Address!: string;
}
