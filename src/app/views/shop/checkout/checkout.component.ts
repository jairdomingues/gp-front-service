import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryDB } from '../../../shared/inmemory-db/countries';
import { ShopService, CartItem } from '../shop.service';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { OrderService } from 'app/service/order/order.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { TokenStorageService } from 'app/_services/token-storage.service';
import { CustomerService } from 'app/service/customer/customer.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  animations: egretAnimations
})
export class CheckoutComponent implements OnInit {
  public cart: CartItem[];
  public checkoutForm: FormGroup;
  public checkoutFormAlt: FormGroup;
  public hasAltAddress: boolean = true;
  public countries: any[];

  public total: number;
  public subTotal: number;
  public vat: number = 15;
  public shipping: any = 'Free';
  public paymentMethod: string;

  constructor(
    private snack: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private shopService: ShopService,
    private orderService: OrderService,
    public alertService: AppAlertService,
    private loader: AppLoaderService,
    public confirmService: AppConfirmService,
    private cdr: ChangeDetectorRef,
    private tokenStorageService: TokenStorageService,
    private customerService: CustomerService,
  ) {
    let countryDB = new CountryDB();
    this.countries = countryDB.countries;
  }

  visible = true;
  totalCrypto: number = 0;
  totalCreditCard: number = 0;
  totalAccount: number = 0;
  user: any = {};
  customer: any = {};

  ngOnInit() {
    this.user = this.tokenStorageService.getUser();
    if (this.user) {
      this.getCustomer();
    } else {
      this.router.navigateByUrl('/others/n1/n2');      
    }
    this.getCart();
    this.buildCheckoutForm();
  }

  async getCustomer() {
    await this.customerService.getCustomerUuidUser(this.user.id).subscribe((customer: any) => {
      this.customer = customer;
      if (customer==null) {
        this.router.navigateByUrl('/others/n1/n2');
      }
    });
  }

  calculateCost() {
    this.subTotal = 0;
    this.cart.forEach(item => {
      this.subTotal += (item.product.price.sale * item.data.quantity)
    })
    this.total = this.subTotal + (this.subTotal * (0/100));
    if(this.shipping !== 'Free') {
      this.total += this.shipping;
    }
  }
  
  getCart() {
    this.shopService
    .getCart()
    .subscribe(cart => {
      this.cart = cart;
      this.calculateCost();
    })
  }
  
  buildCheckoutForm() {
    this.checkoutForm = this.fb.group({
      country: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      company: [],
      address1: ['', Validators.required],
      address2: [],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required]
    })

    this.checkoutFormAlt = this.fb.group({
      country: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      company: [],
      address1: ['', Validators.required],
      address2: [],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required]
    })
  }

  placeOrder() {
    let verifica = (this.totalAccount+this.totalCreditCard+this.totalCrypto);
    if (this.total!=verifica) {
      this.confirmService.confirm({title: "Erro", message: "Total não é válido!"})
      .subscribe((result) => {
        this.cdr.markForCheck();
      });
      return false;
    }

    let payments = [];
    let payment = {};
    if (this.totalAccount)  {
      payment = { paymentMethod: "CurrentAccount", amount: this.totalAccount};   
      payments.push(payment);
    }
    if (this.totalCreditCard)  {
      payment = { paymentMethod: "CreditCard", amount: this.totalCreditCard};   
      payments.push(payment);
    }
    if (this.totalCrypto)  {
      payment = { paymentMethod: "CryptoCurrency", amount: this.totalCrypto};   
      payments.push(payment);
    }
    let salesOrder = { clientRef: this.customer.id, partnerRef: 1, payments: payments, ecommerce: this.visible};
    this.callOrder(salesOrder);
  }

  async callOrder(salesOrder: any) {
    this.loader.open();
    await this.orderService.createSalesOrder(salesOrder).subscribe(resposta => {
      console.log(resposta);
      this.snack.open('Sales order created', 'OK', { duration: 4000 }).afterOpened()
      .subscribe(() => {
          this.loader.close();
          //aqui se for customer é true se for partner é false
          if (this.visible) {
            this.router.navigateByUrl('/financial/information/'+resposta.id)
          } else {
            this.router.navigateByUrl('/financial/scanner/'+resposta.id);
          }
        });            
    }, (err) => {
      this.alertService.confirm({title: err.status, message: err.error})
      .subscribe((result) => {
        this.loader.close();
      });
    });
  }
  
}
