import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { CreateComponent } from './pages/create/create.component';
import { UpdateComponent } from './pages/update/update.component';
import { ListComponent } from './pages/list/list.component';
import { MaxDevicesReachedGuard } from './guards/max-devices-reached.guard';

const routes: Route[] = [
  {
    path: '',
    children: [
      // Avoid creating more than allowed devices
      { path: 'gateway/:gid/create', component: CreateComponent, canActivate: [MaxDevicesReachedGuard] },
      { path: 'gateway/:gid/update/:id', component: UpdateComponent },
      { path: 'gateway/:gid', component: ListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesRoutingModule { }
