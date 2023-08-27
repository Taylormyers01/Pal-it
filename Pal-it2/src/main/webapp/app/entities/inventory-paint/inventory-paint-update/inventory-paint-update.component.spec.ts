import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPaintUpdateComponent } from './inventory-paint-update.component';

describe('InventoryPaintUpdateComponent', () => {
  let component: InventoryPaintUpdateComponent;
  let fixture: ComponentFixture<InventoryPaintUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryPaintUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryPaintUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
