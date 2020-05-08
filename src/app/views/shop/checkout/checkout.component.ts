import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryDB } from '../../../shared/inmemory-db/countries';
import { ShopService, CartItem } from '../shop.service';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { Router } from '@angular/router';
import { MatSnackBar} from '@angular/material/snack-bar';
import { OrderService } from 'app/service/order/order.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { TokenStorageService } from 'app/_services/token-storage.service';
import { CustomerService } from 'app/service/customer/customer.service';
import { PartnerService } from 'app/service/partner/partner.service';
import { AccountService } from 'app/service/account/account.service';

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

  totalCrypto: number = 0;
  totalCreditCard: number = 0;
  totalAccount: number = 0;
  user: any = {};
  customer: any = {};
  partner: any = {};
  roleName: any;
  ecommerce: boolean = true;
  partnerId: any;
  accounts: any = [];

  amount: any = [];

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
    private accountService: AccountService,
    private partnerService: PartnerService,
  ) {
    let countryDB = new CountryDB();
    this.countries = countryDB.countries;
  }
  
  ngOnInit() {
    this.user = this.tokenStorageService.getUser();
    if (this.user) {
      this.roleName = this.user.roles[0];
      if (this.roleName==='ROLE_USER') {
        this.getCustomer();
      } else {
        this.getPartner();
        this.ecommerce = false;
      }
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
      this.getAccounts();
    }, (err) => {
      this.alertService.confirm({title: err.status, message: err.error})
      .subscribe((result) => {
        this.loader.close();
      });
    });
  }

  async getPartner() {
    await this.partnerService.getPartnerUserId(this.user.id).subscribe((partner: any) => {
      this.partner = partner;
      this.partnerId = this.partner.id;
    }, (err) => {
      this.alertService.confirm({title: err.status, message: err.error})
      .subscribe((result) => {
        this.loader.close();
      });
    });
  }

  async getAccounts() {
    await this.accountService.getCustomerAccounts(this.customer.id).subscribe((accounts: Array<any>) => {
      this.accounts = accounts; 
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

  itens = [];

  onBlur(i: any, c: any){
    this.itens[i] = c;
  }
  value: any;

  sendOrder() {
    const sum = this.itens.reduce((sum, current) => sum + current.lastBalance, 0);
    if (this.total!=sum) {
      this.confirmService.confirm({title: "Erro", message: "Valor total não confere!"})
      .subscribe((result) => {
        this.cdr.markForCheck();
      });
      return false;
    }

    let payments = [];
    let payment = {};
    for (let entry of this.itens.filter(a => a.typeAccount !== 'undefined')) {
      console.log(entry.typeAccount+" mostra" );
      if (entry.typeAccount==='WALLET') {
        payment = { id: entry.id, paymentMethod: entry.typeAccount, amount: entry.lastBalance};   
        payments.push(payment);
      }
      if (entry.typeAccount==='CURRENT_ACCOUNT') {
        payment = { id: entry.id, paymentMethod: entry.typeAccount, amount: entry.lastBalance};   
        payments.push(payment);
      }
      if (entry.typeAccount==='CREDIT_CARD') {
        payment = { id: entry.id, paymentMethod: entry.typeAccount, amount: entry.lastBalance};   
        payments.push(payment);
      }
    }
    //caso seja produto solicitado pelo ecommerce...verificar partner produto 
    if (this.ecommerce) {
      this.partnerId = this.cart[0].product.partnerId;
    }

    let salesOrder = { clientRef: this.customer.id, partnerRef: this.partnerId, payments: payments, ecommerce: this.ecommerce};
    this.callOrder(salesOrder);
  }

  async callOrder(salesOrder: any) {
    this.loader.open();
    await this.orderService.createSalesOrder(salesOrder).subscribe(resposta => {
      console.log(resposta);
      this.snack.open('Sales order created', 'OK', { duration: 4000 }).afterOpened()
      .subscribe(() => {
          this.loader.close();
          //aqui se for customer é pagamento ja gerado se for partner é pagamento por qrcode
          if (this.roleName==='ROLE_USER') {
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
