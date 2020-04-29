import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { ShopService, CartItem } from '../shop.service';
import { MatSnackBar } from '@angular/material';
import { Product } from '../../../shared/models/product.model';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../service/product/product.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  animations: egretAnimations
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  public productID;
  public product: Product;
  public quantity: number = 1;
  public cart: CartItem[];
  public cartData: any;
  private productSub: Subscription;

  public photoGallery: any[] = [{url: '', state: '0'}];
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private productService: ProductService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {
    this.productID = this.route.snapshot.params['id'];
    this.getProduct(this.productID);
    this.getCart();
    this.cartData = this.shopService.cartData;
  }

  async getProduct(productId) {
   this.loader.open();
   this.productSub = await this.productService.getProduct(productId)
    .subscribe(res => {
      this.product = res;
      this.loader.close();
      this.initGallery(this.product)
    }, err => {
      this.product = {
        _id: '',
        name: '',
        price: { sale: 0 }
      };
    })
  }

  ngOnDestroy() {
    this.productSub.unsubscribe();
  }

  getCart() {
    this.shopService
    .getCart()
    .subscribe(cart => {
      this.cart = cart;
    })
  }

  addToCart() {
    let cartItem: CartItem = {
      product: this.product,
      data: {
        quantity: this.quantity,
        options: {}
      }
    };

    this.shopService
    .addToCart(cartItem)
    .subscribe(res => {
      this.cart = res;
      this.quantity = 1;
      this.snackBar.open('Product added to cart', 'OK', { duration: 4000 });
    })
  }

  initGallery(product: Product) {
    if(!product.gallery) {
      return;
    }
    this.photoGallery = product.gallery.map(i => {
      return {
        url: i,
        state: '0'
      }
    });
    if (this.photoGallery[0])  {
      this.photoGallery[0].state = '1';
    }
  }
  
  changeState(photo) {
    if (photo.state === '1') {
      return;
    }
    this.photoGallery = this.photoGallery.map(p => {
      if (photo.url === p.url) {
        setTimeout(() => {
          p.state = '1';
          return p;
        }, 290)
      }
      p.state = '0';
      return p;
    })
  }

}
