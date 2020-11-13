import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpresaService } from 'src/app/service/empresa.service';
import { Empresa } from '../empresa';

@Component({
  selector: 'app-logo-modal',
  templateUrl: './logo-modal.component.html',
  styleUrls: ['./logo-modal.component.css']
})
export class LogoModalComponent implements OnInit {

  constructor(
    private service: EmpresaService,
    public dialogRef: MatDialogRef<LogoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public empresa: Empresa
  ) { }

  ngOnInit(): void {
  }

  fechar() {
    this.dialogRef.close();
  }

  apagarLogo(){       
    this.service.apagarlogo(this.empresa)
    .subscribe(response => this.fechar()); 
   
  }
}
