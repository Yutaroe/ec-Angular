import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoffeeService } from '../coffee.service';
import { AuthenService } from '../auth/authen.service';
import { COFFEE, TOPPING, CART } from '../type';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-coffee-detail',
  templateUrl: './coffee-detail.component.html',
  styleUrls: ['./coffee-detail.component.css'],
})
export class CoffeeDetailComponent implements OnInit {
  coffee: COFFEE | undefined;
  topping: TOPPING[] = [];
  cart: CART | undefined;
  selectToppings: number[] = [];

  checkBoxFormArray: FormArray | undefined;
  showSpinner = false;

  orderList: FormGroup = this.fb.group({
    item_number: [null, Validators.required],
    item_size: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private coffeeService: CoffeeService,
    private authenService: AuthenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCoffee();
    this.getTopping();
    this.getCart();
  }

  getCoffee(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.coffeeService
      .getCoffee(id)
      .subscribe((coffee) => (this.coffee = coffee));
  }

  getTopping(): void {
    this.coffeeService
      .getToppingList()
      .subscribe((topping) => (this.topping = topping));
  }

  getCart(): void {
    this.showSpinner = true;
    this.authenService
      .getCart()
      .pipe(tap(() => (this.showSpinner = false)))
      .subscribe((data) =>
        data.forEach((mycart) => {
          if (
            mycart.userCart === Number(localStorage['user']) &&
            mycart.status === 0
          ) {
            this.cart = mycart;
          }
        })
      );
  }

  onSubmit() {
    if (this.cart !== undefined) {
      let order = {
        item_number: this.orderList.value.item_number,
        item_size: this.orderList.value.item_size,
        toppings: this.selectToppings,
        coffee_id: this.coffee?.id,
        carts: this.cart.id,
      };
      this.coffeeService
        .orderCoffee(order)
        .pipe(tap(() => this.router.navigate(['/cart'])))
        .subscribe();
    } else {
      let confirm = window.confirm(
        'カートに追加するにはログインをしてください'
      );
      if (confirm) {
        this.router.navigate(['/login']);
      }
    }
  }
}
