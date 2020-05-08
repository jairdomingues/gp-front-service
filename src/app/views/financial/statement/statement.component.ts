import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { AccountService } from 'app/service/account/account.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'app/_services/token-storage.service';
import { CustomerService } from 'app/service/customer/customer.service';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: [
    "./statement.component.css"
  ],
  animations: egretAnimations
})
export class StatementComponent implements OnInit {
  
  accounts: any = [];
  user: any = {};
  customer: any = {};

  constructor(
    
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private accountService: AccountService,
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    this.user = this.tokenStorageService.getUser();
    this.getCustomer();
    this.getAccounts();
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

  
}
