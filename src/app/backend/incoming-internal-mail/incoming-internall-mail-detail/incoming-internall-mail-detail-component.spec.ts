import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInternallMailDetailComponent } from './incoming-internall-mail-detail-component';

describe('IncomingInternallMailDetailComponent', () => {
  let component: IncomingInternallMailDetailComponent;
  let fixture: ComponentFixture<IncomingInternallMailDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingInternallMailDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInternallMailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
