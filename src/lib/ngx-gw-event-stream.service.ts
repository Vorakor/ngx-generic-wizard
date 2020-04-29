import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { INgxGwEvents, INgxGwFnEventCodes } from './interfaces';

@Injectable({
    providedIn: 'root',
})
export class NgxGwEventStreamService {
    private eventStream: BehaviorSubject<INgxGwEvents> = new BehaviorSubject<INgxGwEvents>(null);
    eventStream$: Observable<INgxGwEvents> = this.eventStream.asObservable();

    beforeEventStream$: Observable<INgxGwEvents> = this.eventStream$.pipe(
        filter(event => event !== null),
        distinctUntilChanged(),
        filter(event => event.eventType.toLowerCase() === 'before'),
    );

    afterEventStream$: Observable<INgxGwEvents> = this.eventStream$.pipe(
        filter(event => event !== null),
        distinctUntilChanged(),
        filter(event => event.eventType.toLowerCase() === 'after'),
    );

    errorEventStream$: Observable<INgxGwEvents> = this.eventStream$.pipe(
        filter(event => event !== null),
        distinctUntilChanged(),
        filter(event => event.eventType.toLowerCase() === 'error'),
    );

    otherEventStream$: Observable<INgxGwEvents> = this.eventStream$.pipe(
        filter(event => event !== null),
        distinctUntilChanged(),
        filter(
            event =>
                event.eventType.toLowerCase() !== 'before' ||
                event.eventType.toLowerCase() !== 'after' ||
                event.eventType.toLowerCase() !== 'error',
        ),
    );

    private eventCodes: BehaviorSubject<INgxGwFnEventCodes[]> = new BehaviorSubject<
        INgxGwFnEventCodes[]
    >(null);
    eventCodes$: Observable<INgxGwFnEventCodes[]> = this.eventCodes.asObservable();

    constructor() {}

    submitToStream(fn: (...args) => void | any, fnType: string, fnData?: any | any[]) {
        const fnName = fn.name;
        const fnClass = fn.constructor.name;
        const fnCode = this.getEventCode(fnName);
        let fnDescription = [fnClass, fnName].join('.');
        if (fnType.toLowerCase() === 'before') {
            fnDescription = ['Beginning', fnDescription].join(' ');
        } else if (fnType.toLowerCase() === 'after') {
            fnDescription = ['Completing', fnDescription].join(' ');
        } else if (fnType.toLowerCase() === 'error') {
            fnDescription = ['Error:', fnDescription].join(' ');
        } else if (fnType.toLowerCase() === 'redo') {
            fnDescription = ['Re-executing', fnDescription].join(' ');
        } else {
            fnDescription = [fnType, fnDescription].join(' ');
        }
        this.eventStream.next({
            eventFn: fnName,
            eventCode: fnCode,
            eventType: fnType,
            eventDescription: fnDescription,
            eventData: fnData ? fnData : null,
        });
    }

    getEventCode(fnName: string): number {
        const currentCodes =
            this.eventCodes.value !== null ? this.eventCodes.value : ([] as INgxGwFnEventCodes[]);
        if (currentCodes.length > 0) {
            const eventCode = currentCodes.find(
                eCode => eCode.fnName.toLowerCase() === fnName.toLowerCase(),
            );
            if (eventCode) {
                return eventCode.code;
            }
            const maxCode: number = Math.max.apply(
                Math,
                currentCodes.map(eCode => eCode.code),
            );
            currentCodes.push({
                fnName,
                code: maxCode + 1,
            });
            this.eventCodes.next(currentCodes);
            return this.getEventCode(fnName);
        } else {
            currentCodes.push({
                fnName,
                code: 1,
            });
            this.eventCodes.next(currentCodes);
            return this.getEventCode(fnName);
        }
    }
}
