import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { FormaPagamento } from '../formas-pagamentos/forma-pagamento';
import { Observable } from 'rxjs';
import { PaginarComponents } from '../util/paginarComponents';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService {

  apiBaseUrl: string = environment.apiBaseUrl + '/api/forma-pagamento';

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

  salvar(formaPagamento: FormaPagamento): Observable<FormaPagamento> {
    return this.http.post<FormaPagamento>(this.apiBaseUrl, formaPagamento);
  }

  atualizar(formaPagamento: FormaPagamento): Observable<FormaPagamento> {
    return this.http.put<any>(`${this.apiBaseUrl}/${formaPagamento.id}`, formaPagamento);
  }

  deletar(formaPagamento: FormaPagamento): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/${formaPagamento.id}`);
  }

  carregarFp(): Observable<FormaPagamento[]> {
    return this.http.get<FormaPagamento[]>(this.apiBaseUrl);
  }

  listaFormaPagamento(page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseUrl}/page?${params.toString()}`);
  }

  buscaFormaPagamento(filtro, page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('filtro', filtro)
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseUrl}/buscar?${params.toString()}`);
  }

}
