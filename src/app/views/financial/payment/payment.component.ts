import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import Keyboard from 'simple-keyboard';
import { AccountService } from 'app/service/account/account.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentTablePopupComponent } from './payment-table-popup/payment-table-popup.component';
import { TokenStorageService } from 'app/_services/token-storage.service';
import { CustomerService } from 'app/service/customer/customer.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: [
    "./payment.component.css"
  ],  
  providers: [DragulaService]
}) 
export class PaymentComponent implements OnInit {

  accounts: any = [];
  user: any = {};
  customer: any = {};

  constructor(public alertService: AppAlertService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router,
    private loader: AppLoaderService,
    private tokenStorageService: TokenStorageService,
    private accountService: AccountService,
    private customerService: CustomerService) {    }

  ngOnInit() {
    this.user = this.tokenStorageService.getUser();
    this.getCustomer();
  }

  async getCustomer() {
    await this.customerService.getCustomerUuidUser(this.user.id).subscribe((customer: any) => {
      this.customer = customer;
      if (customer==null) {
        this.router.navigateByUrl('/others/n1/n2');
      }
      this.getAccounts();
    });
  }

  async getAccounts() {
    await this.accountService.getCustomerAccounts(this.customer.id).subscribe((accounts: Array<any>) => {
      this.accounts = accounts; 
    });
  }

  toggle(data: any = {}) {

      let title = 'Pagamento';
      let dialogRef: MatDialogRef<any> = this.dialog.open(PaymentTablePopupComponent, {
        width: '720px',
        data: { title: title, payload: data }
      })
      dialogRef.afterClosed()
        .subscribe(resposta => {
          if(!resposta) {
            // If user press cancel
            return;
          }
        })
  }
  
}
