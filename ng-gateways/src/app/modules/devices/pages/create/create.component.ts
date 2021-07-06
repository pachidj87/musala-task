import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CreateableComponent } from 'src/app/modules/shared/components/createable/createable.component';
import { DevicesService } from 'src/app/services/devices.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { DeviceStatus } from 'src/app/enums/device-status.enum';
import { Device } from 'src/app/entities/device.entity';
import { GatewaysService } from 'src/app/services/gateways.service';
import { Gateway } from 'src/app/entities/gateway.entity';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class CreateComponent extends CreateableComponent implements OnInit, OnDestroy {

  gatewayId!: string;
  gatewayName!: string;
  Status = DeviceStatus;

  activatedRouteSubscription!: Subscription;
  gatewaySubscription!: Subscription;

  constructor(
    protected readonly service: DevicesService,
    protected readonly notificationService: NotificationsService,
    protected readonly gatewaysService: GatewaysService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly router: Router,
  ) {
    super(service);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      uid: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      vendor: new FormControl('', [Validators.required]),
      status:  new FormControl(DeviceStatus.online)
    });

    this.getRouteParams();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.gatewaySubscription && this.gatewaySubscription.unsubscribe();
    this.activatedRouteSubscription && this.activatedRouteSubscription.unsubscribe();
  }

  submit(): void {
    const device = this.loadData();

    this.serviceSubscription = this.service.create<Device>(device)
      .subscribe((response: Device) => {
        if (!response) return;

        this.notificationService.success(`Device UID: <${response.uid}> sucessfully created`);
        this.router.navigate(['/devices/gateway/' + this.gatewayId])
      });
  }

  protected loadData(): Device {
    const form = this.form;
    const device = new Device({
      uid: form.get('uid')?.value.trim(),
      vendor: form.get('vendor')?.value.trim(),
      status: form.get('status')?.value.trim(),
      gatewayId: this.gatewayId.trim()
    });

    return device;
  }

  protected getRouteParams(): void {
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params) => {
      this.gatewayId = params['gid'];

      const state = history.state[0];

      if (state?.data) {
        this.gatewayName = state?.data;
      } else {
        this.gatewaySubscription = this.gatewaysService.read<Gateway>(params['gid'])
          .subscribe((gateway: Gateway) => {
            this.gatewayName = gateway.name;
          });
      }
    });
  }

}
