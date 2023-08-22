import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ApplicationUserFormService } from './application-user-form.service';
import { ApplicationUserService } from '../service/application-user.service';
import { IApplicationUser } from '../application-user.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPaint } from 'app/entities/paint/paint.model';
import { PaintService } from 'app/entities/paint/service/paint.service';

import { ApplicationUserUpdateComponent } from './application-user-update.component';

describe('ApplicationUser Management Update Component', () => {
  let comp: ApplicationUserUpdateComponent;
  let fixture: ComponentFixture<ApplicationUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let applicationUserFormService: ApplicationUserFormService;
  let applicationUserService: ApplicationUserService;
  let userService: UserService;
  let paintService: PaintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ApplicationUserUpdateComponent],
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
      .overrideTemplate(ApplicationUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ApplicationUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    applicationUserFormService = TestBed.inject(ApplicationUserFormService);
    applicationUserService = TestBed.inject(ApplicationUserService);
    userService = TestBed.inject(UserService);
    paintService = TestBed.inject(PaintService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const applicationUser: IApplicationUser = { id: 456 };
      const internalUser: IUser = { id: 32396 };
      applicationUser.internalUser = internalUser;

      const userCollection: IUser[] = [{ id: 67663 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [internalUser];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Paint query and add missing value', () => {
      const applicationUser: IApplicationUser = { id: 456 };
      const ownedPaints: IPaint[] = [{ id: 98036 }];
      applicationUser.ownedPaints = ownedPaints;

      const paintCollection: IPaint[] = [{ id: 49648 }];
      jest.spyOn(paintService, 'query').mockReturnValue(of(new HttpResponse({ body: paintCollection })));
      const additionalPaints = [...ownedPaints];
      const expectedCollection: IPaint[] = [...additionalPaints, ...paintCollection];
      jest.spyOn(paintService, 'addPaintToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      expect(paintService.query).toHaveBeenCalled();
      expect(paintService.addPaintToCollectionIfMissing).toHaveBeenCalledWith(
        paintCollection,
        ...additionalPaints.map(expect.objectContaining)
      );
      expect(comp.paintsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const applicationUser: IApplicationUser = { id: 456 };
      const internalUser: IUser = { id: 45793 };
      applicationUser.internalUser = internalUser;
      const ownedPaint: IPaint = { id: 6954 };
      applicationUser.ownedPaints = [ownedPaint];

      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(internalUser);
      expect(comp.paintsSharedCollection).toContain(ownedPaint);
      expect(comp.applicationUser).toEqual(applicationUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationUser>>();
      const applicationUser = { id: 123 };
      jest.spyOn(applicationUserFormService, 'getApplicationUser').mockReturnValue(applicationUser);
      jest.spyOn(applicationUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: applicationUser }));
      saveSubject.complete();

      // THEN
      expect(applicationUserFormService.getApplicationUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(applicationUserService.update).toHaveBeenCalledWith(expect.objectContaining(applicationUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationUser>>();
      const applicationUser = { id: 123 };
      jest.spyOn(applicationUserFormService, 'getApplicationUser').mockReturnValue({ id: null });
      jest.spyOn(applicationUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: applicationUser }));
      saveSubject.complete();

      // THEN
      expect(applicationUserFormService.getApplicationUser).toHaveBeenCalled();
      expect(applicationUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationUser>>();
      const applicationUser = { id: 123 };
      jest.spyOn(applicationUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(applicationUserService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePaint', () => {
      it('Should forward to paintService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(paintService, 'comparePaint');
        comp.comparePaint(entity, entity2);
        expect(paintService.comparePaint).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
