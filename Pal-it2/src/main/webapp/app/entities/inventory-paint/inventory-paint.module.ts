import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {InventoryPaintComponent} from "./inventory-paint list/inventory-paint.component";
import {InventoryPaintRoutingModule} from "./inventory-paint route/inventory-paint-routing.module";
import {InventoryPaintDetailComponent} from "./inventory-paint-detail/intentory-paint-detail.component";
import {InventoryPaintUpdateComponent} from "./inventory-paint-update/inventory-paint-update.component";
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

@NgModule({
    imports: [SharedModule, InventoryPaintRoutingModule, MatCardModule, MatButtonModule, MatGridListModule, MatButtonToggleModule],
  declarations: [InventoryPaintComponent, InventoryPaintDetailComponent, InventoryPaintUpdateComponent],
})
export class InventoryPaintModule {}
