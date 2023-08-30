import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaintService} from "../../paint/service/paint.service";
import {IApplicationUser} from "../../application-user/application-user.model";
import {IPaint} from "../../paint/paint.model";
import {ApplicationUserService} from "../../application-user/service/application-user.service";
import {AccountService} from "../../../core/auth/account.service";
import {takeUntil} from "rxjs/operators";
import {Account} from "../../../core/auth/account.model";
import {Subject} from "rxjs";


@Component({
  selector: 'jhi-inventory-paint-update',
  templateUrl: './inventory-paint-update.component.html',
})
export class InventoryPaintUpdateComponent implements OnInit {
  applicationUser?: IApplicationUser | null = null;
  ownedPaints?: IPaint[] | null = [];
  account: Account | null = null;
  availablePaints?: IPaint[] | null = [];

  private readonly destroy$ = new Subject<void>();
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected paintService: PaintService,
    public router: Router,
    private accountService: AccountService,
    protected applicationUserService: ApplicationUserService,


    ) {}

  ngOnInit(): void {
    this.accountService
        .getAuthenticationState()
        .pipe(takeUntil(this.destroy$))
        .subscribe(account => (this.account = account));
    if (this.account?.email) {
      this.applicationUserService.findByUserID(this.account.email).subscribe((data)=> this.applicationUser = data.body);
      this.applicationUserService.findPaintByUserID(this.account.email).subscribe(data => this.ownedPaints = data.body);

    }
    if(this.applicationUser?.id && this.applicationUser.applicationUserName){
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
