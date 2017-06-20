import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/Observable/timer';
import { Question } from './question';
import { OutputContent, OutputGroup } from './output';
import { CompileService } from './compile.service';
import * as FileSaver from 'file-saver';
import { Page } from './page';
import { Config } from './config';
import { GetBlankPage, GetBlankCondition } from './util';
import { v4 } from 'uuid';
import { ConfigService } from './config.service';
import { TextService } from './text.service';
import { TooltipComponent } from 'ngx-better-tooltip';

@Component({
  selector: 'surv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  confirm = confirm;

  uuid: string;

  outScript: string;
  outStyle: string;
  outHTML: string;

  insertTag = '';
  insertId = '';

  ogrp = new OutputGroup([new OutputContent('', 'body')]);

  @ViewChild('styleTagInserter') styleTagInserter: TooltipComponent;
  @ViewChild('valueTagInserter') valueTagInserter: TooltipComponent;
  @ViewChild('loadFileSelection') loader;
  @ViewChild('outputElement') outElem;

  @HostListener('document:keydown', ['$event']) onkeydown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      switch (event.key) {
        case 's':
          this.save();
          return false;
      }
    }
  }

  constructor(private dragulaService: DragulaService, private compileService: CompileService, public configService: ConfigService, private textService: TextService) {
    dragulaService.setOptions('page-bag', {
      moves: (el, container, handle) => {
        return handle.classList.contains('page-handle');
      }
    });
    dragulaService.setOptions('question-bag', {
      moves: (el, container, handle) => {
        return handle.classList.contains('handle');
      }
    });
    dragulaService.setOptions('node-bag', {
      moves: (el, container, handle) => {
        return handle.classList.contains('node-handle');
      },
      copy: (el, container) => {
        return container.classList.contains('toolbox');
      },
      accepts: (el, container) => {
        return !container.classList.contains('toolbox');
      }
    });
    dragulaService.setOptions('content-bag', {
      moves: (el, container, handle) => {
        return handle.classList.contains('content-handle');
      },
      copy: (el, container) => {
        return container.classList.contains('toolbox');
      },
      accepts: (el, container) => {
        return !container.classList.contains('toolbox');
      }
    });
    dragulaService.find('node-bag').drake.on('drop', () => {this.configService.renew()});
    dragulaService.find('content-bag').drake.on('drop', () => {this.configService.renew()});
    this.uuid = v4();
  }

  ngOnInit(): void {
  }

  navto(id: string): void {
    if (id.startsWith('-')) { return; }
    const bodyRect = document.body.getBoundingClientRect(),
          elemRect = document.querySelector(`*[data-id="${id}"]`).getBoundingClientRect(),
          offset   = elemRect.top - bodyRect.top;
    scroll(0, offset - 140);
  }

  addPage(): void {
    this.configService.config.pages.push(GetBlankPage());
  }

  addBasicO(): void {
    this.configService.config.outputs.push(new OutputGroup([new OutputContent('', 'body')]));
  }

  compile(): void {
    const result = this.compileService.compile(this.configService.config); // TODO pages for compile
    this.outHTML = result.html.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;');
    this.outScript = result.script.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    this.outStyle = result.style.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  save(): void {
    const blob = new Blob([this.configService.getConfigString()], {
      type: 'application/json;charset=utf-8'
    });
    FileSaver.saveAs(blob, 'survey.json');
  }
  load(): void {
    this.loader.nativeElement.click();
  }
  clear(): void {
    this.configService.clearConfig();
  }
  loadFile($event: any): void {
    const file: File = $event.target.files[0];
    const myReader = new FileReader();

    myReader.onloadend = () => {
      this.configService.setConfigString(myReader.result);
    };

    myReader.readAsText(file);
  }

  insertStyle() {
    this.textService.insert(`#s:${this.insertTag}:`);
    this.styleTagInserter.close();
  }

  insertValue() {
    this.textService.insert(`#v:${this.insertId}:`);
    this.valueTagInserter.close();
  }

  getDateString() {
    const d = new Date();
    return `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`;
  }

  get disclaimerText(): string {
    return this.configService.config.properties.disclaimer.join('\n\n');
  }
  set disclaimerText(text: string) {
    this.configService.config.properties.disclaimer = text.split('\n\n');
  }

  trackById(i, obj) {
    return obj.id;
  }

}
