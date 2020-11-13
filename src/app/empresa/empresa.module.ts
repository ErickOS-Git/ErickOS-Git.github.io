import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { EmpresaComponent } from './empresa/empresa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TextMaskModule } from 'angular2-text-mask';
import { LogoModalComponent } from './logo-modal/logo-modal.component';


@NgModule({
  declarations: [EmpresaComponent, LogoModalComponent],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    MatRadioModule,
    MatTabsModule,
    MatTableModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatRadioModule,
    MatPaginatorModule,
    TextMaskModule,
    
  ],
  exports:[
    EmpresaComponent,
    LogoModalComponent
  ]
})
export class EmpresaModule { }
