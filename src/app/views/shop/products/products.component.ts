import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSnackBar, MatSidenav } from '@angular/material';
import { ShopService, CartItem } from '../shop.service';
import { Product } from '../../../shared/models/product.model';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { CategoryService } from 'app/views/cruds/category/category.service';
import { Category } from 'app/views/cruds/category/category.model';
import { MapsAPILoader } from '@agm/core';
import { PartnerService } from 'app/service/partner/partner.service';
import { Router, ActivatedRoute } from '@angular/router';
 
declare var google: any; 

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
   draggable: boolean;
   content?:string;
   isShown:boolean;
   icon:string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [egretAnimations]
})
export class ProductsComponent implements OnInit, OnDestroy {
  
  public isSideNavOpen: boolean;
  public viewMode: string = 'grid-view';
  public currentPage: any;

  @ViewChild(MatSidenav, {static: false}) private sideNav: MatSidenav;

  public products$: Observable<Product[]>;
  public categories$: Observable<Category>;
  public activeCategory: string = 'all';
  public filterForm: FormGroup;
  public cart: CartItem[];
  public cartData: any = {itemCount: 0};
  public categories: any = [];
  public partners: any = [];

  address: string;
  private geoCoder;
  // Radius
  radius = 30000;
  radiusLat = 0;
  radiusLong = 0;
  latitude: number;
  longitude: number;
  
  visible = true;

  zoom = 15;
  markers: marker[] = []

  constructor(private mapsAPILoader: MapsAPILoader,
    private categoryService: CategoryService,
    private shopService: ShopService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private partnerService: PartnerService
  ) { 
  }

  partnerId: any;

  ngOnInit() {
    this.partnerId = this.route.snapshot.params['id'];
    this.viewMap();
    this.buildFilterForm(this.shopService.initialFilters);
    this.categoryService.getCategories().subscribe((categories: Array<Category>) => {
        this.categories = categories;
        this.init();
      });
  }

  async viewMap() {
    await this.partnerService.getAllPartners().subscribe((partners: any) => {
      this.partners = partners;
      this.mapsAPILoader.load().then(() => {
        this.setCurrentLocation();
      });
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.radiusLat = this.latitude;
        this.radiusLong = this.longitude;
        this.zoom = 9;
      
        for(let entry of this.partners){
          let i = 1;
          this.markers.push(
            {
              lat: parseFloat(entry.adresses[0].lat),
              lng: parseFloat(entry.adresses[0].lng),
              label: `${i}`,
              draggable: false,
              content: `Content no ${i}`,
              isShown:false,
              icon:'./assets/icons8.png'
            }
          )
          i++;
        }

      });
    }
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  radiusDragEnd($event: any) {
    console.log($event);
    this.radiusLat = $event.coords.lat;
    this.radiusLong = $event.coords.lng;
    this.showHideMarkers();
  }

  event(type,$event) {
    console.log(type,$event);
    this.radius = $event;
    this.showHideMarkers();
  }

  showHideMarkers(){
    Object.values(this.markers).forEach(value => {
      value.isShown = this.getDistanceBetween(value.lat,value.lng,this.radiusLat,this.radiusLong);
    });
  }

  getDistanceBetween(lat1,long1,lat2,long2){
    var from = new google.maps.LatLng(lat1,long1);
    var to = new google.maps.LatLng(lat2,long2);

    if(google.maps.geometry.spherical.computeDistanceBetween(from,to) <= this.radius){    
      console.log('Radius',this.radius);
      console.log('Distance Between',google.maps.geometry.spherical.computeDistanceBetween(
        from,to
      ));
      return true;
    }else{
      return false;
    }
  }

  init() {
    let categories = [];
    for (let entry of this.categories) {
      categories.push(entry.name)
    }
    this.categories$ = this.shopService.getCategories(categories);
    setTimeout(() => {
      this.loader.open();
    });

    this.products$ = this.shopService
      .getFilteredProduct(this.partnerId, this.filterForm)
      .pipe(
        map(products => {
          this.loader.close();
          return products;
        })
      );


    this.getCart();
    this.cartData = this.shopService.cartData;
  }

  ngOnDestroy() {
  }

  getCart() {
    this.shopService
    .getCart()
    .subscribe(cart => {
      this.cart = cart;
    })
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

  buildFilterForm(filterData:any = {}) {
    this.filterForm = this.fb.group({
      search: [''],
      category: ['all'],
      minPrice: [filterData.minPrice],
      maxPrice: [filterData.maxPrice],
      minRating: [filterData.minRating],
      maxRating: [filterData.maxRating]
    })
  }

  setActiveCategory(category) {
    this.activeCategory = category;
    this.filterForm.controls['category'].setValue(category)
  }

  toggleSideNav() {
    this.sideNav.opened = !this.sideNav.opened;
  }

  openShop(id) {
    this.router.navigateByUrl('/shop/'+id);
  }
}
