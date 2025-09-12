import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutFrontendComponent } from './layout-frontend-component';

describe('LayoutFrontendComponent', () => {
  let component: LayoutFrontendComponent;
  let fixture: ComponentFixture<LayoutFrontendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutFrontendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutFrontendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
