import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {InventoryFormulaRoutingModule} from "./inventory-formula-routing/inventory-formula-routing.module";
import {InventoryFormulaComponent} from "./inventory-formula-list/inventory-formula.component";
import {InventoryFormulaNewComponent} from "./inventory-formula-new/inventory-formula-new.component";
import {InventoryFormulaUpdateComponent} from "./inventory-formula-update/inventory-formula-update.component";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
    imports: [SharedModule, InventoryFormulaRoutingModule, MatSelectModule],
  declarations: [InventoryFormulaComponent, InventoryFormulaNewComponent, InventoryFormulaUpdateComponent],
})
export class InventoryFormulaModule {}
