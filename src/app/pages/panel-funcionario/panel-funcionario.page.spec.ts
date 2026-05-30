import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelFuncionarioPage } from './panel-funcionario.page';

describe('PanelFuncionarioPage', () => {
  let component: PanelFuncionarioPage;
  let fixture: ComponentFixture<PanelFuncionarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelFuncionarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
