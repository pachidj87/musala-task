import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CreateComponent } from '../create/create.component';
import { GatewaysService } from 'src/app/services/gateways.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Gateway } from 'src/app/entities/gateway.entity';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.sass']
})
export class UpdateComponent extends CreateComponent implements OnInit, OnDestroy {
  private activatedRouteSubscription!: Subscription;

  gatewayId!: string;
  gatewayName!: string;

  constructor(
    protected readonly service: GatewaysService,
    protected readonly notificationService: NotificationsService,
    protected readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    super(service, notificationService, router);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.activatedRouteSubscription = this.activatedRoute.params.subscribe(params => {
      this.gatewayId = params['id'];

      this.serviceSubscription = this.service.read<Gateway>(params['id'])
        .subscribe((gateway: Gateway) => {
          if (!gateway) return;

          this.gatewayName = gateway.name;

          this.form.setValue({
            serial_number: gateway.serialNumber,
            gateway_name: gateway.name,
            ip_v4_address: gateway.ipV4Address
          });
        });
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.activatedRouteSubscription && this.activatedRouteSubscription.unsubscribe();
  }

  submit(): void {
    const gateway = this.loadData();

    this.serviceSubscription = this.service.update<Gateway>(this.gatewayId, gateway)
      .subscribe((response: Gateway) => {
        if (!response) return;
        
        this.notificationService.success(`Gateway ${response.name} sucessfully updated`);
        this.router.navigate(['/gateways']);
      });
  }
}
