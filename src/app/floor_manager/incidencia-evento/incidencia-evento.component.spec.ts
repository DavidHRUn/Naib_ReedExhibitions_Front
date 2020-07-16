import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciaEventoComponent } from './incidencia-evento.component';

describe('IncidenciaEventoComponent', () => {
  let component: IncidenciaEventoComponent;
  let fixture: ComponentFixture<IncidenciaEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidenciaEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenciaEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
