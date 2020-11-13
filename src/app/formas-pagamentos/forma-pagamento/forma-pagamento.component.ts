import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormaPagamentoService } from 'src/app/service/forma-pagamento.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormaPagamento } from '../forma-pagamento';
import { FormaPagamentoDeleteComponent } from '../forma-pagamento-delete/forma-pagamento-delete.component';
import { PageEvent } from '@angular/material/paginator';
import { FormaPagamentoDetalheComponent } from '../forma-pagamento-detalhe/forma-pagamento-detalhe.component';

@Component({
  selector: 'app-forma-pagamento',
  templateUrl: './forma-pagamento.component.html',
  styleUrls: ['./forma-pagamento.component.css']
})
export class FormaPagamentoComponent implements OnInit {

  progress = false;
  errors: string;
  formaPagamentoNovo: FormaPagamento;
  formaPagamentos: FormaPagamento[] = [];

  formulario: FormGroup;
  colunas = ['id', 'descricao', 'formaPagamento',  'taxa', 'detalhes', 'apagar'];
  dataSource = new MatTableDataSource<FormaPagamento>();

  totalElementos = 0;
  pagina = 0;
  tamanho = 4;
  pageSizeOptions: number[] = [2, 4, 6, 10];
  filtroTable;

  constructor(
    private service: FormaPagamentoService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.formaPagamentoNovo = new FormaPagamento();
  }

  ngOnInit(): void {    
    this.formaPagamentoNovo = new FormaPagamento();
    this.formularioFormaPagamento(this.formaPagamentoNovo);
    this.listaFormaPagamento(this.pagina, this.tamanho);
  }

  formularioFormaPagamento(formFp: FormaPagamento) {
    this.formulario = this.fb.group({
      id: [formFp.id],
      tipoPagamento: [formFp.tipoPagamento, Validators.required],
      descricao: [formFp.descricao, Validators.required],
      taxa: [formFp.taxa]
    });
  }


  onSubmit() {
    console.log('Salvando....');
    this.progress = true;
    console.log(this.formulario.value);
    this.service.salvar(this.formulario.value)
      .subscribe(response => {
        this.formulario.setValue(response);
        this.formaPagamentoNovo = response;
        this.progress = false;
        this.service.msg('Salvo com sucesso');
        this.listaFormaPagamento();
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg(this.errors, true);
        this.progress = false;
      })
  }

  atualizarFormPg(event: Event) {
    event.preventDefault();
    this.progress = true;
    this.service.atualizar(this.formulario.value)
      .subscribe(reponse => {
        this.service.msg('Atualizado.');
        this.progress = false;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
        this.progress = false;
      });
  }
  
  preparaDelecao(formaPagamento: FormaPagamento, event: Event){
    event.preventDefault();
    this.dialog.open(FormaPagamentoDeleteComponent, {
      data: formaPagamento
    }).afterClosed().subscribe(responseClose => {
      if (responseClose) {
        this.progress = true;
        console.log(formaPagamento)
        this.service.deletar(formaPagamento)
          .subscribe(responseDelete => {
            console.log(responseDelete);
            this.service.msg('Forma de pagamento deletado!');
            this.formaPagamentoNovo = new FormaPagamento();
           this,this.formulario.reset();
            this.progress = false;
          }, errorResponse => {
            console.log(errorResponse);
            this.service.msg('Ocorreu um erro ao deletar a forma de pagamento!', true);
            this.progress = false;
          });
      }
    });
  }

  
  preparaDelecaoList(formaPagamento: FormaPagamento, event: Event) {
    event.preventDefault();
    this.dialog.open(FormaPagamentoDeleteComponent, {
      data: formaPagamento
    }).afterClosed().subscribe(response => {
      if (response) {      
        this.service.deletar(formaPagamento)
          .subscribe(responseDelete => {
            this.service.msg('deletado com sucesso!');
            if (!this.filtroTable) {
              this.listaFormaPagamento(this.pagina, this.tamanho);              
            } else {
              this.service.buscaFormaPagamento(this.filtroTable, this.pagina, this.tamanho)
                .subscribe(responseFilter => {
                  this.formaPagamentos = responseFilter.content;
                  this.totalElementos = responseFilter.totalElements;
                  this.pagina = responseFilter.number;
                  this.dataSource.data = this.formaPagamentos;
                });
            }
            this.progress = false;
          }, errorResponse => {
            this.service.msg('Ocorreu um erro ao deletar!', true),
              this.progress = false;
          });
      }
    });

  }

  detalharFormaPagamento(formaPagamento: FormaPagamento) {
    this.dialog.open(FormaPagamentoDetalheComponent, {      
      data: formaPagamento
    }).afterClosed().subscribe(response => {
      if (!this.filtroTable) {
        this.listaFormaPagamento(this.pagina, this.tamanho);
      } else {
        this.service.buscaFormaPagamento(this.filtroTable, this.pagina, this.tamanho)
          .subscribe(responseAt => {
            this.formaPagamentos = responseAt.content;
            this.totalElementos = responseAt.totalElements;
            this.pagina = responseAt.number;
            this.dataSource.data = this.formaPagamentos;
          });
      }
    });
  }


  listaFormaPagamento(pagina = 0, tamanho = 4) {
    this.service.listaFormaPagamento(pagina, tamanho)
      .subscribe(response => {
        this.formaPagamentos = response.content;
        this.totalElementos = response.totalElements;
        this.pagina = response.number;
        this.dataSource.data = this.formaPagamentos;
      },
        errorResponse => {
          this.service.msg('Error ao Carregar Clientes', true);
        });
  }

  
  paginar(event: PageEvent) {
    if (!this.filtroTable) {
      this.pagina = event.pageIndex;
      this.tamanho = event.pageSize;
      this.listaFormaPagamento(this.pagina, this.tamanho);
    } else {
      this.pagina = event.pageIndex;
      this.tamanho = event.pageSize;
      this.service.buscaFormaPagamento(this.filtroTable, this.pagina, this.tamanho)
        .subscribe(response => {
          this.formaPagamentos = response.content;
          this.totalElementos = response.totalElements;
          this.pagina = response.number;
          this.dataSource.data = this.formaPagamentos;
        });
    }
  }

  applyFilter(event: Event) {
    this.filtroTable = (event.target as HTMLInputElement).value;
    this.service.buscaFormaPagamento(this.filtroTable, 0, 4)
      .subscribe(response => {
        this.formaPagamentos = response.content;
        this.totalElementos = response.totalElements;
        this.pagina = response.number;
        this.dataSource.data = this.formaPagamentos;
      },
        errorResponse => {
          this.service.msg('erro ao buscar', true);
        });
    this.dataSource.filter = this.filtroTable.trim().toLowerCase();

  }

  novoFormPag(event ?: Event){
    event.preventDefault();
    this.formaPagamentoNovo = new FormaPagamento();
    this.formulario.reset();
  }
  

}
