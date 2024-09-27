///
/// Copyright © 2023 ThingsBoard, Inc.
///

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/public-api';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';


import {
  BasicWidgetConfigModule,
  HomeComponentsModule,
  WidgetConfigComponentsModule
} from '@home/components/public-api';


import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OneDynamicChartWidgetComponent } from './dynamic-chart.component';

@NgModule({
  declarations: [
    OneDynamicChartWidgetComponent,
   
  ],
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
    AccordionModule,
    MatSelectModule,
    MatInputModule,
    WidgetConfigComponentsModule,
    HomeComponentsModule,
    BasicWidgetConfigModule,
    MatDatepickerModule,
    MatCheckboxModule
  ],
  exports: [
    OneDynamicChartWidgetComponent,
  ]
})
export class OneDynamicChartWidgetModule {
}
