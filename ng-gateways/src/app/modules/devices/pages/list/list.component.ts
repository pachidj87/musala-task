import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataTableDirective } from 'angular-datatables';

import { ListableComponent } from 'src/app/modules/shared/components/listable/listable.component';
import { DevicesService } from 'src/app/services/devices.service';
import { Device } from 'src/app/entities/device.entity';
import { DataTablesResponse } from 'src/app/entities/datatables-response.entity';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Subscription } from 'rxjs';
import { GatewaysService } from 'src/app/services/gateways.service';
import { Gateway } from 'src/app/entities/gateway.entity';
import { environment } from 'src/environments/environment';
import { DeviceStatus } from 'src/app/enums/device-status.enum';

/**
 * ListComponent
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent extends ListableComponent implements OnInit {
  /**
   * Reference the table object
   */
  @ViewChild(DataTableDirective, { static: false })
  protected readonly datatable!: DataTableDirective;

  gatewayId!: string;
  gatewayName!: string;
  maxReached = true;

  activatedRouteSubscription!: Subscription;
  gatewaySubscription!: Subscription;

  /**
   * Devices ListComponent constructor
   *
   * @param router: Router Router object
   */
  constructor(
    protected readonly notificationService: NotificationsService,
    protected readonly devicesService: DevicesService,
    protected readonly gatewaysService: GatewaysService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly router: Router,
  ) {
    super(notificationService, devicesService, router);
  }

  ngOnInit(): void {
    const self = this;

    this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params) => {
      self.gatewayId = params['gid'];

      const state = history.state[0];

      if (state?.data) {
        self.gatewayName = state?.data;
      } else {
        self.gatewaySubscription = self.gatewaysService.read<Gateway>(params['gid'])
          .subscribe((gateway: Gateway) => {
            self.gatewayName = gateway.name;
          });
      }
    });

    self.tableOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      stateSave: true,
      ajax: (dataTablesParameters: any, callback) => {
        // Is not the best way but for task purpose works :D
        this.devicesService.extraParams = '?gatewayId=' + self.gatewayId;

        self.tableSubscription = self.devicesService.datatables<Device>(dataTablesParameters)
          .subscribe((response: DataTablesResponse<Device>) => {
            if (!response) return;

            self.maxReached = response.data.length >= environment.constants.maxDevicesPerGatewayAllowed;

            callback({
              recordsTotal: response.recordsTotal,
              recordsFiltered: response.recordsTotal,
              data: response.data
            });
          });
      },
      columns: [
        { name: 'uid', data: 'uid' },
        { name: 'vendor', data: 'vendor' },
        { name: 'created_at', data: 'createdAt' },
        {
          name: 'status', data: 'status',
          render: (status: DeviceStatus) => {
            return `<span class="uk-label uk-label-${status === DeviceStatus.online ? 'success' : 'danger'}">${status}</span>`;
          }
        },
        {
          name: 'actions', data:'id', searchable: false, orderable: false, className: 'uk-text-right',
          render: (id) => {
            return `
              <a data-url="/devices/gateway/${self.gatewayId}/update/${id}" uk-tooltip="Update" class="uk-icon-link" uk-icon="pencil"></a>
              <a data-action="remove" data-target="${id}" uk-tooltip="Remove" class="uk-icon-link" uk-icon="trash"></a>
            `;
          }
        }
      ],
      dom: 't<"card-footer"i>',
    };
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.activatedRouteSubscription && this.activatedRouteSubscription.unsubscribe();
    this.gatewaySubscription && this.gatewaySubscription.unsubscribe();
  }

  @HostListener("click", ["$event"])
  onClick(event: MouseEvent): void {
    super.onClick(event);
  }
}
