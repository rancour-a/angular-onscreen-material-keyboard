import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, LOCALE_ID, OnDestroy, Optional, Output, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

import { MatKeyboardRef } from '../classes/keyboard-ref.class';
import { MatKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MatKeyboardService } from '../services/keyboard.service';

@Directive({
  selector: 'input[matKeyboard], textarea[matKeyboard]'
})
export class MatKeyboardDirective implements OnDestroy {

  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;

  @Input() matKeyboard: string;

  @Input() active: boolean = true;

  @Input() anchor: string = 'bottom';

  @Input() darkTheme: boolean;

  @Input() duration: number;

  @Input() isDebug: boolean;

  @Output() enterClick: EventEmitter<void> = new EventEmitter<void>();

  @Output() capsClick: EventEmitter<void> = new EventEmitter<void>();

  @Output() altClick: EventEmitter<void> = new EventEmitter<void>();

  @Output() shiftClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(private _elementRef: ElementRef,
              private _keyboardService: MatKeyboardService,
              @Inject(LOCALE_ID) private _defaultLocale: string,
              @Optional() @Self() private _control?: NgControl) {}

  ngOnDestroy() {
    this.hideKeyboard();
  }

  @HostListener('focus', ['$event'])
  public showKeyboard() {

    if (!this.active) {
      return;
    }

    this._keyboardRef = this._keyboardService.open(this.matKeyboard, {
      darkTheme: this.darkTheme,
      duration: this.duration,
      isDebug: this.isDebug
    }, this.anchor);

    // reference the input element
    this._keyboardRef.instance.setInputInstance(this._elementRef);

    // set control if given, cast to smth. non-abstract
    if (this._control) {
      this._keyboardRef.instance.attachControl(this._control.control);
    }

    // connect outputs
    this._keyboardRef.instance.enterClick.subscribe(() => this.enterClick.next());
    this._keyboardRef.instance.capsClick.subscribe(() => this.capsClick.next());
    this._keyboardRef.instance.altClick.subscribe(() => this.altClick.next());
    this._keyboardRef.instance.shiftClick.subscribe(() => this.shiftClick.next());
  }

  @HostListener('blur', ['$event'])
  public hideKeyboard() {
    if (this._keyboardRef) {
      this._keyboardRef.dismiss();
    }
  }

}
