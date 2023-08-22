import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMiniature } from '../miniature.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-miniature-detail',
  templateUrl: './miniature-detail.component.html',
})
export class MiniatureDetailComponent implements OnInit {
  miniature: IMiniature | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ miniature }) => {
      this.miniature = miniature;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
