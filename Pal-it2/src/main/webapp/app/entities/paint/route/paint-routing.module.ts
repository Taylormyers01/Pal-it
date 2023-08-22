import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PaintComponent } from '../list/paint.component';
import { PaintDetailComponent } from '../detail/paint-detail.component';
import { PaintUpdateComponent } from '../update/paint-update.component';
import { PaintRoutingResolveService } from './paint-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const paintRoute: Routes = [
  {
    path: '',
    component: PaintComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaintDetailComponent,
    resolve: {
      paint: PaintRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaintUpdateComponent,
    resolve: {
      paint: PaintRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaintUpdateComponent,
    resolve: {
      paint: PaintRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(paintRoute)],
  exports: [RouterModule],
})
export class PaintRoutingModule {}
