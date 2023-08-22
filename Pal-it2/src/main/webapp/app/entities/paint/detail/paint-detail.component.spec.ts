import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PaintDetailComponent } from './paint-detail.component';

describe('Paint Management Detail Component', () => {
  let comp: PaintDetailComponent;
  let fixture: ComponentFixture<PaintDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaintDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ paint: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PaintDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PaintDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load paint on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.paint).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
