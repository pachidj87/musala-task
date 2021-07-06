import {
  HttpException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { DatatablesRequestDto } from '../dto/datatables-request.dto';

declare type QueryOptions = {
  [x: string]: any;
};

export abstract class BaseService {
  protected columns!: string[];

  protected processTableParams(params: DatatablesRequestDto): QueryOptions[] {
    let options: QueryOptions = params.start
      ? { limit: params.length, offset: params.start }
      : { limit: params.length };

    if (params.order?.length) {
      const order = {};

      params.order.forEach((o) => {
        order[this.columns[o.column]] = o.dir;
      });

      options = { ...options, sort: order };
    }

    // @TODO implement filters
    return [{}, { ...options, lean: true }];
  }

  protected handleError(error): HttpException | void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    switch (error.code) {
      case 11000: // Duplicated key error
        const keys: string[] = [];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        for (const prop in error.keyValue) {
          keys.push(prop);
        }

        error.description = `Duplicated key error [${keys.join(',')}]`;

        throw new BadRequestException(error);
      default:
        throw new InternalServerErrorException(error);
    }
  }
}
