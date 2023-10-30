import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaintService} from "../../paint/service/paint.service";
import {IApplicationUser} from "../../application-user/application-user.model";
import {IPaint} from "../../paint/paint.model";
import {ApplicationUserService} from "../../application-user/service/application-user.service";
import {AccountService} from "../../../core/auth/account.service";
import {takeUntil} from "rxjs/operators";
import {Account} from "../../../core/auth/account.model";
import {Subject, switchMap} from "rxjs";


@Component({
  selector: 'jhi-inventory-paint-update',
  templateUrl: './inventory-paint-update.component.html',
})
export class InventoryPaintUpdateComponent implements OnInit {
  applicationUser?: IApplicationUser | null = null;
  ownedPaints?: IPaint[] | null = [];
  account: Account | null = null;
  availablePaints?: IPaint[] | null = [];
  allPaints: IPaint[] | null = [];
  updateView: string | null = null;
  searchText = ''
  iconAvailSearch = ''
  iconOwnedSearch = ''
  protected readonly localStorage = localStorage;
  private readonly destroy$ = new Subject<void>();



  constructor(
    protected activatedRoute: ActivatedRoute,
    protected paintService: PaintService,
    public router: Router,
    private accountService: AccountService,
    protected applicationUserService: ApplicationUserService,


    ) {}
  sleep(ms: number | undefined):Promise<any>{
  return new Promise(r => setTimeout(r, ms));
  }


  ngOnInit(): void {
    if(localStorage.getItem('updatView')){
      this.updateView = localStorage.getItem('updateView');
      // eslint-disable-next-line no-console
      console.log(this.updateView)

    }
    else{
      this.updateView = 'grid';
      // eslint-disable-next-line no-console
      console.log(this.updateView)
    }
    this.accountService
        .getAuthenticationState()
        .pipe(takeUntil(this.destroy$), switchMap(accountCall => {
          this.account = accountCall;
          return this.applicationUserService.findByUserID(accountCall?.email);
        })).subscribe({next: applicationUserCall =>{
          this.applicationUser = applicationUserCall.body;
          this.ownedPaints = this.applicationUser?.ownedPaints;
          return this.applicationUserService.queryAvailablePaints(this.applicationUser?.id).subscribe(data => this.availablePaints = data.body);
        }});
    this.paintService.query().subscribe(item => this.allPaints = item.body)
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
    this.previousState();
  }
  async previousState(): Promise<void> {
    await this.sleep(1000);
    window.history.back();
  }

  valueContained(id: number): boolean{
    if(this.ownedPaints) {
      return this.ownedPaints.filter(item => item.id===id).length > 0;
    }
    return false;
  }

  onChange(paintOption: IPaint):void {
    if (this.valueContained(paintOption.id)){
      this.ownedPaints = this.ownedPaints?.filter(item => item.id !== paintOption.id)
    }
    else{
      this.ownedPaints?.push(paintOption)
    }
  }

}
