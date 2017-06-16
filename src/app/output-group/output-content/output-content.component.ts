import { Component, OnInit, Input } from '@angular/core';
import { OutputContent } from '../../output';

@Component({
  selector: 'surv-output-content',
  templateUrl: './output-content.component.html',
  styleUrls: ['./output-content.component.css'],
  host: {
    'class': 'print'
  }
})
export class OutputContentComponent implements OnInit {

  @Input() content: OutputContent;

  constructor() { }

  ngOnInit() {
  }

}
