import { IsAlphanumeric, IsNotEmpty } from 'class-validator';

export class GatewayIdParamDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  gatewayId!: string;
}
