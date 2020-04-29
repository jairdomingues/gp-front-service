import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Credencial } from 'app/model/credencial';
import { environment } from 'environments/environment';
import { TokenStorageService } from 'app/_services/token-storage.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json', 'X-TENANT': 'public'})
};

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  env = environment;
  apiUrl = this.env.SERVER_URL_USER + 'api/auth/signin';

  constructor(private http: HttpClient,
              private tokenStorageService: TokenStorageService) { }

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

  authenticate(credencial): Observable<any> {
    return this.http.post(this.apiUrl, credencial, httpOptions).pipe(
      tap((user: any) => {
        console.log(`login succesful username=${user.name}`)
      }),
      catchError(this.handleError)
    )
  }

}
