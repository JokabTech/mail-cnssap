import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingExternaMailDetailComponent } from './incoming-externa-mail-detail-component';

describe('IncomingExternaMailDetailComponent', () => {
  let component: IncomingExternaMailDetailComponent;
  let fixture: ComponentFixture<IncomingExternaMailDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingExternaMailDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingExternaMailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
