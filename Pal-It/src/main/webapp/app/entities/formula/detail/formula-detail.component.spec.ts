import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FormulaDetailComponent } from './formula-detail.component';

describe('Formula Management Detail Component', () => {
  let comp: FormulaDetailComponent;
  let fixture: ComponentFixture<FormulaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ formula: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FormulaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FormulaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load formula on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.formula).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
