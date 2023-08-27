import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {InventoryPaintComponent} from "./inventory-paint list/inventory-paint.component";
import {InventoryPaintRoutingModule} from "./inventory-paint route/inventory-paint-routing.module";
import {InventoryPaintDetailComponent} from "./inventory-paint-detail/intentory-paint-detail.component";
import {InventoryPaintUpdateComponent} from "./inventory-paint-update/inventory-paint-update.component";
import {MatCardModule} from '@angular/material/card';
import {MatButton, MatButtonModule} from "@angular/material/button";

@NgModule({
  imports: [SharedModule, InventoryPaintRoutingModule, MatCardModule, MatButtonModule],
  declarations: [InventoryPaintComponent, InventoryPaintDetailComponent, InventoryPaintUpdateComponent],
})
export class InventoryPaintModule {}
