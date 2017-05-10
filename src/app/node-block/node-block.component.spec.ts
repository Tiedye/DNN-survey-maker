import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeBlockComponent } from './node-block.component';

describe('NodeBlockComponent', () => {
  let component: NodeBlockComponent;
  let fixture: ComponentFixture<NodeBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
