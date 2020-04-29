import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { MatTable, MatSnackBar } from "@angular/material";
import { InvoiceService } from "../invoice.service";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
import { Invoice } from "app/shared/models/invoice.model";
import { ProductService } from "app/views/cruds/product/product.service";
import { Product } from "app/shared/models/product.model";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";

@Component({
  selector: "app-invoice-list",
  templateUrl: "./invoice-list.component.html",
  styleUrls: ["./invoice-list.component.scss"]
})
export class InvoiceListComponent implements OnInit {
  @ViewChild(MatTable, {static: false}) itemTable: MatTable<any>;
  invoiceList: Product[];

  itemTableColumn: string[] = [
    "Order No.",
    "Bill From",
    "Bill To",
    "Status",
    "Actions"
  ];

  constructor(
    private invoiceService: InvoiceService,
    private confirmService: AppConfirmService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private snack: MatSnackBar,
    private loader: AppLoaderService
  ) {}

  ngOnInit() {
    this.getProductList();
  }

  async getProductList() {
    await this.productService.getProducts().subscribe((products: Array<Product>) => {
      this.invoiceList = products;
      this.cdr.detectChanges();
    });
  }

  async deleteProductById(id) {
    this.confirmService
      .confirm({ title: "Confirm", message: "Are you sure to delete?" })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.productService.deleteProduct(id).then
            (()=> {
              this.loader.close();
              this.getProductList();
              this.snack.open('Product deleted!', 'OK', { duration: 4000 })
          })
          this.itemTable.renderRows();
        } else return;
      });
  }
  
}
