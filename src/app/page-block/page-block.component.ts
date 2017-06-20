import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Page } from '../page';
import { GetBlankCondition } from '../util';
import { ChoiceQuestion, DateQuestion, NumericQuestion, TextQuestion, HeaderQuestion } from '../question-types';
import { Question } from '../question';

@Component({
  selector: 'surv-page-block',
  templateUrl: './page-block.component.html',
  styleUrls: ['./page-block.component.css']
})
export class PageBlockComponent implements OnInit {

  @Input() page: Page;
  @Output() deleted: EventEmitter<void> = new EventEmitter<void>();

  collapsed = true;

  constructor() { }

  ngOnInit() {
  }

  addCondition() {
    this.page.condition = GetBlankCondition();
  }
  removeCondition() {
    this.page.condition = null;
  }

  addChoiceQ(): void {
    this.page.questions.push(new ChoiceQuestion());
  }

  addTextQ(): void {
    this.page.questions.push(new TextQuestion());
  }

  addNumberQ(): void {
    this.page.questions.push(new NumericQuestion());
  }

  addDateQ(): void {
    this.page.questions.push(new DateQuestion());
  }

  addHeaderQ(): void {
    this.page.questions.push(new HeaderQuestion());
  }

  @Input() set toggle(v) {
    console.log(v);
  }

}
