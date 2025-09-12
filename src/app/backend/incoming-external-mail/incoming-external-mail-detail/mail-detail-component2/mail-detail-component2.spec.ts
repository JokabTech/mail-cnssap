import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailDetailComponent2 } from './mail-detail-component2';

describe('MailDetailComponent2', () => {
  let component: MailDetailComponent2;
  let fixture: ComponentFixture<MailDetailComponent2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailDetailComponent2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailDetailComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
