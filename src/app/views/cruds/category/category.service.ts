import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Category} from './category.model';
import {catchError, map, tap} from 'rxjs/operators';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {CookieService} from 'ngx-cookie';
import { EndpointsConfig, EndpointsCategory } from 'app/configs/endpoints.config';
import { AppConfig } from 'app/configs/app.config';
import { LoggerService } from 'app/shared/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesCollection: AngularFirestoreCollection<Category>;

  constructor(private afs: AngularFirestore,
              private snackBar: MatSnackBar,
              private cookieService: CookieService) {
    this.categoriesCollection = this.afs.collection<Category>(EndpointsCategory.categories.list, (category) => {
      return category.orderBy('name', 'desc');
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

  getCategories(): Observable<Category[]> {
    return this.categoriesCollection.snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data();
            action.payload.doc.metadata.fromCache
            var source = action.payload.doc.metadata.fromCache ? "local cache" : "server";
            console.log("Data came from " + source);
            return new Category({id: action.payload.doc.id, ...data});
          });
        }),
        tap(() => LoggerService.log(`fetched categories`)),
        catchError(CategoryService.handleError('getCatgories', []))
      );
  }

  getCategory(id: string): Observable<any> {
    return this.afs.doc(EndpointsCategory.categories.detail(id)).get().pipe(
      map((category) => {
        return new Category({id, ...category.data()});
      }),
      tap(() => LoggerService.log(`fetched category ${id}`)),
      catchError(CategoryService.handleError('getCategory', []))
    );
  }

  createCategory(category: Category): Promise<DocumentReference> {
    return this.categoriesCollection.add(JSON.parse(JSON.stringify(category)));
  }

  updateCategory(id: string, category: Category): Promise<void> {
    return this.afs.doc(EndpointsCategory.categories.detail(id)).update(JSON.parse(JSON.stringify(category))).then(() => {
      LoggerService.log(`updated category w/ id=${category.id}`);
      this.showSnackBar('Saved');
    });
  }

  deleteCategory(id: string): Promise<void> {
    return this.afs.doc(EndpointsCategory.categories.detail(id)).delete();
  }

  showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }

}
