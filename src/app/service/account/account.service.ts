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
export class AccountService {

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

  createCurrentAccount(currentAccountRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl+'current_account', currentAccountRequest, httpOptions).pipe(
      tap((currentAccount: any) => console.log(`currentAccount created uuid=${currentAccount}`)),
      catchError(this.handleError)
    );
  }

  createCrypto(walletRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl+'wallet', walletRequest, httpOptions).pipe(
      tap((wallet: any) => console.log(`wallet created uuid=${wallet}`)),
      catchError(this.handleError)
    );
  }

  createCreditCard(creditCardRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl+'credit_card', creditCardRequest, httpOptions).pipe(
      tap((creditCard: any) => console.log(`credit card created uuid=${creditCard}`)),
      catchError(this.handleError)
    );
  }

  createTokenAccount(tokenAccountRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl+'token_account', tokenAccountRequest, httpOptions).pipe(
      tap((token: any) => console.log(`token created uuid=${token.uuid}`)),
      catchError(this.handleError)
    );
  }

  validTokenAccount(validTokenAccountRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl+'valid_token', validTokenAccountRequest, httpOptions).pipe(
      tap((token: any) => console.log(`valid token created uuid=${token}`)),
      catchError(this.handleError)
    );
  }

  getAllAccounts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'accounts');
  }

  getCustomerAccounts(id): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'customer_accounts/'+id);
  }

  deleteById(id) {
    return this.http.delete(this.apiUrl+'accounts/'+id).pipe(
      tap((token: any) => console.log(`id deleted`)),
      catchError(this.handleError)
    );
  }

}
