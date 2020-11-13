import { Component, OnInit, Inject } from '@angular/core';
import { ProdutoDeleteComponent } from '../produto-delete/produto-delete.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Produto } from '../produto';
import { CategoriaProduto } from '../categoria-produto';
import { TipoProduto } from '../tipo-produto';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProdutoService } from 'src/app/service/produto.service';

@Component({
  selector: 'app-produto-detalhe',
  templateUrl: './produto-detalhe.component.html',
  styleUrls: ['./produto-detalhe.component.css']
})
export class ProdutoDetalheComponent implements OnInit {

  formProduto: FormGroup;
  formCategoriaProduto: FormGroup;
  formTipoProduto: FormGroup;
  errors: string;
  progress = false;

  produtoAtt: Produto;
  categoriaProdutoAtt:  CategoriaProduto;
  tipoProdutoAtt:  TipoProduto;

  listarCategoriaProdutos: CategoriaProduto[] = [];
  listaTipoProdutos: TipoProduto[] = [];

  constructor(
    private service: ProdutoService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProdutoDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public produto?: Produto,
    @Inject(MAT_DIALOG_DATA) public categoria?: CategoriaProduto,
    @Inject(MAT_DIALOG_DATA) public tipo?: TipoProduto,
  ) {
    this.produtoAtt = new Produto();
    this.categoriaProdutoAtt = categoria;
    this.tipoProdutoAtt = tipo;
   }

  ngOnInit(): void {
    this.produtoAtt = this.produto;
    this.montarFormulario(this.produtoAtt, this.categoriaProdutoAtt, this.tipo);    
    this.carregarCategoriaProduto();
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
      valorCompra: [produtoForm.valorCompra, Validators.required],
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
    event.preventDefault();
    this.progress = true;
    this.service.atualizarCategoriaProduto(this.formCategoriaProduto.value)
      .subscribe(response => {
        this.service.msg('Categoria Atualizado!');
        this.progress = false;
      }, errorResponse => {
        this.progress = false;
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
      });
  }

  carregarCategoriaProduto() {
    this.service.carregarCategoriasProdutos()
      .subscribe(response => {
        this.listarCategoriaProdutos = response;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg('Não foi possível Carregar as Categorias', true);
      });
  }

  atualizarTipoProduto() {
    event.preventDefault();
    this.progress = true;
    this.service.atualizarTipoProduto(this.formTipoProduto.value)
      .subscribe(response => {
        this.service.msg('Tipo Produto Atualizado!');
        this.progress = false;
      }, errorResponse => {
        this.progress = false;
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
      });
  }

  carregarTipoProdutos() {
    this.service.carregarTipoProdutos()
      .subscribe(response => {
        console.log(response);
        this.listaTipoProdutos = response;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg('Não foi possível Carregar os tipos', true);
      });
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
