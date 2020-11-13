import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endereco } from '../clientes/endereco';

@Injectable({
  providedIn: 'root'
})
export class BuscarCepService {

  apiCep: string = environment.buscarCep;

    constructor(private http: HttpClient) { }


buscarCep(cep: string): Observable < Endereco > {
  return this.http.get<Endereco>(`${this.apiCep}/${cep}/json/`);
}
}
