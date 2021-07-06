import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base.service';
import { NotificationsService } from './notifications.service';
import { Device } from '../entities/device.entity';

@Injectable({
  providedIn: 'root'
})
export class DevicesService extends BaseService<Device> {
  baseEndPoint: string = 'devices';

  constructor(
    protected readonly http: HttpClient,
    protected readonly notificationsService: NotificationsService,
  ) {
    super(http, notificationsService);
  }
}
