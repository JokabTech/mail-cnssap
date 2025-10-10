import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsIncomingInternalMailComponent } from './analytics-incoming-internal-mail-component';

describe('AnalyticsIncomingInternalMailComponent', () => {
  let component: AnalyticsIncomingInternalMailComponent;
  let fixture: ComponentFixture<AnalyticsIncomingInternalMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsIncomingInternalMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsIncomingInternalMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
