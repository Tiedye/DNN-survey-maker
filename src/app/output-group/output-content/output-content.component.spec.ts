import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputContentComponent } from './output-content.component';

describe('OutputContentComponent', () => {
  let component: OutputContentComponent;
  let fixture: ComponentFixture<OutputContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
