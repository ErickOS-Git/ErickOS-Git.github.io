import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import jQuery from 'jquery';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements AfterViewInit {

  usuarioLogado: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.usuarioLogado = this.authService.getUsuarioAuthenticado();
  }
  
  ngAfterViewInit() {
    
  }
  
  logout() {
    this.authService.encerrarSessao();
  
  }
}
