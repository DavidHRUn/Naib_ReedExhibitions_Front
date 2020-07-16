import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaExpositoresComponent } from './lista-expositores.component';

describe('ListaExpositoresComponent', () => {
  let component: ListaExpositoresComponent;
  let fixture: ComponentFixture<ListaExpositoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaExpositoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaExpositoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
