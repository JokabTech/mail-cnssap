import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingExternalMailReportComponent } from './incoming-external-mail-report-component';

describe('IncomingExternalMailReportComponent', () => {
  let component: IncomingExternalMailReportComponent;
  let fixture: ComponentFixture<IncomingExternalMailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingExternalMailReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingExternalMailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
