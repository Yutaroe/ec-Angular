import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { CoffeeListComponent } from '../../coffee-list/coffee-list.component';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginUser: FormGroup;
  let emailInput: HTMLInputElement;
  let passInput: HTMLInputElement;
  let button: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      declarations: [LoginComponent, CoffeeListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loginUser = component.loginUser;
    emailInput = fixture.debugElement.query(
      By.css('[placeholder="メールアドレス"]')
    ).nativeElement as HTMLInputElement;
    passInput = fixture.debugElement.query(By.css('[placeholder="パスワード"]'))
      .nativeElement as HTMLInputElement;
    button = fixture.debugElement.query(By.css('button'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('click should toggle hide', () => {
    expect(component.hide).toBe(true);
    component.showPass();
    expect(component.hide).toBe(false);
    component.showPass();
    expect(component.hide).toBe(true);
  });

  it('値が正しく入力されるか', () => {
    emailInput.value = 'test@gmail.com';
    passInput.value = 'password';
    emailInput.dispatchEvent(new Event('input'));
    passInput.dispatchEvent(new Event('input'));
    expect(loginUser.value.email).toBe('test@gmail.com');
    expect(loginUser.value.password).toBe('password');
    expect(loginUser.valid).toBeTruthy();
  });

  it('requiredエラーが発生する場合にFormGroupは無効か', () => {
    expect(loginUser.invalid).toBeTruthy();
  });

  it('正しく入力されているときonSubmit()が呼び出されるか', () => {
    let spyObject = spyOn(component, 'onSubmit');

    emailInput.value = 'test@gmail.com';
    passInput.value = 'password';
    emailInput.dispatchEvent(new Event('input'));
    passInput.dispatchEvent(new Event('input'));

    button.triggerEventHandler('click', null);

    expect(spyObject).toHaveBeenCalled();
  });
});
