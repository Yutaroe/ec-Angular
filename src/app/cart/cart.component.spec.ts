import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartComponent } from './cart.component';
import { CoffeeService } from '../coffee.service';
import { AuthenService } from '../auth/authen.service';
import { COFFEE, TOPPING, CART, ORDEREDCOFFEE } from '../type';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let testList: COFFEE[];
  let testToppings: TOPPING[];
  let testCart: CART[];
  let testOrderedCoffee: ORDEREDCOFFEE[];
  let getCoffeeListSpy: any;
  let getToppingListSpy: any;
  let getCartSpy: any;
  let getOrderCoffeeSpy: any;
  let deleteCartItemSpy: any;
  let deleteButton: HTMLElement;

  beforeEach(async () => {
    testList = [
      {
        id: 1,
        coffee_name: 'coffee',
        coffee_detail: 'これはコーヒーです',
        img: 'image1',
        coffee_priceM: 200,
        coffee_priceL: 300,
      },
      {
        id: 2,
        coffee_name: 'cokkie',
        coffee_detail: 'これはクッキーです',
        img: 'image2',
        coffee_priceM: 100,
        coffee_priceL: 200,
      },
    ];
    testToppings = [
      {
        id: 1,
        topping_name: 'チョコ',
        topping_priceM: 200,
        topping_priceL: 300,
      },
    ];
    testCart = [
      {
        id: 1,
        userCart: 1,
        status: 0,
      },
    ];
    testOrderedCoffee = [
      {
        id: 1,
        item_number: 2,
        coffee_id: 1,
        item_size: 'M',
        toppings: [1],
        carts: 1,
      },
      {
        id: 3,
        item_number: 1,
        coffee_id: 2,
        item_size: 'L',
        toppings: [1],
        carts: 2,
      },
    ];
    const coffeeService = jasmine.createSpyObj('CoffeeService', [
      'getCoffeeList',
      'getToppingList',
      'getOrderCoffee',
      'deleteCartItem',
    ]);

    const authenService = jasmine.createSpyObj('AuthenService', ['getCart']);

    getCoffeeListSpy = coffeeService.getCoffeeList.and.returnValue(
      of(testList)
    );
    getToppingListSpy = coffeeService.getToppingList.and.returnValue(
      of(testToppings)
    );
    getCartSpy = authenService.getCart.and.returnValue(of(testCart));
    getOrderCoffeeSpy = coffeeService.getOrderCoffee.and.returnValue(
      of(testOrderedCoffee)
    );
    deleteCartItemSpy = coffeeService.deleteCartItem;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      declarations: [CartComponent],
      providers: [
        { provide: CoffeeService, useValue: coffeeService },
        { provide: AuthenService, useValue: authenService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deleteButton = fixture.debugElement.query(By.css('.delete'))
      .nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getCoffeeListが機能しているかどうか', () => {
    expect(component.coffeeList).toEqual(testList);
    expect(getCoffeeListSpy.calls.any()).toBe(true);
  });

  it('getToppingが機能しているかどうか', () => {
    expect(component.topping).toEqual(testToppings);
    expect(getToppingListSpy.calls.any()).toBe(true);
  });

  it('getCartが機能しているかどうか', () => {
    expect(component.cart).toEqual(testCart);
    expect(getCartSpy.calls.any()).toBe(true);
  });

  it('getOrderCoffeeが機能しているかどうか', () => {
    let expectedOrderCoffee = [
      {
        id: 1,
        item_number: 2,
        coffee_id: 1,
        item_size: 'M',
        toppings: [1],
        carts: 1,
      },
    ];
    expect(getOrderCoffeeSpy.calls.any()).toBe(true);
    expect(component.orderList).toEqual(expectedOrderCoffee);
  });

  it('getCoffeeByIdが機能しているかどうか', () => {
    let expectedOrderCoffeeWithName = [
      {
        name: 'coffee',
        image: 'image1',
        item_number: 2,
        item_size: 'M',
        price: 600,
        toppings: ['チョコ'],
      },
    ];
    expect(component.orderCoffee).toEqual(expectedOrderCoffeeWithName);
  });

  it('deleteCartItemが機能しているかどうか', () => {
    deleteButton.dispatchEvent(new Event('click'));
    expect(deleteCartItemSpy.calls.any()).toBe(true);
  });
});
