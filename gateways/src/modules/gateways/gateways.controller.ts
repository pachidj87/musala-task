import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';

import { GatewaysService } from './gateways.service';
import { GatewayDto } from './dto/gateway.dto';
import { DatatablesRequestDto } from 'src/shared/dto/datatables-request.dto';
import { IdParamDto } from 'src/shared/dto/id-param.dto';

@Controller('gateways')
export class GatewaysController {
  constructor(private readonly gatewaysService: GatewaysService) {}

  @Post()
  async create(@Body() createGatewayDto: GatewayDto) {
    return this.gatewaysService.create(createGatewayDto);
  }

  @Get()
  async findAll() {
    return this.gatewaysService.findAll();
  }

  @Get(':id')
  async findOne(@Param() param: IdParamDto) {
    return this.gatewaysService.findOne(param.id);
  }

  @Put(':id')
  async update(@Param() param: IdParamDto, @Body() gatewayDto: GatewayDto) {
    return this.gatewaysService.update(param.id, gatewayDto);
  }

  @Delete(':id')
  async remove(@Param() param: IdParamDto) {
    return this.gatewaysService.remove(param.id);
  }

  @Post('datatables')
  async datatables(@Body() params: DatatablesRequestDto) {
    return await this.gatewaysService.datatables(params);
  }
}
