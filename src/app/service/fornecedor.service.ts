import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Fornecedor } from '../fornecedores/fornecedor/fornecedor';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginarComponents } from '../util/paginarComponents';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  apiBaseUrl: string = environment.apiBaseUrl + '/api/fornecedor';

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

  salvar(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.apiBaseUrl, fornecedor);
  }

  atualizar(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.put<any>(`${this.apiBaseUrl}/${fornecedor.id}`, fornecedor);
  }

  deletar(fornecedor: Fornecedor): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/${fornecedor.id}`);
  }

  getFornecedorAll(page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseUrl}?${params.toString()}`);
  }

  buscarFornecedor(filtro: string, page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('filtro', filtro)
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseUrl}/buscarFornecedor?${params.toString()}`);
  }
}
