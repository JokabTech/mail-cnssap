import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingExternalMailReportComponent } from './outgoing-external-mail-report-component';

describe('OutgoingExternalMailReportComponent', () => {
  let component: OutgoingExternalMailReportComponent;
  let fixture: ComponentFixture<OutgoingExternalMailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingExternalMailReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingExternalMailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
