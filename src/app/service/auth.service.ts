import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Usuario } from '../login/usuario';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl: string = environment.apiBaseUrl + '/api/usuarios';
  tokenUrl: string = environment.apiBaseUrl + environment.obterTokenUrl;
  clientID: string = environment.clienteId;
  ClientSecret: string = environment.clienteSecret;
  jwtHelper: JwtHelperService = new JwtHelperService();


  constructor(
    private http: HttpClient,
    private snack: MatSnackBar
  ) { }

  obterToken() {
    const tokenString = sessionStorage.getItem('access_token');
    if (tokenString) {
      const token = JSON.parse(tokenString).access_token;
      return token;
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.obterToken();
    if (token) {
      const expired = this.jwtHelper.isTokenExpired(token);
      return !expired;
    }
    return false;
  }

  encerrarSessao() {
    sessionStorage.removeItem('access_token');
  }

  getUsuarioAuthenticado() {
    const token = this.obterToken();
    if (token) {
     const usuario = this.jwtHelper.decodeToken(token).user_name;
     return usuario;
    }
    return null;
  }

  msg(msg: string, isError: boolean = false): void {

    this.snack.open(msg, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: isError ? ['msg-error'] : ['msg-sucess']
    });


  }

  salvar(usuario: Usuario): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  login(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password');
    const headers = {
      // tslint:disable-next-line: object-literal-key-quotes
      'Authorization': 'Basic ' + btoa(`${this.clientID}:${this.ClientSecret}`),
      'Content-type': 'application/x-www-form-urlencoded'
    };
    return this.http.post(this.tokenUrl, params.toString(), { headers });
  }

}
