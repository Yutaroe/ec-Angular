import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../auth/authen.service';
import { CoffeeService } from '../coffee.service';
import {
  COFFEE,
  TOPPING,
  CART,
  ORDEREDCOFFEE,
  ORDERCOFFEEWITHNAME,
} from '../type';
import { tap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-ordered',
  templateUrl: './ordered.component.html',
  styleUrls: ['./ordered.component.css'],
})
export class OrderedComponent implements OnInit {
  coffeeList: COFFEE[] = [];
  topping: TOPPING[] = [];
  cart: CART[] = [];
  orderList: ORDEREDCOFFEE[] = [];
  orderCoffee: ORDERCOFFEEWITHNAME[] = [];
  showSpinner: boolean = false;

  constructor(
    private authenService: AuthenService,
    private coffeeService: CoffeeService
  ) {}

  ngOnInit(): void {
    this.getTopping(), this.getCoffeeList(), this.getCart();
  }

  getTopping(): void {
    this.coffeeService
      .getToppingList()
      .subscribe((topping) => (this.topping = topping));
  }

  getCoffeeList(): void {
    this.coffeeService.getCoffeeList().subscribe((list) => {
      this.coffeeList = list;
    });
  }

  getCart(): void {
    this.showSpinner = true;
    this.authenService
      .getCart()
      .pipe(
        tap((cart) =>
          cart.forEach((mycart) => {
            if (
              mycart.userCart === Number(localStorage['user']) &&
              mycart.status !== 0
            ) {
              this.cart.push(mycart);
            }
          })
        ),
        mergeMap(() => this.getOrderCoffee()),
        tap(() => this.getCoffeeById()),
        tap(() => (this.showSpinner = false))
      )
      .subscribe();
  }

  getOrderCoffee() {
    return this.coffeeService.getOrderCoffee().pipe(
      tap((orderList) =>
        orderList.forEach((order) => {
          this.cart.forEach((cart) => {
            if (order.carts === cart.id) {
              order.day = cart.order_date;
              this.orderList.push(order);
            }
          });
        })
      )
    );
  }

  getCoffeeById() {
    let orderCoffee: ORDERCOFFEEWITHNAME;
    this.coffeeList.forEach((coffee) => {
      this.orderList.forEach((order) => {
        if (coffee.id === order.coffee_id) {
          orderCoffee = {
            name: coffee.coffee_name,
            image: coffee.img,
            item_number: order.item_number,
            item_size: order.item_size,
            price: 0,
            toppings: order.toppings,
            day: order.day,
          };

          let toppingNames: string[] = [];

          order.toppings.forEach((toppingId) => {
            this.topping.forEach((topping) => {
              if (toppingId === topping.id) {
                toppingNames.push(topping.topping_name);
              }
            });
            orderCoffee.toppings = toppingNames;
          });
          if (orderCoffee.item_size === 'M') {
            orderCoffee.price =
              coffee.coffee_priceM * order.item_number +
              orderCoffee.toppings.length * 200;
          } else {
            orderCoffee.price =
              coffee.coffee_priceL * order.item_number +
              orderCoffee.toppings.length * 300;
          }
          this.orderCoffee.push(orderCoffee);
          this.orderCoffee.sort((a, b) => {
            if (a.day && b.day) {
              return a.day > b.day ? -1 : (1 as any);
            }
          });
        }
      });
    });
  }
}
