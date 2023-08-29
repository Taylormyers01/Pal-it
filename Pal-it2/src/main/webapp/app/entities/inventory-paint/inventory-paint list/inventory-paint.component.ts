import { Component, OnInit } from '@angular/core';
import {IPaint} from "../../paint/paint.model";
import {EntityArrayResponseType, PaintService} from "../../paint/service/paint.service";
import {ActivatedRoute, Data, ParamMap, Router} from "@angular/router";
import {Subject, map, Observable, tap, combineLatest, switchMap} from "rxjs";
import {IApplicationUser} from "../../application-user/application-user.model";
import {takeUntil} from "rxjs/operators";
import {Account} from "../../../core/auth/account.model";
import {AccountService} from "../../../core/auth/account.service";
import {
  ApplicationUserService,
  EntityArrayResponseTypePaint
} from "../../application-user/service/application-user.service";
import {IUser} from "../../user/user.model";
import {ASC, DEFAULT_SORT_DATA, DESC, SORT} from "../../../config/navigation.constants";
import { SortService } from 'app/shared/sort/sort.service';

@Component({
  selector: 'jhi-inventory-paint',
  templateUrl: './inventory-paint.component.html',
})
export class InventoryPaintComponent implements OnInit {
  paints?: IPaint[];
  applicationUser?: IApplicationUser;
  user?: IUser;
  account: Account | null = null;
  predicate = 'id';
  ascending = true;
  isLoading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
      protected paintService: PaintService,
      protected activatedRoute: ActivatedRoute,
      public router: Router,
      private accountService: AccountService,
      protected applicationUserService: ApplicationUserService,
      protected sortService: SortService
  ) {}

  trackId = (_index: number, item: IPaint): number => this.paintService.getPaintIdentifier(item);


  ngOnInit(): void {
    this.accountService
        .getAuthenticationState()
        .pipe(takeUntil(this.destroy$))
        .subscribe(account => (this.account = account));
    if (this.account?.email) {
      this.applicationUserService.findByUserID(this.account.email).subscribe(user => this.applicationUser = user);
      this.applicationUserService.findPaintByUserID(this.account.email).subscribe(data => this.paints = data) //.pipe(map(data => this.paints = data));
    }
  }
  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }
  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }
  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }


}
