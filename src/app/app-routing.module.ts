import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoffeeListComponent } from './coffee-list/coffee-list.component';
import { CoffeeDetailComponent } from './coffee-detail/coffee-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CartComponent } from './cart/cart.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { OrderdoneComponent } from './orderdone/orderdone.component';
import { OrderedComponent } from './ordered/ordered.component';

const routes: Routes = [
  { path: 'list', component: CoffeeListComponent },
  { path: 'detail/:id', component: CoffeeDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'done', component: OrderdoneComponent },
  { path: 'ordered', component: OrderedComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
