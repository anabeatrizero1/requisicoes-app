import { Component, OnInit, TemplateRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Funcionario } from './models/funcionario.model';
import { FuncionarioService } from './services/funcionario.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html'
})
export class FuncionarioComponent implements OnInit {
  public funcionarios$: Observable<Funcionario[]>;
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(""),
      nome: new FormControl(""),
      email: new FormControl(""),
      funcao: new FormControl(""),
      departamentoId: new FormControl(""),
      departamento: new FormControl("")
    });
    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();

  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id() {
    return this.form.get("id");
  }

  public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario) {
    this.form.reset();

    if(funcionario) {
      const departamento = funcionario.departamento ? funcionario.departamento : null;

      // spread operator (JavaScript)
      const funcionarioCompleto = {
        ...funcionario,
        departamento
      }

      this.form.setValue(funcionarioCompleto);
    }

    try {
      await this.modalService.open(modal).result;

      if(!funcionario)
        await this.funcionarioService.inserir(this.form.value);
      else
        await this.funcionarioService.editar(this.form.value);

      this.toastr.success("Funcionário salvo com sucesso", "Sucesso");

    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
        this.toastr.error("Erro ao tenter salvar Funcionário", "Erro");
    }
  }

  public async excluir(funcioanrio: Funcionario) {
    try {
      await this.funcionarioService.excluir(funcioanrio);
      this.toastr.success("Funcionário excluido com sucesso", "Sucesso");
    } catch (error) {
      this.toastr.error("Erro ao tenter excluir Funcionário", "Erro");
    }
  }
}
