import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalIncomingMailsGridComponent } from './external-incoming-mails-grid-component';

describe('ExternalIncomingMailsGridComponent', () => {
  let component: ExternalIncomingMailsGridComponent;
  let fixture: ComponentFixture<ExternalIncomingMailsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalIncomingMailsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalIncomingMailsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
