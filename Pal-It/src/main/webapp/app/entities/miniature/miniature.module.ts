import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MiniatureComponent } from './list/miniature.component';
import { MiniatureDetailComponent } from './detail/miniature-detail.component';
import { MiniatureUpdateComponent } from './update/miniature-update.component';
import { MiniatureDeleteDialogComponent } from './delete/miniature-delete-dialog.component';
import { MiniatureRoutingModule } from './route/miniature-routing.module';

@NgModule({
  imports: [SharedModule, MiniatureRoutingModule],
  declarations: [MiniatureComponent, MiniatureDetailComponent, MiniatureUpdateComponent, MiniatureDeleteDialogComponent],
})
export class MiniatureModule {}
