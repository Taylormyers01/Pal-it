import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMiniature } from '../miniature.model';
import { MiniatureService } from '../service/miniature.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './miniature-delete-dialog.component.html',
})
export class MiniatureDeleteDialogComponent {
  miniature?: IMiniature;

  constructor(protected miniatureService: MiniatureService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.miniatureService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
