import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMiniatureListComponent } from './inventory-miniature-list.component';

describe('InventoryMiniatureListComponent', () => {
  let component: InventoryMiniatureListComponent;
  let fixture: ComponentFixture<InventoryMiniatureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryMiniatureListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryMiniatureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
