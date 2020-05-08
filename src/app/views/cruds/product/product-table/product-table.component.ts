import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { egretAnimations } from "../../../../shared/animations/egret-animations";
import { HeroService } from 'app/shared/hero.service';
import { Hero } from 'app/shared/hero.model';
import { ProductService } from '../product.service';
import { Product } from 'app/shared/models/product.model';
import { ProductTablePopupComponent } from './product-table-popup/product-table-popup.component';
import { InvoiceDetailsComponent } from 'app/views/invoice/invoice-details/invoice-details.component';

@Component({
  selector: 'app-crud-ngx-table',
  templateUrl: './product-table.component.html',
  animations: egretAnimations
})
export class ProductTableComponent implements OnInit, OnDestroy {
  public items: Product[];
  public getItemSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private productService: ProductService,
    private confirmService: AppConfirmService,
    private heroService: HeroService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {
    this.getItems();
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }

  getItems() {
    this.productService.getProducts().subscribe((products: Array<Product>) => {
      this.items = products;
    });
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Add new product' : 'Update product';
    let dialogRef: MatDialogRef<any> = this.dialog.open(InvoiceDetailsComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          this.productService.createProduct(res).then
            (data => {
              this.loader.close();
              this.snack.open('Product Added!', 'OK', { duration: 4000 })
            })
        } else {
          this.productService.updateProduct(data._id, res).then
            (data => {
              this.loader.close();
              this.snack.open('Product Updated!', 'OK', { duration: 4000 })
            })
        }
      })
  }

  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.productService.deleteProduct(row._id).then
            (()=> {
              this.loader.close();
              this.snack.open('Product deleted!', 'OK', { duration: 4000 })
          })
        }
      })
  }
  
}