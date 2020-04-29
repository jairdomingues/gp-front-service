import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Hero} from './hero.model';
import {catchError, map, tap} from 'rxjs/operators';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {CookieService} from 'ngx-cookie';
import { LoggerService } from './services/logger.service';
import { EndpointsConfig } from 'app/configs/endpoints.config';
import { AppConfig } from 'app/configs/app.config';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesCollection: AngularFirestoreCollection<Hero>;

  constructor(private afs: AngularFirestore,
              private snackBar: MatSnackBar,
              private cookieService: CookieService) {
    this.heroesCollection = this.afs.collection<Hero>(EndpointsConfig.heroes.list, (hero) => {
      return hero.orderBy('firstName', 'desc');
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

  checkIfUserCanVote(): boolean {
    const votes = this.cookieService.get('votes');
    return Number(votes ? votes : 0) < AppConfig.votesLimit;
  }

  getHeroes(): Observable<Hero[]> {
    return this.heroesCollection.snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data();
            action.payload.doc.metadata.fromCache
            var source = action.payload.doc.metadata.fromCache ? "local cache" : "server";
            console.log("Data came from " + source);
            return new Hero({id: action.payload.doc.id, ...data});
          });
        }),
        tap(() => LoggerService.log(`fetched heroes`)),
        catchError(HeroService.handleError('getHeroes', []))
      );
  }
  //https://github.com/johnpapa/heroes-angular/tree/master/src
  getHero(id: string): Observable<any> {
    return this.afs.doc(EndpointsConfig.heroes.detail(id)).get().pipe(
      map((hero) => {
        return new Hero({id, ...hero.data()});
      }),
      tap(() => LoggerService.log(`fetched hero ${id}`)),
      catchError(HeroService.handleError('getHero', []))
    );
  }

  private order: any = {};

  createHero(hero: Hero): Promise<DocumentReference> {
    return this.heroesCollection.add(JSON.parse(JSON.stringify(hero)));
  }

  updateHero(hero: Hero): Promise<void> {
    return this.afs.doc(EndpointsConfig.heroes.detail(hero.id)).update(JSON.parse(JSON.stringify(hero))).then(() => {
      LoggerService.log(`updated hero w/ id=${hero.id}`);
      this.showSnackBar('Saved');
    });
  }

  deleteHero(id: string): Promise<void> {
    return this.afs.doc(EndpointsConfig.heroes.detail(id)).delete();
  }

  showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }
}
