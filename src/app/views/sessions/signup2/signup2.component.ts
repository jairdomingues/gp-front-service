import { CustomValidators } from 'ng2-validation';
import { ErrorStateMatcher } from '@angular/material/core';
import { Validators, FormGroup, NgForm, FormGroupDirective, FormControl, AbstractControl, ValidationErrors } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router'
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { MatSnackBar } from '@angular/material';

import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { UserService } from 'app/service/user/user.service';
import { HeroService } from 'app/shared/hero.service';
import { Hero } from 'app/shared/hero.model';
import { MessageService } from 'app/_services/message.service';
import { SigninService } from 'app/service/signin/signin.service';
import { Credencial } from 'app/model/credencial';
import { TokenStorageService } from 'app/_services/token-storage.service';

@Component({
  selector: "app-signup2",
  templateUrl: "./signup2.component.html",
  styleUrls: ["./signup2.component.scss"]
})
export class Signup2Component implements OnInit {
  signupForm: FormGroup;
  hide = true;
  user: any = {};
  accountId: any;
  credencial: Credencial = new Credencial();
  roles: string[] = [];

  @ViewChild('form', {static: false}) myNgForm; // just to call resetForm method

  constructor(private fb: FormBuilder,
              public alertService: AppAlertService,
              private snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute,
              private tokenStorage: TokenStorageService,
              private loader: AppLoaderService,
              private userService: UserService,
              private signinService: SigninService,
              private messageService: MessageService) {}

  ngOnInit() {

    this.accountId = this.route.snapshot.params['id'];

    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    
    this.signupForm = this.fb.group(
      {
        name: ["",[Validators.required, Validators.maxLength(30)]],
        email: ["",[Validators.required,Validators.email]],
        password: password,
        confirmPassword: confirmPassword,
        agreed: [false,Validators.required],
        end: ["",Validators.required],
        phone: ["",Validators.required]
      }
    );
  }

  async onSubmit2() {
    this.loader.open();
    await this.userService.get()
    .subscribe(resposta => {
      console.log(resposta);
      this.loader.close();
      this.router.navigateByUrl('/shop')
    }, (err) => {

    });
  };

  async onSubmit() {
    if (!this.signupForm.invalid) {
      this.loader.open();
      let role = {name:'USER'};
      //this.user.role = role; 
      this.user.accountShare = this.accountId;
      await this.userService.create(this.user)
        .subscribe(resposta => {
            this.loader.close();
            this.login(this.user.email, this.user.password);
          }, (err) => {
            this.loader.close();
            this.alertService.confirm({title: err.status, message: err.error})
            .subscribe((result) => {
            });
          });
    }
  }

  async login( username, password) {

    this.credencial.username=username;
    this.credencial.password=password;
    this.credencial.fusohorario="brazil east";
    this.credencial.token_fcm="this.token_fcm";

      await this.signinService.authenticate(this.credencial)
        .subscribe(data => {
            this.tokenStorage.saveToken(data.accessToken); 
            this.tokenStorage.saveUser(data);
            this.roles = this.tokenStorage.getUser().roles;
            this.sendMessage(true);
            this.router.navigateByUrl('/profile/settings/true');
          }, (err) => {
            this.loader.close();
            this.alertService.confirm({title: err.status, message: err.error})
            .subscribe((result) => {
            });
          });
  }

  sendMessage(data): void {
    this.messageService.sendMessage(data);
  }

}