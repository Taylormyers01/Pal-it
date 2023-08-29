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
  ownedPaints?: IPaint[] | null = [];
  availablePaints?: IPaint[] | null = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected paintService: PaintService,
    protected applicationUserService: ApplicationUserService,
    ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({applicationUser}) => {
      this.applicationUser = applicationUser;
    });
    // if(this.applicationUser) {
    //   this.ownedPaints = this.applicationUser.ownedPaints;
    // }
    if(this.applicationUser?.applicationUserName) {
      this.applicationUserService.findPaintByUserID(this.applicationUser.applicationUserName).subscribe(data => this.ownedPaints = data);
    }
    this.filterPaints()
  }
  filterPaints(): void {
    if (this.applicationUser) {
      this.applicationUserService.queryAvailablePaints(this.applicationUser.id).subscribe(data => this.availablePaints = data.body);
    }
  }
  add(paintToAdd: IPaint):void {
    if(!this.ownedPaints?.includes(paintToAdd)){
      this.ownedPaints?.push(paintToAdd);
    }
    if(this.availablePaints?.includes(paintToAdd)){
      const numAdd = this.availablePaints.indexOf(paintToAdd);
      this.availablePaints = this.availablePaints.slice(numAdd, 1);
    }
  }
  remove(paintToRem: IPaint): void{
    if(!this.availablePaints?.includes(paintToRem)){
      this.availablePaints?.push(paintToRem);
    }
    if(this.ownedPaints?.includes(paintToRem)){
      const numRem = this.ownedPaints.indexOf(paintToRem);
      this.ownedPaints = this.ownedPaints.slice(numRem, 1);
    }
  }
}
