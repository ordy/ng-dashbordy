import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  @Component({ selector: 'app-header', template: '' })
  class HeaderStubComponent {}

  @Component({ selector: 'app-footer', template: '' })
  class FooterStubComponent {}

  @Component({ selector: 'app-sidebar', template: '' })
  class SidebarStubComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        FooterStubComponent,
        HeaderStubComponent,
        SidebarStubComponent,
      ],
      imports: [RouterModule.forRoot([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
