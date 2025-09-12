import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingExternalMailMenuComponent } from './incoming-external-mail-menu-component';

describe('IncomingExternalMailMenuComponent', () => {
  let component: IncomingExternalMailMenuComponent;
  let fixture: ComponentFixture<IncomingExternalMailMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingExternalMailMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingExternalMailMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
