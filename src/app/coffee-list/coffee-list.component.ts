import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../coffee.service';
import { COFFEE } from '../type';

@Component({
  selector: 'app-coffee-list',
  templateUrl: './coffee-list.component.html',
  styleUrls: ['./coffee-list.component.css'],
})
export class CoffeeListComponent implements OnInit {
  coffeeList: COFFEE[] = [];

  constructor(private coffeeService: CoffeeService) {}

  ngOnInit(): void {
    this.getCoffeeList();
  }

  getCoffeeList(): void {
    this.coffeeService.getCoffeeList().subscribe((list) => {
      this.coffeeList = list;
    });
  }
}
