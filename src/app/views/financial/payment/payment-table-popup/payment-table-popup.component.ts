import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DragulaService } from 'ng2-dragula';
import Keyboard from 'simple-keyboard';
import { Router } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AccountService } from 'app/service/account/account.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';

@Component({
  selector: 'app-payment-table-popup',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './payment-table-popup.component.html',
  styleUrls: [
    "../../../../../../node_modules/simple-keyboard/build/css/index.css",
    "./payment-table-popup.component.css"

  ],  
  providers: [DragulaService]
}) 
export class PaymentTablePopupComponent implements OnInit {

  value = "";
  keyboard: Keyboard;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PaymentTablePopupComponent>,
    private fb: FormBuilder,
    private router: Router,
    private loader: AppLoaderService,
    private accountService: AccountService,
    public alertService: AppAlertService
  ) { }

  ngOnInit() {


    console.log(this.data.payload);

  }

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      inputName: "input1",
      maxLength: {
        input1: 4,
      },      
      display: {
        '{bksp}': 'Delete',
        '{enter}': 'Enviar',
        '{shift}': 'Shift',
      },                                        
      layout: {
        default: ["1 2 3", "4 5 6", "7 8 9", "{shift} 0 {bksp}", "{enter}"]
      },
      theme: "hg-theme-default hg-layout-numeric numeric-theme"
    });
  }

  onChange = (input: string) => {
    this.value = input;
    console.log("Input changed", input);
  };

  onKeyPress = (button: string) => {
    this.handleShift();
    console.log("Button pressed", button);
    if (button === '{enter}') {

  //    this.router.navigateByUrl('/financial/qrcode/'+'1212123311uidaa');
  //    this.router.navigateByUrl('/financial/scanner');

      this.loader.open();
      let tokenAccountRequest = {type: 'WALLET', accountId:this.data.payload.id, password:this.value};
      this.accountService.createTokenAccount(tokenAccountRequest)
        .subscribe(resposta => {
            this.loader.close();
            this.dialogRef.close();
            this.router.navigateByUrl('/financial/qrcode/'+resposta.uuid);
          }, (err) => {
            this.loader.close();
            this.alertService.confirm({title: err.status, message: err.error})
            .subscribe((result) => {
            });
          });
    }
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;

    this.keyboard.setOptions({
      layoutName: 'default'
    });
  };


}
