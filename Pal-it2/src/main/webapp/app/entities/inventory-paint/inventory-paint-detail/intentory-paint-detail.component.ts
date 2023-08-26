import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {IPaint} from "../../paint/paint.model";


@Component({
  selector: 'jhi-intentory-paint-detail',
  templateUrl: './intentory-paint-detail.component.html'
})
export class InventoryPaintDetailComponent implements OnInit {
  paint?: IPaint;
  constructor(protected activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute;
  }

}
