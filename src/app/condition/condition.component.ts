import { Component, OnInit, Input } from '@angular/core';
import { Condition } from '../condition';
import { GetBlankCondition } from '../util';

@Component({
  selector: 'surv-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.css']
})
export class ConditionComponent implements OnInit {

  @Input() condition: Condition;
  selectId:string;

  constructor() { }

  ngOnInit() {
    this.selectId = Math.random().toString();
  }

  addCondition() {
    this.condition = GetBlankCondition();
  }
  removeCondition() {
    this.condition = null;
  }

}
