import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { CoffeeService } from './coffee.service';
import { COFFEE, TOPPING } from './type';

describe('CoffeeService', () => {
  let service: CoffeeService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CoffeeService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected coffees', () => {
    const expectedCoffees: COFFEE[] = [
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

    service.getCoffeeList().subscribe((coffeeList) => {
      expect(coffeeList).toEqual(expectedCoffees);
    });

    const req = httpTestingController.expectOne(
      'http://3.145.158.138:8000/api/coffee/'
    );

    expect(req.request.method).toEqual('GET');
    req.flush(expectedCoffees);
  });

  it('should return expected oppings', () => {
    const expectedToppings: TOPPING[] = [
      {
        id: 1,
        topping_name: 'チョコレート',
        topping_priceM: 200,
        topping_priceL: 300,
      },
      {
        id: 2,
        topping_name: 'マシュマロ',
        topping_priceM: 200,
        topping_priceL: 300,
      },
    ];

    service.getToppingList().subscribe((toppings) => {
      expect(toppings).toEqual(expectedToppings);
    });

    const req = httpTestingController.expectOne(
      'http://3.145.158.138:8000/api/topping/'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(expectedToppings);
  });

  it('should return expected coffee', () => {
    const expectedCoffee: COFFEE = {
      id: 1,
      coffee_name: 'coffee',
      coffee_detail: 'これはコーヒーです',
      img: 'image1',
      coffee_priceM: 200,
      coffee_priceL: 300,
    };

    service.getCoffee(expectedCoffee.id).subscribe((coffee) => {
      expect(coffee).toEqual(expectedCoffee);
    });

    const req = httpTestingController.expectOne(
      `http://3.145.158.138:8000/api/coffee/${expectedCoffee.id}/`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(expectedCoffee);
  });

  it('POST orderCoffee', () => {
    const postData = {
      item_number: 2,
      item_size: 'M',
      toppings: [1, 3, 5],
      coffee_id: 4,
      carts: 1,
    };

    service.orderCoffee(postData).subscribe((order) => {
      expect(order).toEqual(postData);
    });
    const req = httpTestingController.expectOne(
      'http://3.145.158.138:8000/api/ordercoffee/'
    );
    expect(req.request.method).toEqual('POST');
    req.flush(postData);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
