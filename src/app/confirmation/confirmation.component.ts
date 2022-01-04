import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../auth/authen.service';
import { CoffeeService } from '../coffee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  COFFEE,
  TOPPING,
  CART,
  ORDEREDCOFFEE,
  ORDERCOFFEEWITHNAME,
} from '../type';
import { mergeMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent implements OnInit {
  coffeeList: COFFEE[] = [];
  topping: TOPPING[] = [];
  cart: CART[] = [];
  orderList: ORDEREDCOFFEE[] = [];
  orderCoffee: ORDERCOFFEEWITHNAME[] = [];
  total: number = 0;

  minDate: Date | undefined;
  maxDate: Date | undefined;

  emailPattern =
    '^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*.)+[a-zA-Z]{2,}$';
  addressNumberPattern = '^[0-9]{7}$';

  address: FormGroup = this.fb.group({
    order_name: ['', Validators.required],
    addressnumber: ['', Validators.required],
    address: ['', Validators.required],
    email: ['', Validators.required],
    order_date: ['', Validators.required],
    order_time: ['', Validators.required],
    tel: ['', Validators.required],
    status: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authenService: AuthenService,
    private coffeeService: CoffeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCoffeeList();
    this.getTopping();
    this.getCart();
    this.minDate = new Date();

    const date = new Date();
    date.setDate(this.minDate.getDate() + 7);
    this.maxDate = date;
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
        tap(() => this.getCoffeeById())
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

  onSubmit() {
    if (this.cart) {
      this.address.value.id = this.cart[0].id;
      this.address.value.userCart = this.cart[0].userCart;
      this.address.value.status = Number(this.address.value.status);
      this.address.value.order_date = this.formDate(
        new Date(this.address.value.order_date)
      );
      this.coffeeService
        .buy(this.address.value)
        .pipe(
          mergeMap(() =>
            this.authenService.createCart(this.address.value.userCart)
          ),
          tap(() => this.router.navigate(['/done']))
        )
        .subscribe();
    }
  }

  formDate(dt: any) {
    let y = dt.getFullYear();
    let m = ('00' + (dt.getMonth() + 1)).slice(-2);
    let d = ('00' + dt.getDate()).slice(-2);
    return y + '-' + m + '-' + d;
  }
}
