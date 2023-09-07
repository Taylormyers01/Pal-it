import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {InventoryFormulaRoutingModule} from "./inventory-formula-routing/inventory-formula-routing.module";
import {InventoryFormulaComponent} from "./inventory-formula-list/inventory-formula.component";

@NgModule({
  imports: [SharedModule, InventoryFormulaRoutingModule],
  declarations: [InventoryFormulaComponent],
})
export class InventoryFormulaModule {}
