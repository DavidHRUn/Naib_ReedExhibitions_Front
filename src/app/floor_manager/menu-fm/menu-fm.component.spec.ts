import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFMComponent } from './menu-fm.component';

describe('MenuFMComponent', () => {
  let component: MenuFMComponent;
  let fixture: ComponentFixture<MenuFMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuFMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuFMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
