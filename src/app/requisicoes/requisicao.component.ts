import { Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';

import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Funcionario } from '../funcionarios/models/funcionario.model';
import { FuncionarioService } from '../funcionarios/services/funcionario.service';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './service/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html'
})
export class RequisicaoComponent implements OnInit, OnDestroy {
  public requisicoes$: Observable<Requisicao[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public departamentos$: Observable<Departamento[]>;
  private processoAutentificado$: Subscription;

  public form: FormGroup;
  public funcionarioLogadoId: string;

  constructor(
    private authService: AuthenticationService,
    private requisicaoService: RequisicaoService,
    private equipamentoService: EquipamentoService,
    private departamentoService: DepartamentoService,
    private funcionarioService: FuncionarioService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(""),
      descricao: new FormControl(""),
      dataAbertura: new FormControl(""),

      funcionarioId: new FormControl(""),
      funcionario: new FormControl(""),

      departamentoId: new FormControl(""),
      departamento: new FormControl(""),

      equipamentoId: new FormControl(""),
      equipamento: new FormControl(""),
    })


    this.processoAutentificado$ = this.authService.usuarioLogado.subscribe(usuario => {
      const email: string = usuario?.email!; // ! significa que sabemos que o usuário não voltara nulo

      this.funcionarioService.selecionarFuncionarioLogado(email)
      .subscribe(funcionario => {
        this.funcionarioLogadoId = funcionario.id;

        this.requisicoes$ = this.requisicaoService
          .selecionarRequisicoesFuncionarioAtual(this.funcionarioLogadoId)
      });
    });

    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
  }
  ngOnDestroy(): void {
    this.processoAutentificado$.unsubscribe();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }
  // get dataAbertura(): AbstractControl | null {
  //   return this.form.get("dataAbertura");
  // }
  // get descricao(): AbstractControl | null {
  //   return this.form.get("descricao");
  // }
  // get departamentoId(): AbstractControl | null {
  //   return this.form.get("departamentoId");
  // }
  // get equipamentoId(): AbstractControl | null {
  //   return this.form.get("equipamentoId");
  // }
  // get funcionarioId(): AbstractControl | null {
  //   return this.form.get("funcionarioId");
  // }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();
    this.configurarValoresPadrao();

    if (requisicao) {
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const funcionario = requisicao.funcionario ? requisicao.funcionario : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;

      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        funcionario,
        equipamento
      }
      this.form.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {
        if (!requisicao)
          await this.requisicaoService.inserir(this.form.value);
        else
          await this.requisicaoService.editar(this.form.value);

        this.toastrService.success(`A requisição foi salva com sucesso`, "Cadastro de Requisições")
      } else {
        this.toastrService.error(`Verifique o preenchimento do formulário e tente novalente`, "Cadastro de Requisições")
      }
    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error("Erro ao tenter salvar a requisição. Tente novamente.", "Cadastro de Requisições");
    }
  }

  public async excluir(requisicao: Requisicao) {
    try {
      this.requisicaoService.excluir(requisicao);
      this.toastrService.success("Requisição excluída com sucesso", "Cadastro de Requisições");
    } catch (error) {
      this.toastrService.error("Erro ao tenter excluir a requisição", "Cadastro de Requisição");
    }

  }

  private configurarValoresPadrao(): void {
    this.form.get("dataAbertura")?.setValue(new Date());
    this.form.get("departamentoId")?.setValue(null);
    this.form.get("funcionarioId")?.setValue(this.funcionarioLogadoId);
  }


}
