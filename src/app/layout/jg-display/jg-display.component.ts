import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-jg-display',
  templateUrl: './jg-display.component.html',
  styleUrls: ['./jg-display.component.css']
})
export class JgDisplayComponent implements OnInit {

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    
  }

}
