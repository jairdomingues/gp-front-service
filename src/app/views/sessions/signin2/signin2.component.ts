import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Credencial } from 'app/model/credencial';
import { SigninService } from 'app/service/signin/signin.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { TokenStorageService } from 'app/_services/token-storage.service';
import { MessageService } from 'app/_services/message.service';

@Component({
  selector: 'app-signin2',
  templateUrl: './signin2.component.html',
  styleUrls: ['./signin2.component.scss']
})
export class Signin2Component implements OnInit {

  signupForm: FormGroup;
  isAuthenticated = true;
  credencial: Credencial = new Credencial();
  public passwordType: string;
  token_fcm: any;
  isLoggedIn = false;
  roles: string[] = [];

  constructor(private fb: FormBuilder, 
              public alertService: AppAlertService,
              private router: Router,
              private loader: AppLoaderService,
              private tokenStorage: TokenStorageService,
              private signinService: SigninService,
              private messageService: MessageService
    ) {
  }

  ngOnInit() {
    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    this.signupForm = this.fb.group(
      {
        email: ["",[Validators.required,Validators.email]], 
        password: password,
        agreed: [false,Validators.required]
      }
    )

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  async onSubmit() {
    if (!this.signupForm.invalid) {
      this.loader.open();
      this.credencial.username=this.signupForm.controls.email.value;
      this.credencial.password=this.signupForm.controls.password.value;
      this.credencial.fusohorario="brazil east";
      this.credencial.token_fcm=this.token_fcm;
      //eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqYWlyc3lvbmV0QGdtYWlsLmNvbSIsImlhdCI6MTU4NTc0MDE4NywiZXhwIjoxNTg1ODI2NTg3fQ.eOZpxwS8iXzHN7eFalwQNjBJkjazpk7IlkcdDJpXzFEngNEEGzaBnEfx11EibdiBTGpqcU_xyG7ufPjlC_BXoA
      //  let data = {"id":"1","username":"JAIR DOMINGUES","email":"jairsyonet@gmail.com","roles":["ROLE_USER"],"accessToken":"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqYWlyc3lvbmV0QGdtYWlsLmNvbSIsImlhdCI6MTU4NTc0MDE4NywiZXhwIjoxNTg1ODI2NTg3fQ.eOZpxwS8iXzHN7eFalwQNjBJkjazpk7IlkcdDJpXzFEngNEEGzaBnEfx11EibdiBTGpqcU_xyG7ufPjlC_BXoA","tokenType":"Bearer"};
      //       this.tokenStorage.saveToken(data.accessToken); 
      //       this.tokenStorage.saveUser(data);
      //       this.roles = this.tokenStorage.getUser().roles;
      //       this.sendMessage(true);
      //       this.loader.close();
      //       this.router.navigateByUrl('/shop');
      await this.signinService.authenticate(this.credencial)
        .subscribe(data => {
            this.tokenStorage.saveToken(data.accessToken); 
            this.tokenStorage.saveUser(data);
            this.roles = this.tokenStorage.getUser().roles;
            this.sendMessage(true);
            this.loader.close();
            let role = data.roles[0];
            if (role==='ROLE_USER') {
              this.router.navigateByUrl('/shop');
            } else {
              this.router.navigateByUrl('/dashboard/default');
            }
          }, (err) => {
            this.loader.close();
            this.alertService.confirm({title: err.status, message: err.error})
            .subscribe((result) => {
            });
          });
    }
  }

  sendMessage(data): void {
    this.messageService.sendMessage(data);
  }

}           
