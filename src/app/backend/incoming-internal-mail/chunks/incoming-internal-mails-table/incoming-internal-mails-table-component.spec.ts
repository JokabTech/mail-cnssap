import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInternalMailsTableComponent } from './incoming-internal-mails-table-component';

describe('IncomingInternalMailsTableComponent', () => {
  let component: IncomingInternalMailsTableComponent;
  let fixture: ComponentFixture<IncomingInternalMailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingInternalMailsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInternalMailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
