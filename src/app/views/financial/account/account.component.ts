import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { AccountService } from 'app/service/account/account.service';
import { AccountTablePopupComponent } from './account-table-popup/account-table-popup.component';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { CustomerService } from 'app/service/customer/customer.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'app/_services/token-storage.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: [
    "./account.component.css"
  ],
  animations: egretAnimations
})
export class AccountComponent implements OnInit {

  accounts: any = [];
  customer: any = {};
  user: any = {};

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    public alertService: AppAlertService,
    private router: Router,
    private loader: AppLoaderService,
    private tokenStorageService: TokenStorageService,
    private accountService: AccountService,
    private customerService: CustomerService
  ) { }

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

  openPopUp(data: any = {}) {
    let title = 'Nova Conta';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AccountTablePopupComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(resposta => {
        if(!resposta) {
          // If user press cancel
          return;
        }
        if (resposta.type==='account') {
          this.createCurrentAccount(resposta);
        } else if (resposta.type==='crypto'){
          this.createCryptoCurrency(resposta);
        } else if (resposta.type==='credit'){
          this.createCreditCard(resposta);
        }
      })
  }

  async createCurrentAccount(resposta:any) {
    this.loader.open();
    resposta.customer = {id: this.customer.id};
    await this.accountService.createCurrentAccount(resposta)
    .subscribe(resposta => {
        this.getAccounts(); 
        this.snack.open('Conta adicionada!', 'OK', { duration: 4000 }).afterOpened()
        .subscribe(() => {
            this.loader.close();
          });            
      }, (err) => {
        this.loader.close();
        this.alertService.confirm({title: err.status, message: err.error})
        .subscribe((result) => {
        });
      });
  }

  async createCryptoCurrency(resposta: any) {
    this.loader.open();
    resposta.customer = {id: this.customer.id};
    await this.accountService.createCrypto(resposta)
    .subscribe(resposta => {
        this.getAccounts(); 
        this.snack.open('Conta adicionada!', 'OK', { duration: 4000 }).afterOpened()
        .subscribe(() => {
            this.loader.close();
          });            
      }, (err) => {
        this.loader.close();
        this.alertService.confirm({title: err.status, message: err.error})
        .subscribe((result) => {
        });
      });
  }

  async createCreditCard(resposta:any) {
    this.loader.open();
    resposta.customer = {id: this.customer.id};
    await this.accountService.createCreditCard(resposta)
    .subscribe(resposta => {
        this.getAccounts(); 
        this.snack.open('Conta adicionada!', 'OK', { duration: 4000 }).afterOpened()
        .subscribe(() => {
            this.loader.close();
          });            
      }, (err) => {
        this.loader.close();
        this.alertService.confirm({title: err.status, message: err.error})
        .subscribe((result) => {
        });
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({message: `Delete account ${row.name}?`})
      .subscribe(resposta => {
        if (resposta) {
          this.getAccounts(); 
          this.accountService.deleteById(row.id)
            .subscribe(data => {
              this.getAccounts(); 
              this.snack.open('Account deleted!', 'OK', { duration: 4000 }).afterOpened()
              .subscribe(() => {
                  this.loader.close();
                });            
            }, (err) => {
              this.loader.close();
              this.alertService.confirm({title: err.status, message: err.error})
              .subscribe((result) => {
              });
            });
        }
      })
  }


}
