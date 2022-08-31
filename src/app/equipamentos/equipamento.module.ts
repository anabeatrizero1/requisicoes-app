import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipamentoRoutingModule } from './equipamento-routing.module';
import { EquipamentoComponent } from './equipamento.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EquipamentoService } from './services/equipamento.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
  declarations: [
    EquipamentoComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    EquipamentoRoutingModule
  ],
  providers: [EquipamentoService]
})
export class EquipamentoModule { }
