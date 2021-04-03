import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../guard/auth.guard';
import { LancamentoComponent } from '../lancamentos/lancamento/lancamento.component';
import { ProdutoComponent } from '../produtos/produto/produto.component'

const routes: Routes = [
  {
    path: 'lancamento', component: LayoutComponent, canActivate: [AuthGuard], children: [
      { path: 'principal', component: LancamentoComponent },
      { path: '', redirectTo: '/lancamento/principal', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LancamentosRoutingModule { }

