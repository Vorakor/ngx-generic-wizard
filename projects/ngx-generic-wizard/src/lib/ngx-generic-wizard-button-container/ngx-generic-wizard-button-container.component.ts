import { Component, OnInit, Input } from '@angular/core';
import { INgxGwConfig, NgxGenericWizardService } from '../../public-api';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-gw-button-container',
  templateUrl: './ngx-generic-wizard-button-container.component.html',
  styleUrls: ['./ngx-generic-wizard-button-container.component.scss']
})
export class NgxGenericWizardButtonContainerComponent implements OnInit {
  @Input() config: INgxGwConfig;
  finalize$: Observable<boolean> = this.ngxGwService.finalized$;
  nextBtnText: string;
  prevBtnText: string;
  reenterBtnText: string;
  constructor(private ngxGwService: NgxGenericWizardService) {}

  ngOnInit() {
    //
  }

  action(event) {
    if (event === 'next') {
      this.next();
    } else if (event === 'previous') {
      this.previous();
    } else {
      this.reenter();
    }
  }

  next() {
    this.ngxGwService.next(this.config);
  }

  previous() {
    this.ngxGwService.prev(this.config);
  }

  reenter() {
    this.ngxGwService.resetFinalized(this.config);
  }
}
