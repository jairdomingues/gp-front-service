import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { TokenStorageService } from 'app/_services/token-storage.service';
import { CustomerService } from 'app/service/customer/customer.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  activeView : string = 'overview';

  user: any = {};
  customer: any = {};
  create = true;

  constructor(private route: ActivatedRoute,
              private loader: AppLoaderService,
              public confirmService: AppConfirmService,
              private cdr: ChangeDetectorRef,
              private tokenStorageService: TokenStorageService,
              private customerService: CustomerService) { }

  ngOnInit() {
    this.activeView = this.route.snapshot.params['view']
    this.create  = this.route.snapshot.params['create'];
    this.user = this.tokenStorageService.getUser();
  }

}
