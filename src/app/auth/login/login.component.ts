import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenService } from '../authen.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginUser: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  id: number = 0;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private authenService: AuthenService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.authenService
      .login(this.loginUser.value)
      .pipe(tap(() => this.router.navigate(['/'])))
      .subscribe((user) => (this.id = user.user.id));
  }
}
