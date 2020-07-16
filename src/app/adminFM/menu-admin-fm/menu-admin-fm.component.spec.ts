import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAdminFMComponent } from './menu-admin-fm.component';

describe('MenuAdminFMComponent', () => {
  let component: MenuAdminFMComponent;
  let fixture: ComponentFixture<MenuAdminFMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuAdminFMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuAdminFMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
