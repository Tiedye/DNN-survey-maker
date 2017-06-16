import { Injectable } from '@angular/core';
import { Config } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

@Injectable()
export class ConfigService {

  get config() {
    return this._config;
  }
  
  get questionIds() {
    return [].concat.apply([], this.config.pages.map(p => p.questions.map(q => q.id)));
  }

  private _config: Config;
  private _saveTimer:Observable<number>;

  setConfigString(rConfig:string) {
    const config = JSON.parse(rConfig);
    this._config = config;
  }
  getConfigString() {
    return JSON.stringify(this._config);
  }
  clearConfig() {
    this._config = {
      properties: {disclaimer:["-disclaimer-"], title:"-Title-"},
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
   }

}
