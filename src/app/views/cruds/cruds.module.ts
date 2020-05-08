import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { CrudNgxTableComponent } from './crud-ngx-table/crud-ngx-table.component';

import { CrudsRoutes } from './cruds.routing';
import { CrudService } from './crud.service';
import { NgxTablePopupComponent } from './crud-ngx-table/ngx-table-popup/ngx-table-popup.component'
import { TranslateModule } from '@ngx-translate/core';
import { CategoryTableComponent } from './category/category-table/category-table.component';
import { CategoryTablePopupComponent } from './category/category-table/category-table-popup/category-table-popup.component';
import { CategoryService } from './category/category.service';
import { ProductTablePopupComponent } from './product/product-table/product-table-popup/product-table-popup.component';
import { ProductTableComponent } from './product/product-table/product-table.component';
import { ProductService } from './product/product.service';
import { InvoiceDetailsComponent } from '../invoice/invoice-details/invoice-details.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    TranslateModule,
    SharedModule,
    RouterModule.forChild(CrudsRoutes)
  ],
  declarations: [ProductTableComponent, ProductTablePopupComponent, CategoryTableComponent, CategoryTablePopupComponent, CrudNgxTableComponent, NgxTablePopupComponent],
  providers: [CrudService, ProductService, CategoryService],
  entryComponents: [NgxTablePopupComponent, ProductTablePopupComponent, CategoryTablePopupComponent]
})
export class CrudsModule { }
