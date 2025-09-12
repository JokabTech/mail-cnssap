import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingMailMenuComponent } from './incoming-mail-menu-component';

describe('IncomingMailMenuComponent', () => {
  let component: IncomingMailMenuComponent;
  let fixture: ComponentFixture<IncomingMailMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingMailMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingMailMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
