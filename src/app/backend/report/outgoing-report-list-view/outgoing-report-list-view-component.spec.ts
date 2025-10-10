import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingReportListViewComponent } from './outgoing-report-list-view-component';

describe('OutgoingReportListViewComponent', () => {
  let component: OutgoingReportListViewComponent;
  let fixture: ComponentFixture<OutgoingReportListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingReportListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingReportListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
