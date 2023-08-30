import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaint } from '../paint.model';
import { DataUtils } from 'app/core/util/data-util.service';


@Component({
  selector: 'jhi-paint-detail',
  templateUrl: './paint-detail.component.html',
})
export class PaintDetailComponent implements OnInit {
  paint: IPaint | null = null;

  constructor(protected activatedRoute: ActivatedRoute,protected dataUtils: DataUtils) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paint }) => {
      this.paint = paint;
    });
  }
  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  previousState(): void {
    window.history.back();
  }
}
