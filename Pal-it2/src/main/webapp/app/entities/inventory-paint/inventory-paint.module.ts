import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {InventoryPaintComponent} from "./inventory-paint list/inventory-paint.component";
import {InventoryPaintRoutingModule} from "./inventory-paint list/inventory-paint-routing.module";

@NgModule({
  imports: [SharedModule, InventoryPaintRoutingModule],
  declarations: [InventoryPaintComponent],
})
export class InventoryPaintModule {}
