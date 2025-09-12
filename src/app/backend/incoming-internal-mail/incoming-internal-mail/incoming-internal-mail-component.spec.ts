import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInternalMailComponent } from './incoming-internal-mail-component';

describe('IncomingInternalMailComponent', () => {
  let component: IncomingInternalMailComponent;
  let fixture: ComponentFixture<IncomingInternalMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingInternalMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInternalMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
