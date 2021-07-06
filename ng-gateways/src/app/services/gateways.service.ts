import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base.service';
import { NotificationsService } from './notifications.service';
import { Gateway } from '../entities/gateway.entity';

@Injectable({
  providedIn: 'root'
})
export class GatewaysService extends BaseService<Gateway> {
  baseEndPoint: string = 'gateways';
  
  constructor(
    protected readonly http: HttpClient,
    protected readonly notificationsService: NotificationsService,
  ) {
    super(http, notificationsService);
  }
}
