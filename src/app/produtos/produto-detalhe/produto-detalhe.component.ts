import { Component, OnInit, Inject } from '@angular/core';
import { ProdutoDeleteComponent } from '../produto-delete/produto-delete.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Produto } from '../produto';
import { CategoriaProduto } from '../categoria-produto';
import { TipoProduto } from '../tipo-produto';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ProdutoService } from 'src/app/service/produto.service';
import { Adicional } from '../adicional';
import { CategoriaProdutoService } from 'src/app/service/categoria-produto.service';
import { TipoProdutoService } from 'src/app/service/tipo-produto.service';
import { AdicionalService } from 'src/app/service/adicional.service';
import { CategoraAdicionalService } from 'src/app/service/categora-adicional.service';

@Component({
  selector: 'app-produto-detalhe',
  templateUrl: './produto-detalhe.component.html',
  styleUrls: ['./produto-detalhe.component.css']
})
export class ProdutoDetalheComponent implements OnInit {

  formProduto: FormGroup;
  formCategoriaProduto: FormGroup;
  formTipoProduto: FormGroup;
  formAdicional: FormGroup;
  errors: string;
  progress = false;

  produtoAtt: Produto;
  categoriaProdutoAtt: CategoriaProduto = new CategoriaProduto();
  tipoProdutoAtt: TipoProduto;
  adicionalAtt: Adicional;

  listarCategoriaProdutos: CategoriaProduto[] = [];
  listaTipoProdutos: TipoProduto[] = [];
  carregaAdicionais: Adicional[] = [];
  catAdic: Adicional[];

  constructor(
    private service: ProdutoService,
    private catProdService: CategoriaProdutoService,
    private tipoProdService: TipoProdutoService,
    private adicionalService: AdicionalService,
    private cateAdicionalService: CategoraAdicionalService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProdutoDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public produto?: Produto,
    @Inject(MAT_DIALOG_DATA) public categoria?: CategoriaProduto,
    @Inject(MAT_DIALOG_DATA) public tipo?: TipoProduto,
    @Inject(MAT_DIALOG_DATA) public adicional?: Adicional,
  ) {
    this.produtoAtt = produto;
    this.categoriaProdutoAtt = categoria;
    this.tipoProdutoAtt = tipo;
    this.adicionalAtt = adicional;
  }

  ngOnInit(): void {
    console.log(this.categoriaProdutoAtt);
    this.montarFormulario(this.produtoAtt, this.categoriaProdutoAtt, this.tipoProdutoAtt, this.adicionalAtt);
    this.carregarCategoriaProduto();
    this.carregarTipoProdutos();
    this.carregarAdicionais();
    if (this.categoriaProdutoAtt != null) {
      this.carregarAdicionaisForm(this.categoriaProdutoAtt);
    }

  }

  // FORMULARIOS DE PRODUTO, CATEGORIA E TIPO PRODUTO
  montarFormulario(
    produtoForm?: Produto,
    categoriaProdutoForm?: CategoriaProduto,
    tipoProdutoForm?: TipoProduto,
    adicionalForm?: Adicional
  ) {
    this.formProduto = this.fb.group({
      id: [produtoForm.id],
      dataCadastro: [produtoForm.dataCadastro],
      nomeProduto: [produtoForm.nomeProduto, Validators.required],
      valorVenda: [produtoForm.valorVenda, Validators.required],
      valorCompra: [produtoForm.valorCompra, Validators.required],
      categoriaProduto: [produtoForm.categoriaProduto, Validators.required],
      tipoProduto: [produtoForm.tipoProduto, Validators.required]
    });

    this.formCategoriaProduto = this.fb.group({
      id: [categoriaProdutoForm.id],
      dataCadastro: [categoriaProdutoForm.nomeCategoriaProduto],
      nomeCategoriaProduto: [categoriaProdutoForm.nomeCategoriaProduto, Validators.required],
      adicionais: this.fb.array([])
    });

    this.formTipoProduto = this.fb.group({
      id: [tipoProdutoForm.id],
      dataCadastro: [tipoProdutoForm.dataCadastro],
      nomeTipoProduto: [tipoProdutoForm.nomeTipoProduto, Validators.required]
    });

    this.formAdicional = this.fb.group({
      id: [adicionalForm.id],
      nome: [adicionalForm.nome],
      dataCadastro: [adicionalForm.dataCadastro]
    })
  }

  atualizarProdutos() {
    this.progress = true;
    this.service.atualizarProduto(this.formProduto.value)
      .subscribe(response => {
        this.service.msg('Produto Atualizado!');
        this.progress = false;
      }, errorResponse => {
        this.progress = false;
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
      });
  }

  atualizarCategoriaProduto() {
    this.progress = true;
    console.log(this.formCategoriaProduto.value);
    this.catProdService.atualizarCategoriaProduto(this.formCategoriaProduto.value)
      .subscribe(response => {
        this.service.msg('Categoria Atualizado!');
        this.catProdService.getCateId(this.formCategoriaProduto.controls.id.value).subscribe(
          response => {
            this.formCategoriaProduto.setValue(response);
          }
        )
        this.progress = false;
      }, errorResponse => {
        this.progress = false;
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
      });
  }


  atualizarTipoProduto() {
    this.progress = true;
    this.tipoProdService.atualizarTipoProduto(this.formTipoProduto.value)
      .subscribe(response => {
        this.service.msg('Tipo Produto Atualizado!');
        this.progress = false;
      }, errorResponse => {
        this.progress = false;
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
      });
  }

  atualizarAdicional() {
    this.progress = true;
    this.adicionalService.atualizarAdicional(this.formAdicional.value)
      .subscribe(response => {
        this.service.msg('Adicional Atualizado!');
        this.progress = false;
      }, errorResponse => {
        this.progress = false;
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
      });
  }


  carregarCategoriaProduto() {
    this.catProdService.carregarCategoriasProdutos()
      .subscribe(response => {
        this.listarCategoriaProdutos = response;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg('Não foi possível Carregar as Categorias', true);
      });
  }

  carregarTipoProdutos() {
    this.tipoProdService.carregarTipoProdutos()
      .subscribe(response => {
        this.listaTipoProdutos = response;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg('Não foi possível Carregar os tipos', true);
      });
  }

  carregarAdicionais() {
    this.adicionalService.carregarAdicionais()
      .subscribe(response => {
        this.carregaAdicionais = response;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.adicionalService.msg('Não foi possível Carregar os Adicionais', true);
      });
  }

  get categoriaControls() {
    return this.formCategoriaProduto.get('adicionais') as FormArray;
  }



  carregarAdicionaisForm(categoriaAdicionalArray: CategoriaProduto) {

    this.catAdic = this.categoria.adicionais;
    this.catAdic.forEach(element => {
      const adicionais = this.fb.group({
        idCatProAd: [element.idCatProAd],
        id: [element.id],
        nome: [element.nome],       
      })
      this.categoriaControls.push(adicionais);
    });

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

  fechar(event: Event) {
    event.preventDefault();
    this.dialogRef.close();
  }

  // COMPARAR OS SELECTS DO OS DADOS DO BANCO
  compararObj(obj1, obj2) {
    return obj1 && obj2 ? (obj1.id === obj2.id) : obj1 === obj2;
  }



}
