import { Component, OnInit } from '@angular/core';
import { ShopService, CartItem } from '../shop.service';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from 'app/shared/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-cart',
  templateUrl: './service-cart.component.html',
  styleUrls: ['./service-cart.component.scss'],
  animations: [egretAnimations]
})
export class ServiceCartComponent implements OnInit {
  
  public cart: CartItem[];
  public itemForm: FormGroup;
  public total: number = 0;
  public subTotal: number = 0;
  visible = true ;

  constructor(
    private shopService: ShopService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
    })
  }

  addToCart() {
    if (!this.itemForm.invalid) {
      let product = new Product();
      product. _id ="";
      product.name = this.itemForm.value.description;
      product.description = this.itemForm.value.description;
      product.category = "Service";
      product.tags = [];
      product.price =  { sale: this.itemForm.value.price, previous: 0} ;
      product.features =  [];
      product.photo = "";
      product.gallery = [];
      let cartItem: CartItem = {
        product: product,
        data: {
          quantity: 1
        }
      };
      this.shopService
      .addToCart(cartItem)
      .subscribe(cart => {
        this.cart = cart;
        this.snackBar.open('Product added to cart', 'OK', { duration: 4000 });
        this.router.navigateByUrl('/shop/checkout');
       
      })
    }
  }
 
}
