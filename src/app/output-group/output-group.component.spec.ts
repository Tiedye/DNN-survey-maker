import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputGroupComponent } from './output-group.component';

describe('OutputGroupComponent', () => {
  let component: OutputGroupComponent;
  let fixture: ComponentFixture<OutputGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
