import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import {InventoryMiniatureListComponent} from "../inventory-miniature-list/inventory-miniature-list.component";
import {InventoryMiniatureUpdateComponent} from "../inventory-miniature-update/inventory-miniature-update.component";
import {MiniatureRoutingResolveService} from "../../miniature/route/miniature-routing-resolve.service";


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
  {
    path: ':id/edit',
    component: InventoryMiniatureUpdateComponent,
    resolve: {
      miniature: MiniatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InventoryMiniatureUpdateComponent,
      resolve: {
        miniature: MiniatureRoutingResolveService,
      },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(inventoryRoute)],
  exports: [RouterModule],
})
export class InventoryMiniatureRoutingModule {}
