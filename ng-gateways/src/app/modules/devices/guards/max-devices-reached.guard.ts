import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, UrlTree, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { NotificationsService } from 'src/app/services/notifications.service';
import { DevicesService } from 'src/app/services/devices.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaxDevicesReachedGuard implements CanActivate {
  constructor(
    protected readonly notificationService: NotificationsService,
    protected readonly devicesService: DevicesService,
    protected readonly router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const params = route.params;

    if (!params.gid) return false;

    this.devicesService.extraParams = '?gatewayId=' + params.gid;

    return this.devicesService.count().toPromise()
      .then((value: number) => {
        const allowed = value < environment.constants.maxDevicesPerGatewayAllowed;

        if (!allowed) {
          this.notificationService.warning(`Max device number of ${environment.constants.maxDevicesPerGatewayAllowed} reached!`)
          this.router.navigate(['/devices/gateway/' + params.gid]);

          return false;
        }
        return true;
      });
  }

}
