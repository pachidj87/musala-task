import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { DataTableDirective } from 'angular-datatables';

import { ListableComponent } from 'src/app/modules/shared/components/listable/listable.component';
import { GatewaysService } from 'src/app/services/gateways.service';
import { Gateway } from 'src/app/entities/gateway.entity';
import { DataTablesResponse } from 'src/app/entities/datatables-response.entity';
import { NotificationsService } from 'src/app/services/notifications.service';

/**
 * ListComponent
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent extends ListableComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Reference the table object
   */
  @ViewChild(DataTableDirective, { static: false })
  protected readonly datatable!: DataTableDirective;

  /**
   * Gateways ListComponent constructor
   *
   * @param router: Router Router object
   */
  constructor(
    protected readonly notificationService: NotificationsService,
    protected readonly router: Router,
    protected readonly gatewaysService: GatewaysService,
  ) {
    super(notificationService, gatewaysService, router);
  }

  ngOnInit(): void {
    const self = this;
    self.tableOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      stateSave: true,
      ajax: (dataTablesParameters: any, callback) => {
        self.tableSubscription = self.gatewaysService.datatables<Gateway>(dataTablesParameters)
          .subscribe((response: DataTablesResponse<Gateway>) => {
            if (!response) return;

            callback({
              recordsTotal: response.recordsTotal,
              recordsFiltered: response.recordsTotal,
              data: response.data
            });
          });
      },
      columns: [
        { name: 'serial_number', data: 'serialNumber' },
        { name: 'name', data: 'name' },
        { name: 'ip_v4_address', data: 'ipV4Address' },
        {
          name: 'actions', data:'id', searchable: false, orderable: false, className: 'uk-text-right',
          render: (id: string, _type: any, gateway: Gateway) => {
            return `
            <a data-url="/devices/gateway/${id}" data-extra="${gateway.name}" uk-tooltip="Devices" class="uk-icon-link" uk-icon="server"></a>
              <a data-url="/gateways/update/${id}" uk-tooltip="Update" class="uk-icon-link" uk-icon="pencil"></a>
              <a data-action="remove" data-target="${id}" uk-tooltip="Remove" class="uk-icon-link" uk-icon="trash"></a>
            `;
          }
        }
      ]
    };
  }

  @HostListener("click", ["$event"])
  onClick(event: MouseEvent): void {
    super.onClick(event);
  }
}
