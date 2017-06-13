import { Component, ViewChild, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/Observable/timer';
import { Question } from './question';
import { OutputNode, BasicOutput } from './output';
import { CompileService } from './compile.service';
import * as FileSaver from 'file-saver';
import { Page } from './page';
import { Config } from './config';
import { GetBlankPage, GetBlankCondition } from './util';
import { v4 } from 'uuid';

@Component({
  selector: 'surv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  config:Config = {
    properties: {disclaimer:["-disclaimer-"], title:"-Title-"},
    outputs: [],
    pages: []
  };
  uuid: string;

  outScript: string;
  outStyle: string;
  outHTML: string;

  @ViewChild('loadFileSelection') loader;
  @ViewChild('outputElement') outElem;
  
  @HostListener('document:keydown', ['$event']) onkeydown(event:KeyboardEvent) {
    if(event.ctrlKey) {
      switch (event.key) {
        case 's':
          this.save();
          return false;
      }
    }
  }

  constructor(private dragulaService: DragulaService, private compileService: CompileService, private changeDetectorRef:ChangeDetectorRef) {
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
    this.uuid = v4();
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
    this.config.pages.push(GetBlankPage());
  }

  addBasicO(): void {
    const prefix = 'basic';
    let n = 1;
    while (this.config.outputs.some(q => q.id === prefix + n)) {++n;}
    this.config.outputs.push(new BasicOutput(prefix + n));
  }

  compile(): void {
    const result = this.compileService.compile(this.config); // TODO pages for compile
    this.outHTML = result.html.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;');
    this.outScript = result.script.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    this.outStyle = result.style.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private setConfig(rConfig:string) {
    const config = JSON.parse(rConfig);
    this.config = config;
    if (config['quesitons']) {
      // convert to modern
      this.config.pages = [];
      config.quesitons.forEach((q:Question) => {
        if (this.config.pages.length && q.id.startsWith(this.config.pages[this.config.pages.length - 1].title)) {
          this.config.pages[this.config.pages.length - 1].questions.push(q);
        } else {
          this.config.pages.push({title: q.id, condition: null, questions: [q]});
        }
      });
    } else {
      this.config.pages = config.pages;
    }
    if (!config['properties']) {
      this.config.properties = {disclaimer: [], title: ''};
    }
    this.config.outputs.forEach(n => {
      n.condition = n.condition || GetBlankCondition();
      n.hide = n.hide || !n['display'];
      if (n.type == 'basic') {
        n.style = n.style || 'body';
      }
    })
    this.changeDetectorRef.detectChanges();
  }
  private getConfig():string {
    return JSON.stringify(this.config);
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
  getIds() {
    return [].concat.apply([], this.config.pages.map(p => p.questions.map(q => q.id)));
  }
  getDateString() {
    let d = new Date();
    return `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`;
  }

  get disclaimerText():string {
    return this.config.properties.disclaimer.join('\n\n');
  }
  set disclaimerText(text:string) {
    this.config.properties.disclaimer = text.split('\n\n');
  }

}
