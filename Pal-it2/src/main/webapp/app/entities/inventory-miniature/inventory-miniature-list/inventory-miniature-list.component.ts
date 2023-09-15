import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../../core/auth/account.service";
import {Account} from "../../../core/auth/account.model";
import {IApplicationUser} from "../../application-user/application-user.model";
import {ApplicationUserService} from "../../application-user/service/application-user.service";
import {IMiniature} from "../../miniature/miniature.model";
import {MiniatureService} from "../../miniature/service/miniature.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'jhi-inventory-miniature-list',
  templateUrl: './inventory-miniature-list.component.html',
})
export class InventoryMiniatureListComponent implements OnInit {
  account?: Account | null;
  appUser?: IApplicationUser | null;
  minis?: IMiniature[] | null;
  constructor(
      protected accountService: AccountService,
      protected applicationUserService: ApplicationUserService,
      protected miniatureService: MiniatureService,
  ) {}

  ngOnInit(): void {
    this.accountService
        .getAuthenticationState()
        .subscribe(account => (this.account = account));
    if(this.account?.email){
      this.applicationUserService
          .findByUserID(this.account.email)
          .subscribe(data => {
            this.appUser = data.body;

            if(this.appUser?.id){
              console.log("made it here!")
              return this.miniatureService.findAllByUserId(this.appUser.id)
                  .subscribe(miniatureCall => this.minis = miniatureCall.body);
            }
            return null;
          });

    }
  }

}
