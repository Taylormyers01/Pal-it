import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import {InventoryFormulaComponent} from "../inventory-formula-list/inventory-formula.component";
import {InventoryFormulaUpdateComponent} from "../inventory-formula-update/inventory-formula-update.component";
import {FormulaRoutingResolveService} from "../../formula/route/formula-routing-resolve.service";


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
  {
    path: ':id/edit',
    component: InventoryFormulaUpdateComponent,
    resolve: {
      formula: FormulaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InventoryFormulaUpdateComponent,
      resolve: {
        applicationUser: FormulaRoutingResolveService,
      },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(inventoryRoute)],
  exports: [RouterModule],
})
export class InventoryFormulaRoutingModule {}
