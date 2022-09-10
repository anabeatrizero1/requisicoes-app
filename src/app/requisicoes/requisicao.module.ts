import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequisicaoRoutingModule } from './requisicao-routing.module';
import { RequisicaoComponent } from './requisicao.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequisicaoService } from './service/requisicao.service';
import { RequisicoesFuncionarioComponent } from './requisicoes-funcionario/requisicoes-funcionario.component';
import { RequisicoesDepartamentoComponent } from './requisicoes-departamento/requisicoes-departamento.component';


@NgModule({
  declarations: [
    RequisicaoComponent,
    RequisicoesFuncionarioComponent,
    RequisicoesDepartamentoComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RequisicaoRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  providers: [RequisicaoService]
})
export class RequisicaoModule { }