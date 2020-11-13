import { Component, OnInit } from '@angular/core';
import { Empresa } from '../empresa';
import { EmpresaService } from 'src/app/service/empresa.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MascaraUtil } from 'src/app/util/mascara-util';
import { BuscarCepService } from 'src/app/service/buscar-cep.service';
import { LogoModalComponent } from '../logo-modal/logo-modal.component';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  progress = false;
  errors: string;
  empresa: Empresa;  
  formulario: FormGroup;

  mascaraCnpj = MascaraUtil.mascaraCnpj;
  mascaraCelular = MascaraUtil.mascaraCelular;
  mascaraTelefoneFixo = MascaraUtil.mascaraTelefoneFixo;
  
  constructor(
    private service: EmpresaService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cep: BuscarCepService,
  ) {
    this.empresa = new Empresa();
   }

  ngOnInit(): void {
    this.formularioEmpresa(this.empresa)
    this.carregarEmpresa();
  }

  formularioEmpresa(empresa: Empresa) {
    this.formulario = this.fb.group({
      id: [empresa.id],
      cnpj: [empresa.cnpj, Validators.required],
      nomeFantasia: [empresa.nomeFantasia, Validators.required],
      razaoSocial: [empresa.razaoSocial, Validators.required],      
      areaAtuacao: [empresa.areaAtuacao],
      inscricaoEstadual: [empresa.inscricaoEstadual],
      inscricaoMunicipal: [empresa.inscricaoMunicipal],  
      logoTipo: [empresa.logoTipo], 
      telefone: [empresa.telefone],   
      celular: [empresa.celular],   
      endereco: [empresa.endereco],   
      numero: [empresa.numero],  
      bairro: [empresa.bairro],  
      cidade: [empresa.cidade],  
      estado: [empresa.estado],  
      cep: [empresa.cep],  
      email: [empresa.email],  
    });
  }

  carregarEmpresa(){
    this.service.carregar().subscribe(response => {          
      this.empresa = response;
      this.formulario.setValue(this.empresa);
    
    });
  }

  

  Submit() {
    console.log('Salvando....');
    this.progress = true;
    console.log(this.formulario.value);
    this.service.salvar(this.formulario.value)
      .subscribe(response => {
        this.formulario.setValue(response);
        this.empresa = response;
        this.progress = false;
        this.service.msg('Salvo com sucesso');        
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        console.log(errorResponse);
        this.service.msg(this.errors, true);
        this.progress = false;
      })
  }

  atualizaEmpresa(event: Event){
    event.preventDefault();
    this.progress = true;
    this.service.atualizar(this.formulario.value)
      .subscribe(reponse => {
        this.service.msg('Atualizado.');
        this.progress = false;
      }, errorResponse => {
        this.errors = errorResponse.error.errors;
        this.service.msg(this.errors, true);
        this.progress = false;
      });
  }

  buscarCep(event: Event) {
    const cep = (event.target as HTMLInputElement).value;
    this.cep
      .buscarCep(cep)
      .subscribe(response => {
        this.formulario.controls.bairro.setValue(response.bairro);
        this.formulario.controls.endereco.setValue(response.logradouro);
        this.formulario.controls.estado.setValue(response.uf);
        this.formulario.controls.cidade.setValue(response.localidade);
      }
      );
  }

  uploadLogo(event, empresa){
    const files = event.target.files;
    if(files){
      const foto = files[0];
      const formData: FormData = new FormData();
      formData.append("foto", foto);
      this.service
      .upload(empresa, formData)
      .subscribe(response => this.carregarEmpresa());
    }
  }

  visualizarFoto(event : Event){
    event.preventDefault();
    this.dialog.open(LogoModalComponent, {      
      data: this.empresa
    }).afterClosed().subscribe(responseClose => {
      this.ngOnInit();
    });
  }
}

