import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './services/equipamento.service';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html'
})
export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private equipamentoService: EquipamentoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      numSerie: new FormControl(""),
      nome: new FormControl(""),
      precoAquisicao: new FormControl(""),
      dataFabricacao: new FormControl("")
    });
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id() {
    return this.form.get("id");
  }

  get nome() {
    return this.form.get("nome");
  }

  get numSerie() {
    return this.form.get("numSerie");
  }

  get precoAquisicao() {
    return this.form.get("precoAquisicao");
  }

  get dataFabricacao() {
    return this.form.get("dataFabricacao");
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {
    this.form.reset();

    if(equipamento)
      this.form.setValue(equipamento);

    try {
      await this.modalService.open(modal).result;

      if(!equipamento)
        await this.equipamentoService.inserir(this.form.value);
      else
        await this.equipamentoService.editar(this.form.value);

      this.toastr.success("Equipamento salvo com sucesso", "Sucesso");

    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
        this.toastr.error("Erro ao tenter salvar Equipamento", "Erro");
    }
  }

  public async excluir(equipamento: Equipamento) {
    try {
      await this.equipamentoService.excluir(equipamento);
      this.toastr.success("Equipamento excluido com sucesso", "Sucesso");
    } catch (error) {
      this.toastr.error("Erro ao tenter excluir equipamento", "Erro");
    }
  }

}
