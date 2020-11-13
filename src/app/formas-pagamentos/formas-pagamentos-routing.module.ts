import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../guard/auth.guard';
import { FormaPagamentoComponent } from './forma-pagamento/forma-pagamento.component';

const routes: Routes = [
  {
    path: 'forma-pagamento', component: LayoutComponent, canActivate: [AuthGuard], children: [
      { path: 'principal', component: FormaPagamentoComponent },
      { path: '', redirectTo: '/forma-pagamento/principal', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormasPagamentosRoutingModule { }
