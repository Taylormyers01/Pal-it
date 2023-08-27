import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PaintService} from "../../paint/service/paint.service";
import {IApplicationUser} from "../../application-user/application-user.model";


@Component({
  selector: 'jhi-inventory-paint-update',
  templateUrl: './inventory-paint-update.component.html',
})
export class InventoryPaintUpdateComponent implements OnInit {
  applicationUser: IApplicationUser | null = null;


  constructor(
    protected activatedRoute: ActivatedRoute,
    protected paintService: PaintService,
    ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationUser }) => {
      this.applicationUser = applicationUser;
    });
  }

}
