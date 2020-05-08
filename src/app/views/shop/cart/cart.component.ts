import { Component, OnInit } from '@angular/core';
import { ShopService, CartItem } from '../shop.service';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [egretAnimations]
})
export class CartComponent implements OnInit {
  
  public cart: CartItem[];
  public total: number;
  public subTotal: number;
  public vat: number = 0;

  constructor(
    private shopService: ShopService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getCart();
    this.onQuantityChange();
  }

  addToCart(product) {
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
    })
  }
  
  getCart() {
    this.shopService
    .getCart()
    .subscribe(cart => {
      this.cart = cart;
    })
  }

  removeProduct(cartItem) {
    this.shopService
    .removeFromCart(cartItem)
    .subscribe(res => {
      this.cart = res;
    })
  }

  onQuantityChange() {
    this.subTotal = 0;
    this.cart.forEach(item => {
      this.subTotal += (item.product.price.sale * item.data.quantity)
    })
    this.total = this.subTotal + (this.subTotal * (0/100))
  }

}
