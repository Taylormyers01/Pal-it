import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import {InventoryPaintComponent} from "../inventory-paint list/inventory-paint.component";
import {ASC} from "../../../config/navigation.constants";
import {InventoryPaintDetailComponent} from "../inventory-paint-detail/intentory-paint-detail.component";
import {PaintRoutingResolveService} from "../../paint/route/paint-routing-resolve.service";
import {ApplicationUserRoutingResolveService} from "../../application-user/route/application-user-routing-resolve.service";
import {InventoryPaintUpdateComponent} from "../inventory-paint-update/inventory-paint-update.component";
import {UserService} from "../../user/user.service";
import {UserManagementResolve} from "../../../admin/user-management/user-management.route";


const inventoryRoute: Routes = [
  {
    path: '',
    component: InventoryPaintComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InventoryPaintDetailComponent,
    resolve: {
      paint: PaintRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'edit',
    component: InventoryPaintUpdateComponent,
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(inventoryRoute)],
  exports: [RouterModule],
})
export class InventoryPaintRoutingModule {}
