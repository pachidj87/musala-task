import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CreateComponent } from '../create/create.component';
import { DevicesService } from 'src/app/services/devices.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { GatewaysService } from 'src/app/services/gateways.service';
import { Gateway } from 'src/app/entities/gateway.entity';
import { Device } from 'src/app/entities/device.entity';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.sass']
})
export class UpdateComponent extends CreateComponent implements OnInit, OnDestroy {

  deviceId!: string;
  deviceUID!: string;

  constructor(
    protected readonly service: DevicesService,
    protected readonly notificationService: NotificationsService,
    protected readonly gatewaysService: GatewaysService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly router: Router,
  ) {
    super(service, notificationService, gatewaysService, activatedRoute, router);
  }

  protected getRouteParams(): void {
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params) => {
      this.gatewayId = params['gid'];
      this.deviceId = params['id'];

      const state = history.state[0];

      if (state?.data) {
        this.gatewayName = state?.data;
      } else {
        this.gatewaySubscription = this.gatewaysService.read<Gateway>(params['gid'])
          .subscribe((gateway: Gateway) => {
            if (!gateway) return;

            this.gatewayName = gateway.name;
          });
      }

      this.serviceSubscription = this.service.read<Device>(params['id'])
        .subscribe((device: Device) => {
          if (!device) return;

          this.deviceUID = device.uid;

          this.form.setValue({
            uid: device.uid,
            vendor: device.vendor,
            status: device.status
          });
        })
    })
  }

  submit(): void {
    const device = this.loadData();

    this.serviceSubscription = this.service.update<Device>(this.deviceId, device)
      .subscribe((response: Device) => {
        if (!response) return;

        this.notificationService.success(`Device UID: <${response.uid}> sucessfully updated`);
        this.router.navigate(['/devices/gateway/' + this.gatewayId])
      });
  }
}
