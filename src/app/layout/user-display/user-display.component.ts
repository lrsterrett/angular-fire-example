import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { DataService } from 'src/app/data/data.service';
import { User, StatView } from 'src/app/data/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-display',
  templateUrl: './user-display.component.html',
  styleUrls: ['./user-display.component.css']
})
export class UserDisplayComponent implements OnInit {
  user$: Observable<User>;
  currentView: StatView = StatView.Today;
  
  constructor(
    private afs: AngularFirestore,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.user$ = this.dataService.currentUser$;
  }

  changeView(view: StatView): void {
    this.currentView = view;
  }

}
