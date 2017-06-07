import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Page } from '../page';
import { GetBlankCondition } from '../util';
import { ChoiceQuestion, DateQuestion, NumericQuestion, TextQuestion, HeaderQuestion } from '../question-types';


@Component({
  selector: 'surv-page-block',
  templateUrl: './page-block.component.html',
  styleUrls: ['./page-block.component.css']
})
export class PageBlockComponent implements OnInit {

  @Input() page: Page;
  @Output() deleted: EventEmitter<void> = new EventEmitter<void>();

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
    const prefix = 'choice';
    let n = 1;
    while (document.querySelector(`*[data-id=${prefix+n}]`)) {++n;}
    this.page.questions.push(new ChoiceQuestion(prefix + n));
  }

  addTextQ(): void {
    const prefix = 'text';
    let n = 1;
    while (document.querySelector(`*[data-id=${prefix+n}]`)) {++n;}
    this.page.questions.push(new TextQuestion(prefix + n));
  }

  addNumberQ(): void {
    const prefix = 'number';
    let n = 1;
    while (document.querySelector(`*[data-id=${prefix+n}]`)) {++n;}
    this.page.questions.push(new NumericQuestion(prefix + n));
  }

  addDateQ(): void {
    const prefix = 'date';
    let n = 1;
    while (document.querySelector(`*[data-id=${prefix+n}]`)) {++n;}
    this.page.questions.push(new DateQuestion(prefix + n));
  }

  addHeaderQ(): void {
    const prefix = 'header';
    let n = 1;
    while (document.querySelector(`*[data-id=${prefix+n}]`)) {++n;}
    this.page.questions.push(new HeaderQuestion(prefix + n));
  }

}
