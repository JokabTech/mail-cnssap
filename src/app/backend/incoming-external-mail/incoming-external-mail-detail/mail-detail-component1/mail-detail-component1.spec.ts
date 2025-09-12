import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailDetailComponent1 } from './mail-detail-component1';

describe('MailDetailComponent1', () => {
  let component: MailDetailComponent1;
  let fixture: ComponentFixture<MailDetailComponent1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailDetailComponent1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailDetailComponent1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
