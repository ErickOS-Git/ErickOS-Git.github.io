import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../guard/auth.guard';
import { EmpresaComponent } from './empresa/empresa.component';

const routes: Routes = [
  {
    path: 'empresa', component: LayoutComponent, canActivate: [AuthGuard], children: [

      { path: 'principal', component: EmpresaComponent },
      { path: '', redirectTo: '/empresa/principal', pathMatch: 'full' }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
