import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingExternalMailListComponent } from './incoming-external-mail-list-component';

describe('IncomingExternalMailListComponent', () => {
  let component: IncomingExternalMailListComponent;
  let fixture: ComponentFixture<IncomingExternalMailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingExternalMailListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingExternalMailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
