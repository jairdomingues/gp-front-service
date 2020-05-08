import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { CategoryTablePopupComponent } from './category-table-popup/category-table-popup.component';
import { Subscription } from 'rxjs';
import { egretAnimations } from "../../../../shared/animations/egret-animations";
import { HeroService } from 'app/shared/hero.service';
import { Hero } from 'app/shared/hero.model';
import { CategoryService } from '../category.service';
import { Category } from '../category.model';

@Component({
  selector: 'app-crud-ngx-table',
  templateUrl: './category-table.component.html',
  animations: egretAnimations
})
export class CategoryTableComponent implements OnInit, OnDestroy {
  public items: Category[];
  public getItemSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private categoryService: CategoryService,
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
    this.categoryService.getCategories().subscribe((categories: Array<Category>) => {
      this.items = categories;
    });
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Add new category' : 'Update category';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CategoryTablePopupComponent, {
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
//        this.loader.open();
        if (isNew) {
          this.categoryService.createCategory(res).then
            (data => {
//              this.loader.close();
              this.snack.open('Category Added!', 'OK', { duration: 4000 })
            })
        } else {
          this.categoryService.updateCategory(data.id, res).then
            (data => {
//              this.loader.close();
              this.snack.open('Category Updated!', 'OK', { duration: 4000 })
            })
        }
      })
  }

  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
//          this.loader.open();
          this.categoryService.deleteCategory(row.id).then
            (()=> {
              //this.loader.close();
              this.snack.open('Category deleted!', 'OK', { duration: 4000 })
          })
        }
      })
  }
}