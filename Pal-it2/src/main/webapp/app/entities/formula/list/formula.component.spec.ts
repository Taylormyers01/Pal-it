import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FormulaService } from '../service/formula.service';

import { FormulaComponent } from './formula.component';

describe('Formula Management Component', () => {
  let comp: FormulaComponent;
  let fixture: ComponentFixture<FormulaComponent>;
  let service: FormulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'formula', component: FormulaComponent }]), HttpClientTestingModule],
      declarations: [FormulaComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(FormulaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormulaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FormulaService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.formulas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to formulaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFormulaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFormulaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
