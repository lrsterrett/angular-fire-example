import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DataService } from 'src/app/data/data.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  stairs = new FormControl(undefined);

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
  }

  add(): void {
    if (this.stairs.value) {
      this.dataService.addStairs(this.stairs.value);
      this.stairs.setValue(undefined);
    }
  }

}
