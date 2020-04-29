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
export class UserService {

  env = environment;
  apiUrl = this.env.SERVER_URL_USER + 'api/auth/';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
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

  create(user): Observable<any> {
    return this.http.post<any>(this.apiUrl, user, httpOptions).pipe(
      tap((user: any) => console.log(`user created username=${user.name}`)),
      catchError(this.handleError)
    );
  }

  get(): Observable<any[]> {
    const url = 'https://secondapp-talkative-wolverine-fw.cfapps.us10.hana.ondemand.com/hello';
    return this.http.get<any[]>(url)
      .pipe(
        tap(heroes => console.log('fetched')),
        catchError(this.handleError)
    );
  }

}
