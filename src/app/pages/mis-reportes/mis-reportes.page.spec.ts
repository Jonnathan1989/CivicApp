import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisReportesPage } from './mis-reportes.page';

describe('MisReportesPage', () => {
  let component: MisReportesPage;
  let fixture: ComponentFixture<MisReportesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisReportesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
