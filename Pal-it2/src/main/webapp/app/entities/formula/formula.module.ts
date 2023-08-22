import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FormulaComponent } from './list/formula.component';
import { FormulaDetailComponent } from './detail/formula-detail.component';
import { FormulaUpdateComponent } from './update/formula-update.component';
import { FormulaDeleteDialogComponent } from './delete/formula-delete-dialog.component';
import { FormulaRoutingModule } from './route/formula-routing.module';

@NgModule({
  imports: [SharedModule, FormulaRoutingModule],
  declarations: [FormulaComponent, FormulaDetailComponent, FormulaUpdateComponent, FormulaDeleteDialogComponent],
})
export class FormulaModule {}
