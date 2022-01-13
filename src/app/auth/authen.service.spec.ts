import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthenService } from './authen.service';
import { CART } from '../type';
import { tap } from 'rxjs/operators';

describe('AuthenService', () => {
  let service: AuthenService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
    });
    service = TestBed.inject(AuthenService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('ログインが成功するか', () => {
    const user = {
      email: 'test@gmail.com',
      password: 'password',
    };
    const expectUser = {
      token: 'abc123',
      user: { id: 1, email: 'test@gmail.com' },
    };

    service.login(user).subscribe((user) => {
      expect(user).toEqual(expectUser);
    });

    const req = httpTestingController.expectOne(
      'http://3.145.158.138:8000/api/rest-auth/login/'
    );
    expect(req.request.method).toEqual('POST');
    req.flush(expectUser);
  });

  it('getCart()が機能しているか', () => {
    const expectCart: CART[] = [
      {
        id: 1,
        userCart: 1,
        order_name: '',
        addressnumber: '',
        address: '',
        email: '',
        order_date: '',
        order_time: 0,
        tel: '',
        status: 0,
      },
    ];

    service.getCart().subscribe((cart) => {
      expect(cart).toEqual(expectCart);
    });

    const req = httpTestingController.expectOne(
      'http://3.145.158.138:8000/api/cart/'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(expectCart);
  });

  it('カート作成ができるかどうか', () => {
    const expectCart: CART = {
      id: 1,
      userCart: 1,
      order_name: '',
      addressnumber: '',
      address: '',
      email: '',
      order_date: '',
      order_time: 0,
      tel: '',
      status: 0,
    };

    const userId = 1;

    service.createCart(userId).subscribe((newCart) => {
      expect(newCart).toEqual(expectCart);
    });

    const req = httpTestingController.expectOne(
      'http://3.145.158.138:8000/api/cart/'
    );
    expect(req.request.method).toEqual('POST');
    req.flush(expectCart);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
