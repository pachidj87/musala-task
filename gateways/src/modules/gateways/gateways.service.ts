import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { DatatablesRequestDto } from '../../shared/dto/datatables-request.dto';
import { DataTablesResultsDto } from '../../shared/dto/datatables-results.dto';
import { Gateway, GatewayDocument } from './schemas/gateway.schema';
import { GatewayDto } from './dto/gateway.dto';
import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class GatewaysService extends BaseService {
  protected columns: string[] = ['serial_number', 'name', 'ip_v4_address'];

  constructor(
    @InjectModel(Gateway.name) private gatewayModel: Model<GatewayDocument>,
  ) {
    super();
  }

  async create(gatewayDto: GatewayDto): Promise<GatewayDto> {
    try {
      const gateway = new Gateway(gatewayDto);
      const model = new this.gatewayModel(gateway);

      const res = await model.save();

      return Promise.resolve(new GatewayDto(res));
    } catch (error) {
      Logger.error(error);

      this.handleError(error);
    }
  }

  async findAll() {
    return `This action returns all gateways`;
  }

  async findOne(id: string): Promise<GatewayDto> {
    try {
      const gateway = await this.gatewayModel.findById(id).exec();

      if (!gateway) throw new NotFoundException();

      const dto = new GatewayDto(gateway);

      return Promise.resolve(dto);
    } catch (error) {
      Logger.error(error);

      this.handleError(error);
    }
  }

  async update(id: string, gatewayDto: GatewayDto): Promise<GatewayDto> {
    try {
      const gateway = await this.gatewayModel
        .findByIdAndUpdate(
          id,
          {
            name: gatewayDto.name,
            serial_number: gatewayDto.serialNumber,
            ip_v4_address: gatewayDto.ipV4Address,
          },
          { new: true }, // Return the updated document
        )
        .exec();

      if (!gateway) throw new NotFoundException();

      const dto = new GatewayDto(gateway);

      return Promise.resolve(dto);
    } catch (error) {
      Logger.error(error);

      this.handleError(error);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const gateway = await this.gatewayModel.findByIdAndRemove(id).exec();

      if (!gateway) throw new NotFoundException();

      return Promise.resolve(true);
    } catch (error) {
      Logger.error(error);

      this.handleError(error);
    }
  }

  async datatables(
    params: DatatablesRequestDto,
  ): Promise<DataTablesResultsDto<GatewayDto>> {
    const [query, options] = this.processTableParams(params);

    try {
      const gateways = await this.gatewayModel
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .paginate(query, options);

      const total = await this.gatewayModel.estimatedDocumentCount().exec();
      const gatewayDtos: GatewayDto[] = [];

      gateways.docs.map((gateway) => {
        gatewayDtos.push(new GatewayDto(gateway));
      });

      return Promise.resolve({
        data: gatewayDtos,
        draw: params.draw,
        recordsFiltered: gateways.total,
        recordsTotal: total,
      });
    } catch (error) {
      Logger.error(error);

      this.handleError(error);
    }
  }
}
