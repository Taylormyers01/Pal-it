import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { InventoryMiniatureFormService, MiniatureFormGroup } from './inventory-miniature-form.service';
import { IMiniature} from "../../miniature/miniature.model";
import { MiniatureService} from "../../miniature/service/miniature.service";
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPaint } from 'app/entities/paint/paint.model';
import { PaintService } from 'app/entities/paint/service/paint.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import {Account} from "../../../core/auth/account.model";
import {AccountService} from "../../../core/auth/account.service";

@Component({
  selector: 'jhi-miniature-update',
  templateUrl: './inventory-miniature-update.component.html',
})
export class InventoryMiniatureUpdateComponent implements OnInit {
  isSaving = false;
  miniature: IMiniature | null = null;
  account?: Account | null = null;

  paintsSharedCollection: IPaint[] = [];
  applicationUsersSharedCollection: IApplicationUser | null = null;

  editForm: MiniatureFormGroup = this.miniatureFormService.createMiniatureFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected miniatureService: MiniatureService,
    protected miniatureFormService: InventoryMiniatureFormService,
    protected paintService: PaintService,
    protected applicationUserService: ApplicationUserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
  ) {}

  comparePaint = (o1: IPaint | null, o2: IPaint | null): boolean => this.paintService.comparePaint(o1, o2);

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ miniature }) => {
      this.miniature = miniature;
      if (miniature) {
        this.updateForm(miniature);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('palItApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const miniature = this.miniatureFormService.getMiniature(this.editForm);
    miniature.user = this.applicationUsersSharedCollection;
    if (miniature.id !== null) {
      this.subscribeToSaveResponse(this.miniatureService.update(miniature));
    } else {
      this.subscribeToSaveResponse(this.miniatureService.create(miniature));
    }
  }
  onChange(paintOption: IPaint):void {
    if(this.editForm.value.miniatureFormulas?.includes(paintOption)) {
      this.editForm.value.miniatureFormulas = this.editForm.value.miniatureFormulas.filter((item) => item !== paintOption);
    }else{
      this.editForm.value.miniatureFormulas?.push(paintOption);
    }
    console.log(this.editForm.value.miniatureFormulas);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMiniature>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(miniature: IMiniature): void {
    this.miniature = miniature;
    this.miniatureFormService.resetForm(this.editForm, miniature);

    this.paintsSharedCollection = this.paintService.addPaintToCollectionIfMissing<IPaint>(
      this.paintsSharedCollection,
      ...(miniature.miniatureFormulas ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.accountService
      .getAuthenticationState()
      .subscribe(account => (this.account = account));
    if(this.account?.email){
      this.applicationUserService.findUserWithFormulas(this.account.email).subscribe(data => this.applicationUsersSharedCollection = data.body);
      if(this.applicationUsersSharedCollection?.ownedPaints) {
        this.paintsSharedCollection = this.applicationUsersSharedCollection.ownedPaints;
      }
    }
  }


  protected readonly console = console;


}
