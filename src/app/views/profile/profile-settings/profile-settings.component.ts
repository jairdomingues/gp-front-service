import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TokenStorageService } from 'app/_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { CustomerService } from 'app/service/customer/customer.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { MatSnackBar } from '@angular/material';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ url: 'upload_url' });
  public hasBaseDropZoneOver: boolean = false;
  public customerForm: FormGroup;
  user: any = {};
  customer: any = {};
  hide = true;
  update = true;

  @ViewChild('form', {static: false}) myNgForm; // just to call resetForm method

  constructor(private fb: FormBuilder,
              public alertService: AppAlertService,
              private snack: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute,
              private loader: AppLoaderService,
              private cdr: ChangeDetectorRef,
              public confirmService: AppConfirmService,
              private tokenStorageService: TokenStorageService,
              private customerService: CustomerService    
  ) {}

  ngOnInit() {
    this.user = this.tokenStorageService.getUser();
    const password = new FormControl('', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    this.customerForm = this.fb.group({
      firstname: ["",[Validators.required, Validators.maxLength(30)]],
      lastname: ["",[Validators.required, Validators.maxLength(40)]],
      email: [this.user.email,[Validators.required,Validators.email]],
      document: ["",[Validators.required,Validators.maxLength(14)]],
      phone: [this.user.phone,[Validators.required]],
      birthday: [this.user.birthday,[Validators.required]],
      password: password,
      confirmPassword: confirmPassword
    })
    this.getCustomer(this.user.id);
  }

  async getCustomer(uuidUser) {
    this.loader.open();
    await this.customerService.getCustomerUuidUser(uuidUser).subscribe((customer: any) => {
      this.loader.close();
      this.customer = customer;
      if (customer==null) {
        this.update = false;
        this.welcome();
      }
    });
  }

  welcome() {
    this.confirmService.confirm({title: "Bem vindo!", message: "Você deve atualizar os dados."})
      .subscribe((result) => {
        this.cdr.markForCheck();
      });
  }

  async submit() {
    if (!this.customerForm.invalid) {
      this.loader.open();
      delete this.customerForm.value.confirmPassword;
      delete this.customerForm.value.email;
      delete this.customerForm.value.phone;
      delete this.customerForm.value.birthday;
      let adresses = [ {
      'street':'Av. Manoel Elias',
      'number':'2200',
      'complement':'Apto 401 Bloco 3',
      'neighborhood':'Passo das Pedras',
      'city':'Porto Alegre',
      'province':'RS',
      'zip':'91240260',
      'country':'Brasil',
      'referencePoint':'próximo FAPA'
      }];
      this.customerForm.value.adresses = adresses;
      this.customerForm.value.userId = this.user.id;
      await this.customerService.createCustomer(this.customerForm.value)
        .subscribe(resposta => {
          this.snack.open('Customer account created', 'OK', { duration: 4000 }).afterOpened()
          .subscribe(() => {
            this.loader.close();
            this.router.navigateByUrl('/shop');
            });            
          }, (err) => {
            this.loader.close();
            this.alertService.confirm({title: err.status, message: err.error})
            .subscribe((result) => {
            });
          });
    }
  } 

  async submittUpdate() {

  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
