import { Component, OnInit, Input, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';
import { OutputGroup, OutputContent } from '../output';
import { Question } from '../question';
import { GetBlankCondition } from '../util';

@Component({
  selector: 'surv-output-group',
  templateUrl: './output-group.component.html',
  styleUrls: ['./output-group.component.css'],
  host: {
    'class': 'print'
  }
})
export class OutputGroupComponent implements OnInit {

  @Input() group: OutputGroup;
  @Output() deleted: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(){
    
  }

  addCondition() {
    this.group.condition = GetBlankCondition();
  }
  removeCondition() {
    this.group.condition = null;
  }

  //TODO content lost when draggin b/w bags
}
