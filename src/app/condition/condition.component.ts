import { Component, OnInit, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { Condition } from '../condition';
import { GetBlankCondition } from '../util';

const noop = () => {
};

@Component({
  selector: 'surv-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.css'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: ConditionComponent, multi: true}
  ]
})
export class ConditionComponent implements OnInit, ControlValueAccessor {

  selectId: string;
  private _condition: Condition;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  get condition(): Condition {
    return this._condition;
  }

  set condition(v: Condition) {
    if (v !== this._condition) {
      this._condition = v;
      this.onChangeCallback(v);
    }
  }

  writeValue(v: any): void {
    if (v !== this._condition) {
      this._condition = v;
    }
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    return;
  }

  constructor() { }

  ngOnInit() {
    this.selectId = Math.random().toString();
  }

  addCondition() {
    this.condition = GetBlankCondition();
  }
  removeCondition() {
    this.condition = null;
  }

}
