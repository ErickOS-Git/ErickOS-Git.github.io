import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProdutoDetalheComponent } from '../produto-detalhe/produto-detalhe.component';
import { Produto } from '../produto';
import { TipoProduto } from '../tipo-produto';
import { CategoriaProduto } from '../categoria-produto';

@Component({
  selector: 'app-produto-delete',
  templateUrl: './produto-delete.component.html',
  styleUrls: ['./produto-delete.component.css']
})
export class ProdutoDeleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProdutoDetalheComponent>,
    @Inject(MAT_DIALOG_DATA) public produto?: Produto,
    @Inject(MAT_DIALOG_DATA) public categoria?: CategoriaProduto,
    @Inject(MAT_DIALOG_DATA) public tipo?: TipoProduto,
  ) { }

  ngOnInit(): void {
  }

  fechar() {
    this.dialogRef.close();
  }

}
