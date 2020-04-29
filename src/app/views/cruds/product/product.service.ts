import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {catchError, map, tap} from 'rxjs/operators';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {CookieService} from 'ngx-cookie';
import { EndpointsConfig, EndpointsCategory, EndpointsProduct } from 'app/configs/endpoints.config';
import { AppConfig } from 'app/configs/app.config';
import { LoggerService } from 'app/shared/services/logger.service';
import { Product } from 'app/shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCollection: AngularFirestoreCollection<Product>;

  constructor(private afs: AngularFirestore,
              private snackBar: MatSnackBar,
              private cookieService: CookieService) {
    this.productsCollection = this.afs.collection<Product>(EndpointsProduct.products.list, (product) => {
      return product.orderBy('name', 'desc');
    });
  }

  private static handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      LoggerService.log(`${operation} failed: ${error.message}`);

      if (error.status >= 500) {
        throw error;
      }

      return of(result);
    };
  }

  getProducts(): Observable<Product[]> {
    return this.productsCollection.snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data();
            action.payload.doc.metadata.fromCache
            var source = action.payload.doc.metadata.fromCache ? "local cache" : "server";
            console.log("Data came from " + source);
            return new Product({id: action.payload.doc.id, ...data});
          });
        }),
        tap(() => LoggerService.log(`fetched products`)),
        catchError(ProductService.handleError('getProducts', []))
      );
  }

  getProduct(id: string): Observable<any> {
    return this.afs.doc(EndpointsProduct.products.detail(id)).get().pipe(
      map((product) => {
        return new Product({id, ...product.data()});
      }),
      tap(() => LoggerService.log(`fetched product ${id}`)),
      catchError(ProductService.handleError('getProduct', []))
    );
  }

  createProduct(product: Product): Promise<DocumentReference> {
    return this.productsCollection.add(JSON.parse(JSON.stringify(product)));
  }

  updateProduct(id: string, product: Product): Promise<void> {
    return this.afs.doc(EndpointsProduct.products.detail(id)).update(JSON.parse(JSON.stringify(product))).then(() => {
      LoggerService.log(`updated product w/ id=${product._id}`);
      this.showSnackBar('Saved');
    });
  }

  deleteProduct(id: string): Promise<void> {
    return this.afs.doc(EndpointsProduct.products.detail(id)).delete();
  }

  showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }

}
