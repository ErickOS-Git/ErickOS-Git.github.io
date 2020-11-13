import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../guard/auth.guard';


const routes: Routes = [
  {
    path: 'fornecedores', component: LayoutComponent, canActivate: [AuthGuard], children: [
      { path: 'principal', component: FornecedorComponent },
      { path: '', redirectTo: '/fornecedores/principal', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FornecedoresRoutingModule { }
