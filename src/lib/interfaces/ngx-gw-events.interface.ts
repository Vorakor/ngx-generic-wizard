/**
 * Explanation of fields
 *
 * Event - The title of the event, should be prefixed with Before, After, or On
 * EventDescription - An actual description of what is firing
 * EventCode - A useful integer value to assist in tracking what was or is firing, constructors will always be code 1
 * EventData - Data that may come with the event being fired
 */
export interface INgxGwEvents {
    eventFn: string;
    eventType: string;
    eventDescription?: string;
    eventCode: number;
    eventData?: any | any[];
}

export interface INgxGwFnEventCodes {
    fnName: string;
    code: number;
}
