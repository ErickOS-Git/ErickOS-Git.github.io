import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../cliente';
import { ClientesService } from 'src/app/service/clientes.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cliente-delete',
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['./cliente-delete.component.css']
})
export class ClienteDeleteComponent implements OnInit {

 

  constructor(
    public dialogRef: MatDialogRef<ClienteDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public cliente: Cliente
  ) { }

  ngOnInit(): void {
  }

  fechar() {
    this.dialogRef.close();
  }

}
