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
import { mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  coffeeList: COFFEE[] = [];
  topping: TOPPING[] = [];
  cart: CART[] = [];
  orderList: ORDEREDCOFFEE[] = [];
  orderCoffee: ORDERCOFFEEWITHNAME[] = [];
  total: number = 0;
  showSpinner: boolean = false;

  constructor(
    private authenService: AuthenService,
    private coffeeService: CoffeeService
  ) {}

  ngOnInit(): void {
    this.getCoffeeList();
    this.getTopping();
    this.getCart();
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
              mycart.status === 0
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
          if (order.carts === this.cart[0].id) {
            this.orderList.push(order);
          }
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
          this.total = this.orderCoffee.reduce((a, b) => {
            return a + b.price;
          }, 0);
        }
      });
    });
  }

  deleteItem(i: number) {
    this.coffeeService.deleteCartItem(this.orderList[i].id).subscribe();
    this.orderCoffee.splice(i, 1);
    this.orderList.splice(i, 1);
  }
}
