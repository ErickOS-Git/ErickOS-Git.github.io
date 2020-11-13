import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from './usuario';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string;
  password: string;
  cadastrando: boolean;
  msgErrorsApi: string;
  progress = false;


  constructor(private router: Router,
    private authService: AuthService,
  ) { }

  onSubmit() {
    this.progress = true;
    this.authService
      .login(this.username, this.password)
      .subscribe(response => {
        const access_token = JSON.stringify(response);
        sessionStorage.setItem('access_token', access_token);
        this.router.navigate(['/home']);
        this.authService.msg('Bem vindo, ' + this.username);
        this.progress = false;
      }, errorResponse => {
        this.progress = false;
        this.authService.msg('Usuário e/ou senha incorretos(s).', true);
      });
  }

  preparaCadastrar(event) {
    event.preventDefault();
    this.cadastrando = true;
  }
  cancelaCadastro() {
    this.cadastrando = false;
  }

  cadastrar() {
    const usuario: Usuario = new Usuario();
    usuario.username = this.username;
    usuario.password = this.password;
    this.authService
      .salvar(usuario)
      .subscribe(response => {
        this.authService.msg('Cadastro realizado com sucesso! efetue o login.');
        this.cadastrando = false;
        this.username = '';
        this.password = '';
      }, errorResponse => {
        this.msgErrorsApi = errorResponse.error.errors;
        this.authService.msg(this.msgErrorsApi, true);

      });
  }

}
