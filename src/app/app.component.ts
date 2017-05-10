import { Component } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Question } from './question';
import { ChoiceQuestion, DateQuestion, NumericQuestion, TextQuestion } from './question-types';
import { OutputNode } from './output';
import { BasicOutput } from './output-types';
import { CompileService } from './compile.service';

@Component({
  selector: 'surv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'surv works!';
  outputs: OutputNode[] = [];
  questions: Question[] = [];

  outScript:string;
  outStyle:string;
  outHTML:string;

  constructor(private dragulaService: DragulaService, private compileService: CompileService) {
    dragulaService.setOptions('question-bag', {
      moves: (el, container, handle) => {
        return handle.classList.contains('handle');
      }
    });
    dragulaService.setOptions('node-bag', {
      moves: (el, container, handle) => {
        return handle.classList.contains('handle');
      }
    });
  }

  addChoiceQ():void {
    this.questions.push(new ChoiceQuestion());
  }

  addTextQ():void {
    this.questions.push(new TextQuestion());
  }

  addNumberQ():void {
    this.questions.push(new NumericQuestion());
  }

  addDateQ():void {
    this.questions.push(new DateQuestion());
  }

  scrollToQ(i:number):void {
    document.querySelector(`#question-bag .col-12:nth-child(${i})`).scrollIntoView();
    console.log(i);
  }

  addBasicO():void {
    this.outputs.push(new BasicOutput());
  }

  compile():void {
    let result = this.compileService.compile(this.questions, this.outputs);
    this.outHTML = result.html.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;');
    console.log(this.outHTML);
  }

}
