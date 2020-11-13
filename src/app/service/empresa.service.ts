import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Empresa } from '../empresa/empresa'
import { Endereco } from '../clientes/endereco';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  apiBaseUrl: string = environment.apiBaseUrl + '/api/empresa';
  apiCep: string = environment.buscarCep;
  
  constructor(
    private snack: MatSnackBar,
    private http: HttpClient
  ) { }

  msg(msg: string, isError: boolean = false): void {
    this.snack.open(msg, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: isError ? ['msg-error'] : ['msg-sucess']
    });
  }

  salvar(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiBaseUrl, empresa);
  }

  atualizar(empresa: Empresa): Observable<Empresa>{
    return this.http.put<any>(`${this.apiBaseUrl}/${empresa.id}`, empresa);  
  }
  
  carregar(): Observable<Empresa>{
    return this.http.get<any>(this.apiBaseUrl)
  }

  buscarCep(cep: string): Observable<Endereco> {
    return this.http.get<Endereco>(`${this.apiCep}/${cep}/json/`);
  }
  
  upload(empresa: Empresa, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/${empresa.id}/upload`, formData, { responseType : 'blob' })
  }

  apagarlogo(empresa: Empresa): Observable<any> {    
    return this.http.patch(`${this.apiBaseUrl}/${empresa.id}/delete`, empresa)
  }
}

