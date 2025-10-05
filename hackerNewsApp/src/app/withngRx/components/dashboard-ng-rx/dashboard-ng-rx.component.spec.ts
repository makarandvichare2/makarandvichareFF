import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNgRxComponent } from './dashboard-ng-rx.component';

describe('DashboardNgRxComponent', () => {
  let component: DashboardNgRxComponent;
  let fixture: ComponentFixture<DashboardNgRxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardNgRxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardNgRxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
