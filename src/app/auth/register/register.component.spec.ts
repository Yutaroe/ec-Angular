import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegisterComponent } from './register.component';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let register: FormGroup;
  let emailInput: HTMLInputElement;
  let pass1Input: HTMLInputElement;
  let pass2Input: HTMLInputElement;
  let button: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        HttpClientTestingModule,
      ],
      declarations: [RegisterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    register = component.register;
    emailInput = fixture.debugElement.query(
      By.css('[placeholder="メールアドレス"]')
    ).nativeElement as HTMLInputElement;
    pass1Input = fixture.debugElement.query(
      By.css('[placeholder="パスワード(8文字以上)"]')
    ).nativeElement as HTMLInputElement;
    pass2Input = fixture.debugElement.query(
      By.css('[placeholder="パスワード再入力"]')
    ).nativeElement as HTMLInputElement;
    button = fixture.debugElement.query(By.css('button'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hideを切り替えられるかどうか', () => {
    expect(component.hide).toBe(true);
    component.showPass();
    expect(component.hide).toBe(false);
    component.showPass();
    expect(component.hide).toBe(true);
  });

  it('値が正しく入力されるか', () => {
    emailInput.value = 'test@gmail.com';
    pass1Input.value = 'password';
    pass2Input.value = 'password';
    emailInput.dispatchEvent(new Event('input'));
    pass1Input.dispatchEvent(new Event('input'));
    pass2Input.dispatchEvent(new Event('input'));

    expect(register.value.email).toBe('test@gmail.com');
    expect(register.value.password1).toBe('password');
    expect(register.value.password2).toBe('password');
    expect(register.valid).toBeTruthy();
  });

  it('requiredエラーが発生する場合にFormGroupは無効か', () => {
    expect(register.invalid).toBeTruthy();
  });

  it('passwordが8文字以下の場合FormGroupは無効か', () => {
    emailInput.value = 'test@gmail.com';
    pass1Input.value = 'passwor';
    pass2Input.value = 'passwor';
    emailInput.dispatchEvent(new Event('input'));
    pass1Input.dispatchEvent(new Event('input'));
    pass2Input.dispatchEvent(new Event('input'));

    expect(register.invalid).toBeTruthy();
  });

  it('正しく入力されているときonSubmit()が呼び出されるか', () => {
    let spyObject = spyOn(component, 'onSubmit');

    register.setValue({
      email: 'test@gmail.com',
      password1: 'password',
      password2: 'password',
    });

    button.triggerEventHandler('click', null);

    expect(spyObject).toHaveBeenCalled();
  });

  it('パスワードが異なる時、アラートが表示されるか', () => {
    spyOn(window, 'alert');
    register.setValue({
      email: 'test@gmail.com',
      password1: 'password',
      password2: 'testtest',
    });

    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('パスワードが一致しません');
  });
});
