import { Component, OnInit } from '@angular/core';
import {IApplicationUser} from "../../application-user/application-user.model";
import {ActivatedRoute} from "@angular/router";
import {IPaint} from "../../paint/paint.model";

@Component({
  selector: 'jhi-inventory-formula-new',
  templateUrl: './inventory-formula-new.component.html',
})
export class InventoryFormulaNewComponent implements OnInit {
  applicationUser: IApplicationUser | null = null;
  ownedPaints: IPaint[] | null | undefined = null;

  constructor(protected activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationUser }) => {
      this.applicationUser = applicationUser;
    });
    // if(this.applicationUser?.ownedPaints){
    //   console.log("Made it here");
    //   this.ownedPaints = this.applicationUser.ownedPaints;
    // }
  }

}
