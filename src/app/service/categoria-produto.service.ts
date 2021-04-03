import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriaProduto } from '../produtos/categoria-produto';
import { PaginarComponents } from '../util/paginarComponents';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProdutoService {

  apiBaseURlcat: string = environment.apiBaseUrl + '/api/categoria-produtos';

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



  salvarCategoriaProduto(categoria: CategoriaProduto): Observable<CategoriaProduto> {
    return this.http.post<CategoriaProduto>(this.apiBaseURlcat, categoria);
  }

  atualizarCategoriaProduto(categoria: CategoriaProduto): Observable<CategoriaProduto> {
    return this.http.put<CategoriaProduto>(`${this.apiBaseURlcat}/${categoria.id}`, categoria);
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

  getCateId(id:number): Observable<CategoriaProduto>{
    return this.http.get<CategoriaProduto>(`${this.apiBaseURlcat}/${id}`)
  }

  buscarCategoriaProdutos(filtro: string, page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('filtro', filtro)
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseURlcat}/buscar?${params.toString()}`);
  }

}
