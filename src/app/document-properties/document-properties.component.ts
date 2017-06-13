import { Component, OnInit, Input } from '@angular/core';
import { SurveyProperties } from '../config';

@Component({
  selector: 'surv-document-properties',
  templateUrl: './document-properties.component.html',
  styleUrls: ['./document-properties.component.css']
})
export class DocumentPropertiesComponent implements OnInit {

  @Input() properties: SurveyProperties = {disclaimer:[], title: ""};

  get disclaimerText():string {
    return this.properties.disclaimer.join('\n\n');
  }
  set disclaimerText(text:string) {
    this.properties.disclaimer = text.split('\n\n');
  }

  constructor() { }

  ngOnInit() {
  }

}
