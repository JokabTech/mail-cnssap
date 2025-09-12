import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInternalMailsGridComponent } from './incoming-internal-mails-grid-component';

describe('IncomingInternalMailsGridComponent', () => {
  let component: IncomingInternalMailsGridComponent;
  let fixture: ComponentFixture<IncomingInternalMailsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingInternalMailsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInternalMailsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
