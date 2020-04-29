/**
 * Explanation of fields
 *
 * EventFn - The function name of the event
 * EventType - Helps determin the description of the event, current expected values:
 *             Before, After, Error, Redo, and there's a spot for others
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
