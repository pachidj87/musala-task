import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { DatatablesRequestDto } from 'src/shared/dto/datatables-request.dto';
import { DataTablesResultsDto } from 'src/shared/dto/datatables-results.dto';
import { Device, DeviceDocument } from './schemas/device.schema';
import { DeviceDto } from './dto/device.dto';
import { BaseService } from 'src/shared/services/base.service';

@Injectable()
export class DevicesService extends BaseService {
  protected columns: string[] = ['uid', 'vendor', 'status'];

  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
  ) {
    super();
  }

  async create(deviceDto: DeviceDto): Promise<DeviceDto> {
    try {
      const devicesCount = await this.count(deviceDto.gatewayId);
      if (devicesCount > parseInt(process.env.MAX_DEVICE_PER_GATEWAY)) {
        throw new BadRequestException(
          `Max device number of ${process.env.MAX_DEVICE_PER_GATEWAY} reached!`,
        );
      }

      const device = new Device(deviceDto);
      const model = new this.deviceModel(device);

      const res = await model.save();

      return Promise.resolve(new DeviceDto(res));
    } catch (error) {
      Logger.error(error);

      this.handleError(error);
    }
  }

  async findAll(): Promise<DeviceDto[]> {
    try {
      const devices = await this.deviceModel.find().exec();

      const dtos: DeviceDto[] = [];

      devices.forEach((device: Device) => {
        dtos.push(new DeviceDto(device));
      });

      return Promise.resolve(dtos);
    } catch (error) {
      Logger.error(error);

      this.handleError(error);
    }
  }

  async findOne(id: string): Promise<DeviceDto> {
    try {
      const device = await this.deviceModel.findById(id).exec();

      if (!device) throw new NotFoundException();

      const dto = new DeviceDto(device);

      return Promise.resolve(dto);
    } catch (error) {
      Logger.error(error);

      this.handleError(error);
    }
  }

  async update(id: string, deviceDto: DeviceDto): Promise<DeviceDto> {
    try {
      const device = await this.deviceModel
        .findByIdAndUpdate(
          id,
          {
            uid: deviceDto.uid,
            vendor: deviceDto.vendor,
            status: deviceDto.status,
          },
          { new: true }, // Return the updated document
        )
        .exec();

      if (!device) throw new NotFoundException();

      const dto = new DeviceDto(device);

      return Promise.resolve(dto);
    } catch (error) {
      Logger.error(error);

      this.handleError(error);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const device = await this.deviceModel.findByIdAndRemove(id).exec();

      if (!device) throw new NotFoundException();

      return Promise.resolve(true);
    } catch (error) {
      Logger.error(error);

      this.handleError(error);
    }
  }

  async datatables(
    gatewayId: string,
    params: DatatablesRequestDto,
  ): Promise<DataTablesResultsDto<DeviceDto>> {
    // eslint-disable-next-line prefer-const
    let [query, options] = this.processTableParams(params);

    try {
      query = { ...query, gatewayId: gatewayId };

      const devices = await this.deviceModel
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .paginate(query, options);

      const total =
        devices.total > params.length
          ? await this.deviceModel
              .where({ gatewayId: gatewayId })
              .countDocuments()
              .exec()
          : devices.total;

      const deviceDtos: DeviceDto[] = [];

      devices.docs.map((device) => {
        deviceDtos.push(new DeviceDto(device));
      });

      return Promise.resolve({
        data: deviceDtos,
        draw: params.draw,
        recordsFiltered: devices.total,
        recordsTotal: total,
      });
    } catch (error) {
      Logger.error(error);

      this.handleError(error);
    }
  }

  async count(gatewayId: string): Promise<number> {
    try {
      const count = await this.deviceModel
        .where({ gatewayId: gatewayId })
        .countDocuments()
        .exec();

      return Promise.resolve(count);
    } catch (error) {
      Logger.error(error);

      this.handleError(error);
    }
  }
}
