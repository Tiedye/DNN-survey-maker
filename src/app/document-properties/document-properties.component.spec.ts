import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPropertiesComponent } from './document-properties.component';

describe('DocumentPropertiesComponent', () => {
  let component: DocumentPropertiesComponent;
  let fixture: ComponentFixture<DocumentPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
