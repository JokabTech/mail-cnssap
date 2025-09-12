import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInternalMailListComponent } from './incoming-internal-mail-list-component';

describe('IncomingInternalMailListComponent', () => {
  let component: IncomingInternalMailListComponent;
  let fixture: ComponentFixture<IncomingInternalMailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingInternalMailListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInternalMailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
