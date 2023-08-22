import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'paint',
        data: { pageTitle: 'palItApp.paint.home.title' },
        loadChildren: () => import('./paint/paint.module').then(m => m.PaintModule),
      },
      {
        path: 'formula',
        data: { pageTitle: 'palItApp.formula.home.title' },
        loadChildren: () => import('./formula/formula.module').then(m => m.FormulaModule),
      },
      {
        path: 'application-user',
        data: { pageTitle: 'palItApp.applicationUser.home.title' },
        loadChildren: () => import('./application-user/application-user.module').then(m => m.ApplicationUserModule),
      },
      {
        path: 'miniature',
        data: { pageTitle: 'palItApp.miniature.home.title' },
        loadChildren: () => import('./miniature/miniature.module').then(m => m.MiniatureModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
