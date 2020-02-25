import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { JgDisplayComponent } from './layout/jg-display/jg-display.component';
import { UserDisplayComponent } from './layout/user-display/user-display.component';
import { LeaderboardComponent } from './layout/leaderboard/leaderboard.component';
import { UserUpdateComponent } from './layout/user-update/user-update.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    JgDisplayComponent,
    UserDisplayComponent,
    LeaderboardComponent,
    UserUpdateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
