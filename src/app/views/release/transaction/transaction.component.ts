import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { AccountService } from 'app/service/account/account.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'app/_services/token-storage.service';
import { CustomerService } from 'app/service/customer/customer.service';
import { PartnerService } from 'app/service/partner/partner.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: [
    "./transaction.component.css"
  ],
  animations: egretAnimations
})
export class TransactionComponent implements OnInit {

  user: any = {};
  partner: any = [];
  partnerAccount: any = {};
  
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private accountService: AccountService,
    private partnerService: PartnerService
  ) { }

  ngOnInit() {
    this.user = this.tokenStorageService.getUser();
    this.getPartner();
  }

  async getPartner() {
    await this.partnerService.getPartnerUserId(this.user.id).subscribe((partner: any) => {
      this.partner = partner;
      this.getPartnerAccounts();
    });
  }

  async getPartnerAccounts() {
    await this.partnerService.getPartnerAccountByPartner(this.partner.id).subscribe((partnerAccount: any) => {
      this.partnerAccount = partnerAccount;
    });
  }


}
