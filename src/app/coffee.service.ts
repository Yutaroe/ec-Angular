import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { COFFEE, TOPPING, ORDEREDCOFFEE, BUY } from './type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoffeeService {
  private apiUrl = 'http://3.145.158.138:8000/api/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getCoffeeList(): Observable<COFFEE[]> {
    return this.http.get<COFFEE[]>(this.apiUrl + 'coffee/');
  }

  getToppingList(): Observable<TOPPING[]> {
    return this.http.get<TOPPING[]>(this.apiUrl + 'topping/');
  }

  getCoffee(id: number): Observable<COFFEE> {
    return this.http.get<COFFEE>(this.apiUrl + `coffee/${id}/`);
  }

  orderCoffee(order: any) {
    return this.http.post(
      this.apiUrl + 'ordercoffee/',
      order,
      this.httpOptions
    );
  }

  getOrderCoffee(): Observable<ORDEREDCOFFEE[]> {
    return this.http.get<ORDEREDCOFFEE[]>(this.apiUrl + 'ordercoffee/');
  }

  deleteCartItem(id: number) {
    return this.http.delete(this.apiUrl + `ordercoffee/${id}/`);
  }

  buy(user: BUY) {
    let id = user.id;
    return this.http.put(this.apiUrl + `cart/${id}/`, user, this.httpOptions);
  }
}
