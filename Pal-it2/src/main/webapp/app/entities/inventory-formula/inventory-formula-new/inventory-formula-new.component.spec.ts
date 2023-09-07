import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryFormulaNewComponent } from './inventory-formula-new.component';

describe('InventoryFormulaNewComponent', () => {
  let component: InventoryFormulaNewComponent;
  let fixture: ComponentFixture<InventoryFormulaNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryFormulaNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryFormulaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
