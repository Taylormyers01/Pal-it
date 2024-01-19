import { Component, OnInit } from '@angular/core';
import {MiniatureService} from "../../miniature/service/miniature.service";
import {IMiniature} from "../../miniature/miniature.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'jhi-inventory-miniature-view',
  templateUrl: './inventory-miniature-view.component.html',
})
export class InventoryMiniatureViewComponent implements OnInit {
  miniature: IMiniature | null = null;


  constructor(
    protected miniatureService: MiniatureService,
    protected activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ miniature }) => {this.miniature = miniature})
    console.log(this.miniature)
  }

}
