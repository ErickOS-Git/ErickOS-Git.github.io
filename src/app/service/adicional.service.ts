import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Adicional } from '../produtos/adicional';
import { PaginarComponents } from '../util/paginarComponents';

@Injectable({
  providedIn: 'root'
})
export class AdicionalService { 

  apiBaseURlAdicionais: string = environment.apiBaseUrl + '/api/adicionais';

  constructor(
    private snack: MatSnackBar,
    private http: HttpClient,
  ) { }

  msg(msg: string, isError: boolean = false): void {
    this.snack.open(msg, 'x', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: isError ? ['msg-error'] : ['msg-sucess']
    });
  }

  
  /*------------------------------URLS ADICIONAL------------------------------------*/
  salvarAdicional(adicional: Adicional): Observable<Adicional> {
    return this.http.post<Adicional>(this.apiBaseURlAdicionais, adicional);
  }

  atualizarAdicional(adicional: Adicional): Observable<Adicional> {
    return this.http.put<any>(`${this.apiBaseURlAdicionais}/${adicional.id}`, adicional);
  }

  deletarAdicional(adicional: Adicional): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseURlAdicionais}/${adicional.id}`);
  }

  listaAdicionais(page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseURlAdicionais}?${params.toString()}`);
  }

  carregarAdicionais(): Observable<Adicional[]> {
    return this.http.get<Adicional[]>(`${this.apiBaseURlAdicionais}/carregar-adicionais`);
  }

  buscarAdicional(filtro: string, page, size): Observable<PaginarComponents> {
    const params = new HttpParams()
      .set('filtro', filtro)
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiBaseURlAdicionais}/buscar-adicionais?${params.toString()}`);
  }


}
