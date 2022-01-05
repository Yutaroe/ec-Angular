import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LOGIN, USER, CART, REGISTER } from '../type';
import { map, mergeMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenService {
  private apiUrl = 'http://3.145.158.138:8000/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient, private router: Router) {}

  login(user: LOGIN): Observable<USER> {
    return this.http
      .post<any>(this.apiUrl + 'api/rest-auth/login/', user, this.httpOptions)
      .pipe(
        catchError(this.errorLogin({})),
        map((user) => user as USER),
        tap((user) => (localStorage['user'] = user.user.id))
      );
  }

  getCart(): Observable<CART[]> {
    return this.http.get<CART[]>(this.apiUrl + 'api/cart/');
  }

  register(user: REGISTER): void {
    this.http
      .post(this.apiUrl + 'api/rest-auth/registration/', user, this.httpOptions)
      .pipe(
        catchError(this.errorRegister({})),
        map((newUser) => newUser as USER),
        mergeMap((newUser) => this.createCart(newUser.user.id)),
        tap(() => this.router.navigate(['/login']))
      )
      .subscribe();
  }

  createCart(id: number): Observable<any> {
    let status = {
      userCart: id,
      status: 0,
    };
    return this.http.post(this.apiUrl + 'api/cart/', status, this.httpOptions);
  }

  errorLogin<T>(result?: T) {
    return (error: any): Observable<T> => {
      if (error.error.email) {
        alert('有効なメールアドレスを入力してください');
      } else if (error.error.non_field_errors) {
        alert('パスワードが異なります');
      }
      console.error(error);
      return of(result as T);
    };
  }

  errorRegister<T>(result?: T) {
    return (error: any): Observable<T> => {
      if (error.error.email) {
        alert('有効なメールアドレスを入力してください');
      } else if (error.error.password1) {
        alert('入力されたパスワードは一般的すぎます');
      }
      console.error(error);
      return of(result as T);
    };
  }
}
