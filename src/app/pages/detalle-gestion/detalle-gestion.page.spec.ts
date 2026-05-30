import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleGestionPage } from './detalle-gestion.page';

describe('DetalleGestionPage', () => {
  let component: DetalleGestionPage;
  let fixture: ComponentFixture<DetalleGestionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleGestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
