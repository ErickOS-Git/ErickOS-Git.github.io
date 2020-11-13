import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../guard/auth.guard';




const routes: Routes = [
  {
    path: 'clientes', component: LayoutComponent, canActivate: [AuthGuard], children: [

      { path: 'principal', component: ClienteComponent },
      { path: '', redirectTo: '/clientes/principal', pathMatch: 'full' }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
