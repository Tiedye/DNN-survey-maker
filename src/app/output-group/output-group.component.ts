import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { OutputGroup, OutputContent } from '../output';
import { Question } from '../question';
import { GetBlankCondition } from '../util';
import { v4 } from 'uuid';
import { OutputContentComponent } from './output-content/output-content.component';
import { TextService } from '../text.service';

@Component({
  selector: 'surv-output-group',
  templateUrl: './output-group.component.html',
  styleUrls: ['./output-group.component.css'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    'class': 'print'
  }
})
export class OutputGroupComponent implements OnInit {
  @ViewChildren(OutputContentComponent) contentElements: QueryList<OutputContentComponent>;

  @Input() group: OutputGroup;
  @Output() deleted: EventEmitter<void> = new EventEmitter<void>();

  constructor(private focusService: TextService) { }

  ngOnInit() { }

  addCondition() {
    this.group.condition = GetBlankCondition();
  }
  removeCondition() {
    this.group.condition = null;
  }

  split(i: number) {
    const obj = new OutputContent('', this.group.items[i].style);
    this.group.items.splice(i + 1, 0, obj);
    this.focusService.focus(obj.id);
  }

  delete(hard: boolean, i: number) {
    if (hard || i !== 0) {
      this.group.items.splice(i, 1);
      if (i > 0 && !hard) {
        this.focusService.focus(this.group.items[i - 1].id);
      }
    }
  }

  navigate(i: number, end: boolean) {
    if (i >= 0 && i < this.group.items.length) {
      this.focusService.focus(this.group.items[i].id, end);
    }
  }
}
