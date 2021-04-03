import { Component, OnInit, LOCALE_ID, Inject, ViewChild, TemplateRef } from '@angular/core';
import { Cliente } from '../cliente';
import { ClientesService } from 'src/app/service/clientes.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MascaraUtil } from 'src/app/util/mascara-util';
import { ClienteDeleteComponent } from '../cliente-delete/cliente-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { ClienteDetalheComponent } from '../cliente-detalhe/cliente-detalhe.component';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})

export class ClienteComponent implements OnInit {

  // mascaras para o formulário
  mascaraData = MascaraUtil.mascaraNascimento;
  mascaraCpf = MascaraUtil.mascaraCpf;
  mascaraRg = MascaraUtil.mascaraRg;
  mascaraCelular = MascaraUtil.mascaraCelular;
  mascaraTelefoneFixo = MascaraUtil.mascaraTelefoneFixo;
  errors: string;


  formulario: FormGroup;
  colunas = ['id', 'nome', 'cpf', 'dataCadastro', 'detalhes', 'apagar'];
  dataSource = new MatTableDataSource<Cliente>();
  progress = false;


  clientes: Cliente[] = [];
  clientenovo: Cliente;

  totalElementos = 0;
  pagina = 0;
  tamanho = 4;
  pageSizeOptions: number[] = [2, 4, 6, 10];
  filtroTable;


  constructor(
    @Inject(LOCALE_ID) locale: string,
    private service: ClientesService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.clientenovo = new Cliente();
  }

  ngOnInit(): void {
    this.listaClientes(this.pagina, this.tamanho);
    this.montarFormulario(this.clientenovo);
  }


  montarFormulario(clienteForm: Cliente) {

    this.formulario = this.fb.group({
      id: [clienteForm.id],
      nome: [clienteForm.nome, Validators.required],
      cpf: [clienteForm.cpf, Validators.required],
      rg: [clienteForm.rg],
      dataNascimento: [clienteForm.dataNascimento, Validators.required],
      dataCadastro: [{
        value: clienteForm.dataCadastro,
        disabled: true
      }],
      sexo: [clienteForm.sexo],
      email: [clienteForm.email, Validators.email],
      celular: [clienteForm.celular],
      telefone: [clienteForm.telefone],
      observacao: [clienteForm.observacao],

      cep1: [clienteForm.cep1],
      bairro1: [clienteForm.bairro1],
      lagradouro1: [clienteForm.lagradouro1],
      complemento1: [clienteForm.complemento1],
      numero1: [clienteForm.numero1],

      cep2: [clienteForm.cep2],
      bairro2: [clienteForm.bairro2],
      lagradouro2: [clienteForm.lagradouro2],
      complemento2: [clienteForm.complemento2],
      numero2: [clienteForm.numero2]

    });
  }

  listaClientes(pagina = 0, tamanho = 4) { 
    this.service.getClienteAll(pagina, tamanho)
      .subscribe(response => {
        this.clientes = response.content;
        this.totalElementos = response.totalElements;
        this.pagina = response.number;
        this.dataSource.data = this.clientes;
      },
        errorResponse => {
          this.service.msg('Error ao Carregar Clientes', true);
        });
  }


  applyFilter(event: Event) {
    this.filtroTable = (event.target as HTMLInputElement).value;
    this.service.buscarCliente(this.filtroTable, 0, 4)
      .subscribe(response => {
        this.clientes = response.content,
          this.totalElementos = response.totalElements;
        this.pagina = response.number;
        this.dataSource.data = this.clientes;
      },
        errorResponse => {
          this.service.msg('erro ao buscar', true);
        });
    this.dataSource.filter = this.filtroTable.trim().toLowerCase();

  }

  submit() {
    this.progress = true;
        
    this.service
      .salvar(this.formulario.value)
      .subscribe(response => {
        this.service.msg('Cliente salvo com sucesso.');
        this.formulario.setValue(response);
        this.clientenovo = response;        
        this.listaClientes();
        this.progress = false;
        
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
        this.progress = false;
      });
  }

  atualizarCliente(event: Event) {
    event.preventDefault();
    this.progress = true;
    this.service.atualizar(this.formulario.value)
      .subscribe(reponse => {
        this.service.msg('Cliente atualizado.');
        this.progress = false;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
        this.progress = false;
      });
  }

  novoCliente(event: Event) {
    event.preventDefault();
    this.clientenovo = new Cliente();
    this.formulario.reset();
  }

  preparaDelecaoForm(cliente: Cliente, event: Event) {
    event.preventDefault();
    this.dialog.open(ClienteDeleteComponent, {
      data: cliente
    }).afterClosed().subscribe(responseClose => {
      if (responseClose) {
        this.progress = true;
        this.service.deletar(cliente)
          .subscribe(responseDelete => {
            this.service.msg('Cliente deletado!');
            this.clientenovo = new Cliente();
            this.formulario.reset();
            this.progress = false;
          }, errorResponse => {
            this.service.msg('Ocorreu um erro ao deletar o Cliente!', true);
            this.progress = false;
          });
      }
    });
  }

  preparaDelecaoList(cliente: Cliente, event: Event) {
    event.preventDefault();
    this.dialog.open(ClienteDeleteComponent, {
      data: cliente
    }).afterClosed().subscribe(response => {
      if (response) {      
        this.service.deletar(cliente)
          .subscribe(responseDelete => {
            this.service.msg('Cliente deletado com sucesso!');
            if (!this.filtroTable) {
              this.listaClientes(this.pagina, this.tamanho);              
            } else {
              this.service.buscarCliente(this.filtroTable, this.pagina, this.tamanho)
                .subscribe(responseFilter => {
                  this.clientes = responseFilter.content;
                  this.totalElementos = responseFilter.totalElements;
                  this.pagina = responseFilter.number;
                  this.dataSource.data = this.clientes;
                });
            }
            this.progress = false;
          }, errorResponse => {
            this.service.msg('Ocorreu um erro ao deletar o cliente', true),
              this.progress = false;
          });
      }
    });

  }

  detalhesCliente(cliente: Cliente) {
    this.dialog.open(ClienteDetalheComponent, {
      height: '500px',
      width: '850px',
      data: cliente
    }).afterClosed().subscribe(response => {
      if (!this.filtroTable) {
        this.listaClientes(this.pagina, this.tamanho);
      } else {
        this.service.buscarCliente(this.filtroTable, this.pagina, this.tamanho)
          .subscribe(responseAt => {
            this.clientes = responseAt.content;
            this.totalElementos = responseAt.totalElements;
            this.pagina = responseAt.number;
            this.dataSource.data = this.clientes;
          });
      }
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

  paginar(event: PageEvent) {
    if (!this.filtroTable) {
      this.pagina = event.pageIndex;
      this.tamanho = event.pageSize;
      this.listaClientes(this.pagina, this.tamanho);
    } else {
      this.pagina = event.pageIndex;
      this.tamanho = event.pageSize;
      this.service.buscarCliente(this.filtroTable, this.pagina, this.tamanho)
        .subscribe(response => {
          this.clientes = response.content;
            this.totalElementos = response.totalElements;
          this.pagina = response.number;
          this.dataSource.data = this.clientes;
        });
    }
  }

}

