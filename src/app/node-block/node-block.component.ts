import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OutputNode } from '../output';
import { Question } from '../question';
import { GetBlankCondition } from '../util';

@Component({
  selector: 'surv-node-block',
  templateUrl: './node-block.component.html',
  styleUrls: ['./node-block.component.css']
})
export class NodeBlockComponent implements OnInit {

  @Input() node: OutputNode;
  @Input() questions: Question[] = [];
  @Output() deleted: EventEmitter<void> = new EventEmitter<void>();

  contentVisible = false;

  constructor() { }

  ngOnInit(){
    
  }

  addCondition() {
    this.node.condition = GetBlankCondition();
  }
  removeCondition() {
    this.node.condition = null;
  }

}
