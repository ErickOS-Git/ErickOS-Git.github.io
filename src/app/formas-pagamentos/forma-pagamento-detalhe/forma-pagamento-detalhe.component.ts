import { Component, OnInit, Inject } from '@angular/core';
import { FormaPagamento } from '../forma-pagamento';
import { FormaPagamentoService } from 'src/app/service/forma-pagamento.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forma-pagamento-detalhe',
  templateUrl: './forma-pagamento-detalhe.component.html',
  styleUrls: ['./forma-pagamento-detalhe.component.css']
})
export class FormaPagamentoDetalheComponent implements OnInit {

  formulario: FormGroup;
  errors: string;
  progress = false;

  constructor(
    private service: FormaPagamentoService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormaPagamentoDetalheComponent>,
    @Inject(MAT_DIALOG_DATA) public formaPagamentoAtualizado: FormaPagamento
  ) { 
   
  }

  ngOnInit(): void {
    this.formularioFormaPagamento(this.formaPagamentoAtualizado);
  }

  formularioFormaPagamento(formFp: FormaPagamento) {
    this.formulario = this.fb.group({
      id: [formFp.id],
      tipoPagamento: [formFp.tipoPagamento, Validators.required],
      descricao: [formFp.descricao, Validators.required],
      taxa: [formFp.taxa]
    });
  }

  atualizarFormaPagamento() {
    this.progress = true;
    this.service.atualizar(this.formulario.value).subscribe(reponse => {
      this.service.msg('Atualizado com sucesso!');
      this.progress = false;
    }, errorResponse => {
      this.errors = errorResponse.error.errors;
      this.service.msg(this.errors, true);
      this.progress = false;
    });
  }

  fechar() {
    this.dialogRef.close();
  }

}
