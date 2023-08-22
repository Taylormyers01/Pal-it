import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MiniatureService } from '../service/miniature.service';

import { MiniatureComponent } from './miniature.component';

describe('Miniature Management Component', () => {
  let comp: MiniatureComponent;
  let fixture: ComponentFixture<MiniatureComponent>;
  let service: MiniatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'miniature', component: MiniatureComponent }]), HttpClientTestingModule],
      declarations: [MiniatureComponent],
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
      .overrideTemplate(MiniatureComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MiniatureComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MiniatureService);

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
    expect(comp.miniatures?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to miniatureService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMiniatureIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMiniatureIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
