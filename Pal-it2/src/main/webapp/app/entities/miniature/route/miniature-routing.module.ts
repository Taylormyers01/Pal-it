import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MiniatureComponent } from '../list/miniature.component';
import { MiniatureDetailComponent } from '../detail/miniature-detail.component';
import { MiniatureUpdateComponent } from '../update/miniature-update.component';
import { MiniatureRoutingResolveService } from './miniature-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const miniatureRoute: Routes = [
  {
    path: '',
    component: MiniatureComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MiniatureDetailComponent,
    resolve: {
      miniature: MiniatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MiniatureUpdateComponent,
    resolve: {
      miniature: MiniatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MiniatureUpdateComponent,
    resolve: {
      miniature: MiniatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(miniatureRoute)],
  exports: [RouterModule],
})
export class MiniatureRoutingModule {}
