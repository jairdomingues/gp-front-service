import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ngx-table-popup1',
  templateUrl: './account-table-popup.component.html'
})
export class AccountTablePopupComponent implements OnInit {

  public itemForm: FormGroup;
  public cryptoForm: FormGroup;
  cardForm: FormGroup;

  hasAltAddress: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountTablePopupComponent>,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    if (this.data.payload.type==='account') {
      this.buildItemForm(this.data.payload)
    } else if (this.data.payload.type==='crypto') {
      this.buildCryptoForm(this.data.payload)
    } else if (this.data.payload.type==='credit') {
      this.buildCardForm(this.data.payload)
    }
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      name: [item.name || '', Validators.required],
      bankCode: [item.bankCode || '', Validators.required],
      agency: [item.agency || '', Validators.required],
      currentAccount: [item.currentAccount || '', Validators.required],
      type: 'account'
    })
  }

  buildCryptoForm(item) {
    this.cryptoForm = this.fb.group({
      name: [item.name || '', Validators.required],
      hashCard: [item.hashCard || '', Validators.required],
      type: 'crypto'
    });
  }

  buildCardForm(item) { 
    this.cardForm = this.fb.group({
      name: [item.name || '', Validators.required],
      brand: [item.brand || '', Validators.required],
      cardholderName: [item.cardholderName || '', Validators.required],
      cardNumber: [item.cardNumber || '', Validators.required],
      expirationMonth: [item.expirationMonth || '', Validators.required],
      expirationYear: [item.expirationYear || '', Validators.required],
      securityCode: [item.securityCode || '', Validators.required],
      type: 'credit'

    });
  }

  submit() {
    if (this.data.payload.type==='account') {
      this.dialogRef.close(this.itemForm.value)
    } else if (this.data.payload.type==='crypto') {
      this.dialogRef.close(this.cryptoForm.value)
    } else if (this.data.payload.type==='credit') {
      this.dialogRef.close(this.cardForm.value)
    }
  }

}
