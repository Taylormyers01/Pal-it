import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PaintService} from "../../paint/service/paint.service";
import {IApplicationUser} from "../../application-user/application-user.model";
import {IPaint} from "../../paint/paint.model";
import {ApplicationUserService} from "../../application-user/service/application-user.service";


@Component({
  selector: 'jhi-inventory-paint-update',
  templateUrl: './inventory-paint-update.component.html',
})
export class InventoryPaintUpdateComponent implements OnInit {
  applicationUser: IApplicationUser | null = null;
  ownedPaints: IPaint[] = [];
  availablePaints: IPaint[] | null = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected paintService: PaintService,
    protected applicationUserService: ApplicationUserService,
    ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({applicationUser}) => {
      this.applicationUser = applicationUser;
    });
    if(this.applicationUser) {
      this.ownedPaints = this.applicationUser.ownedPaints ?? [];
    }
    this.paintService.query().subscribe(data => this.availablePaints = data.body);
  }


}
