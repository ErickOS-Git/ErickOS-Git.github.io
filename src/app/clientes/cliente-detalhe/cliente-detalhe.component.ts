import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../cliente';
import { ClientesService } from 'src/app/service/clientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MascaraUtil } from 'src/app/util/mascara-util';

@Component({
  selector: 'app-cliente-detalhe',
  templateUrl: './cliente-detalhe.component.html',
  styleUrls: ['./cliente-detalhe.component.css']
})
export class ClienteDetalheComponent implements OnInit {


  formulario: FormGroup;
  errors: string;
  progress = false;
  mascaraData = MascaraUtil.mascaraNascimento;
  mascaraCpf = MascaraUtil.mascaraCpf;
  mascaraCelular = MascaraUtil.mascaraCelular;
  mascaraTelefoneFixo = MascaraUtil.mascaraTelefoneFixo;

  constructor(
    private fb: FormBuilder,
    private service: ClientesService,
    public dialogRef: MatDialogRef<ClienteDetalheComponent>,
    @Inject(MAT_DIALOG_DATA) public clienteAtualizado: Cliente
  ) { }

  ngOnInit(): void {
    this.montarFormulario(this.clienteAtualizado);
  }

  montarFormulario(clienteAtualizar: Cliente) {
    this.formulario = this.fb.group({
      id: [clienteAtualizar.id, Validators.required],
      nome: [clienteAtualizar.nome, Validators.required],
      cpf: [clienteAtualizar.cpf, Validators.required],
      rg: [clienteAtualizar.rg],
      dataNascimento: [clienteAtualizar.dataNascimento, Validators.required],
      dataCadastro: [{
        value: clienteAtualizar.dataCadastro,
        disabled: true
      }, Validators.required],
      sexo: [clienteAtualizar.sexo],
      email: [clienteAtualizar.email, Validators.email],
      celular: [clienteAtualizar.celular],
      telefone: [clienteAtualizar.telefone],
      observacao: [clienteAtualizar.observacao],

      cep1: [clienteAtualizar.cep1],
      bairro1: [clienteAtualizar.bairro1],
      lagradouro1: [clienteAtualizar.lagradouro1],
      complemento1: [clienteAtualizar.complemento1],
      numero1: [clienteAtualizar.numero1],

      cep2: [clienteAtualizar.cep2],
      bairro2: [clienteAtualizar.bairro2],
      lagradouro2: [clienteAtualizar.lagradouro2],
      complemento2: [clienteAtualizar.complemento2],
      numero2: [clienteAtualizar.numero2]
    });
  }


  atualizarCliente() {
    this.progress = true;
    this.service.atualizar(this.formulario.value).subscribe(reponse => {
      this.service.msg('Cliente atualizado com sucesso');
      this.progress = false;
    }, errorResponse => {
      this.errors = errorResponse.error.errors;
      this.service.msg(this.errors, true);
      this.progress = false;
    });
  }

  buscarCep1(event: Event) {
    const cep = (event.target as HTMLInputElement).value;
    this.service
      .buscarCep(cep)
      .subscribe(response => {
        this.formulario.controls.bairro1.setValue(response.bairro);
        this.formulario.controls.lagradouro1.setValue(response.logradouro);
        this.formulario.controls.complemento1.setValue(response.complemento);
      }
      );
  }

  buscarCep2(event: Event) {
    const cep = (event.target as HTMLInputElement).value;
    this.service
      .buscarCep(cep)
      .subscribe(response => {
        this.formulario.controls.bairro2.setValue(response.bairro);
        this.formulario.controls.lagradouro2.setValue(response.logradouro);
        this.formulario.controls.complemento2.setValue(response.complemento);
      }
      );
  }

  fechar() {
    this.dialogRef.close();
  }

}
