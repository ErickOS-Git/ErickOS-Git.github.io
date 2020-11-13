import { Component, OnInit, Inject } from '@angular/core';
import { MascaraUtil } from 'src/app/util/mascara-util';
import { Fornecedor } from '../fornecedor/fornecedor';
import { FornecedorService } from 'src/app/service/fornecedor.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuscarCepService } from 'src/app/service/buscar-cep.service';

@Component({
  selector: 'app-fornecedor-detalhe',
  templateUrl: './fornecedor-detalhe.component.html',
  styleUrls: ['./fornecedor-detalhe.component.css']
})
export class FornecedorDetalheComponent implements OnInit {

  mascaraData = MascaraUtil.mascaraNascimento;
  mascaraCpf = MascaraUtil.mascaraCpf;
  mascaraCnpj = MascaraUtil.mascaraCnpj;
  mascaraCelular = MascaraUtil.mascaraCelular;
  mascaraTelefoneFixo = MascaraUtil.mascaraTelefoneFixo;
  errors: string;
  progress = false;

  formulario: FormGroup;

  constructor(
    private cep: BuscarCepService,
    private fb: FormBuilder,
    private service: FornecedorService,
    public dialogRef: MatDialogRef<FornecedorDetalheComponent>,
    @Inject(MAT_DIALOG_DATA) public fornecedorAtualizado: Fornecedor
  ) { }

  ngOnInit(): void {
    this.montarFormulario(this.fornecedorAtualizado);
  }

  montarFormulario(fornecedorForm: Fornecedor) {
    this.formulario = this.fb.group({
      id: [fornecedorForm.id],
      razaoSocial: [fornecedorForm.razaoSocial, Validators.required],
      cpf: [fornecedorForm.cpf],
      cnpj: [fornecedorForm.cnpj],
      checked: [fornecedorForm.checked = false],
      tipo: [fornecedorForm.tipo],
      inscricaoEstadual: [fornecedorForm.inscricaoEstadual],
      inscricaoMunicipal: [fornecedorForm.inscricaoMunicipal],
      celular: [fornecedorForm.celular],
      telefone: [fornecedorForm.endereco],
      dataCadastro: [fornecedorForm.dataCadastro],
      dataAbertura: [fornecedorForm.dataAbertura],
      endereco: [fornecedorForm.endereco],
      numero: [fornecedorForm.numero],
      bairro: [fornecedorForm.bairro],
      cidade: [fornecedorForm.cidade],
      estado: [fornecedorForm.estado],
      cep: [fornecedorForm.cep],
      email: [fornecedorForm.email],
      site: [fornecedorForm.site],
      observacao: [fornecedorForm.observacao]
    });
  }

  atualizarFornecedor() {
    this.progress = true;
    if (this.formulario.controls.checked.value) {
      this.formulario.controls.tipo.setValue('PF');
      this.formulario.controls.cnpj.setValue(null);
    } else if (!this.formulario.controls.checked.value) {
      this.formulario.controls.tipo.setValue('PJ');
      this.formulario.controls.cpf.setValue(null);
    }
    this.service.atualizar(this.formulario.value)
      .subscribe(response => {
        this.service.msg('Fornecedor atualizado.');
        this.progress = false;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
        this.progress = false;
      });
  }


  buscarCep(event: Event) {
    const cep = (event.target as HTMLInputElement).value;
    this.cep
      .buscarCep(cep)
      .subscribe(response => {
        this.formulario.controls.bairro.setValue(response.bairro);
        this.formulario.controls.endereco.setValue(response.logradouro);
        this.formulario.controls.estado.setValue(response.uf);
        this.formulario.controls.cidade.setValue(response.localidade);
      }
      );
  }

  fechar() {
    this.dialogRef.close();
  }

}
