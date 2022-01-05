import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../coffee.service';
import { COFFEE } from '../type';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-coffee-list',
  templateUrl: './coffee-list.component.html',
  styleUrls: ['./coffee-list.component.css'],
})
export class CoffeeListComponent implements OnInit {
  coffeeList: COFFEE[] = [];
  showSpinner = false;

  constructor(private coffeeService: CoffeeService) {}

  ngOnInit(): void {
    this.getCoffeeList();
  }

  getCoffeeList(): void {
    this.showSpinner = true;
    this.coffeeService
      .getCoffeeList()
      .pipe(tap(() => (this.showSpinner = false)))
      .subscribe((list) => {
        this.coffeeList = list;
      });
  }
}
