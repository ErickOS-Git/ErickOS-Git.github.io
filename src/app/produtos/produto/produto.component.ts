import { Component, OnInit, ViewChild, TemplateRef, ɵConsole } from '@angular/core';
import { ProdutoService } from 'src/app/service/produto.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Produto } from '../produto';
import { CategoriaProduto } from '../categoria-produto';
import { TipoProduto } from '../tipo-produto';
import { ProdutoDeleteComponent } from '../produto-delete/produto-delete.component';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ProdutoDetalheComponent } from '../produto-detalhe/produto-detalhe.component';
import { Adicional } from '../adicional';
import { CategoriaAdicionalList } from '../categoria-adicional-list';
import { CategoriaProdutoService } from 'src/app/service/categoria-produto.service';
import { TipoProdutoService } from 'src/app/service/tipo-produto.service';
import { AdicionalService } from 'src/app/service/adicional.service';
import { CategoraAdicionalService } from 'src/app/service/categora-adicional.service';



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
  adicionalNovo: Adicional;
  // carregamentos
  carregaCategoriaProdutos: CategoriaProduto[] = [];
  carregaTipoProdutos: TipoProduto[] = [];
  carregaAdicionais: Adicional[] = [];
  produtos: Produto[];
  categorias: CategoriaProduto[] = []
  tipos: TipoProduto[] = [];
  adicionais: Adicional[] = []; 

  // Formularios
  formProduto: FormGroup;
  formCategoriaProduto: FormGroup;
  formTipoProduto: FormGroup;
  formAdicional: FormGroup;
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

  totalElementosAdicionais = 0;
  paginaAdicional = 0;
  tamanhoAdicional = 4;
  pageSizeOptionsAdicional: number[] = [2, 4, 6, 10];
  filtroTableAdicional;

  //Montar a tabelas
  dataSourceProduto = new MatTableDataSource<Produto>();
  dataSourceCategoriaProduto = new MatTableDataSource<CategoriaProduto>();
  dataSourceTipoProduto = new MatTableDataSource<TipoProduto>();
  dataSourceAdicional = new MatTableDataSource<Adicional>();
  colunasProduto = ['id', 'produto', 'categoria', 'tipo', 'dataCadastro', 'detalhes', 'apagar'];
  colunasCategoria = ['id', 'categoria', 'dataCadastro', 'detalhes', 'apagar'];
  colunasTipo = ['id', 'tipo', 'dataCadastro', 'detalhes', 'apagar'];
  colunasAdicional = ['id', 'adicional', 'dataCadastro', 'detalhes', 'apagar'];


  constructor(
    private service: ProdutoService,
    private catProdService: CategoriaProdutoService,
    private tipoProdService: TipoProdutoService,
    private adicionalService: AdicionalService,
    private cateAdicionalService: CategoraAdicionalService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.produtoNovo = new Produto();
    this.categoriaProdutoNovo = new CategoriaProduto();
    this.tipoProdutoNovo = new TipoProduto();
    this.adicionalNovo = new Adicional();
  }

  ngOnInit(): void {
    this.montarFormulario(this.produtoNovo, this.categoriaProdutoNovo, this.tipoProdutoNovo, this.adicionalNovo);
    this.listarProdutos(this.pagina, this.tamanho);
    this.listarCategoriaProduto(this.paginaCategoria, this.tamanhoCategoria);
    this.listarTipoProduto(this.paginaTipo, this.tamanhoTipo);
    this.listarAdicional(this.paginaAdicional, this.tamanhoAdicional);
    this.carregarCategoriaProdutos();
    this.carregarTipoProdutos();
    this.carregarAdicionais();

  }

  // FORMULARIOS DE PRODUTO, CATEGORIA E TIPO PRODUTO
  montarFormulario(
    produtoForm: Produto,
    categoriaProdutoForm: CategoriaProduto,
    tipoProdutoform: TipoProduto,
    adicional: Adicional
  ) {
    
    this.formProduto = this.fb.group({
      id: [produtoForm.id],
      dataCadastro: [produtoForm.dataCadastro],
      nomeProduto: [produtoForm.nomeProduto, Validators.required],
      valorVenda: [produtoForm.valorVenda, Validators.required],
      valorCompra: [produtoForm.valorCompra],
      categoriaProduto: [produtoForm.categoriaProduto, Validators.required],
      tipoProduto: [produtoForm.tipoProduto, Validators.required],
      adicionais: this.fb.array([
        this.fb.group({
          adicional: []
        })
      ])
    });

    this.formCategoriaProduto = this.fb.group({
      id: [categoriaProdutoForm.id],
      dataCadastro: [categoriaProdutoForm.dataCadastro],
      nomeCategoriaProduto: [categoriaProdutoForm.nomeCategoriaProduto, Validators.required],
      adicionais: this.fb.array([
        this.fb.group({
          idCatProAd: [],
          id: [],
          nome: []
        })
      ])
    });

    this.formTipoProduto = this.fb.group({
      id: [tipoProdutoform.id],
      dataCadastro: [tipoProdutoform.dataCadastro],
      nomeTipoProduto: [tipoProdutoform.nomeTipoProduto, Validators.required]
    });

    this.formAdicional = this.fb.group({
      id: [adicional.id],
      nome: [adicional.nome],
      dataCadastro: [adicional.dataCadastro]
    })
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
            this.service.msg('Ocorreu um erro ao deletar o produto', true)

          });
      }
    });
  }

  applyFilterProduto(event: Event) {
    this.filtroTable = (event.target as HTMLInputElement).value;
    this.service.buscarProdutos(this.filtroTable, 0, 4)
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
        console.log(this.errors);
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
    console.log(this.formCategoriaProduto.value)
    this.progress = false;
    this.catProdService.salvarCategoriaProduto(this.formCategoriaProduto.value)
      .subscribe(response => {
        console.log(response);
        this.formCategoriaProduto.setValue(response);
        this.categoriaProdutoNovo = response;
        console.log(this.formCategoriaProduto.value);
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

  get categoriaControls() {
    return this.formCategoriaProduto.get('adicionais') as FormArray;
  }

  addAdicional(event: Event) {
    event.preventDefault();
    const adiconalLength = this.categoriaControls.length;
    const novo = this.fb.group({
      idCatProAd: [],
      id: [],
      nome: []
    })

    this.categoriaControls.push(novo);
  }

  removerCategoriaAdiconal(index) {
    this.categoriaControls.removeAt(index);
  }

  apagarCategoriaAdicional(event: Event, index) {
    event.preventDefault();
    const idCatAdicional = (<FormArray>this.formCategoriaProduto.controls['adicionais']).at(index).value.idCatProAd;
    this.cateAdicionalService.deletarCategoriaAdicional(idCatAdicional)
      .subscribe(responseDelete => {
        this.categoriaControls.removeAt(index);
        this.cateAdicionalService.msg("Adicional deletado")
      }, errorDeletar => {
        this.errors = errorDeletar.erro.errors;
        this.cateAdicionalService.msg(this.errors, true);
      }) 
  }


  carregarCategoriaProdutos() {
    this.catProdService.carregarCategoriasProdutos()
      .subscribe(response => {
        this.carregaCategoriaProdutos = response;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg('Não foi possível Carregar as Categorias', true);
      });
  }

  listarCategoriaProduto(pagina = 0, tamanho = 4) {
    this.catProdService.getAllCategoriaProdutos(pagina, tamanho)
      .subscribe(response => {
        this.categorias = response.content;
        this.carregaCategoriaProdutos = response.content;
        this.totalElementosCategoria = response.totalElements;
        this.paginaCategoria = response.number;
        this.dataSourceCategoriaProduto.data = this.carregaCategoriaProdutos;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.catProdService.msg('Não foi possível Carregar Lista categorias', true);
      });
  }

  PreparadeletarCategoriaForm(categria: CategoriaProduto, event: Event) {
    event.preventDefault();
    this.dialog.open(ProdutoDeleteComponent, {
      data: categria
    }).afterClosed().subscribe(responseClose => {
      if (responseClose) {
        this.progress = true;
        this.catProdService.deleteCategoriaProduto(this.formCategoriaProduto.value)
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

        this.catProdService.deleteCategoriaProduto(categoria)
          .subscribe(responseDelete => {
            this.service.msg('Categoria deletado!');
            if (!this.filtroTableCategoria) {
              this.listarCategoriaProduto(this.paginaCategoria, this.tamanhoCategoria);

            } else {
              this.catProdService.buscarCategoriaProdutos(this.filtroTableCategoria, this.paginaCategoria, this.tamanhoCategoria)
                .subscribe(responseFilter => {
                  this.categorias = responseFilter.content;
                  this.carregaCategoriaProdutos = responseFilter.content
                  this.totalElementosCategoria = responseFilter.totalElements;
                  this.paginaCategoria = responseFilter.number;
                  this.dataSourceCategoriaProduto.data = this.carregaCategoriaProdutos;

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
    console.log(this.formCategoriaProduto.value);
    this.catProdService.atualizarCategoriaProduto(this.formCategoriaProduto.value)
      .subscribe(response => {
        this.service.msg('Categoria Atualizado!');
        this.carregarCategoriaProdutos();
        this.listarCategoriaProduto(this.paginaCategoria, this.tamanhoCategoria)
        this.catProdService.getCateId(this.formCategoriaProduto.controls.id.value).subscribe(
          response => {
            this.formCategoriaProduto.setValue(response);
            this.categoriaProdutoNovo = response;
          }
        )
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
        this.catProdService.buscarCategoriaProdutos(this.filtroTableCategoria, this.paginaCategoria, this.tamanhoCategoria)
          .subscribe(responseAt => {
            this.carregaCategoriaProdutos = responseAt.content;
            this.totalElementosCategoria = responseAt.totalElements;
            this.paginaCategoria = responseAt.number;
            this.dataSourceCategoriaProduto.data = this.carregaCategoriaProdutos;
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
    this.catProdService.buscarCategoriaProdutos(this.filtroTableCategoria, 0, 4)
      .subscribe(response => {
        this.categorias = response.content;
        this.totalElementosCategoria = response.totalElements;
        this.paginaCategoria = response.number;
        this.dataSourceCategoriaProduto.data = this.carregaCategoriaProdutos;
      },
        errorResponse => {
          this.service.msg('erro ao buscar', true);
        });
    this.dataSourceCategoriaProduto.filter = this.filtroTableCategoria.trim().toLowerCase();

  }


  //------------------------------------------------------- FUNÇÕES FORMULARIO TIPO PRODUTOS
  submitTipoProduto() {
    this.progress = true;
    console.log(this.formTipoProduto.value);
    this.tipoProdService.salvarTipoProduto(this.formTipoProduto.value)
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
        this.tipoProdService.deleteTipoProduto(this.formTipoProduto.value)
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
        this.tipoProdService.deleteTipoProduto(tipoProduto)
          .subscribe(responseDelete => {
            this.service.msg('Tipo produto deletado!');
            if (!this.filtroTableTipo) {
              this.listarTipoProduto(this.paginaTipo, this.tamanhoTipo);
            } else {
              this.tipoProdService.buscarTipoProdutos(this.filtroTableTipo, this.paginaTipo, this.tamanhoTipo)
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
    this.tipoProdService.atualizarTipoProduto(this.formTipoProduto.value)
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
    this.tipoProdService.getAllTipoProdutos(pagina, tamanho)
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
    this.tipoProdService.carregarTipoProdutos()
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
    this.tipoProdService.buscarTipoProdutos(this.filtroTableTipo, 0, 4)
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

  //------------------------------------------------------- FUNÇÕES FORMULARIO ADICIONAL
  submitAdicional() {
    this.progress = true;
    this.adicionalService.salvarAdicional(this.formAdicional.value)
      .subscribe(response => {
        this.formAdicional.setValue(response);
        this.adicionalNovo = response;
        this.carregarAdicionais();
        this.listarAdicional(this.paginaAdicional, this.tamanhoAdicional);
        this.adicionalService.msg(' Salvo!');
        this.progress = false;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.adicionalService.msg(this.errors, true);
        this.progress = false;
      });
  }

  atualizarAdicional() {
    this.progress = true;
    this.adicionalService.atualizarAdicional(this.formAdicional.value)
      .subscribe(response => {
        this.adicionalService.msg('Adicional Atualizado!');
        this.carregarAdicionais();
        this.listarAdicional(this.paginaAdicional, this.tamanhoAdicional);
        this.progress = false;
      }, errorResponse => {
        this.progress = false;
        this.errors = errorResponse.error.errors;
        this.adicionalService.msg(this.errors, true);
      });
  }


  carregarAdicionais() {
    this.adicionalService.carregarAdicionais()
      .subscribe(response => {        
        this.carregaAdicionais = response;
      }, errorResponse => {
        //  this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.adicionalService.msg('Não foi possível Carregar os Adicionais', true);
      });
  }

  listarAdicional(pagina = 0, tamanho = 4) {
    this.adicionalService.listaAdicionais(pagina, tamanho)
      .subscribe(response => {
        this.adicionais = response.content;
        this.totalElementosAdicionais = response.totalElements;
        this.paginaAdicional = response.number;
        this.dataSourceAdicional.data = this.adicionais;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.adicionalService.msg('Não foi possível listar os adicionais', true);
      });
  }

  novoAdicional(event: Event) {
    event.preventDefault();
    this.adicionalNovo = new Adicional();
    this.formAdicional.reset();
  }

  applyFilterAdicional(event: Event) {
    this.filtroTableAdicional = (event.target as HTMLInputElement).value;
    this.adicionalService.buscarAdicional(this.filtroTableAdicional, 0, 4)
      .subscribe(response => {
        this.adicionais = response.content;
        this.totalElementosAdicionais = response.totalElements;
        this.paginaAdicional = response.number;
        this.dataSourceAdicional.data = this.adicionais;
      },
        errorResponse => {
          this.adicionalService.msg('erro ao buscar', true);
        });
    this.dataSourceAdicional.filter = this.filtroTableAdicional.trim().toLowerCase();

  }

  PreparadeletarAdicionalForm(adicional: Adicional, event: Event) {
    event.preventDefault();
    this.dialog.open(ProdutoDeleteComponent, {
      data: adicional
    }).afterClosed().subscribe(responseClose => {
      if (responseClose) {
        this.progress = true;
        this.adicionalService.deletarAdicional(this.formAdicional.value)
          .subscribe(responseDelete => {
            this.adicionalService.msg('Adicional deletado!');
            this.adicionalNovo = new Adicional();
            this.formAdicional.reset();
            this.carregarAdicionais();
            this.listarAdicional(this.paginaAdicional, this.tamanhoAdicional)
            this.progress = false;
          }, errorResponse => {
            this.progress = false;
            this.errors = errorResponse.error.errors;
            this.adicionalService.msg(this.errors, true);
          });
      }
    });
  }

  PreparadeletarAdicionalList(adicional: Adicional, event: Event) {
    event.preventDefault();
    this.dialog.open(ProdutoDeleteComponent, {
      data: adicional
    }).afterClosed().subscribe(response => {
      if (response) {

        this.adicionalService.deletarAdicional(adicional)
          .subscribe(responseDelete => {
            this.adicionalService.msg('Adicional deletado!');
            if (!this.filtroTableAdicional) {
              this.listarAdicional(this.paginaAdicional, this.tamanhoAdicional);

            } else {
              this.adicionalService.buscarAdicional(this.filtroTableAdicional, this.paginaAdicional, this.tamanhoAdicional)
                .subscribe(responseFilter => {
                  this.adicionais = responseFilter.content;
                  this.totalElementosAdicionais = responseFilter.totalElements;
                  this.paginaAdicional = responseFilter.number;
                  this.dataSourceAdicional.data = this.adicionais;

                });
            }

          }, errorResponse => {
            this.adicionalService.msg('Ocorreu um erro ao deletar Adicional', true)

          });
      }
    });
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

  paginarAdicional(event: PageEvent) {
    this.paginaAdicional = event.pageIndex;
    this.tamanhoAdicional = event.pageSize;
    this.listarAdicional(this.paginaAdicional, this.tamanhoAdicional = event.pageSize
    );
  }

}
