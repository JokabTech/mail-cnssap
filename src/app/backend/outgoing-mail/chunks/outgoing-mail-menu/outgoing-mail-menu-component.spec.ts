import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingMailMenuComponent } from './outgoing-mail-menu-component';

describe('OutgoingMailMenuComponent', () => {
  let component: OutgoingMailMenuComponent;
  let fixture: ComponentFixture<OutgoingMailMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingMailMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingMailMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
