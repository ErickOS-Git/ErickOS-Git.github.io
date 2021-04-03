import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LancamentoProduto } from '../lancamentos/lancamento-produto';

@Injectable({
  providedIn: 'root'
})
export class LancamentoProdutoService {

  apiBaseUrl: string = environment.apiBaseUrl + '/api/lancamentos-produtos';

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

  salvar(lancamentoProduto: LancamentoProduto): Observable<LancamentoProduto[]> {
    return this.http.post<LancamentoProduto[]>(this.apiBaseUrl, lancamentoProduto);
  }

  deleteLancamento(lancamentoProduto: LancamentoProduto): Observable<LancamentoProduto> {
    return this.http.delete<any>(`${this.apiBaseUrl}/${lancamentoProduto.id}`);
  }

}
