import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
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
  newPaints: IPaint[] = [];
  availablePaints?: IPaint[] | null = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected paintService: PaintService,
    protected applicationUserService: ApplicationUserService,
    public router: Router,
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
      this.availablePaints = this.availablePaints.filter(data => data !== paintToAdd);
    }
  }
  //remove - name of method (Paramaters - variable name: Variable type) : return type
  remove(paintToRem: IPaint): void{
    if(!this.availablePaints?.includes(paintToRem)){
      this.availablePaints?.push(paintToRem);
    }
    if(this.ownedPaints?.includes(paintToRem)){
      this.ownedPaints = this.ownedPaints.filter(data => data !== paintToRem);
    }
  }
  onSave():void {
    if (this.applicationUser?.id && this.ownedPaints) {
      this.applicationUser.ownedPaints = this.ownedPaints;
      this.applicationUserService.update(this.applicationUser).subscribe(data => this.applicationUser = data.body);
    }
    this.router.navigate(['/inventory-paint'], {
      relativeTo: this.activatedRoute,
    });
  }
  previousState(): void {
    window.history.back();
  }
}
