import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportToolbarComponent } from './report-toolbar-component';

describe('ReportToolbarComponent', () => {
  let component: ReportToolbarComponent;
  let fixture: ComponentFixture<ReportToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
