import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenService } from '../authen.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  register: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password1: ['', [Validators.required, Validators.minLength(8)]],
    password2: ['', [Validators.required, Validators.minLength(8)]],
  });

  hide = true;

  constructor(private fb: FormBuilder, private authenService: AuthenService) {}

  ngOnInit(): void {}

  showPass() {
    this.hide = !this.hide;
  }

  onSubmit() {
    if (this.register.value.password1 === this.register.value.password2) {
      this.authenService.register(this.register.value);
    } else {
      alert('パスワードが一致しません');
    }
  }
}
