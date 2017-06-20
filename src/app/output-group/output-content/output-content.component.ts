import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { OutputContent } from '../../output';
import { TextService } from '../../text.service';
import { ConfigService } from '../../config.service';
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
  @Output() navigatePrev = new EventEmitter<void>();
  @Output() navigateNext = new EventEmitter<void>();

  private deleteNext = false;
  private focusedElementSub: Subscription;
  private inserterSub: Subscription;
  private focused = false;

  constructor(private textService: TextService, public configService: ConfigService) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.focusedElementSub = this.textService.focusedElement.subscribe(v => {
      if (v.id === this.content.id) {
        this.focused = true;
        if (this.inputArea.nativeElement !== document.activeElement) {
          setTimeout(() => this.focus(v.end), 0);
        }
      } else {
        this.focused = false;
      }
    });
    this.inserterSub = this.textService.toInsert.subscribe(v => {
      if (this.focused) {
        const ss = this.inputArea.nativeElement.selectionStart;
        this.content.content = this.content.content.substring(0, ss) + v + this.content.content.substring(ss);
        this.inputArea.nativeElement.selectionStart = this.inputArea.nativeElement.selectionEnd = ss + v.length;
      }
    });
  }

  ngOnDestroy() {
    this.focusedElementSub.unsubscribe();
    this.inserterSub.unsubscribe();
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
      case 'ArrowUp':
      case 'ArrowLeft': {
        const t = <HTMLTextAreaElement>this.inputArea.nativeElement;
        if (t.selectionStart === 0) {
          this.navigatePrev.emit();
        }
        return;
      }
      case 'ArrowDown':
      case 'ArrowRight': {
        const t = <HTMLTextAreaElement>this.inputArea.nativeElement;
        if (t.selectionStart === t.value.length) {
          this.navigateNext.emit();
        }
        return;
      }
    }
  }

  focus(end: boolean = false) {
    this.inputArea.nativeElement.focus();
    if (end) {
      this.inputArea.nativeElement.selectionStart = this.inputArea.nativeElement.selectionEnd = this.inputArea.nativeElement.value.length;
    }
  }

  setFocus() {
    this.textService.focus(this.content.id);
  }

}
