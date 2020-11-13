import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Produto } from '../produtos/produto';
import { Observable } from 'rxjs';
import { CategoriaProduto } from '../produtos/categoria-produto';
import { TipoProduto } from '../produtos/tipo-produto';
import { PaginarComponents } from '../util/paginarComponents';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  apiBaseUrlprod: string = environment.apiBaseUrl + '/api/produtos';
  apiBaseURlcat: string = environment.apiBaseUrl + '/api/produtos/categoria-produto';
  apiBaseURlTipo: string = environment.apiBaseUrl + '/api/produtos/tipo-produto';

  constructor(
    private snack: MatSnackBar,
    private http: HttpClient,
  ) { }

  msg(msg: string, isError: boolean = false): void {
    this.snack.open(msg, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: isError ? ['msg-error'] : ['msg-sucess']
    });
  }

  /*------------------------------URLS PRODUTOS----------------------------------------*/

  salvarProduto(produto: Produto): Observable<Produto> {
    return this.http.post<any>(this.apiBaseUrlprod, produto);
  }

  getAllProdutos(page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseUrlprod}?${params.toString()}`);
  }

  buscarProdutos(filtro: string, page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('filtro', filtro)
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseUrlprod}?${params.toString()}`);
  }

  atualizarProduto(produto: Produto): Observable<Produto> {
    return this.http.put<any>(`${this.apiBaseUrlprod}/${produto.id}`, produto);
  }

  deleteProduto(produto: Produto): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrlprod}/${produto.id}`);
  }

  /*------------------------URLS CATEGORIA PRODUTOS---------------------------------------*/


  salvarCategoriaProduto(categoria: CategoriaProduto): Observable<CategoriaProduto> {
    return this.http.post<CategoriaProduto>(this.apiBaseURlcat, categoria);
  }

  atualizarCategoriaProduto(categoria: CategoriaProduto): Observable<CategoriaProduto> {
    return this.http.put<any>(`${this.apiBaseURlcat}/${categoria.id}`, categoria);
  }

  deleteCategoriaProduto(categoria: CategoriaProduto): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseURlcat}/${categoria.id}`);
  }
  carregarCategoriasProdutos(): Observable<CategoriaProduto[]> {
    return this.http.get<CategoriaProduto[]>(this.apiBaseURlcat);
  }

  getAllCategoriaProdutos(page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseURlcat}/list?${params.toString()}`);
  }

  buscarCategoriaProdutos(filtro: string, page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('filtro', filtro)
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseURlcat}/buscar?${params.toString()}`);
  }

  /*------------------------------URLS TIPOS DE PRODUTOS------------------------------------*/


  salvarTipoProduto(tipo: TipoProduto): Observable<TipoProduto> {
    return this.http.post<TipoProduto>(this.apiBaseURlTipo, tipo);
  }

  atualizarTipoProduto(tipoProduto: TipoProduto): Observable<CategoriaProduto> {
    return this.http.put<any>(`${this.apiBaseURlTipo}/${tipoProduto.id}`, tipoProduto);
  }

  deleteTipoProduto(tipoProduto: TipoProduto): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseURlTipo}/${tipoProduto.id}`);
  }

  carregarTipoProdutos(): Observable<TipoProduto[]> {
    return this.http.get<TipoProduto[]>(this.apiBaseURlTipo);
  }

  getAllTipoProdutos(page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseURlTipo}/list?${params.toString()}`);
  }

  buscarTipoProdutos(filtro: string, page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('filtro', filtro)
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseURlTipo}/buscar?${params.toString()}`);
  }

}
