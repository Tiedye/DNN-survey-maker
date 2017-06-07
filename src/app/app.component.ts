import { Component, ViewChild, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/Observable/timer';
import { Question } from './question';
import { OutputNode } from './output';
import { BasicOutput } from './output-types';
import { CompileService } from './compile.service';
import * as FileSaver from 'file-saver';
import { Page } from './page';
import { Config } from './config';
import { GetBlankPage } from './util';

@Component({
  selector: 'surv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: string;
  outputs: OutputNode[] = [];
  pages: Page[] = [];

  outScript: string;
  outStyle: string;
  outHTML: string;

  @ViewChild('loadFileSelection') loader;
  @ViewChild('outputElement') outElem;

  constructor(private dragulaService: DragulaService, private compileService: CompileService) {
    dragulaService.setOptions('page-bag', {
      moves: (el, container, handle) => {
        return handle.classList.contains('page-handle');
      }
    });
    dragulaService.setOptions('node-bag', {
      moves: (el, container, handle) => {
        return handle.classList.contains('handle');
      }
    });
    dragulaService.setOptions('question-bag', {
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
    elemRect = document.querySelector(`*[data-id="${id}"]`).getBoundingClientRect(),
    offset   = elemRect.top - bodyRect.top;
    scroll(0, offset - 80);
  }

  addPage(): void {
    this.pages.push(GetBlankPage());
  }

  addBasicO(): void {
    const prefix = 'basic';
    let n = 1;
    while (this.outputs.some(q => q.id === prefix + n)) {++n;}
    this.outputs.push(new BasicOutput(prefix + n));
  }

  compile(): void {
    const result = this.compileService.compile(this.title, this.pages, this.outputs); // TODO pages for compile
    this.outHTML = result.html.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;');
    this.outScript = result.script.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    this.outStyle = result.style.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private setConfig(rConfig:string) {
    const config = JSON.parse(rConfig);
    if (config['quesitons']) {
      // convert to modern
      this.pages = [];
      config.quesitons.forEach((q:Question) => {
        if (this.pages.length && q.id.startsWith(this.pages[this.pages.length - 1].title)) {
          this.pages[this.pages.length - 1].questions.push(q);
        } else {
          this.pages.push({title: q.id, condition: null, questions: [q]});
        }
      });
    } else {
      this.pages = config.pages;
    }
    this.outputs = config.outputs;
  }
  private getConfig():string {
    return JSON.stringify({outputs: this.outputs, pages: this.pages });
  }

  save(e:MouseEvent): void {
    e.preventDefault();
    const blob = new Blob([this.getConfig()], {
      type: 'application/json;charset=utf-8'
    });
    FileSaver.saveAs(blob, 'survey.json');
  }
  load(e:MouseEvent): void {
    e.preventDefault();
    this.loader.nativeElement.click();
  }
  clear(e:MouseEvent): void {
    e.preventDefault();
    this.setConfig(JSON.stringify({outputs:[], pages: []}));
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
