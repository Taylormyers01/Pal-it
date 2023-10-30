import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../../core/auth/account.service";
import{ApplicationUserService} from "../../application-user/service/application-user.service";
import {Account} from "../../../core/auth/account.model";
import {IApplicationUser} from "../../application-user/application-user.model";
import {IFormula} from "../../formula/formula.model";
import {FormulaService} from "../../formula/service/formula.service";
import {NgbOffcanvas, OffcanvasDismissReasons} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'jhi-inventory-formula',
  templateUrl: './inventory-formula.component.html',
})
export class InventoryFormulaComponent implements OnInit {
  account: Account | null = null;
  applicationUser?: IApplicationUser | null = null;
  formulas?: IFormula[] | null | undefined;
  selectedFormula?: IFormula | null;
  closeResult = '';

  constructor(
    private accountService: AccountService,
    protected applicationUserService: ApplicationUserService,
    protected formulaService: FormulaService,
    private offCanvasService: NgbOffcanvas,
  ) {

  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .subscribe(account => (this.account = account));
    this.load();
  }



  load():void{
    if (this.account?.email) {
      this.applicationUserService.findUserWithFormulas(this.account.email).subscribe(user => {
        this.applicationUser = user.body;
        this.formulas = this.applicationUser?.formulaNames;
      });
    }
  }
  loadFormula(id: number):void {
    this.formulaService.find(id).subscribe(data => this.selectedFormula = data.body);
  }
  open(content: any): void {
    this.offCanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
      (result) => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === OffcanvasDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === OffcanvasDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on the backdrop';
    } else {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `with: ${reason}`;
    }
  }
}

