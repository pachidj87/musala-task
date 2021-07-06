import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private notificationMarkup = `
    <div class="uk-text-small uk-padding-small bg-gradient-{status} uk-light round shadow-{status} uk-grid-small" uk-grid>
      <div class="uk-width-auto">
        <div class="uk-width-expand">
          <h3 class="uk-margin-remove-adjacent uk-margin-small-bottom uk-text-capitalize">{status-header}</h3>
          <p>{message}</p>
        </div>
      </div>
    </div>
  `;

  private notificationSettings = {
    pos: environment.constants.notificationPosition
  }

  constructor() { }

  success(message: string) {
    this.init(message, 'success');
  }

  warning(message: string) {
    this.init(message, 'warning');
  }

  info(message: string) {
    this.init(message, 'primary');
  }

  error(message: string) {
    this.init(message, 'danger');
  }

  message(options: any) {
    // @ts-ignore
    UIkit.notification({ ...this.notificationSettings, ...options });
  }

  private init(message: string, status: string) {
      const header = `${status} notification`;
      const mess = this.notificationMarkup
        .replace(/{status}/gi, status)
        .replace(/{status-header}/, header)
        .replace(/{message}/, message);

      // @ts-ignore
      UIkit.notification({ message: mess, status: status, ...this.notificationSettings});
  }
}
