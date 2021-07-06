import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { UpdateComponent } from './pages/update/update.component';
import { GatewaysRoutingModule } from './gateways-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    UpdateComponent
  ],
  imports: [
    CommonModule,
    GatewaysRoutingModule,
    SharedModule
  ]
})
export class GatewaysModule { }
