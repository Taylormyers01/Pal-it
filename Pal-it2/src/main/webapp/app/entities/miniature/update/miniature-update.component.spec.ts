import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MiniatureFormService } from './miniature-form.service';
import { MiniatureService } from '../service/miniature.service';
import { IMiniature } from '../miniature.model';
import { IPaint } from 'app/entities/paint/paint.model';
import { PaintService } from 'app/entities/paint/service/paint.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';

import { MiniatureUpdateComponent } from './miniature-update.component';

describe('Miniature Management Update Component', () => {
  let comp: MiniatureUpdateComponent;
  let fixture: ComponentFixture<MiniatureUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let miniatureFormService: MiniatureFormService;
  let miniatureService: MiniatureService;
  let paintService: PaintService;
  let applicationUserService: ApplicationUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MiniatureUpdateComponent],
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
      .overrideTemplate(MiniatureUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MiniatureUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    miniatureFormService = TestBed.inject(MiniatureFormService);
    miniatureService = TestBed.inject(MiniatureService);
    paintService = TestBed.inject(PaintService);
    applicationUserService = TestBed.inject(ApplicationUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Paint query and add missing value', () => {
      const miniature: IMiniature = { id: 456 };
      const miniatureFormulas: IPaint[] = [{ id: 47234 }];
      miniature.miniatureFormulas = miniatureFormulas;

      const paintCollection: IPaint[] = [{ id: 6116 }];
      jest.spyOn(paintService, 'query').mockReturnValue(of(new HttpResponse({ body: paintCollection })));
      const additionalPaints = [...miniatureFormulas];
      const expectedCollection: IPaint[] = [...additionalPaints, ...paintCollection];
      jest.spyOn(paintService, 'addPaintToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ miniature });
      comp.ngOnInit();

      expect(paintService.query).toHaveBeenCalled();
      expect(paintService.addPaintToCollectionIfMissing).toHaveBeenCalledWith(
        paintCollection,
        ...additionalPaints.map(expect.objectContaining)
      );
      expect(comp.paintsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ApplicationUser query and add missing value', () => {
      const miniature: IMiniature = { id: 456 };
      const user: IApplicationUser = { id: 82615 };
      miniature.user = user;

      const applicationUserCollection: IApplicationUser[] = [{ id: 64961 }];
      jest.spyOn(applicationUserService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserCollection })));
      const additionalApplicationUsers = [user];
      const expectedCollection: IApplicationUser[] = [...additionalApplicationUsers, ...applicationUserCollection];
      jest.spyOn(applicationUserService, 'addApplicationUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ miniature });
      comp.ngOnInit();

      expect(applicationUserService.query).toHaveBeenCalled();
      expect(applicationUserService.addApplicationUserToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserCollection,
        ...additionalApplicationUsers.map(expect.objectContaining)
      );
      expect(comp.applicationUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const miniature: IMiniature = { id: 456 };
      const miniatureFormula: IPaint = { id: 97647 };
      miniature.miniatureFormulas = [miniatureFormula];
      const user: IApplicationUser = { id: 86992 };
      miniature.user = user;

      activatedRoute.data = of({ miniature });
      comp.ngOnInit();

      expect(comp.paintsSharedCollection).toContain(miniatureFormula);
      expect(comp.applicationUsersSharedCollection).toContain(user);
      expect(comp.miniature).toEqual(miniature);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMiniature>>();
      const miniature = { id: 123 };
      jest.spyOn(miniatureFormService, 'getMiniature').mockReturnValue(miniature);
      jest.spyOn(miniatureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ miniature });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: miniature }));
      saveSubject.complete();

      // THEN
      expect(miniatureFormService.getMiniature).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(miniatureService.update).toHaveBeenCalledWith(expect.objectContaining(miniature));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMiniature>>();
      const miniature = { id: 123 };
      jest.spyOn(miniatureFormService, 'getMiniature').mockReturnValue({ id: null });
      jest.spyOn(miniatureService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ miniature: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: miniature }));
      saveSubject.complete();

      // THEN
      expect(miniatureFormService.getMiniature).toHaveBeenCalled();
      expect(miniatureService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMiniature>>();
      const miniature = { id: 123 };
      jest.spyOn(miniatureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ miniature });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(miniatureService.update).toHaveBeenCalled();
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
