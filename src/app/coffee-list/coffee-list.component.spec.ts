import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoffeeService } from '../coffee.service';
import { CoffeeListComponent } from './coffee-list.component';
import { COFFEE } from '../type';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('CoffeeListComponent', () => {
  let component: CoffeeListComponent;
  let fixture: ComponentFixture<CoffeeListComponent>;
  let testList: COFFEE[];
  let getCoffeeListSpy: any;
  let searchButton: HTMLElement;
  let lowButton: HTMLElement;
  let heighButton: HTMLElement;

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
      {
        id: 3,
        coffee_name: 'cafe',
        coffee_detail: 'カフェ',
        img: 'image3',
        coffee_priceM: 150,
        coffee_priceL: 250,
      },
    ];
    const coffeeService = jasmine.createSpyObj('CoffeeService', [
      'getCoffeeList',
    ]);
    getCoffeeListSpy = coffeeService.getCoffeeList.and.returnValue(
      of(testList)
    );

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CoffeeListComponent],
      providers: [{ provide: CoffeeService, useValue: coffeeService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoffeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    searchButton = fixture.debugElement.query(By.css('[data-content="search"]'))
      .nativeElement as HTMLElement;
    lowButton = fixture.debugElement.query(By.css('[data-content="low"]'))
      .nativeElement as HTMLElement;

    heighButton = fixture.debugElement.query(By.css('[data-content="heigh"]'))
      .nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getCoffeeListが機能しているかどうか', () => {
    expect(component.coffeeList).toEqual(testList);
    expect(component.searchCoffee).toEqual(testList);
    expect(component.showSpinner).toEqual(false);
    expect(getCoffeeListSpy.calls.any()).toBe(true);
  });

  it('searchItem()が機能しているかどうか', () => {
    let expectedCoffee = [
      {
        id: 1,
        coffee_name: 'coffee',
        coffee_detail: 'これはコーヒーです',
        img: 'image1',
        coffee_priceM: 200,
        coffee_priceL: 300,
      },
    ];

    component.searchValue = 'coffee';
    searchButton.dispatchEvent(new Event('click'));

    expect(component.searchCoffee).toEqual(expectedCoffee);
  });

  it('searchValueが空の時alertがよびだされるか', () => {
    spyOn(window, 'alert');
    searchButton.dispatchEvent(new Event('click'));
    expect(window.alert).toHaveBeenCalledWith(
      'ご希望の商品名を入力してください'
    );
    expect(component.searchCoffee).toEqual(testList);
  });

  it('該当する商品がない時にalertが呼び出されるか', () => {
    spyOn(window, 'alert');
    component.searchValue = 'tea';
    searchButton.dispatchEvent(new Event('click'));
    expect(window.alert).toHaveBeenCalledWith('該当する商品がありません');
    expect(component.searchCoffee).toEqual(testList);
  });

  it('低い順にソートされるか', () => {
    let expectedCoffeeList = [
      {
        id: 2,
        coffee_name: 'cokkie',
        coffee_detail: 'これはクッキーです',
        img: 'image2',
        coffee_priceM: 100,
        coffee_priceL: 200,
      },
      {
        id: 3,
        coffee_name: 'cafe',
        coffee_detail: 'カフェ',
        img: 'image3',
        coffee_priceM: 150,
        coffee_priceL: 250,
      },
      {
        id: 1,
        coffee_name: 'coffee',
        coffee_detail: 'これはコーヒーです',
        img: 'image1',
        coffee_priceM: 200,
        coffee_priceL: 300,
      },
    ];

    lowButton.dispatchEvent(new Event('click'));
    expect(component.searchCoffee).toEqual(expectedCoffeeList);
  });

  it('高い順にソートされるか', () => {
    let expectedCoffeeList = [
      {
        id: 1,
        coffee_name: 'coffee',
        coffee_detail: 'これはコーヒーです',
        img: 'image1',
        coffee_priceM: 200,
        coffee_priceL: 300,
      },
      {
        id: 3,
        coffee_name: 'cafe',
        coffee_detail: 'カフェ',
        img: 'image3',
        coffee_priceM: 150,
        coffee_priceL: 250,
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
    heighButton.dispatchEvent(new Event('click'));
    expect(component.searchCoffee).toEqual(expectedCoffeeList);
  });
});
