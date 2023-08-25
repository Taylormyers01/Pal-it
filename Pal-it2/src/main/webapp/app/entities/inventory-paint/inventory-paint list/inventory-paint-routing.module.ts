import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import {InventoryPaintComponent} from "./inventory-paint.component";
import {ASC} from "../../../config/navigation.constants";


const inventoryRoute: Routes = [
  {
    path: '',
    component: InventoryPaintComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  // {
  //   path: ':id/view',
  //   component: PaintDetailComponent,
  //   resolve: {
  //     paint: PaintRoutingResolveService,
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
  // {
  //   path: 'new',
  //   component: PaintUpdateComponent,
  //   resolve: {
  //     paint: PaintRoutingResolveService,
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
  // {
  //   path: ':id/edit',
  //   component: PaintUpdateComponent,
  //   resolve: {
  //     paint: PaintRoutingResolveService,
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(inventoryRoute)],
  exports: [RouterModule],
})
export class InventoryPaintRoutingModule {}
