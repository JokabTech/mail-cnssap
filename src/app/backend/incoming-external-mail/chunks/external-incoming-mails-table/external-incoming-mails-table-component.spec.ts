import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalIncomingMailsTableComponent } from './external-incoming-mails-table-component';

describe('ExternalIncomingMailsTableComponent', () => {
  let component: ExternalIncomingMailsTableComponent;
  let fixture: ComponentFixture<ExternalIncomingMailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalIncomingMailsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalIncomingMailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
