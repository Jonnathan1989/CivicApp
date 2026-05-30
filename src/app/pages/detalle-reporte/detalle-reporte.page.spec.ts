import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleReportePage } from './detalle-reporte.page';

describe('DetalleReportePage', () => {
  let component: DetalleReportePage;
  let fixture: ComponentFixture<DetalleReportePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleReportePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
