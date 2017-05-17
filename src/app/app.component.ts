import { Component, ViewChild, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Question } from './question';
import { ChoiceQuestion, DateQuestion, NumericQuestion, TextQuestion } from './question-types';
import { OutputNode } from './output';
import { BasicOutput } from './output-types';
import { CompileService } from './compile.service';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/Observable/timer';

@Component({
  selector: 'surv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  outputs: OutputNode[] = [];
  questions: Question[] = [];

  outScript: string;
  outStyle: string;
  outHTML: string;

  @ViewChild('loadFileSelection') loader;
  @ViewChild('outputElement') outElem;

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

  private saveTimer:Observable<number>;

  ngOnInit():void {
    if (localStorage.getItem('survey-save')) {
      this.setConfig(localStorage.getItem('survey-save'));
    }
    this.saveTimer = timer(0, 5000);
    this.saveTimer.subscribe(t => localStorage.setItem('survey-save', this.getConfig()));
  }

  navto(id: string): void {
    if (id.startsWith('-')) { return; }
    let bodyRect = document.body.getBoundingClientRect(),
    elemRect = document.querySelector(`*[data-id=${id}]`).getBoundingClientRect(),
    offset   = elemRect.top - bodyRect.top;
    scroll(0, offset - 80);
  }

  addChoiceQ(): void {
    const prefix = 'choice';
    let n = 1;
    while (this.questions.some(q => q.id === prefix + n)) {++n;}
    this.questions.push(new ChoiceQuestion(prefix + n));
  }

  addTextQ(): void {
    const prefix = 'text';
    let n = 1;
    while (this.questions.some(q => q.id === prefix + n)) {++n;}
    this.questions.push(new TextQuestion(prefix + n));
  }

  addNumberQ(): void {
    const prefix = 'number';
    let n = 1;
    while (this.questions.some(q => q.id === prefix + n)) {++n;}
    this.questions.push(new NumericQuestion(prefix + n));
  }

  addDateQ(): void {
    const prefix = 'date';
    let n = 1;
    while (this.questions.some(q => q.id === prefix + n)) {++n;}
    this.questions.push(new DateQuestion(prefix + n));
  }

  scrollToQ(i: number): void {
    document.querySelector(`#question-bag .col-12:nth-child(${i})`).scrollIntoView();
    console.log(i);
  }

  addBasicO(): void {
    const prefix = 'basic';
    let n = 1;
    while (this.outputs.some(q => q.id === prefix + n)) {++n;}
    this.outputs.push(new BasicOutput(prefix + n));
  }

  compile(): void {
    const result = this.compileService.compile(this.questions, this.outputs);
    this.outHTML = result.html.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;');
    this.outScript = result.script.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    this.outStyle = result.style.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private setConfig(rConfig:string) {
    const config = JSON.parse(rConfig);
    this.outputs = config.outputs;
    this.questions = config.quesitons;
  }
  private getConfig():string {
    return JSON.stringify({outputs: this.outputs, quesitons: this.questions });
  }

  save(): void {
    const blob = new Blob([this.getConfig()], {
      type: 'application/json;charset=utf-8'
    });
    FileSaver.saveAs(blob, 'survey.json');
  }
  load(): void {
    this.loader.nativeElement.click();
  }
  clear(): void {
    this.setConfig(JSON.stringify({outputs:[], questions: []}));
  }
  loadFile($event: any): void {
    const file: File = $event.target.files[0];
    const myReader = new FileReader();

    myReader.onloadend = () => {
      this.setConfig(myReader.result);
    };

    myReader.readAsText(file);
  }

}
