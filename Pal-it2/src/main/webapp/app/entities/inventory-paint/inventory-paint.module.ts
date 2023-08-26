import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {InventoryPaintComponent} from "./inventory-paint list/inventory-paint.component";
import {InventoryPaintRoutingModule} from "./inventory-paint route/inventory-paint-routing.module";
import {InventoryPaintDetailComponent} from "./inventory-paint-detail/intentory-paint-detail.component";

@NgModule({
  imports: [SharedModule, InventoryPaintRoutingModule],
  declarations: [InventoryPaintComponent, InventoryPaintDetailComponent],
})
export class InventoryPaintModule {}
