import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './guard/auth.guard';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent, children: [
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },           
      { path: '', redirectTo: '/home', pathMatch: 'full' }
    ]
  },
  {
    path: '', component: LayoutComponent, children: [
      { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [AuthGuard] },          
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
