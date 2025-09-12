import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingMailGridComponent } from './incoming-mail-grid-component';

describe('IncomingMailGridComponent', () => {
  let component: IncomingMailGridComponent;
  let fixture: ComponentFixture<IncomingMailGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingMailGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingMailGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
