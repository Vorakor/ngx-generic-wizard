import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'ngx-gw-action-btn',
  templateUrl: './ngx-gw-action-btn.component.html',
  styleUrls: ['./ngx-gw-action-btn.component.scss']
})
export class NgxGwActionBtnComponent implements OnChanges {
  @Input() actionType: 'next' | 'previous' | 'reenter';
  @Input() btnText = '';
  @Input() minWidth: number;
  @Output() action: EventEmitter<string> = new EventEmitter<string>(null);
  btnLabel = '';
  minButtonWidth: number;
  maxButtonWidth: number;

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.btnText) {
      this.btnLabel = changes.btnText.currentValue;
    }
    if (changes && changes.minWidth) {
      this.minButtonWidth = changes.minWidth.currentValue;
      this.maxButtonWidth = this.minButtonWidth + 30;
    }
  }

  actionEmit() {
    this.action.emit(this.actionType);
  }
}
