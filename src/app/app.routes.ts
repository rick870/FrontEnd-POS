import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Login/login';
import { LayoutComponent } from './Components/layout/layout';
import { CategoryComponent } from './Components/category/category';
import { UserComponent } from './Components/user/user';
import { authGuard } from './Guards/auth.guard';
import { ProviderComponent } from './Components/provider/provider';
import { ClientComponent } from './Components/client/client';
import { ProductComponent } from './Components/product/product';
import { SaleComponent } from './Components/sale/sale';
import { DashboardComponent } from './Components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'categories', component: CategoryComponent },
      { path: 'users', component: UserComponent },
      { path: 'providers', component: ProviderComponent },
      { path: 'clients', component: ClientComponent },
      { path: 'products', component: ProductComponent },
      { path: 'sales', component: SaleComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'categories', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];