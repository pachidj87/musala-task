import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';

@Component({template: ''})
export class CreateableComponent implements OnDestroy {
  public form!: FormGroup;
  public serviceSubscription!: Subscription;

  constructor(protected readonly service: BaseService<any>) {}

  ngOnDestroy(): void {
    this.serviceSubscription && this.serviceSubscription.unsubscribe();
  }

  submit(): void {}
}
