import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';

import { DevicesService } from './devices.service';
import { DeviceDto } from './dto/device.dto';
import { IdParamDto } from 'src/shared/dto/id-param.dto';
import { DatatablesRequestDto } from 'src/shared/dto/datatables-request.dto';
import { GatewayIdParamDto } from 'src/shared/dto/gateway-id-param.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  create(@Body() createDeviceDto: DeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @Get()
  findAll() {
    return this.devicesService.findAll();
  }

  @Get('count')
  count(@Query() param: GatewayIdParamDto) {
    return this.devicesService.count(param.gatewayId);
  }

  @Get(':id')
  findOne(@Param() param: IdParamDto) {
    return this.devicesService.findOne(param.id);
  }

  @Put(':id')
  update(@Param() param: IdParamDto, @Body() updateDeviceDto: DeviceDto) {
    return this.devicesService.update(param.id, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param() param: IdParamDto) {
    return this.devicesService.remove(param.id);
  }

  @Post('datatables')
  datatables(
    @Query() param: GatewayIdParamDto,
    @Body() params: DatatablesRequestDto,
  ) {
    return this.devicesService.datatables(param.gatewayId, params);
  }
}
