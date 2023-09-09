import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import {InventoryMiniatureListComponent} from "../inventory-miniature-list/inventory-miniature-list.component";


const inventoryRoute: Routes = [
  {
    path: '',
    component: InventoryMiniatureListComponent,
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
  //   path: ':id/edit',
  //   component: InventoryFormulaUpdateComponent,
  //   resolve: {
  //     formula: FormulaRoutingResolveService,
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
  // {
  //   path: 'new',
  //   component: InventoryFormulaUpdateComponent,
  //     resolve: {
  //       applicationUser: FormulaRoutingResolveService,
  //     },
  //   canActivate: [UserRouteAccessService],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(inventoryRoute)],
  exports: [RouterModule],
})
export class InventoryMiniatureRoutingModule {}