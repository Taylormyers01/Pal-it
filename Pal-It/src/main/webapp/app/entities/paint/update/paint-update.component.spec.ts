import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaintFormService } from './paint-form.service';
import { PaintService } from '../service/paint.service';
import { IPaint } from '../paint.model';

import { PaintUpdateComponent } from './paint-update.component';

describe('Paint Management Update Component', () => {
  let comp: PaintUpdateComponent;
  let fixture: ComponentFixture<PaintUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paintFormService: PaintFormService;
  let paintService: PaintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PaintUpdateComponent],
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
      .overrideTemplate(PaintUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaintUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paintFormService = TestBed.inject(PaintFormService);
    paintService = TestBed.inject(PaintService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const paint: IPaint = { id: 456 };

      activatedRoute.data = of({ paint });
      comp.ngOnInit();

      expect(comp.paint).toEqual(paint);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPaint>>();
      const paint = { id: 123 };
      jest.spyOn(paintFormService, 'getPaint').mockReturnValue(paint);
      jest.spyOn(paintService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paint });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paint }));
      saveSubject.complete();

      // THEN
      expect(paintFormService.getPaint).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(paintService.update).toHaveBeenCalledWith(expect.objectContaining(paint));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPaint>>();
      const paint = { id: 123 };
      jest.spyOn(paintFormService, 'getPaint').mockReturnValue({ id: null });
      jest.spyOn(paintService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paint: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paint }));
      saveSubject.complete();

      // THEN
      expect(paintFormService.getPaint).toHaveBeenCalled();
      expect(paintService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPaint>>();
      const paint = { id: 123 };
      jest.spyOn(paintService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paint });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paintService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
