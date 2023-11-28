import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {InventoryMiniatureListComponent} from "./inventory-miniature-list/inventory-miniature-list.component";
import {InventoryMiniatureRoutingModule} from "./inventory-miniature-route/inventory-miniature-routing.module";
import {InventoryMiniatureUpdateComponent} from "./inventory-miniature-update/inventory-miniature-update.component";
import {InventoryMiniatureViewComponent} from "./inventory-miniature-view/inventory-miniature-view.component";

@NgModule({
    imports: [SharedModule, InventoryMiniatureRoutingModule],
  declarations: [InventoryMiniatureListComponent, InventoryMiniatureUpdateComponent, InventoryMiniatureViewComponent],
})
export class InventoryMiniatureModule {}
