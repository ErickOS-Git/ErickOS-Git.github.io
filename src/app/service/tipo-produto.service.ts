import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoProduto } from '../produtos/tipo-produto';
import { PaginarComponents } from '../util/paginarComponents';

@Injectable({
  providedIn: 'root'
})
export class TipoProdutoService {

  apiBaseURlTipo: string = environment.apiBaseUrl + '/api/tipo-produto';

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

  salvarTipoProduto(tipo: TipoProduto): Observable<TipoProduto> {
    return this.http.post<TipoProduto>(this.apiBaseURlTipo, tipo);
  }

  atualizarTipoProduto(tipoProduto: TipoProduto): Observable<TipoProduto> {
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
