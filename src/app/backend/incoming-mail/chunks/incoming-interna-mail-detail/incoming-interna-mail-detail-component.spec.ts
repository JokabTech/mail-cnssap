import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInternaMailDetailComponent } from './incoming-interna-mail-detail-component';

describe('IncomingInternaMailDetailComponent', () => {
  let component: IncomingInternaMailDetailComponent;
  let fixture: ComponentFixture<IncomingInternaMailDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingInternaMailDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInternaMailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
