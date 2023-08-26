import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPaintDetailComponent } from './intentory-paint-detail.component';

describe('IntentoryPaintDetailComponent', () => {
  let component: InventoryPaintDetailComponent;
  let fixture: ComponentFixture<InventoryPaintDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryPaintDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryPaintDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
