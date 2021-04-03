import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from 'src/app/clientes/cliente';
import { ClientesService } from 'src/app/service/clientes.service';
import { LancamentoService } from 'src/app/service/lancamento.service';
import { ProdutoService } from 'src/app/service/produto.service';
import { Lancamento } from '../lancamento';
import { debounceTime, delay, filter, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Produto } from 'src/app/produtos/produto';
import { FormaPagamento } from 'src/app/formas-pagamentos/forma-pagamento';
import { FormaPagamentoService } from 'src/app/service/forma-pagamento.service';
import { MascaraUtil } from 'src/app/util/mascara-util';
import { Adicional } from 'src/app/produtos/adicional';
import { LancamentoProdutoService } from 'src/app/service/lancamento-produto.service';
import { LancamentoProduto } from '../lancamento-produto';
import { LancamentoAdicional } from '../lancamento-adicional';


@Component({
  selector: 'app-lancamento',
  templateUrl: './lancamento.component.html',
  styleUrls: ['./lancamento.component.css'],
})
export class LancamentoComponent implements OnInit, OnDestroy {

  protected _onDestroy = new Subject<void>();

  // mascara para formulário
  mascaraData = MascaraUtil.mascaraNascimento;
  mascaraCpf = MascaraUtil.mascaraCpf;
  mascaraCelular = MascaraUtil.mascaraCelular;
  mascaraTelefoneFixo = MascaraUtil.mascaraTelefoneFixo;
  checked = false;
  progress = false;
  progressDelete = false;
  progressAtualizarCli = false;

  // carregamentos
  protected carregaClientes: Cliente[] = [];
  public clienteFiltro: FormControl = new FormControl();
  public produtosFiltro: FormControl = new FormControl();
  protected carregaProdutos: Produto[] = [];
  protected tipoPagamentos: FormaPagamento[] = [];

  /** indica o inicio da filtragem dos clientes */
  public searching = false;

  // variavel de erro
  errors: string;

  // variaveis de objetos
  lancamentoNovo: Lancamento;
  clienteSelecionado = new Cliente;
  adicionaisProduto: Adicional[] = [];
  lancamentoProdutos: LancamentoProduto[] = [];

  // variaveis de formulario
  formularioLancamento: FormGroup;
  formularioProduto: FormGroup;

  //filtros
  filtroClientes: ReplaySubject<Cliente[]> = new ReplaySubject<Cliente[]>(1);
  filtroProdutos: ReplaySubject<Produto[]> = new ReplaySubject<Produto[]>(1);
  filtroTipoPagamentos: Observable<FormaPagamento[]>;

  constructor(
    private service: LancamentoService,
    private produtoService: ProdutoService,
    private LancamentoProdutoService: LancamentoProdutoService,
    private clienteService: ClientesService,
    private formaPagService: FormaPagamentoService,
    private fb: FormBuilder,
    private dialog: MatDialog,

  ) {
    this.lancamentoNovo = new Lancamento();

  }

  ngOnInit(): void {
    this.lancamentoNovo = new Lancamento();
    this.carregarClientes();
    this.carregarProdutos();
    this.carregarFormaPagamento();
    this.formulario(this.lancamentoNovo);
    // inicializar filtro dos campos(clientes, produtos e forma de pagamento)    
    this.clienteFiltro.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.carregaClientes) {
            return [];
          }
          // simulate server fetching and filtering data
          return this.carregaClientes.filter(cliente => cliente.nome.toLowerCase().includes(search.toLowerCase()));

        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(filtroCliente => {
        this.searching = false;
        this.filtroClientes.next(filtroCliente);
      }, error => {
        // no errors in our simulated example
        this.searching = false;
        // handle error...
      });

    this.produtosFiltro.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.carregaClientes) {
            return [];
          }
          // simulate server fetching and filtering data
          return this.carregaProdutos.filter(produto => produto.nomeProduto.toLowerCase().includes(search.toLowerCase()));
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(filtroProduto => {
        this.searching = false;
        this.filtroProdutos.next(filtroProduto);
      }, error => {
        // no errors in our simulated example
        this.searching = false;
        // handle error...
      });
  }


  formulario(
    lancamentoForm?: Lancamento
  ) {
    this.formularioLancamento = this.fb.group({
      id: [lancamentoForm.id],
      dataLancamento: [lancamentoForm.dataLancamento, Validators.required],
      dataNascimento: [lancamentoForm.cliente.dataNascimento],
      // clienteId: [],
      nomeCliente: [lancamentoForm.cliente.nome, Validators.required],
      cpf: [lancamentoForm.cliente.cpf],
      cliente: [lancamentoForm.cliente.id, Validators.required],
      email: [lancamentoForm.cliente.email],
      entrega: ["p", Validators.required],
      cep: [lancamentoForm.cep],
      bairro: [lancamentoForm.bairro],
      lagradouro: [lancamentoForm.lagradouro],
      complemento: [lancamentoForm.complemento],
      numero: [lancamentoForm.numero],
      telefone: [lancamentoForm.telefone],
      celular: [lancamentoForm.celular],
      status: [lancamentoForm.status],
      total: [lancamentoForm.total]
    });
    this.formularioProduto = this.fb.group({
      lancamento: [this.lancamentoNovo.id],
      produtos: this.fb.array([this.formProdutos])
    })

  }

  get formProdutos(): FormGroup {
    return this.fb.group({
      id: [],
      nomeProduto: ["", Validators.required],
      desconto: [],
      produto: [],
      valorVenda: [],
      quantidade: ["", Validators.maxLength(2)],
      totalProduto: [],
      adicionais: this.fb.array([])
    })
  }

  get formAdicionais(): FormGroup {
    return this.fb.group({
      id: [],
      selecionaAdicionais: [],
      nome: [],
    })
  }

  get produtosControls(): FormArray {
    return this.formularioProduto.get('produtos') as FormArray;
  }
  get adicionaisControls() {
    return this.formularioProduto.get('adicionais') as FormArray;
  }

  adicionarProduto(event: Event) {
    event.preventDefault();
    (this.formularioProduto.get("produtos") as FormArray).push(this.formProdutos);
  }

  removerProduto(index) {
    if ((<FormArray>this.formularioProduto.controls['produtos']).at(index).value.id) {
      this.LancamentoProdutoService.
        deleteLancamento((<FormArray>this.formularioProduto.controls['produtos']).at(index).value)
        .subscribe(removeu => {
          this.LancamentoProdutoService.msg("Produto removido");
          (this.formularioProduto.get("produtos") as FormArray).removeAt(index);
        }, erroRemove => {
          console.log(erroRemove);
          this.errors = erroRemove.error.errors;
          this.LancamentoProdutoService.msg(this.errors, true);
        })
    } else {
      (this.formularioProduto.get("produtos") as FormArray).removeAt(index);
      this.LancamentoProdutoService.msg("Produto removido");
    }
  }

  removerAdiconal(index) {
    (this.formProdutos.get("adicionais") as FormArray).removeAt(index);
  }

  TotalProd(event: Event, index: number) {
    const qtd = Number((event.target as HTMLInputElement).value);
    console.log(qtd + "+" + index)
    const valorVenda = (<FormArray>this.formularioProduto.controls['produtos']).at(index).value.valorVenda;
    const quantidade = qtd;
    (<FormArray>this.formularioProduto.controls['produtos']).at(index).patchValue({
      totalProduto: valorVenda * quantidade
    })
  }
  totalPedido() {

  }

  ngSubmit() {
    if (this.formularioLancamento.controls.entrega.value === "p") {
      console.log("salvando true");
      this.formularioLancamento.patchValue({
        cep: this.clienteSelecionado.cep1,
        lagradouro: this.clienteSelecionado.lagradouro1,
        complemento: this.clienteSelecionado.complemento1,
        numero: this.clienteSelecionado.numero1,
        bairro: this.clienteSelecionado.bairro1,
      });
      if (this.lancamentoNovo.id) {
        this.progressAtualizarCli = true;
        this.AtualizarCli();
      } else {
        this.progress = true;
        this.salvarPedido();
      }

    } else if (this.formularioLancamento.controls.entrega.value == "s") {
      console.log("salvando false");
      this.formularioLancamento.patchValue({
        cep: this.clienteSelecionado.cep2,
        lagradouro: this.clienteSelecionado.lagradouro2,
        complemento: this.clienteSelecionado.complemento2,
        numero: this.clienteSelecionado.numero2,
        bairro: this.clienteSelecionado.bairro2,
      });
      if (this.lancamentoNovo.id) {
        this.progressAtualizarCli = true;
        this.AtualizarCli();
      } else {
        this.progress = true;
        this.salvarPedido();
      }
    }


  }

  salvarPedido() {
    this.service.salvar(this.formularioLancamento.value).subscribe
      (salvouPedido => {
        this.progress = false;
        this.service.msg("Pedido em aberto");
        this.lancamentoNovo = salvouPedido;
        this.formulario(this.lancamentoNovo);
        console.log("Salvo", this.formularioLancamento.value);
      }, erroSalvar => {
        this.progress = false;
        console.log(erroSalvar);
        this.errors = erroSalvar.error.errors;
        this.service.msg(this.errors, true);
      })
  }

  AtualizarCli() {

    this.service.atualizarClienteLancamento(this.formularioLancamento.value)
      .subscribe(atualizou => {
        this.progressAtualizarCli = false;
        this.service.msg("Informações atualizadas");
      }, erroAtualizar => {
        this.progressAtualizarCli = false;
        console.log(erroAtualizar);
        this.errors = erroAtualizar.error.errors;
        this.service.msg(this.errors, true);
      })
  }

  cancelarPedido(event: Event) {
    this.progressDelete = true;
    event.preventDefault();
    this.service.deleteLancamento(this.lancamentoNovo)
      .subscribe(deletou => {
        this.progressDelete = false;
        this.service.msg("Pedido cancelado com sucesso!")
        this.ngOnInit();
      }, erroDeletar => {
        this.progressDelete = false;
        this.errors = erroDeletar.error.errors;
        this.service.msg(this.errors, true);

      })
  }

  salvarProduto(event: Event) {
    event.preventDefault();

    this.LancamentoProdutoService.salvar(this.formularioProduto.value)
      .subscribe(salvou => {
        console.log(salvou);
        this.lancamentoProdutos = salvou;
        this.recarregarProdutosSalvos(this.lancamentoProdutos)
        this.LancamentoProdutoService.msg("Produtos do pedido Salvo");
      }, erroSalvar => {
        this.LancamentoProdutoService.msg("erro ao salvar o produto", true);
      })
  }

  recarregarProdutosSalvos(lancProd: LancamentoProduto[]) {

    this.produtosControls.clear();
    //this.adicionaisControls.clear();
    const catAdic = lancProd;
    catAdic.forEach(element => {

      //  const adicionais = 
      const produtos = this.fb.group({
        id: element.id,
        nomeProduto: element.nomeProduto,
        desconto: '',
        produto: element.produto,
        valorVenda: element.valorVenda,
        quantidade: element.quantidade,
        totalProduto: element.totalProduto,
        adicionais: this.fb.array([])
      })


      element.adicionais.forEach(element1 => {
        const listAdicionais = this.fb.group({
          id: element1.adicionalId,
          selecionaAdicionais: element1.status,
          nome: element1.nome
        });
        produtos.get("adicionais").patchValue({
          adicionais: listAdicionais.value});
      });
      this.produtosControls.push(produtos);

    });
    console.log(this.formularioProduto.value);

  }

  //CARREGAMENTOS autocomplete
  carregarClientes() {
    this.clienteService.carregarClientes()
      .subscribe(clientes => {
        this.carregaClientes = clientes;
      }, errorResponse => {
        this.errors = errorResponse.error.error;
        console.log(errorResponse);
        this.clienteService.msg(this.errors, true);
      })
  }

  carregarProdutos() {
    this.produtoService.carregarProdutos()
      .subscribe(produtos => {
        this.carregaProdutos = produtos;

      }, errorResponse => {
        this.errors = errorResponse.error.error;
        console.log(errorResponse);
        this.produtoService.msg(this.errors, true)
      })
  }

  carregarFormaPagamento() {
    this.formaPagService.carregarFp()
      .subscribe(formaPagamentos => {
        this.tipoPagamentos = formaPagamentos;
      }, errorResponse => {
        this.errors = errorResponse.error.error;
        console.log(errorResponse);
        this.produtoService.msg(this.errors, true);
      })
  }

  //id: any
  onCliente(selectCliente: Cliente) {


    if (selectCliente.id) {
      this.clienteSelecionado = selectCliente;
      this.formularioLancamento.patchValue({
        cliente: this.clienteSelecionado.id,
        nomeCliente: this.clienteSelecionado.nome,
        dataNascimento: this.clienteSelecionado.dataNascimento,
        cpf: this.clienteSelecionado.cpf,
        telefone: this.clienteSelecionado.telefone,
        celular: this.clienteSelecionado.celular,
        email: this.clienteSelecionado.email
      });
    }
  }

  onProduto(selectProduto: Produto, index: any, listaprod: any) {

    if (selectProduto.id) {

      (<FormArray>this.formularioProduto.controls['produtos']).at(index)
        .patchValue({
          lancamento: this.lancamentoNovo.id,
          nomeProduto: selectProduto.nomeProduto,
          produto: selectProduto.id,
          valorVenda: selectProduto.valorVenda,
          quantidade: 1,
          totalProduto: '',
        });
      if (selectProduto.categoriaProduto.adicionais != null) {


        listaprod.get("adicionais").clear();

        const catAdic = selectProduto.categoriaProduto.adicionais;

        catAdic.forEach(element => {
          const adicionais = this.fb.group({
            id: [element.id],
            selecionaAdicionais: [false],
            nome: [element.nome]
          })
          listaprod.get("adicionais").push(adicionais);
        });
      }

      const valorVenda = (<FormArray>this.formularioProduto.controls['produtos']).at(index).value.valorVenda;
      const quantidade = (<FormArray>this.formularioProduto.controls['produtos']).at(index).value.quantidade;
      (<FormArray>this.formularioProduto.controls['produtos']).at(index).patchValue({
        totalProduto: valorVenda * quantidade
      })
      this.adicionaisProduto = selectProduto.categoriaProduto.adicionais;
    }
  }




  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
