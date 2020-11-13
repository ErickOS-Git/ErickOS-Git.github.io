import { Injectable } from '@angular/core';
import { Cliente } from '../clientes/cliente';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

import { Endereco } from '../clientes/endereco';
import { PaginarComponents } from '../util/paginarComponents';




@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  apiBaseUrl: string = environment.apiBaseUrl + '/api/clientes';
  apiCep: string = environment.buscarCep;

  constructor(private http: HttpClient, private snack: MatSnackBar) { }

  // tslint:disable-next-line: ban-types
  msg(msg: string, isError: Boolean = false): void {
    this.snack.open(msg, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: isError ? ['msg-error'] : ['msg-sucess']
    });
  }

  salvar(cliente: Cliente): Observable<Cliente> {

    return this.http.post<Cliente>(this.apiBaseUrl, cliente);

  }

  atualizar(cliente: Cliente): Observable<Cliente> {

    return this.http.put<any>(`${this.apiBaseUrl}/${cliente.id}`, cliente);

  }

  deletar(cliente: Cliente): Observable<any> {

    return this.http.delete<any>(`${this.apiBaseUrl}/${cliente.id}`);

  }

  getClienteAll(page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseUrl}?${params.toString()}`);

  }

  buscarCliente(filtro: string, page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('filtro', filtro)
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseUrl}/buscarCliente?${params.toString()}`);
  }


  getClienteById(id: number): Observable<Cliente> {

    return this.http.get<any>(`${this.apiBaseUrl}/${id}`);

  }

  getClienteByCPF(cpf: string): Observable<Cliente> {

    return this.http.get<any>(`${this.apiBaseUrl}/cpf/${cpf}`);

  }

  buscarCep(cep: string): Observable<Endereco> {
    return this.http.get<Endereco>(`${this.apiCep}/${cep}/json/`);
  }

}
