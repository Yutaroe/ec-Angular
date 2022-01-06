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
  searchCoffee: COFFEE[] = [];
  showSpinner = false;
  searchValue: string = '';

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
        this.searchCoffee = list;
      });
  }

  searchItem(): void {
    if (this.searchValue === '') {
      alert('ご希望の商品名を入力してください');
      this.searchCoffee = this.coffeeList;
    } else {
      let coffee = this.coffeeList.filter((coffee) => {
        return coffee.coffee_name.indexOf(this.searchValue) >= 0;
      });
      if (coffee.length === 0) {
        alert('該当する商品がありません');
        this.searchCoffee = this.coffeeList;
      } else {
        this.searchCoffee = coffee;
      }
    }
  }

  heighCostSort() {
    this.searchCoffee.sort((a, b) => {
      return b.coffee_priceM - a.coffee_priceM;
    });
  }

  lowCostSort() {
    this.searchCoffee.sort((a, b) => {
      return a.coffee_priceM - b.coffee_priceM;
    });
  }
}
