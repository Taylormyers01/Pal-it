import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InventoryFormulaFormService } from './inventory-formula-form.service';
import { FormulaService } from '../service/formula.service';
import { IFormula } from '../formula.model';
import { IPaint } from 'app/entities/paint/paint.model';
import { PaintService } from 'app/entities/paint/service/paint.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';

import { InventoryFormulaUpdateComponent } from './inventory-formula-update.component';

describe('Formula Management Update Component', () => {
  let comp: InventoryFormulaUpdateComponent;
  let fixture: ComponentFixture<InventoryFormulaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let formulaFormService: InventoryFormulaFormService;
  let formulaService: FormulaService;
  let paintService: PaintService;
  let applicationUserService: ApplicationUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InventoryFormulaUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(InventoryFormulaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InventoryFormulaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    formulaFormService = TestBed.inject(InventoryFormulaFormService);
    formulaService = TestBed.inject(FormulaService);
    paintService = TestBed.inject(PaintService);
    applicationUserService = TestBed.inject(ApplicationUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Paint query and add missing value', () => {
      const formula: IFormula = { id: 456 };
      const paintFormulas: IPaint[] = [{ id: 23135 }];
      formula.paintFormulas = paintFormulas;

      const paintCollection: IPaint[] = [{ id: 74138 }];
      jest.spyOn(paintService, 'query').mockReturnValue(of(new HttpResponse({ body: paintCollection })));
      const additionalPaints = [...paintFormulas];
      const expectedCollection: IPaint[] = [...additionalPaints, ...paintCollection];
      jest.spyOn(paintService, 'addPaintToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ formula });
      comp.ngOnInit();

      expect(paintService.query).toHaveBeenCalled();
      expect(paintService.addPaintToCollectionIfMissing).toHaveBeenCalledWith(
        paintCollection,
        ...additionalPaints.map(expect.objectContaining)
      );
      expect(comp.paintsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ApplicationUser query and add missing value', () => {
      const formula: IFormula = { id: 456 };
      const user: IApplicationUser = { id: 77178 };
      formula.user = user;

      const applicationUserCollection: IApplicationUser[] = [{ id: 94803 }];
      jest.spyOn(applicationUserService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserCollection })));
      const additionalApplicationUsers = [user];
      const expectedCollection: IApplicationUser[] = [...additionalApplicationUsers, ...applicationUserCollection];
      jest.spyOn(applicationUserService, 'addApplicationUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ formula });
      comp.ngOnInit();

      expect(applicationUserService.query).toHaveBeenCalled();
      expect(applicationUserService.addApplicationUserToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserCollection,
        ...additionalApplicationUsers.map(expect.objectContaining)
      );
      expect(comp.applicationUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const formula: IFormula = { id: 456 };
      const paintFormula: IPaint = { id: 68657 };
      formula.paintFormulas = [paintFormula];
      const user: IApplicationUser = { id: 78249 };
      formula.user = user;

      activatedRoute.data = of({ formula });
      comp.ngOnInit();

      expect(comp.paintsSharedCollection).toContain(paintFormula);
      expect(comp.applicationUsersSharedCollection).toContain(user);
      expect(comp.formula).toEqual(formula);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFormula>>();
      const formula = { id: 123 };
      jest.spyOn(formulaFormService, 'getFormula').mockReturnValue(formula);
      jest.spyOn(formulaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formula });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formula }));
      saveSubject.complete();

      // THEN
      expect(formulaFormService.getFormula).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(formulaService.update).toHaveBeenCalledWith(expect.objectContaining(formula));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFormula>>();
      const formula = { id: 123 };
      jest.spyOn(formulaFormService, 'getFormula').mockReturnValue({ id: null });
      jest.spyOn(formulaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formula: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formula }));
      saveSubject.complete();

      // THEN
      expect(formulaFormService.getFormula).toHaveBeenCalled();
      expect(formulaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFormula>>();
      const formula = { id: 123 };
      jest.spyOn(formulaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formula });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(formulaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePaint', () => {
      it('Should forward to paintService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(paintService, 'comparePaint');
        comp.comparePaint(entity, entity2);
        expect(paintService.comparePaint).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareApplicationUser', () => {
      it('Should forward to applicationUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(applicationUserService, 'compareApplicationUser');
        comp.compareApplicationUser(entity, entity2);
        expect(applicationUserService.compareApplicationUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
