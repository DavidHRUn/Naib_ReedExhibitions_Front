import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleExpositorComponent } from './detalle-expositor.component';

describe('DetalleExpositorComponent', () => {
  let component: DetalleExpositorComponent;
  let fixture: ComponentFixture<DetalleExpositorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleExpositorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleExpositorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
