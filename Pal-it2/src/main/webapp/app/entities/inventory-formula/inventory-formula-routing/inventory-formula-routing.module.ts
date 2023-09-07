import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import {InventoryFormulaComponent} from "../inventory-formula-list/inventory-formula.component";


const inventoryRoute: Routes = [
  {
    path: '',
    component: InventoryFormulaComponent,
    canActivate: [UserRouteAccessService],
  },
  // {
  //   path: ':id/view',
  //   component: InventoryPaintDetailComponent,
  //   resolve: {
  //     paint: PaintRoutingResolveService,
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
  // {
  //   path: 'edit',
  //   component: InventoryPaintUpdateComponent,
  //   canActivate: [UserRouteAccessService],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(inventoryRoute)],
  exports: [RouterModule],
})
export class InventoryFormulaRoutingModule {}
