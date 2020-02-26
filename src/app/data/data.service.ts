import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import * as moment from 'moment';

import { User, UserBasicInfo } from './models';
import { map, switchMap, tap } from 'rxjs/operators';

const DATE_FORMAT = 'YYYY-MM-DD';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _currentUser: UserBasicInfo;
  private _currentUserStats: User;
  currentUser$: Observable<User>;

  constructor(
    private afs: AngularFirestore,
    fireAuth: AngularFireAuth
  ) {
    this.currentUser$ = fireAuth.authState.pipe(
      tap(auth => this._currentUser = { email: auth.email, name: auth.displayName }),
      switchMap(auth => this.getUserStats(auth.email))
    )
  }

  getUserStats(email: string): Observable<User> {
    return this.afs.collection('users').doc<User>(email).valueChanges().pipe(
      map(user => {
        return user || this.handleNewUser()
      }),
      tap(userStats => this._currentUserStats = userStats)
    )
  }

  addStairs(stairs: number, date: string = null): void {
    const docRef = this.afs.firestore.doc(`users/${this._currentUser.email}`);
    this.afs.firestore.runTransaction((transaction) => {
      return transaction.get(docRef).then(doc => {
        const now = moment();
        const user = doc.data() as User;
        if (moment(user.thisYear.date, DATE_FORMAT).isSame(now, 'year')) {
          user.thisYear.stairs += stairs;
        } else {
          user.thisYear.stairs = stairs;
        }
        if (moment(user.thisMonth.date, DATE_FORMAT).isSame(now, 'month')) {
          user.thisMonth.stairs += stairs;
        } else {
          user.thisMonth.stairs = stairs;
        }
        if (moment(user.thisWeek.date, DATE_FORMAT).isSame(now, 'week')) {
          user.thisWeek.stairs += stairs;
        } else {
          user.thisWeek.stairs = stairs;
        }
        if (moment(user.today.date, DATE_FORMAT).isSame(moment(), 'day')) {
          user.today.stairs += stairs;
        } else {
          user.today.stairs = stairs;
        }
        user.allTime.stairs += stairs;
        transaction.set(docRef, user);
      })
    })
  }

  private handleNewUser(): User {
    const user: User = {
      ...this._currentUser,
      today: {
        date: moment().format(DATE_FORMAT),
        stairs: 0
      },
      thisWeek: {
        date: moment().startOf('week').format(DATE_FORMAT),
        stairs: 0
      },
      thisMonth: {
        date: moment().startOf('month').format(DATE_FORMAT),
        stairs: 0
      },
      thisYear: {
        date: moment().startOf('year').format(DATE_FORMAT),
        stairs: 0
      },
      allTime: {
        date: moment().format(DATE_FORMAT),
        stairs: 0
      },
      groups: {}
    }
    this.afs.collection('users').doc(this._currentUser.email).set(user);
    return user;
  }
}