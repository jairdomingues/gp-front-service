import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/operators";
import { AccountService } from "app/service/account/account.service";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from "@angular/router";
import { TokenStorageService } from "app/_services/token-storage.service";
import { CustomerService } from "app/service/customer/customer.service";
import { ScannerTablePopupComponent } from "./scanner-table-popup/scanner-table-popup.component";

@Component({
  selector: "app-scanner",
  templateUrl: "./scanner.component.html",
  styleUrls: ["./scanner.component.scss"]
})
export class ScannerComponent implements OnInit {
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  hasDevices: boolean;
  hasPermission: boolean;
  submit: boolean = true;
  totalAccount: any;
  totalCreditCard: any;
  totalCrypto: any;
  user: any = {};
//  customer: any = {};
  orderId: any;

  constructor(private accountService: AccountService,
              private router: Router,
              private route: ActivatedRoute,              
              private snack: MatSnackBar,
              private dialog: MatDialog,
              public alertService: AppAlertService,
              private loader: AppLoaderService,
              private customerService: CustomerService,
              private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    this.orderId =  this.route.snapshot.params['orderId'];
    //this.getCustomer();
  }

  // async getCustomer() {
  //   await this.customerService.getCustomerUuidUser(this.user.id).subscribe((customer: any) => {
  //     this.customer = customer;
  //     if (customer==null) {
  //       this.router.navigateByUrl('/others/n1/n2');
  //     }
  //   });
  // }

  onCodeResult(resultString: string) {
    console.log(this.checkQRJSON(resultString));
    if (this.submit) {
      
      this.submit = false;
      let request = {"customerId": this.user.id, "uuid": resultString, "orderId": this.orderId};
      let title = 'Eba!! Câmera posicionada.';
      let dialogRef: MatDialogRef<any> = this.dialog.open(ScannerTablePopupComponent, {
        width: '720px',
        data: { title: title, payload: request }
      })
      dialogRef.afterClosed()
        .subscribe(resposta => {
          this.callOrder(request);
        })
    }
  }

  async callOrder(request: any) {
    this.loader.open();
    await this.accountService.validTokenAccount(request).subscribe(resposta => {
      this.snack.open('Payment approved!', 'OK', { duration: 4000 }).afterOpened()
      .subscribe(() => {
        this.loader.close();
        this.submit = true;
        this.router.navigateByUrl('/financial/information/'+this.orderId);
        });            
    }, (err) => {
      this.loader.close();
      this.submit = true;
      this.alertService.confirm({title: err.status, message: err.error})
      .subscribe((result) => {
        this.loader.close();
      });
    });
  }

  onHasPermission(has: boolean): void {
    this.hasPermission = has;
  }

  checkQRJSON(qrString: string): boolean {
    if (
      /^[\],:{}\s]*$/.test(
        qrString
          .replace(/\\["\\\/bfnrtu]/g, "@")
          .replace(
            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            "]"
          )
          .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
}
