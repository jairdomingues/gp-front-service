import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { UserService } from 'app/service/user/user.service';
import { HeroService } from 'app/shared/hero.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup4',
  templateUrl: './signup4.component.html',
  styleUrls: ['./signup4.component.scss'],
  animations: egretAnimations
})
export class Signup4Component implements OnInit {

  signupForm: FormGroup;
  hide = true;
  user: any = {};

  constructor(private fb: FormBuilder,
    public alertService: AppAlertService,
    private snackBar: MatSnackBar,
    private router: Router,
    private loader: AppLoaderService,
    private userService: UserService,
    private heroService: HeroService,) {}

  ngOnInit() {

  const password = new FormControl('', Validators.required);
  const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    
  this.signupForm = this.fb.group(
      {
        firstName: ["",[Validators.required, Validators.maxLength(30)]],
        email: ["",[Validators.required,Validators.email]],
        password: password,
        confirmPassword: confirmPassword,
        agreed: [false,Validators.required],
    //    end: ["",Validators.required],
        phone: ["",Validators.required]
      }
    );
  }

  async onSubmit() {
    if (!this.signupForm.invalid) {
      console.log(this.user);
      this.loader.open();
      let role = {name:'USER'};
      this.user.role = role; 
      await this.userService.create(this.user)
        .subscribe(resposta => {
            this.loader.close();
            console.log(this.signupForm.value);
            this.router.navigateByUrl('/shop');
          }, (err) => {
            this.loader.close();
            this.alertService.confirm({title: err.status, message: err.error})
            .subscribe((result) => {
            });
          });
    }
  }

}
