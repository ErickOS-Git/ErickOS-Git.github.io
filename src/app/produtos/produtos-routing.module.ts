import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { ProdutoComponent } from './produto/produto.component';
import { AuthGuard } from '../guard/auth.guard';


const routes: Routes = [
  {
    path: 'produtos', component: LayoutComponent, canActivate: [AuthGuard], children: [
      { path: 'principal', component: ProdutoComponent },
      { path: '', redirectTo: '/produtos/principal', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdutosRoutingModule { }
