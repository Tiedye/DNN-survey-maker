import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../question';
import { GetBlankCondition } from '../util';

@Component({
  selector: 'surv-question-block',
  templateUrl: './question-block.component.html',
  styleUrls: ['./question-block.component.css']
})
export class QuestionBlockComponent implements OnInit {

  @Input() question: Question;
  @Input() questionIds: string[] = [];
  @Output() deleted: EventEmitter<void> = new EventEmitter<void>();

  collapsed = true;

  constructor() { }

  ngOnInit() {
  }

  addCondition() {
    this.question.condition = GetBlankCondition();
  }
  removeCondition() {
    this.question.condition = null;
  }

}
