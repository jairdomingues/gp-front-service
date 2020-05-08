import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgmCoreModule } from '@agm/core';

import { MapComponent } from './map.component';
import { MapRoutes } from "./map.routing";
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    FlexLayoutModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyDObGKpiIc6fl02fOytABIKpqpGxSELNxM' }),
    RouterModule.forChild(MapRoutes)
  ],
  declarations: [MapComponent]
})
export class AppMapModule { }
