import { Component, EventEmitter, Input, Output, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, first, map, tap } from 'rxjs';

@Component({
  selector: 'vex-custom-mat-select',
  templateUrl: './custom-mat-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomMatSelectComponent),
      multi: true
    }
  ]
})
export class CustomMatSelectComponent implements ControlValueAccessor  {

  @Input() label: string;
  @Input() icon: string;
  @Input() required: boolean = false;
  @Input() items$: Observable<any[]>;
  @Input() disabled: boolean = false;

  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  control = new FormControl();

  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any) {
    this.control.setValue(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean) {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  onSelectionChange(value: number) {
    this.selectionChange.emit(value);
  }

  onClick(event: any) {
    this.control.setValue(null);
    this.selectionChange.emit(null);
    event.stopPropagation();
  }
}
