import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ApplicationUserService } from '../service/application-user.service';

import { ApplicationUserComponent } from './application-user.component';

describe('ApplicationUser Management Component', () => {
  let comp: ApplicationUserComponent;
  let fixture: ComponentFixture<ApplicationUserComponent>;
  let service: ApplicationUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'application-user', component: ApplicationUserComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ApplicationUserComponent],
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
      .overrideTemplate(ApplicationUserComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ApplicationUserComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ApplicationUserService);

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
    expect(comp.applicationUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to applicationUserService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getApplicationUserIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getApplicationUserIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
