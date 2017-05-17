import { Component, ViewChild } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Question } from './question';
import { ChoiceQuestion, DateQuestion, NumericQuestion, TextQuestion } from './question-types';
import { OutputNode } from './output';
import { BasicOutput } from './output-types';
import { CompileService } from './compile.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'surv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  outputs: OutputNode[] = [];
  questions: Question[] = [];

  outScript: string;
  outStyle: string;
  outHTML: string;

  @ViewChild('loadFileSelection') loader;

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

  addChoiceQ(): void {
    this.questions.push(new ChoiceQuestion());
  }

  addTextQ(): void {
    this.questions.push(new TextQuestion());
  }

  addNumberQ(): void {
    this.questions.push(new NumericQuestion());
  }

  addDateQ(): void {
    this.questions.push(new DateQuestion());
  }

  scrollToQ(i: number): void {
    document.querySelector(`#question-bag .col-12:nth-child(${i})`).scrollIntoView();
    console.log(i);
  }

  addBasicO(): void {
    this.outputs.push(new BasicOutput());
  }

  compile(): void {
    const result = this.compileService.compile(this.questions, this.outputs);
    this.outHTML = result.html;//.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;');
    this.outScript = result.script;//.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    console.log(this.outHTML);
  }

  save(): void {
    const blob = new Blob([JSON.stringify({outputs: this.outputs, quesitons: this.questions })], {
      type: 'application/json'
    });
    FileSaver.saveAs(blob, 'survey.json');
  }
  load(): void {
    this.loader.nativeElement.click();
  }
  loadFile($event: any): void {
    const file: File = $event.target.files[0];
    const myReader = new FileReader();

    myReader.onloadend = () => {
      const config = JSON.parse(myReader.result);
      this.outputs = config.outputs;
      this.questions = config.quesitons;
    };

    myReader.readAsText(file);
  }

}
