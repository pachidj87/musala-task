import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { ListableComponent } from './components/listable/listable.component';
import { CreateableComponent } from './components/createable/createable.component';

@NgModule({
  declarations: [
    ListableComponent,
    CreateableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ],
  exports: [
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
