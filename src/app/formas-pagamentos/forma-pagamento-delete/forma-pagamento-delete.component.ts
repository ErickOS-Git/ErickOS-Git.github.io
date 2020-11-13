import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormaPagamento } from '../forma-pagamento';

@Component({
  selector: 'app-forma-pagamento-delete',
  templateUrl: './forma-pagamento-delete.component.html',
  styleUrls: ['./forma-pagamento-delete.component.css']
})
export class FormaPagamentoDeleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FormaPagamentoDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public formaPagamento: FormaPagamento
  ) { }

  ngOnInit(): void {
  }

  fechar() {
    this.dialogRef.close();
  }


}
