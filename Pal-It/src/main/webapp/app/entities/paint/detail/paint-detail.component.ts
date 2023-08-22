import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaint } from '../paint.model';

@Component({
  selector: 'jhi-paint-detail',
  templateUrl: './paint-detail.component.html',
})
export class PaintDetailComponent implements OnInit {
  paint: IPaint | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paint }) => {
      this.paint = paint;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
