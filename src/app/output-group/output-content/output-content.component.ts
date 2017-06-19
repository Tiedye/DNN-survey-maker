import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { OutputContent } from '../../output';
import { FocusService } from '../../focus.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'surv-output-content',
  templateUrl: './output-content.component.html',
  styleUrls: ['./output-content.component.css'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    'class': 'print'
  }
})
export class OutputContentComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('inputArea') inputArea;

  @Input() content: OutputContent;
  @Output() deleted = new EventEmitter<boolean>();
  @Output() split = new EventEmitter<void>();

  private deleteNext = false;
  private focusedElementSub: Subscription;

  constructor(private focusService: FocusService) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.focusedElementSub = this.focusService.focusedElement.subscribe(v => {
      if (v === this.content.id) {
        setTimeout(() => this.focus(), 0);
      }
    });
  }

  ngOnDestroy() {
    this.focusedElementSub.unsubscribe();
  }

  handleKey(e: KeyboardEvent) {
    switch (e.key) {
      case 'Backspace':
        if (this.content.content.length === 0) {
          this.deleted.emit(false);
        }
        return;
      case 'Enter':
        this.split.emit();
        return false;
      case 'Tab':
        this.content.content += '\t';
        return false;
    }
  }

  focus() {
    this.inputArea.nativeElement.focus();
  }

}
