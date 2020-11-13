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
    // tslint:disable-next-line: only-arrow-functions
    (function ($) {

      const path = window.location.href;
      $('#layoutSidenav_nav .sb-sidenav a.nav-link').each(function () {
        if (this.href === path) {
          $(this).addClass('active');
        }
      });

      // tslint:disable-next-line: only-arrow-functions
      $('#sidebarToggle').on('click', function (e) {
        e.preventDefault();
        $('body').toggleClass('sb-sidenav-toggled');
      });
    })(jQuery);

    
  }
  logout() {
    this.authService.encerrarSessao();
  
  }
}
