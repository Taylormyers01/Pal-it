import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PaintComponent } from './list/paint.component';
import { PaintDetailComponent } from './detail/paint-detail.component';
import { PaintUpdateComponent } from './update/paint-update.component';
import { PaintDeleteDialogComponent } from './delete/paint-delete-dialog.component';
import { PaintRoutingModule } from './route/paint-routing.module';

@NgModule({
  imports: [SharedModule, PaintRoutingModule],
  declarations: [PaintComponent, PaintDetailComponent, PaintUpdateComponent, PaintDeleteDialogComponent],
})
export class PaintModule {}
