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
  @Input() btnText: string;
  @Output() action: EventEmitter<string> = new EventEmitter<string>(null);
  btnLabel = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.btnText) {
      this.btnLabel = changes.btnText.currentValue;
    }
  }

  actionEmit() {
    this.action.emit(this.actionType);
  }
}
