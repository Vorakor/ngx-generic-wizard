import { TestBed } from '@angular/core/testing';

import { NgxGwEventStreamService } from './ngx-gw-event-stream.service';

describe('NgxGwEventStreamService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: NgxGwEventStreamService = TestBed.get(NgxGwEventStreamService);
        expect(service).toBeTruthy();
    });
});
