import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { CreateComponent } from './pages/create/create.component';
import { UpdateComponent } from './pages/update/update.component';
import { ListComponent } from './pages/list/list.component';

const routes: Route[] = [
  {
    path: '',
    children: [
      { path: 'create', component: CreateComponent },
      { path: 'update/:id', component: UpdateComponent },
      { path: '', component: ListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GatewaysRoutingModule { }
