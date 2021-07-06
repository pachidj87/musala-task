import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CreateableComponent } from 'src/app/modules/shared/components/createable/createable.component';
import { Gateway } from 'src/app/entities/gateway.entity';
import { GatewaysService } from 'src/app/services/gateways.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class CreateComponent extends CreateableComponent implements OnInit {

  constructor(
    protected readonly service: GatewaysService,
    protected readonly notificationService: NotificationsService,
    protected readonly router: Router,
    ) {
    super(service);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      serial_number: new FormControl('', [Validators.required, Validators.pattern(/[0-9]+$/)]),
      gateway_name: new FormControl('', [Validators.required]),
      ip_v4_address: new FormControl('', [Validators.pattern(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/)])
    })
  }

  submit(): void {
    const gateway = this.loadData();

    this.serviceSubscription = this.service.create<Gateway>(gateway)
      .subscribe((response: Gateway) => {
        if (!response) return;
        
        this.notificationService.success(`Gateway ${response.name} sucessfully created`);
        this.router.navigate(['/gateways']);
      });
  }

  protected loadData(): Gateway {
    const form = this.form;
    const gateway = new Gateway({
      serialNumber: form.get('serial_number')?.value.trim(),
      name: form.get('gateway_name')?.value.trim(),
      ipV4Address: form.get('ip_v4_address')?.value.trim()
    });

    return gateway;
  }
}
