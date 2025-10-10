import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsIncomingExternalMailComponent } from './analytics-incoming-external-mail-component';

describe('AnalyticsIncomingExternalMailComponent', () => {
  let component: AnalyticsIncomingExternalMailComponent;
  let fixture: ComponentFixture<AnalyticsIncomingExternalMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsIncomingExternalMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsIncomingExternalMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
