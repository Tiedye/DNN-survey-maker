import { Injectable } from '@angular/core';
import { Config } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { OutputGroup, OutputContent } from './output';

@Injectable()
export class ConfigService {

  private _config: Config;
  private _saveTimer: Observable<number>;

  private _defaultOutput: OutputGroup[];
  private _defaultContent: OutputContent[];

  styles = [
    { class: 'title', name: 'title' },
    { class: 'sub_title', name: 'sub_title' },
    { class: 'date', name: 'date' },
    { class: 'answer', name: 'answer' },
    { class: 'yes', name: 'yes' },
    { class: 'field', name: 'field' },
    { class: 'sub_header', name: 'sub_header' },
    { class: 'header', name: 'header' },
    { class: 'body', name: 'body' }
  ]

  get defaultOutput() { return this._defaultOutput; }
  get defaultContent() { return this._defaultContent; }

  renew() {
    this._defaultOutput = [new OutputGroup([new OutputContent('Text', 'body')])];
    this._defaultContent = [new OutputContent('Text', 'body')];
  }

  get config() {
    return this._config;
  }

  get questions() {
    return [].concat.apply([], this.config.pages.map(p => p.questions));
  }

  setConfigString(rConfig: string) {
    const config = JSON.parse(rConfig);
    this._config = config;
  }
  getConfigString() {
    return JSON.stringify(this._config);
  }
  clearConfig() {
    this._config = {
      properties: {disclaimer: ['-disclaimer-'], title: '-Title-'},
      outputs: [],
      pages: []
    };
  }

  constructor() {
    this.clearConfig();
    if (localStorage.getItem('survey-save')) {
      //this.setConfig(localStorage.getItem('survey-save'));
    }
    this._saveTimer = Observable.timer(0, 5000);
    //this.saveTimer.subscribe(t => localStorage.setItem('survey-save', this.getConfig()));
    this.renew();
   }

}
