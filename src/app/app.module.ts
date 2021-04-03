import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRippleModule } from '@angular/material/core';

import { TemplateModule } from './template/template.module';
import { HomeComponent } from './home/home.component';
import { ClientesModule } from './clientes/clientes.module';
import { ClientesService } from './service/clientes.service';
import { FormaPagamentoService } from './service/forma-pagamento.service';
import { FormasPagamentosModule } from './formas-pagamentos/formas-pagamentos.module';
import { EmpresaService } from './service/empresa.service';
import { EmpresaModule } from './empresa/empresa.module';
import { ProdutosModule } from './produtos/produtos.module';
import { FornecedoresModule } from './fornecedores/fornecedores.module';
import { FornecedorService } from './service/fornecedor.service';
import { LancamentoService } from './service/lancamento.service';
import { LancamentosModule } from './lancamentos/lancamentos.module';
import { CategoriaProdutoService } from './service/categoria-produto.service'
import { TipoProdutoService } from './service/tipo-produto.service';
import { AdicionalService } from './service/adicional.service';
import { LancamentoProdutoService } from './service/lancamento-produto.service';
import {CategoraAdicionalService} from './service/categora-adicional.service'

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMaskModule } from 'ngx-mask'
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { AuthService } from './service/auth.service';
import { MascaraUtil } from './util/mascara-util';
import { TokenInterceptor } from './token.interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';



registerLocaleData(ptBr, 'pt-BR');





@NgModule({

  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LayoutComponent,
    ConfiguracoesComponent,   

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    TemplateModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    HttpClientModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    FlexLayoutModule,
    ClientesModule,
    FornecedoresModule,
    ProdutosModule,
    FormasPagamentosModule,
    EmpresaModule,
    LancamentosModule,
    MatDividerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,    
    NgxMaskModule.forRoot()


  ],
  providers: [
    ClientesService,
    FornecedorService,
    FormaPagamentoService,
    EmpresaService,
    LancamentoService,
    CategoriaProdutoService,
    TipoProdutoService,
    AdicionalService,
    CategoraAdicionalService,
    LancamentoProdutoService,
    MascaraUtil,
    AuthService,
    DatePipe,
    {
      provide: LOCALE_ID, useValue: 'pt-BR'
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'pt-BR'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
