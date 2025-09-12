import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingExternalMailComponent } from './incoming-external-mail-component';

describe('IncomingExternalMailComponent', () => {
  let component: IncomingExternalMailComponent;
  let fixture: ComponentFixture<IncomingExternalMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingExternalMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingExternalMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
