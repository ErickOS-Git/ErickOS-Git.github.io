import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Fornecedor } from '../fornecedor/fornecedor';
import { FornecedorService } from 'src/app/service/fornecedor.service';

@Component({
  selector: 'app-fornecedor-delete',
  templateUrl: './fornecedor-delete.component.html',
  styleUrls: ['./fornecedor-delete.component.css']
})
export class FornecedorDeleteComponent implements OnInit {

  progress = false;

  constructor(
    private service: FornecedorService,
    public dialogRef: MatDialogRef<FornecedorDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public fornecedor: Fornecedor
  ) { }

  ngOnInit(): void {
  }

  deletarFornecedor() {
    this.progress = true;
    this.service.deletar(this.fornecedor)
      .subscribe(response => {
        this.service.msg('Fornecedor deletado!');
        this.fechar();
        this.progress = false;
      }, errorResponse => {
        this.service.msg('Ocorreu um erro ao deletar o Fornecedor!', true);
        this.progress = false;
      });
  }

  fechar() {
    this.dialogRef.close();
  }
}
