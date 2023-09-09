import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {InventoryMiniatureListComponent} from "./inventory-miniature-list/inventory-miniature-list.component";
import {InventoryMiniatureRoutingModule} from "./inventory-miniature-route/inventory-miniature-routing.module";

@NgModule({
    imports: [SharedModule, InventoryMiniatureRoutingModule],
  declarations: [InventoryMiniatureListComponent],
})
export class InventoryMiniatureModule {}
