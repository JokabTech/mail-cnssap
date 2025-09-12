import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingMailComponent } from './incoming-mail-component';

describe('IncomingMailComponent', () => {
  let component: IncomingMailComponent;
  let fixture: ComponentFixture<IncomingMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
