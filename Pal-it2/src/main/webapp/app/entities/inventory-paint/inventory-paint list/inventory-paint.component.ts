import { Component, OnInit } from '@angular/core';
import {IPaint} from "../../paint/paint.model";
import { PaintService} from "../../paint/service/paint.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject, map} from "rxjs";
import {IApplicationUser} from "../../application-user/application-user.model";
import {takeUntil} from "rxjs/operators";
import {Account} from "../../../core/auth/account.model";
import {AccountService} from "../../../core/auth/account.service";
import {ApplicationUserService} from "../../application-user/service/application-user.service";
import {IUser} from "../../user/user.model";

@Component({
  selector: 'jhi-inventory-paint',
  templateUrl: './inventory-paint.component.html',
})
export class InventoryPaintComponent implements OnInit {
  paints?: Pick<IPaint, "id" | "paintName">[];
  applicationUser?: IApplicationUser;
  user?: IUser;
  account: Account | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
      protected paintService: PaintService,
      protected activatedRoute: ActivatedRoute,
      public router: Router,
      private accountService: AccountService,
      protected applicationUserService: ApplicationUserService,
  ) {}

  trackId = (_index: number, item: IPaint): number => this.paintService.getPaintIdentifier(item);

  ngOnInit(): void {
    this.accountService
        .getAuthenticationState()
        .pipe(takeUntil(this.destroy$))
        .subscribe(account => (this.account = account));
    if (this.account?.email) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.applicationUser = this.applicationUserService.findByUserID(this.account.email).subscribe(user => this.applicationUser = user);
    }
    if (this.applicationUser?.ownedPaints) {
      this.paints = this.applicationUser.ownedPaints;
    }
  }

}
