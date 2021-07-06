import { IsAlphanumeric, IsNotEmpty } from 'class-validator';

export class IdParamDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  id!: string;
}
