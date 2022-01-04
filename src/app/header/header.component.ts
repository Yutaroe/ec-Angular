import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../auth/authen.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  id: any;
  constructor(private authenService: AuthenService, private router: Router) {}

  ngOnInit(): void {
    this.id = localStorage['user'];
  }

  logout() {
    let confirm = window.confirm('ログアウトしますか？');
    if (confirm) {
      this.id = null;
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }
  }
}
