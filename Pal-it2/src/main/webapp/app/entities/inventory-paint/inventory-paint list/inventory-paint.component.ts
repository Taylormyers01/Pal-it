import { Component, OnInit } from '@angular/core';
import {IPaint} from "../../paint/paint.model";
import {PaintService} from "../../paint/service/paint.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {IApplicationUser} from "../../application-user/application-user.model";
import {takeUntil} from "rxjs/operators";
import {Account} from "../../../core/auth/account.model";
import {AccountService} from "../../../core/auth/account.service";
import {ApplicationUserService,} from "../../application-user/service/application-user.service";
import {IUser} from "../../user/user.model";
import { SortService } from 'app/shared/sort/sort.service';
import {sortByItem} from "../../../core/util/operators";

@Component({
  selector: 'jhi-inventory-paint',
  templateUrl: './inventory-paint.component.html',
})
export class InventoryPaintComponent implements OnInit {
  paints?: IPaint[] | null = null ;
  applicationUser?: IApplicationUser | null = null;
  user?: IUser;
  account: Account | null = null;
  predicate = 'id';
  ascending = true;
  isLoading = false;
  view?: string | null = null;
  searchText = '';
  protected readonly localStorage = localStorage;

  private readonly destroy$ = new Subject<void>();

  constructor(
      protected paintService: PaintService,
      protected activatedRoute: ActivatedRoute,
      public router: Router,
      private accountService: AccountService,
      protected applicationUserService: ApplicationUserService,
      protected sortService: SortService,


  ) {}

  trackId = (_index: number, item: IPaint): number => this.paintService.getPaintIdentifier(item);



  ngOnInit(): void {
    if(localStorage.getItem('view')){
      this.view = localStorage.getItem('view');
    }
    else{
      this.view = 'grid';
    }
    this.accountService
        .getAuthenticationState()
        .pipe(takeUntil(this.destroy$))
        .subscribe(account => (this.account = account));
    if (this.account?.email) {
      this.applicationUserService.findByUserID(this.account.email).subscribe(user => {
        this.applicationUser = user.body;
        this.paints = sortByItem(user.body?.ownedPaints, "paintName")
      });

    }}

  protected readonly sortByItem = sortByItem;
}
