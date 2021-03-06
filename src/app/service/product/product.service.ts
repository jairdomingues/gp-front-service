import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json', 'X-TENANT': 'public'})
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  env = environment;
  apiUrl = this.env.SERVER_URL_ACCOUNT;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      alert(error+ "handle");
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error[0].message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`); 
    }
    // return an observable with a user-facing error message
    return throwError(error.error);
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'products');
  }

  getAllProductsPartner(id): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'products_partner/'+id);
  }

  getProduct(id): Observable<any> {
    return this.http.get<any>(this.apiUrl+'products/'+id);
  }

  deleteById(id) {
    return this.http.delete(this.apiUrl+'products/'+id).pipe(
      tap(() => console.log(`id deleted`)),
      catchError(this.handleError)
    );
  }

}
