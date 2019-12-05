import { Component, Input, Output, EventEmitter } from '@angular/core';
import { INgxGwStep } from '../interfaces';

@Component({
  selector: 'ngx-gw-step',
  templateUrl: './ngx-gw-step.component.html',
  styleUrls: ['./ngx-gw-step.component.scss']
})
export class NgxGwStepComponent {
  @Input() step: INgxGwStep;
  @Output() navigate: EventEmitter<INgxGwStep> = new EventEmitter<INgxGwStep>(
    null
  );
  constructor() {}

  route() {
    this.navigate.emit(this.step);
  }
}
