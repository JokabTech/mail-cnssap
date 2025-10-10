import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInternalMailReportComponent } from './incoming-internal-mail-report-component';

describe('IncomingInternalMailReportComponent', () => {
  let component: IncomingInternalMailReportComponent;
  let fixture: ComponentFixture<IncomingInternalMailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingInternalMailReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInternalMailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
