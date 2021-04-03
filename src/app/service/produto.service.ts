import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Produto } from '../produtos/produto';
import { Observable } from 'rxjs';
import { CategoriaProduto } from '../produtos/categoria-produto';
import { TipoProduto } from '../produtos/tipo-produto';
import { PaginarComponents } from '../util/paginarComponents';
import { Adicional } from '../produtos/adicional';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  apiBaseUrlprod: string = environment.apiBaseUrl + '/api/produtos';  

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

  carregarProdutos(): Observable<Produto[]>{
    return this.http.get<Produto[]>(`${this.apiBaseUrlprod}/carregar-produtos`);
  }

  buscarProdutos(filtro: string, page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('filtro', filtro)
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseUrlprod}/buscar-produto?${params.toString()}`);
  }

  atualizarProduto(produto: Produto): Observable<Produto> {
    return this.http.put<any>(`${this.apiBaseUrlprod}/${produto.id}`, produto);
  }

  deleteProduto(produto: Produto): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrlprod}/${produto.id}`);
  }

  

}
