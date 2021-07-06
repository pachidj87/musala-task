import { CommandCenterComponent } from './pages/command-center/command-center.component';
import { E404Component } from './pages/errors/e404/e404.component';
import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '', component: CommandCenterComponent
  },
  {
    path: 'gateways',
    loadChildren: async () => (await (await import('./modules/gateways/gateways.module')).GatewaysModule)
  },
  {
    path: 'devices',
    loadChildren: async () => (await (await import('./modules/devices/devices.module')).DevicesModule)
  },
  {
    path: '**', component: E404Component
  },
];
