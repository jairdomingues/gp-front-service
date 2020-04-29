import { Routes } from '@angular/router';
import { CrudNgxTableComponent } from './crud-ngx-table/crud-ngx-table.component';
import { CategoryTableComponent } from './category/category-table/category-table.component';
import { ProductTableComponent } from './product/product-table/product-table.component';
import { InvoiceListComponent } from '../invoice/invoice-list/invoice-list.component';

export const CrudsRoutes: Routes = [
  { 
    path: 'ngx-table', 
    component: CrudNgxTableComponent, 
    data: { title: 'NgX Table', breadcrumb: 'NgX Table' } 
  },
  { 
    path: 'category', 
    component: CategoryTableComponent, 
    data: { title: 'Category', breadcrumb: 'Category' } 
  },
  { 
    path: 'product', 
    component: ProductTableComponent, 
    data: { title: 'Product', breadcrumb: 'Product' } 
  }

];    