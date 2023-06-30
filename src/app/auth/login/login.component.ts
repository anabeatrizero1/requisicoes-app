import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public formRecuperacao: FormGroup;
  public formCadastro: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    ) {  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl(""),
      senha: new FormControl("")
    });

    this.formRecuperacao = this.formBuilder.group({
      emailRecuperacao: new FormControl("")
    })

    this.formCadastro = this.formBuilder.group({
      emailCadastro: new FormControl(""),
      senhaCadastro: new FormControl(""),
      confirmarSenha: new FormControl("")
    })

  }
  get email(): AbstractControl | null{
    return this.form.get("email");
  }

  get senha(): AbstractControl | null{
    return this.form.get("senha");
  }

  get emailCadastro(): AbstractControl | null{
    return this.form.get("emailCadastro");
  }

  get senhaCadastro(): AbstractControl | null{
    return this.form.get("senhaCadastro");
  }

  get emailRecuperacao(): AbstractControl | null{
    return this.formRecuperacao.get("emailRecuperacao");
  }


  public async login(){
    const email = this.email?.value;
    const senha = this.senha?.value;

    try {
      const resposta = await this.authService.login(email, senha);

      if(resposta?.user) {
        this.router.navigate(["/painel"]);
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async cadastrar(email: string, senha: string){
    try {
      const resposta = await this.authService.cadastrar(email, senha);
      console.log(resposta);
      if(resposta?.user) {
        this.router.navigate(["/painel"]);
      }
    } catch (error) {
      console.log(error)
    }

  }

  public abrirModalRecuperacao(modal: TemplateRef<any>) {
    this.modalService.open(modal)
      .result
      .then(resultado => {
        if(resultado === "enviar") {
          this.authService.resetarSenha(this.emailRecuperacao?.value);
        }
      })
      .catch(() => {
        this.formRecuperacao.reset();
      });
  }

  public abrirModalCadastro(modal: TemplateRef<any>) {
    const email = this.emailCadastro?.value;
    const senha = this.senhaCadastro?.value;

    this.modalService.open(modal)
    .result
    .then(resultado => {
      if(resultado === "enviar") {
        this.authService.cadastrar(email, senha);
      }
    })
    .catch(() => {
      this.formRecuperacao.reset();
    });
  }
}
