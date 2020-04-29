import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { InvoiceItem } from 'app/shared/models/invoice.model';
import { Product } from 'app/shared/models/product.model';

@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './product-table-popup.component.html'
})
export class ProductTablePopupComponent implements OnInit {

  public itemForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductTablePopupComponent>,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }

  arrayItems: {
    id: number;
    title: string;
  }[];

  // buildInvoiceForm(invoice?: Invoice) {
  //   this.invoiceForm = this.fb.group({
  //     id: [invoice?invoice.id:''],
  //     orderNo: [invoice?invoice.orderNo:''],
  //     status: invoice?invoice.status:'',
  //     date: invoice?new Date(invoice.date):'',
  //     vat: invoice?invoice.vat:0,
  //     currency: invoice?invoice.currency:'',
  //     seller: this.fb.group({
  //       name: [invoice?invoice.seller.name:''],
  //       address: [invoice?invoice.seller.address:''],
  //     }),
  //     buyer: this.fb.group({
  //       name: [invoice?invoice.buyer.name:''],
  //       address: [invoice?invoice.buyer.address:''],
  //     }),
  //     item: this.fb.array([])
  //   });

  a: any = {tags: []};

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      name: [item.name || '', Validators.required],
      description: [item.description || ''],
      subtitle: [item.subtitle || ''],
      price: new FormGroup({
        sale: new FormControl('', Validators.required),
        previous: new FormControl(''),
        cashback: new FormControl('')
      }),      
      avatarUrl: [item.avatarUrl || ''],
      isActive: [item.isActive || false],
      tags: this.fb.array([])
    })
  }

  addNewItem(item: any) {
    this.itemForm.value.tags.push(
      this.fb.group({
        name: [item?item.name:''],
      })
    );
  }

  submit() {
    this.dialogRef.close(this.itemForm.value)
  }
}
