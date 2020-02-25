import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import * as moment from 'moment';

import { User, UserBasicInfo, DayHistory, HighLevelStats, Group } from './models';

const DATE_FORMAT = 'YYYY-MM-DD';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _currentUser: UserBasicInfo;
  currentUser$: Observable<User>;

  constructor(
    private afs: AngularFirestore,
    fireAuth: AngularFireAuth
  ) {
    this.afs.collectionGroup<any>('history').stateChanges().subscribe(x => console.log(x));
    this.currentUser$ = fireAuth.authState.pipe(
      tap(auth => this._currentUser = auth ? { email: auth.email, name: auth.displayName } : undefined),
      switchMap(auth => auth ? this.getUserStats(auth.email) : of(undefined))
    )
  }

  getUserStats(email: string): Observable<User> {
    if (!email.includes('@jahnelgroup.com')) {
      return of(undefined);
    }
    const userInfo$ = this.afs.doc<Pick<User, 'email'|'name'|'groups'>>(`users/${email}`).valueChanges().pipe(
      map(user => user || this.handleNewUser())
    );
    const history$: Observable<HighLevelStats> = this.afs.collection<DayHistory>(`users/${email}/history`).valueChanges().pipe(
      map(history => this.parseStatsFromHistory(history))
    );
    return combineLatest<User>(userInfo$, history$, (userInfo, history) => {
      return {...userInfo, ...history}
    })
  }

  async addStairs(stairs: number, date: string = null): Promise<void> {
    const now = moment();
    const dateString = date || now.format(DATE_FORMAT);
    const docPath = `users/${this._currentUser.email}/history/${dateString}`;
    const doc = await this.afs.doc<DayHistory>(docPath).valueChanges().pipe(take(1)).toPromise();
    this.afs.doc(docPath).set({
      timeStamp: now.startOf('day').valueOf(),
      stairs: doc ? doc.stairs + stairs : stairs
    })
  }

  private parseStatsFromHistory(history: DayHistory[]) {
    const stats: HighLevelStats = {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      thisYear: 0,
      allTime: 0
    };
    for (let day of history) {
      const instance = moment(day.timeStamp);
      const now = moment();
      stats.allTime += day.stairs;
      if (now.isSame(instance, 'year')) {
        stats.thisYear += day.stairs;
        if (now.isSame(instance, 'month')) {
          stats.thisMonth += day.stairs;
        }
        if (now.isSame(instance, 'week')) {
          stats.thisWeek += day.stairs;
          if (now.isSame(instance, 'day')) {
            stats.today = day.stairs;
          }
        }
      }
    }
    return stats;
  }

  private handleNewUser() {
    const newUser: Partial<User> = {
      ...this._currentUser,
      groups: this._currentUser.email.includes('@jahnelgroup.com') ? ['JG'] : []
    }
    this.afs.doc(`users/${this._currentUser.email}`).set(newUser).then(_ => {
      const now = moment();
      this.afs.doc(`users/${this._currentUser.email}/history/${now.format(DATE_FORMAT)}`).set({
        timeStamp: now.startOf('day').valueOf(),
        stairs: 0
      })
    });
  }
}