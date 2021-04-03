import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Lancamento } from '../lancamentos/lancamento';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  apiBaseUrl: string = environment.apiBaseUrl + '/api/lancamentos';
  apiCep: string = environment.buscarCep;

  constructor(
    private snack: MatSnackBar,
    private http: HttpClient
  ) { }

  msg(msg: string, isError: boolean = false): void {
    this.snack.open(msg, '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: isError ? ['msg-error'] : ['msg-sucess']
    });
  }

  salvar(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.post<Lancamento>(this.apiBaseUrl, lancamento);
  }

  deleteLancamento(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.delete<any>(`${this.apiBaseUrl}/${lancamento.id}`);
  }

  atualizarClienteLancamento(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.put<any>(`${this.apiBaseUrl}/${lancamento.id}`, lancamento);
  }
}
