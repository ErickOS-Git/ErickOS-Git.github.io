import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ProdutoService } from 'src/app/service/produto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Produto } from '../produto';
import { CategoriaProduto } from '../categoria-produto';
import { TipoProduto } from '../tipo-produto';
import { ProdutoDeleteComponent } from '../produto-delete/produto-delete.component';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ProdutoDetalheComponent } from '../produto-detalhe/produto-detalhe.component';



@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {  
  // Variaveis para cadastro 
  produtoNovo: Produto;
  categoriaProdutoNovo: CategoriaProduto;
  tipoProdutoNovo: TipoProduto;
  // carregamentos
  carregaCategoriaProdutos: CategoriaProduto[] = [];
  carregaTipoProdutos: TipoProduto[] = [];
  produtos: Produto[] = [];
  categorias: CategoriaProduto[] =[]
  tipos: TipoProduto[] =[]

  // Formularios
  formProduto: FormGroup;
  formCategoriaProduto: FormGroup;
  formTipoProduto: FormGroup;
  errors: string;
  progress = false;

  // PAGINAÇÃO
  totalElementos = 0;
  pagina = 0;
  tamanho = 4;
  pageSizeOptions: number[] = [2, 4, 6, 10];
  filtroTable;

  totalElementosCategoria = 0;
  paginaCategoria = 0;
  tamanhoCategoria = 4;
  pageSizeOptionsCategoria: number[] = [2, 4, 6, 10];
  filtroTableCategoria;

  totalElementosTipo = 0;
  paginaTipo = 0;
  tamanhoTipo = 4;
  pageSizeOptionsTipo: number[] = [2, 4, 6, 10];
  filtroTableTipo;

  //Montar a tabelas
  dataSourceProduto = new MatTableDataSource<Produto>();
  dataSourceCategoriaProduto = new MatTableDataSource<CategoriaProduto>();
  dataSourceTipoProduto = new MatTableDataSource<TipoProduto>();
  colunasProduto = ['id', 'produto', 'categoria', 'tipo', 'dataCadastro', 'detalhes', 'apagar'];
  colunasCategoria = ['id', 'categoria', 'dataCadastro', 'detalhes', 'apagar'];
  colunasTipo = ['id', 'tipo', 'dataCadastro', 'detalhes', 'apagar'];


  constructor(
    private service: ProdutoService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.produtoNovo = new Produto();
    this.categoriaProdutoNovo = new CategoriaProduto();
    this.tipoProdutoNovo = new TipoProduto();
  }

  ngOnInit(): void {
    this.montarFormulario(this.produtoNovo, this.categoriaProdutoNovo, this.tipoProdutoNovo);
    this.listarProdutos(this.pagina, this.tamanho);
    this.listarCategoriaProduto(this.paginaCategoria, this.tamanhoCategoria);
    this.listarTipoProduto(this.paginaTipo, this.tamanhoTipo);
    this.carregarCategoriaProdutos();
    this.carregarTipoProdutos();
  }

  // FORMULARIOS DE PRODUTO, CATEGORIA E TIPO PRODUTO
  montarFormulario(
    produtoForm: Produto,
    categoriaProdutoForm: CategoriaProduto,
    tipoProdutoform: TipoProduto
  ) {
    this.formProduto = this.fb.group({
      id: [produtoForm.id],
      dataCadastro: [produtoForm.dataCadastro],
      nomeProduto: [produtoForm.nomeProduto, Validators.required],
      valorVenda: [produtoForm.valorVenda, Validators.required],
      valorCompra: [produtoForm.valorCompra],
      categoriaProduto: [produtoForm.categoriaProduto, Validators.required],
      tipoProduto: [produtoForm.tipoProduto, Validators.required]
    });

    this.formCategoriaProduto = this.fb.group({
      id: [categoriaProdutoForm.id],
      dataCadastro: [categoriaProdutoForm.dataCadastro],
      nomeCategoriaProduto: [categoriaProdutoForm.nomeCategoriaProduto, Validators.required]
    });

    this.formTipoProduto = this.fb.group({
      id: [tipoProdutoform.id],
      dataCadastro: [tipoProdutoform.dataCadastro],
      nomeTipoProduto: [tipoProdutoform.nomeTipoProduto, Validators.required]
    });
  }

  //------------------------------------------------------- FUNÇÕES FORMULARIO PRODUTOS
  submitProduto() {
    this.progress = true;
    this.service.salvarProduto(this.formProduto.value)
      .subscribe(response => {
        this.produtoNovo = response;
        this.formProduto.setValue(response);
        this.service.msg('Produto Salvo!');
        this.progress = false;
      }, errorResponse => {
        this.progress = false;
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg(this.errors, true);
      });
  }

  atualizarProdutos(event: Event) {
    event.preventDefault();
    this.progress = true;
    this.service.atualizarProduto(this.formProduto.value)
      .subscribe(response => {
        this.service.msg('Produto Atualizado!');
        this.listarProdutos(this.pagina, this.tamanho)
        this.progress = false;
      }, errorResponse => {
        this.progress = false;
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
      });
  }

  PreparadeletarProdutoForm(produto: Produto, event: Event) {
    event.preventDefault();
    this.dialog.open(ProdutoDeleteComponent, {
      data: produto
    }).afterClosed().subscribe(responseClose => {
      if (responseClose) {
        this.progress = true;
        this.service.deleteProduto(this.formProduto.value)
          .subscribe(responseDelete => {
            this.service.msg('Fornecedor deletado!');
            this.produtoNovo = new Produto();
            this.formProduto.reset();
            this.progress = false;
          }, errorResponse => {
            this.progress = false;
            this.errors = errorResponse.error.errors;
            this.service.msg(this.errors, true);
          });
      }
    });

  }

  preparaDelecaoProdutoList(produto: Produto, event: Event) {
    event.preventDefault();
    this.dialog.open(ProdutoDeleteComponent, {
      data: produto
    }).afterClosed().subscribe(response => {
      if (response) {
        
        this.service.deleteProduto(produto)
          .subscribe(responseDelete => {
            this.service.msg('Produto deletado!');
            if (!this.filtroTable) {
              this.listarProdutos(this.pagina, this.tamanho);
            
            } else {
              this.service.buscarProdutos(this.filtroTable, this.pagina, this.tamanho)
                .subscribe(responseFilter => {
                  this.produtos = responseFilter.content;
                  this.totalElementos = responseFilter.totalElements;
                  this.pagina = responseFilter.number;
                  this.dataSourceProduto.data = this.produtos;
                
                });
            }
      
          }, errorResponse => {
            this.service.msg('Ocorreu um erro ao deletar o cliente', true)
              
          });
      }
    });
  }

  applyFilterProduto(event: Event) {
    this.filtroTable = (event.target as HTMLInputElement).value;
    this.service.buscarProdutos(this.filtroTable,0 , 10)
      .subscribe(response => {
        this.produtos = response.content;
        this.totalElementos = response.totalElements;
        this.pagina = response.number;
        this.dataSourceProduto.data = this.produtos;
      },
        errorResponse => {
          this.service.msg('erro ao buscar', true);
        });
    this.dataSourceProduto.filter = this.filtroTable.trim().toLowerCase();

  }

  listarProdutos(pagina = 0, tamanho = 4) {
    this.service.getAllProdutos(pagina, tamanho)
      .subscribe(response => {        
        this.produtos = response.content;
        this.totalElementos = response.totalElements;
        this.pagina = response.number;
        this.dataSourceProduto.data = this.produtos;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg('Não foi possível Carregar os produtos', true);
      });
  }

  DetalhesProduto(produto: Produto) {
    this.dialog.open(ProdutoDetalheComponent, {
      height: '500px',
      width: '850px',
      data: produto
      
    }).afterClosed().subscribe(response => {
      if (!this.filtroTable) {
        this.listarProdutos(this.pagina, this.tamanho);
      } else {
        this.service.buscarProdutos(this.filtroTable, this.pagina, this.tamanho)
          .subscribe(responseAt => {
            this.produtos = responseAt.content;
            this.totalElementos = responseAt.totalElements;
            this.pagina = responseAt.number;
            this.dataSourceProduto.data = this.produtos;
          });
      }
    });
  }

  novoProduto(event: Event) {
    event.preventDefault();
    this.produtoNovo = new Produto();
    this.formProduto.reset();
  }

  // ------------------------------------------------------- FUNÇÕES FORMULARIO Categoria
  submitCategoriaProduto() {    
    this.progress = true;
    this.service.salvarCategoriaProduto(this.formCategoriaProduto.value)
      .subscribe(response => {        
        this.formCategoriaProduto.setValue(response);
        this.categoriaProdutoNovo = response;
        this.service.msg('Categoria Salvo!');
        this.carregarCategoriaProdutos();
        this.listarCategoriaProduto(this.paginaCategoria, this.tamanhoCategoria);
        this.progress = false;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg(this.errors, true);
        this.progress = false;
      });
  }

  carregarCategoriaProdutos() {
    this.service.carregarCategoriasProdutos()
      .subscribe(response => {  
        console.log(response);      
        this.carregaCategoriaProdutos = response;
        console.log(this.carregaCategoriaProdutos);
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg('Não foi possível Carregar as Categorias', true);
      });
  }

  listarCategoriaProduto(pagina = 0, tamanho = 4) {
    this.service.getAllCategoriaProdutos(pagina, tamanho)
      .subscribe(response => {
        this.categorias = response.content;
        this.totalElementosCategoria = response.totalElements;
        this.paginaCategoria = response.number;
        this.dataSourceCategoriaProduto.data = this.categorias;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg('Não foi possível Carregar categorias', true);
      });
  }

  PreparadeletarCategoriaForm(categria: CategoriaProduto, event: Event) {
    event.preventDefault();
    this.dialog.open(ProdutoDeleteComponent, {
      data: categria
    }).afterClosed().subscribe(responseClose => {
      if (responseClose) {
        this.progress = true;
        this.service.deleteCategoriaProduto(this.formCategoriaProduto.value)
          .subscribe(responseDelete => {
            this.service.msg('Categoria deletado!');
            this.categoriaProdutoNovo = new CategoriaProduto();
            this.formCategoriaProduto.reset();
            this.carregarCategoriaProdutos();
            this.listarCategoriaProduto(this.paginaCategoria, this.tamanhoCategoria)
            this.progress = false;
          }, errorResponse => {
            this.progress = false;
            this.errors = errorResponse.error.errors;
            this.service.msg(this.errors, true);
          });
      }
    });
  }

  PreparadeletarCategoriaList(categoria: CategoriaProduto, event: Event) {
    event.preventDefault();
    this.dialog.open(ProdutoDeleteComponent, {
      data: categoria
    }).afterClosed().subscribe(response => {
      if (response) {
        
        this.service.deleteCategoriaProduto(categoria)
          .subscribe(responseDelete => {
            this.service.msg('Categoria deletado!');
            if (!this.filtroTableCategoria) {
              this.listarCategoriaProduto(this.paginaCategoria, this.tamanhoCategoria);
             
            } else {
              this.service.buscarCategoriaProdutos(this.filtroTableCategoria, this.paginaCategoria, this.tamanhoCategoria)
                .subscribe(responseFilter => {
                  this.categorias = responseFilter.content;
                  this.totalElementosCategoria = responseFilter.totalElements;
                  this.paginaCategoria = responseFilter.number;
                  this.dataSourceCategoriaProduto.data = this.categorias;
                 
                });
            }
           
          }, errorResponse => {
            this.service.msg('Ocorreu um erro ao deletar a Categoria', true)
              
          });
      }
    });
  }

  atualizarCategoriaProduto(event: Event) {
    event.preventDefault();
    this.progress = true;
    this.service.atualizarCategoriaProduto(this.formCategoriaProduto.value)
      .subscribe(response => {
        this.service.msg('Categoria Atualizado!');
        this.carregarCategoriaProdutos();
        this.listarCategoriaProduto(this.paginaCategoria, this.tamanhoCategoria)
        this.progress = false;
      }, errorResponse => {
        this.progress = false;
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
      });
  }

  detalhesCategoriaproduto(categoria: CategoriaProduto) {
    this.dialog.open(ProdutoDetalheComponent, {      
      data: categoria
      
    }).afterClosed().subscribe(response => {
      if (!this.filtroTableCategoria) {
        this.listarCategoriaProduto(this.pagina, this.tamanho);
      } else {
        this.service.buscarCategoriaProdutos(this.filtroTableCategoria, this.paginaCategoria, this.tamanhoCategoria)
          .subscribe(responseAt => {
            this.categorias = responseAt.content;
            this.totalElementosCategoria = responseAt.totalElements;
            this.paginaCategoria = responseAt.number;
            this.dataSourceCategoriaProduto.data = this.categorias;
          });
      }
    });
  }

  novaCategoria(event: Event) {
    event.preventDefault();
    this.categoriaProdutoNovo = new CategoriaProduto();
    this.formCategoriaProduto.reset();
  }

  applyFilterCategoria(event: Event) {
    this.filtroTableCategoria = (event.target as HTMLInputElement).value;
    this.service.buscarCategoriaProdutos(this.filtroTableCategoria, 0, 4)
      .subscribe(response => {
        this.categorias = response.content;
        this.totalElementosCategoria = response.totalElements;
        this.paginaCategoria = response.number;
        this.dataSourceCategoriaProduto.data = this.categorias;
      },
        errorResponse => {
          this.service.msg('erro ao buscar', true);
        });
    this.dataSourceCategoriaProduto.filter = this.filtroTableCategoria.trim().toLowerCase();

  }


  //------------------------------------------------------- FUNÇÕES FORMULARIO TIPO PRODUTOS
  submitTipoProduto() {
    this.progress = true;
    this.service.salvarTipoProduto(this.formTipoProduto.value)
      .subscribe(response => {
        this.formTipoProduto.setValue(response);
        this.tipoProdutoNovo = response;
        this.carregarTipoProdutos();
        this.listarTipoProduto(this.paginaTipo, this.tamanhoTipo);
        this.service.msg('Tipo produto Salvo!');        
        this.progress = false;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg(this.errors, true);
        this.progress = false;
      });
  }

  PreparadeleteTipoProdutoForm(tipoProduto: TipoProduto, event: Event) {
    event.preventDefault();
    this.dialog.open(ProdutoDeleteComponent, {
      data: tipoProduto
    }).afterClosed().subscribe(responseClose => {
      if (responseClose) {
        this.progress = true;
        this.service.deleteTipoProduto(this.formTipoProduto.value)
          .subscribe(responseDelete => {
            this.service.msg('Tipo Produto deletado!');
            this.tipoProdutoNovo = new TipoProduto();
            this.formTipoProduto.reset();
            this.carregarTipoProdutos();
            this.listarTipoProduto(this.paginaTipo, this.tamanhoTipo);
            this.progress = false;
          }, errorResponse => {
            this.progress = false;
            this.errors = errorResponse.error.errors;
            this.service.msg(this.errors, true);
          });
      }
    });
  }

  PreparadeleteTipoProdutoList(tipoProduto: TipoProduto, event: Event) {
    event.preventDefault();
    this.dialog.open(ProdutoDeleteComponent, {
      data: tipoProduto
    }).afterClosed().subscribe(response => {
      if (response) {

        this.service.deleteTipoProduto(tipoProduto)
          .subscribe(responseDelete => {
            this.service.msg('Tipo produto deletado!');
            if (!this.filtroTableTipo) {
              this.listarTipoProduto(this.paginaTipo, this.tamanhoTipo);
         
            } else {
              this.service.buscarTipoProdutos(this.filtroTableTipo, this.paginaTipo, this.tamanhoTipo)
                .subscribe(responseFilter => {
                  this.tipos = responseFilter.content;
                  this.totalElementosTipo = responseFilter.totalElements;
                  this.paginaTipo = responseFilter.number;
                  this.dataSourceTipoProduto.data = this.tipos;
   
                });
            }
            
          }, errorResponse => {
            this.service.msg('Ocorreu um erro ao deletar o tipo', true)
             
          });
      }
    });
  }

  atualizarTipoProduto(event: Event) {
    event.preventDefault();
    this.progress = true;
    console.log(this.formTipoProduto.value)
    this.service.atualizarTipoProduto(this.formTipoProduto.value)
      .subscribe(response => {
        this.service.msg('Tipo Produto Atualizado!');
        this.carregarTipoProdutos();
        this.listarTipoProduto(this.paginaTipo, this.tamanhoTipo);
        this.progress = false;
      }, errorResponse => {
        this.progress = false;
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
      });
  }

  detalhesTipoProduto(tipoProduto: TipoProduto) {
    this.dialog.open(ProdutoDetalheComponent, {      
      data: tipoProduto
      
    }).afterClosed().subscribe(response => {
      if (!this.filtroTableTipo) {
        this.listarTipoProduto(this.paginaTipo, this.tamanhoTipo);
      } else {
        this.service.buscarProdutos(this.filtroTableTipo, this.paginaTipo, this.tamanhoTipo)
          .subscribe(responseAt => {
            this.tipos = responseAt.content;
            this.totalElementosTipo = responseAt.totalElements;
            this.paginaTipo = responseAt.number;
            this.dataSourceTipoProduto.data = this.tipos;
          });
      }
    });
  }

  listarTipoProduto(pagina = 0, tamanho = 4) {
    this.service.getAllTipoProdutos(pagina, tamanho)
      .subscribe(response => {
        this.tipos = response.content;
        this.totalElementosTipo = response.totalElements;
        this.paginaTipo = response.number;
        this.dataSourceTipoProduto.data = this.tipos;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg('Não foi possível Carregar Tipos de Produtos', true);
      });
  }
 
  novoTipoProduto(event: Event) {
    event.preventDefault();
    this.tipoProdutoNovo = new TipoProduto();
    this.formTipoProduto.reset();
  }

  carregarTipoProdutos() {
    this.service.carregarTipoProdutos()
      .subscribe(response => {       
        this.carregaTipoProdutos = response;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg('Não foi possível Carregar os tipos', true);
      });
  }

  applyFilterTipo(event: Event) {
    this.filtroTableTipo = (event.target as HTMLInputElement).value;
    this.service.buscarTipoProdutos(this.filtroTableTipo, 0, 4)
      .subscribe(response => {
        this.tipos = response.content;
        this.totalElementosTipo = response.totalElements;
        this.paginaTipo = response.number;
        this.dataSourceTipoProduto.data = this.tipos;
      },
        errorResponse => {
          this.service.msg('erro ao buscar', true);
        });
    this.dataSourceTipoProduto.filter = this.filtroTableTipo.trim().toLowerCase();

  }



  // COMPARAR OS SELECTS DO OS DADOS DO BANCO
  compararObj(obj1, obj2) {
    return obj1 && obj2 ? (obj1.id === obj2.id) : obj1 === obj2;
  }

  paginar(event: PageEvent) {
    this.pagina = event.pageIndex;
    this.tamanho = event.pageSize;
    this.listarProdutos(this.pagina, this.tamanho);
  }

  paginarCategoria(event: PageEvent) {
    this.paginaCategoria = event.pageIndex;
    this.tamanhoCategoria = event.pageSize;
    this.listarCategoriaProduto(this.paginaCategoria, this.tamanhoCategoria);
  }

  paginarTipo(event: PageEvent) {
    this.paginaTipo = event.pageIndex;
    this.tamanhoTipo = event.pageSize;
    this.listarTipoProduto(this.paginaTipo, this.tamanhoTipo);
  }

}
