import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { Subscription, Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { BaseService } from 'src/app/services/base.service';
import { NotificationsService } from 'src/app/services/notifications.service';

/**
 * ListableComponent
 */
@Component({template: ''})
export class ListableComponent {
  /**
   * Store the target service event subscription for datatables
   */
  protected tableSubscription!: Subscription;

  /**
   * Target entity service subscription
   */
  targetSubscription!: Subscription;

  /**
   * Reference the table object
   */
  protected readonly datatable!: DataTableDirective;

  /**
   * Table response data
   */
  data!: any[];

  /**
   * Table trigger to start rendering
   */
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  tableTrigger: Subject<any> = new Subject<any>();

  /**
   * Table initialization options
   */
  tableOptions: DataTables.Settings = {};

  /**
   * ListableComponent constructor
   *
   * @param router: Router Router object
   */
  constructor(
    protected readonly notificationServise: NotificationsService,
    protected readonly targetService: BaseService<any>,
    protected readonly router: Router,
  ) {}

  /**
   * On Init hook
   */
  ngOnInit(): void {
  }

  /**
   * On Destroy hook
   */
  ngOnDestroy(): void {
    this.tableSubscription && this.tableSubscription.unsubscribe();
    this.targetSubscription && this.targetSubscription.unsubscribe();
    this.tableTrigger && this.tableTrigger.unsubscribe();
  }

  /**
   * After view init hook
   */
  ngAfterViewInit(): void {
    this.tableTrigger.next();
  }

  /**
   * Refresh the datatable list
   */
  refresh(): void {
    this.targetService.reload();

    // @ts-ignore
    this.targetService.dt.ajax.reload();
  }

  /**
   * Redraw the datatable list
   */
  redraw(): void {
    // @ts-ignore
    this.datatable.dt.draw(true);
  }

  /**
   * On click event callback
   *
   * @param event: MouseEvent Target triggered event
   */
  onClick(event: MouseEvent): void {
    // If we don't have an anchor tag, we don't need to do anything.
    let target: HTMLElement = event.target as HTMLElement;
    if (
      (target.parentNode instanceof HTMLAnchorElement && (target = target.parentNode)) ||
      (target.parentNode?.parentNode instanceof HTMLAnchorElement && (target = target.parentNode.parentNode)) ||
      (target instanceof HTMLAnchorElement)) {

      if (target.dataset.url !== undefined) {
        // Prevent page from reloading
        event.preventDefault();

        // Preparing data pass throghout route
        const extraData = [];

        if (target.dataset.extra !== undefined) {
          extraData.push({ data: target.dataset.extra });
        }

        // Navigate to the path in the link
        this.router.navigate([target.dataset.url], { state: extraData });
      } else if (target.dataset.action === 'remove' && target.dataset.target) {
        const id = target.dataset.target || '';
        // @ts-ignore
        window.confirm('Are you sure you want to remove this item?')
          // @ts-ignore
          .then(() => {
            return this.remove(id);
          });
      }
    }
  }

  protected remove(id: string): void {
    this.targetSubscription = this.targetService.remove(id)
      .subscribe((response) => {
        if (!response) return;

        this.notificationServise.success(`Item sucessfully deleted`);
        this.redraw();
      });
  }
}
