import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingExternalMailDetailComponent } from './incoming-external-mail-detail-component';

describe('IncomingExternalMailDetailComponent', () => {
  let component: IncomingExternalMailDetailComponent;
  let fixture: ComponentFixture<IncomingExternalMailDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingExternalMailDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingExternalMailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
