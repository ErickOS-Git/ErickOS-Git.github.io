import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Fornecedor } from './fornecedor';
import { FornecedorService } from 'src/app/service/fornecedor.service';
import { MascaraUtil } from 'src/app/util/mascara-util';
import { BuscarCepService } from 'src/app/service/buscar-cep.service';
import { FornecedorDeleteComponent } from '../fornecedor-delete/fornecedor-delete.component';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

import { FornecedorDetalheComponent } from '../fornecedor-detalhe/fornecedor-detalhe.component';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.css']
})
export class FornecedorComponent implements OnInit {
 

  mascaraData = MascaraUtil.mascaraNascimento;
  mascaraCpf = MascaraUtil.mascaraCpf;
  mascaraCnpj = MascaraUtil.mascaraCnpj;
  mascaraCelular = MascaraUtil.mascaraCelular;
  mascaraTelefoneFixo = MascaraUtil.mascaraTelefoneFixo;
  errors: string;

  fornecedorNovo: Fornecedor;
  fornecedores: Fornecedor[] = [];

  formulario: FormGroup;
  colunas = ['id', 'razaoSocial', 'cnpj_cpf', 'tipo', 'dataCadastro', 'detalhes', 'apagar'];
  dataSource = new MatTableDataSource<Fornecedor>();

  progress = false;


  totalElementos = 0;
  pagina = 0;
  tamanho = 4;
  pageSizeOptions: number[] = [2, 4, 6, 10];
  filtroTable;


  constructor(
    private service: FornecedorService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cep: BuscarCepService,
  ) {
    this.fornecedorNovo = new Fornecedor();
  }

  ngOnInit(): void {
    this.montarFormulario(this.fornecedorNovo);
    this.listarFornecedor(this.pagina, this.tamanho);
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

  submit() {
    console.log('Salvando....');
    this.progress = true;
    if (this.formulario.controls.checked.value) {
      this.formulario.controls.tipo.setValue('PF');
      this.formulario.controls.cnpj.setValue(null);
    } else if (!this.formulario.controls.checked.value) {
      this.formulario.controls.tipo.setValue('PJ');
      this.formulario.controls.cpf.setValue(null);
    }
    console.log(this.formulario.value);
    this.service.salvar(this.formulario.value)
      .subscribe(response => {
        this.formulario.setValue(response);
        this.fornecedorNovo = response;
        this.progress = false;
        this.service.msg('Salvo Com sucesso');
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg(this.errors, true);
        this.progress = false;
      });

  }

  atualizarFornecedor(event: Event) {
    console.log('Atualizando....');
    event.preventDefault();
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



  listarFornecedor(pagina = 0, tamanho = 4) {
    this.service.getFornecedorAll(pagina, tamanho)
      .subscribe(response => {
        console.log(response);
        this.fornecedores = response.content;
        this.totalElementos = response.totalElements;
        this.pagina = response.number;
        this.dataSource.data = this.fornecedores;
      },
        errorResponse => {
          this.service.msg('Error ao Carregar Clientes', true);
        });
  }

  detalhesFornecedor(fornecedor: Fornecedor) {
    this.dialog.open(FornecedorDetalheComponent, {
      height: '500px',
      width: '850px',
      data: fornecedor
    }).afterClosed().subscribe(response => {
      if (!this.filtroTable) {
        this.listarFornecedor(this.pagina, this.tamanho);
      } else {
        this.service.buscarFornecedor(this.filtroTable, this.pagina, this.tamanho)
          .subscribe(responseAt => {
            this.fornecedores = responseAt.content;
            this.totalElementos = responseAt.totalElements;
            this.pagina = responseAt.number;
            this.dataSource.data = this.fornecedores;
          });
      }
    });

  }

  applyFilter(event: Event) {
    this.filtroTable = (event.target as HTMLInputElement).value;
    this.service.buscarFornecedor(this.filtroTable, 0, 4)
      .subscribe(response => {
        this.fornecedores = response.content;
        this.totalElementos = response.totalElements;
        this.pagina = response.number;
        this.dataSource.data = this.fornecedores;
      },
        errorResponse => {
          this.service.msg('erro ao buscar', true);
        });
    this.dataSource.filter = this.filtroTable.trim().toLowerCase();

  }

  preparaDelecaoForm(fornecedor: Fornecedor, event: Event) {
    event.preventDefault();
    this.dialog.open(FornecedorDeleteComponent, {
      data: fornecedor
    }).afterClosed().subscribe(responseClose => {
      if (responseClose) {
        this.progress = true;
        this.service.deletar(fornecedor)
          .subscribe(responseDelete => {
            this.service.msg('Fornecedor deletado!');
            this.fornecedorNovo = new Fornecedor();
            this.formulario.reset();
            this.progress = false;
          }, errorResponse => {
            this.service.msg('Ocorreu um erro ao deletar o Fornecedor!', true);
            this.progress = false;
          });
      }
    });
  }

  preparaDelecaoList(fornecedor: Fornecedor, event: Event) {
    event.preventDefault();
    this.dialog.open(FornecedorDeleteComponent, {
      data: fornecedor
    }).afterClosed().subscribe(response => {
      if (response) {
   
        this.service.deletar(fornecedor)
          .subscribe(responseDelete => {
            this.service.msg('Fornecedor deletado com sucesso!');
            if (!this.filtroTable) {
              this.listarFornecedor(this.pagina, this.tamanho);
             
            } else {
              this.service.buscarFornecedor(this.filtroTable, this.pagina, this.tamanho)
                .subscribe(responseFilter => {
                  this.fornecedores = responseFilter.content;
                  this.totalElementos = responseFilter.totalElements;
                  this.pagina = responseFilter.number;
                  this.dataSource.data = this.fornecedores;

                });
            }

          }, errorResponse => {
            this.service.msg('Ocorreu um erro ao deletar o cliente', true);

          });
      }
    });
  }

  paginar(event: PageEvent) {
    this.pagina = event.pageIndex;
    this.tamanho = event.pageSize;
    this.listarFornecedor(this.pagina, this.tamanho);
  }

  novoCliente(event: Event) {
    event.preventDefault();
    this.fornecedorNovo = new Fornecedor();
    this.formulario.reset();
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

}
