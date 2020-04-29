import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'app/_services/token-storage.service';
import { CustomerService } from 'app/service/customer/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing',
  templateUrl: './app-pricing.component.html',
  styleUrls: ['./app-pricing.component.css']
})
export class AppPricingComponent implements OnInit {

  customer: any = {};
  user: any = {};
  customerId: any;

  constructor(private router: Router,
              private tokenStorageService: TokenStorageService,
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
      this.customerId = this.customer.id;
    });
  }

}
