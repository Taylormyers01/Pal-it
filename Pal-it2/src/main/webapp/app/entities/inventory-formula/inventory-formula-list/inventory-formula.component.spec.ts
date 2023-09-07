import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryFormulaComponent } from './inventory-formula.component';

describe('InventoryFormulaComponent', () => {
  let component: InventoryFormulaComponent;
  let fixture: ComponentFixture<InventoryFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryFormulaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
