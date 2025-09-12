import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPreviewcomponent } from './document-previewcomponent';

describe('DocumentPreviewcomponent', () => {
  let component: DocumentPreviewcomponent;
  let fixture: ComponentFixture<DocumentPreviewcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentPreviewcomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentPreviewcomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
