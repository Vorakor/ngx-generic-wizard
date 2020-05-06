import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, shareReplay, take } from 'rxjs/operators';

import {
    INgxGwConfig,
    INgxGwLogs,
    INgxGwStep,
    INgxGwStepStatus,
    INgxGwStepStatusMap,
} from './interfaces';
import { NgxGwEventStreamService } from './ngx-gw-event-stream.service';

@Injectable({
    providedIn: 'root',
})
export class NgxGenericWizardService {
    /**
     * Model based behavior subjects and observables
     */
    private ngxGwConfig: BehaviorSubject<INgxGwConfig> = new BehaviorSubject<INgxGwConfig>(null);
    ngxGwConfig$: Observable<INgxGwConfig> = this.ngxGwConfig.asObservable();

    private ngxGwSteps: BehaviorSubject<INgxGwStep[]> = new BehaviorSubject<INgxGwStep[]>([]);
    ngxGwSteps$: Observable<INgxGwStep[]> = this.ngxGwSteps.asObservable();

    private ngxGwStepStatusMap: BehaviorSubject<INgxGwStepStatusMap> = new BehaviorSubject<
        INgxGwStepStatusMap
    >(null);
    ngxGwStepStatusMap$: Observable<INgxGwStepStatusMap> = this.ngxGwStepStatusMap.asObservable();

    // Part of admin type pages and functionality that will be built later
    private ngxGwStepLogs: BehaviorSubject<INgxGwLogs[]> = new BehaviorSubject<INgxGwLogs[]>([]);
    ngxGwStepLogs$: Observable<INgxGwLogs[]> = this.ngxGwStepLogs.asObservable();

    /**
     * Functionality based behavior subjects and observables
     */
    private initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    initialized$: Observable<boolean> = this.initialized.asObservable();
    private finalized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    finalized$: Observable<boolean> = this.finalized.asObservable();

    constructor(private router: Router, private eventStream: NgxGwEventStreamService) {}

    /**
     * This sets up the wizard and gets everything ready to use.
     *
     * We need the user to pass in the config, steps, and status map, as well as whether or not all necessary
     * data is loaded for the wizard to use and the current step we need to start on.
     *
     * The statusMap is because whomever is using this wizard may not necessarily insert the four statuses in
     * the same order or with the same naming and such that the wizard could be hard-coded to expect, so
     * instead, give it a map so it will set the statuses correctly for each step.
     */
    initialize(
        config: INgxGwConfig,
        steps: INgxGwStep[],
        statusMap: INgxGwStepStatusMap,
        externalLoaded$: Observable<boolean>,
        externalCurrentStep$: Observable<INgxGwStep>,
    ) {
        this.eventStream.submitToStream(this.initialize, 'Before');
        // Not supposed to watch these observables, just take the latest and move on.
        externalLoaded$
            .pipe(
                filter(loaded => loaded !== null),
                distinctUntilChanged(),
                shareReplay({ refCount: true, bufferSize: 1 }),
                take(1),
            )
            .subscribe(loaded => {
                if (!loaded) {
                    this.eventStream.submitToStream(this.initialize, 'Error', {
                        config,
                        steps,
                        statusMap,
                        externalLoaded: loaded,
                    });
                    throw new Error(
                        'Cannot initialize wizard when necessary data has not been loaded',
                    );
                }
            });
        this.setGwConfig(config);
        this.setGwStepStatusMap(statusMap);
        externalCurrentStep$
            .pipe(
                filter(step => step !== null && Object.keys(step).length > 0),
                distinctUntilChanged(),
                shareReplay({ refCount: true, bufferSize: 1 }),
                take(1),
            )
            .subscribe(step => {
                if (step.status.statusId !== statusMap.current.statusId) {
                    step.status = statusMap.current;
                }
                const prevSteps = steps.filter(st => st.stepOrder < step.stepOrder);
                prevSteps.map(st => (st.status = statusMap.complete));
                const nextSteps = steps.filter(st => st.stepOrder > step.stepOrder);
                nextSteps.map(st => (st.status = statusMap.initial));
                this.setGwSteps([...prevSteps, step, ...nextSteps]);
                this.initialized.next(true);
            });
        this.eventStream.submitToStream(this.initialize, 'After', {
            config,
            steps,
            statusMap,
        });
        return;
    }

    quickStart(config: INgxGwConfig, steps: INgxGwStep[], statusMap: INgxGwStepStatusMap) {
        this.eventStream.submitToStream(this.quickStart, 'Before');
        this.setGwConfig(config);
        this.setGwStepStatusMap(statusMap);
        this.setGwSteps(steps);
        this.eventStream.submitToStream(this.quickStart, 'After', {
            config,
            steps,
            statusMap,
        });
    }

    setGwConfig(config: INgxGwConfig) {
        this.eventStream.submitToStream(this.setGwConfig, 'Before');
        this.ngxGwConfig.next(config);
        this.eventStream.submitToStream(this.setGwConfig, 'After', config);
        return;
    }

    setGwSteps(steps: INgxGwStep[]) {
        this.eventStream.submitToStream(this.setGwSteps, 'Before');
        steps.sort((a, b) => a.stepOrder - b.stepOrder);
        this.ngxGwSteps.next(steps);
        this.eventStream.submitToStream(this.setGwSteps, 'After', steps);
        return;
    }

    setGwStepStatusMap(statusMap: INgxGwStepStatusMap) {
        this.eventStream.submitToStream(this.setGwStepStatusMap, 'Before');
        this.ngxGwStepStatusMap.next(statusMap);
        this.eventStream.submitToStream(this.setGwStepStatusMap, 'After', statusMap);
        return;
    }

    setCurrentStep(step: INgxGwStep, steps?: INgxGwStep[], statusMap?: INgxGwStepStatusMap) {
        this.eventStream.submitToStream(this.setCurrentStep, 'Before');
        if (this.ngxGwSteps.value.length > 0 && this.ngxGwStepStatusMap) {
            const gwSteps = this.ngxGwSteps.value;
            gwSteps.find(
                gwStep => gwStep.stepId === step.stepId,
            ).status = this.ngxGwStepStatusMap.value.current;
            this.setGwSteps(gwSteps);
        } else {
            // Not initialized which could mean we're trying to run from external module
            if (steps.length > 0 && statusMap) {
                this.setGwSteps(steps);
                this.setGwStepStatusMap(statusMap);
                this.eventStream.submitToStream(this.setCurrentStep, 'Redo', { steps, statusMap });
                return this.setCurrentStep(step);
            } else {
                this.eventStream.submitToStream(this.setCurrentStep, 'Error', {
                    step,
                    steps: steps ? steps : null,
                    statusMap: statusMap ? statusMap : null,
                });
                throw new Error('Cannot set current step! No data initialized or passed in.');
            }
        }
        this.eventStream.submitToStream(this.setCurrentStep, 'After', {
            step,
        });
    }

    setStepStatus(
        step: INgxGwStep,
        status: INgxGwStepStatus,
        steps?: INgxGwStep[],
        statusMap?: INgxGwStepStatusMap,
    ) {
        this.eventStream.submitToStream(this.setStepStatus, 'Before');
        if (this.ngxGwSteps.value.length > 0 && this.ngxGwStepStatusMap.value) {
            const gwSteps = this.ngxGwSteps.value;
            gwSteps.find(gwStep => gwStep.stepId === step.stepId).status = status;
            this.setGwSteps(gwSteps);
        } else {
            if (steps.length > 0 && statusMap) {
                this.setGwSteps(steps);
                this.setGwStepStatusMap(statusMap);
                this.eventStream.submitToStream(this.setStepStatus, 'Redo', { steps, statusMap });
                return this.setStepStatus(step, status);
            } else {
                this.eventStream.submitToStream(this.setStepStatus, 'Error', {
                    step,
                    status,
                    steps: steps ? steps : null,
                    statusMap: statusMap ? statusMap : null,
                });
                throw new Error('Cannot set step status! No data initialized or passed in.');
            }
        }
        this.eventStream.submitToStream(this.setStepStatus, 'After', {
            step,
            status,
        });
    }

    /**
     * This function adds a step to the wizard
     */
    addStep(step: INgxGwStep, steps?: INgxGwStep[]) {
        this.eventStream.submitToStream(this.addStep, 'Before');
        if (this.initialized.value) {
            const gwSteps = this.ngxGwSteps.value;
            const same = gwSteps.find(singlestep => singlestep.stepOrder === step.stepOrder);
            if (same) {
                // Add new step before same step
                const after = gwSteps.filter(singlestep => singlestep.stepOrder > same.stepOrder);
                const increment = this.determineStepOrderIncrement(gwSteps);
                same.stepOrder = same.stepOrder + increment;
                after.map(a => (a.stepOrder = a.stepOrder + increment));
                const newGwSteps = [
                    ...gwSteps.filter(singlestep => singlestep.stepOrder < same.stepOrder),
                    step,
                    same,
                    ...after,
                ];
                this.eventStream.submitToStream(this.addStep, 'After', { steps: newGwSteps });
                this.setGwSteps(newGwSteps);
            } else {
                gwSteps.push(step); // We can just add it to the array because we can simply run a sort to put them in the right order
                this.eventStream.submitToStream(this.addStep, 'After', { steps: gwSteps });
                this.setGwSteps(gwSteps);
            }
        } else {
            if (steps && steps.length > 0) {
                const same = steps.find(singlestep => singlestep.stepOrder === step.stepOrder);
                if (same) {
                    // Add new step before same step
                    const after = steps.filter(singlestep => singlestep.stepOrder > same.stepOrder);
                    const increment = this.determineStepOrderIncrement(steps);
                    same.stepOrder = same.stepOrder + increment;
                    after.map(a => (a.stepOrder = a.stepOrder + increment));
                    const newGwSteps = [
                        ...steps.filter(singlestep => singlestep.stepOrder < same.stepOrder),
                        step,
                        same,
                        ...after,
                    ];
                    this.eventStream.submitToStream(this.addStep, 'After', { steps: newGwSteps });
                    this.setGwSteps(newGwSteps);
                    return newGwSteps.sort((a, b) =>
                        a.stepOrder > b.stepOrder
                            ? a.stepOrder - b.stepOrder
                            : b.stepOrder - a.stepOrder,
                    );
                } else {
                    steps.push(step);
                    steps.sort((a, b) =>
                        a.stepOrder > b.stepOrder
                            ? a.stepOrder - b.stepOrder
                            : b.stepOrder - a.stepOrder,
                    );
                    this.eventStream.submitToStream(this.addStep, 'After', {
                        steps: steps ? steps : null,
                    });
                    this.setGwSteps(steps);
                    return steps;
                }
            } else {
                this.eventStream.submitToStream(this.addStep, 'Error', {
                    step,
                    steps: steps ? steps : null,
                });
                throw new Error(
                    'Cannot add step to wizard! Wizard not initialized or no data passed in to operate on!',
                );
            }
        }
    }

    /**
     * This function adds multiple steps to the wizard
     */
    addSteps(steps: INgxGwStep[], originalSteps?: INgxGwStep[]) {
        this.eventStream.submitToStream(this.addSteps, 'Before');
        if (this.initialized.value) {
            steps.forEach(step => {
                this.addStep(step);
            });
            this.eventStream.submitToStream(this.addSteps, 'After');
            return;
        } else {
            if (originalSteps && originalSteps.length > 0) {
                steps.forEach(step => {
                    originalSteps = this.addStep(step, originalSteps);
                });
                this.eventStream.submitToStream(this.addSteps, 'After');
                return originalSteps;
            } else {
                this.eventStream.submitToStream(this.addSteps, 'Error');
                throw new Error(
                    'Cannot add steps to wizard! Wizard not initialized or no data passed in to operate on!',
                );
            }
        }
    }

    /**
     * This function removes a step from the wizard.
     */
    removeStep(step: INgxGwStep, steps?: INgxGwStep[]) {
        this.eventStream.submitToStream(this.removeStep, 'Before');
        if (this.initialized.value) {
            const gwSteps = this.ngxGwSteps.value;
            const increment = this.determineStepOrderIncrement(gwSteps);
            const after = gwSteps.filter(singlestep => singlestep.stepOrder > step.stepOrder);
            after.map(a => (a.stepOrder = a.stepOrder - increment));
            const newGwSteps = [
                ...gwSteps.filter(singlestep => singlestep.stepOrder < step.stepOrder),
                ...after,
            ];
            this.eventStream.submitToStream(this.removeStep, 'After', { steps: newGwSteps });
            this.setGwSteps(newGwSteps);
        } else {
            if (steps && steps.length > 0) {
                const increment = this.determineStepOrderIncrement(steps);
                const after = steps.filter(singlestep => singlestep.stepOrder > step.stepOrder);
                after.map(a => (a.stepOrder = a.stepOrder - increment));
                const newGwSteps = [
                    ...steps.filter(singlestep => singlestep.stepOrder < step.stepOrder),
                    ...after,
                ];
                this.eventStream.submitToStream(this.removeStep, 'After', { steps: newGwSteps });
                this.setGwSteps(newGwSteps);
                return newGwSteps.sort((a, b) =>
                    a.stepOrder > b.stepOrder
                        ? a.stepOrder - b.stepOrder
                        : b.stepOrder - a.stepOrder,
                );
            } else {
                this.eventStream.submitToStream(this.removeStep, 'Error');
                throw new Error(
                    'Cannot remove step from wizard! Wizard not initialized or no data passed in to operate on!',
                );
            }
        }
    }

    /**
     * This function removes multiple steps from the wizard.
     */
    removeSteps(steps: INgxGwStep[], originalSteps?: INgxGwStep[]) {
        this.eventStream.submitToStream(this.removeSteps, 'Before');
        if (this.initialized.value) {
            steps.forEach(step => {
                this.removeStep(step);
            });
            this.eventStream.submitToStream(this.removeSteps, 'After');
            return;
        } else {
            if (originalSteps && originalSteps.length > 0) {
                steps.forEach(step => {
                    originalSteps = this.removeStep(step, originalSteps);
                });
                this.eventStream.submitToStream(this.removeSteps, 'After');
                return originalSteps;
            } else {
                this.eventStream.submitToStream(this.removeSteps, 'Error');
                throw new Error(
                    'Cannot remove steps from wizard! Wizard not initialized or no data passed in to operate on!',
                );
            }
        }
    }

    /**
     * This function advances our UI to the next step of the wizard assuming that the previous step was
     * completed successfully.
     *
     * PrevCompleted - was the previous step completed?
     *
     * Passing in the config here as optional parameter in case we need to grab that finalize URL
     */
    next(
        prevCompleted: boolean = true,
        steps?: INgxGwStep[],
        statusMap?: INgxGwStepStatusMap,
        config?: INgxGwConfig,
    ) {
        this.eventStream.submitToStream(this.next, 'Before');
        if (
            this.ngxGwConfig.value &&
            this.ngxGwSteps.value.length > 0 &&
            this.ngxGwStepStatusMap.value
        ) {
            const gwSteps = this.ngxGwSteps.value;
            const maxOrder = this.getMaxOrder(gwSteps);
            const currentStep = gwSteps.find(
                step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
            );
            if (currentStep.stepOrder === maxOrder) {
                if (this.finalized.value) {
                    gwSteps.find(
                        step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                    ).status = this.ngxGwStepStatusMap.value.complete;
                    this.setGwSteps(gwSteps);
                    this.eventStream.submitToStream(this.next, 'After', {
                        gwSteps,
                        finalizeUrl: this.ngxGwConfig.value.finalizeUrl,
                    });
                    this.router.navigate([this.ngxGwConfig.value.finalizeUrl]);
                } else {
                    if (prevCompleted) {
                        gwSteps.find(
                            step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                        ).status = this.ngxGwStepStatusMap.value.complete;
                    } else {
                        gwSteps.find(
                            step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                        ).status = this.ngxGwStepStatusMap.value.incomplete;
                    }
                    this.setGwSteps(gwSteps);
                    this.finalized.next(true);
                    this.eventStream.submitToStream(this.next, 'After', {
                        gwSteps,
                        finalizeUrl: this.ngxGwConfig.value.finalizeUrl,
                    });
                    this.router.navigate([this.ngxGwConfig.value.finalizeUrl]);
                }
            } else {
                const nextSteps = gwSteps.filter(step => step.stepOrder > currentStep.stepOrder);
                const minOrder = this.getMinOrder(nextSteps);
                if (this.finalized.value) {
                    gwSteps.find(
                        step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                    ).status = this.ngxGwStepStatusMap.value.complete;
                    gwSteps.find(
                        step => step.stepOrder === minOrder,
                    ).status = this.ngxGwStepStatusMap.value.current;
                    this.setGwSteps(gwSteps);
                    const nextStep = gwSteps.find(
                        step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                    );
                    this.eventStream.submitToStream(this.next, 'After', { gwSteps, nextStep });
                    this.navigateToStep(nextStep, true);
                } else {
                    if (prevCompleted) {
                        gwSteps.find(
                            step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                        ).status = this.ngxGwStepStatusMap.value.complete;
                        gwSteps.find(
                            step => step.stepOrder === minOrder,
                        ).status = this.ngxGwStepStatusMap.value.current;
                        this.setGwSteps(gwSteps);
                        const nextStep = gwSteps.find(
                            step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                        );
                        this.eventStream.submitToStream(this.next, 'After', { gwSteps, nextStep });
                        this.navigateToStep(nextStep, true);
                    } else {
                        gwSteps.find(
                            step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                        ).status = this.ngxGwStepStatusMap.value.incomplete;
                        gwSteps.find(
                            step => step.stepOrder === minOrder,
                        ).status = this.ngxGwStepStatusMap.value.current;
                        this.setGwSteps(gwSteps);
                        const nextStep = gwSteps.find(
                            step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                        );
                        this.eventStream.submitToStream(this.next, 'After', { gwSteps, nextStep });
                        this.navigateToStep(nextStep, true);
                    }
                }
            }
        } else {
            if (
                steps &&
                steps.length > 0 &&
                statusMap &&
                config &&
                Object.keys(config).length > 0
            ) {
                this.setGwConfig(config);
                this.setGwSteps(steps);
                this.setGwStepStatusMap(statusMap);
                this.eventStream.submitToStream(this.next, 'Redo', { config, steps, statusMap });
                return this.next(prevCompleted);
            } else {
                this.eventStream.submitToStream(this.next, 'Error', steps);
                throw new Error(
                    'Cannot move to next step in wizard! Wizard not initialized or no data passed in to operate on!',
                );
            }
        }
    }

    /**
     * This function advances our UI to the previous step of the wizard, assuming that the previous step
     * was not completed
     */
    prev(
        nextCompleted: boolean = false,
        steps?: INgxGwStep[],
        statusMap?: INgxGwStepStatusMap,
        config?: INgxGwConfig,
    ) {
        this.eventStream.submitToStream(this.prev, 'Before');
        if (this.ngxGwSteps.value.length > 0 && this.ngxGwStepStatusMap.value) {
            const gwSteps = this.ngxGwSteps.value;
            const currentStep = gwSteps.find(
                step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
            );
            const minOrder = this.getMinOrder(gwSteps);
            if (currentStep.stepOrder === minOrder) {
                this.eventStream.submitToStream(this.prev, 'After', { gwSteps, currentStep });
                this.navigateToStep(currentStep, true);
            } else {
                const prevSteps = gwSteps.filter(step => step.stepOrder < currentStep.stepOrder);
                const maxOrder = this.getMaxOrder(prevSteps);
                if (nextCompleted) {
                    gwSteps.find(
                        step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                    ).status = this.ngxGwStepStatusMap.value.complete;
                    gwSteps.find(
                        step => step.stepOrder === maxOrder,
                    ).status = this.ngxGwStepStatusMap.value.current;
                    this.setGwSteps(gwSteps);
                    const prevStep = gwSteps.find(
                        step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                    );
                    this.eventStream.submitToStream(this.prev, 'After', {
                        gwSteps,
                        currentStep,
                        prevStep,
                    });
                    this.navigateToStep(prevStep, true);
                } else {
                    gwSteps.find(
                        step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                    ).status = this.ngxGwStepStatusMap.value.incomplete;
                    gwSteps.find(
                        step => step.stepOrder === maxOrder,
                    ).status = this.ngxGwStepStatusMap.value.current;
                    this.setGwSteps(gwSteps);
                    const prevStep = gwSteps.find(
                        step => step.status.code === this.ngxGwStepStatusMap.value.current.code,
                    );
                    this.eventStream.submitToStream(this.prev, 'After', {
                        gwSteps,
                        currentStep,
                        prevStep,
                    });
                    this.navigateToStep(prevStep, true);
                }
            }
        } else {
            if (
                steps &&
                steps.length > 0 &&
                statusMap &&
                config &&
                Object.keys(config).length > 0
            ) {
                this.setGwConfig(config);
                this.setGwSteps(steps);
                this.setGwStepStatusMap(statusMap);
                this.eventStream.submitToStream(this.next, 'Redo', { steps, statusMap });
                return this.prev(nextCompleted);
            } else {
                this.eventStream.submitToStream(this.prev, 'Error');
                throw new Error(
                    'Cannot move to previous step in wizard! Wizard not initialized or no data passed in to operate on!',
                );
            }
        }
    }

    /**
     * This function is meant to route to the step that we've selected.
     *
     * Set navForward to true on steps that we click on that are labeled as incomplete as
     * long as their step order is greater than the current step.
     *
     * If next is true, then another function will have already set the statuses, so there's
     * no need for this function to set them.
     */
    navigateToStep(
        step: INgxGwStep,
        next: boolean = false,
        navForward: boolean = false,
        config?: INgxGwConfig,
    ) {
        this.eventStream.submitToStream(this.navigateToStep, 'Before');
        let requestedUrl = this.router.routerState.snapshot.url;
        let finalizeUrl = '';
        let baseUrl = '';
        if (this.initialized.value) {
            finalizeUrl = this.ngxGwConfig.value.finalizeUrl;
            baseUrl = this.ngxGwConfig.value.baseUrl;
        } else {
            if (config && Object.keys(config).length > 0) {
                finalizeUrl = config.finalizeUrl;
                baseUrl = config.baseUrl;
            } else {
                this.eventStream.submitToStream(this.navigateToStep, 'Error', {
                    step,
                    next,
                    navForward,
                });
                throw new Error(
                    'Cannot navigate to step in wizard! Wizard not initialized or no data passed in to operate on!',
                );
            }
        }
        if (requestedUrl.startsWith('/')) {
            if (!finalizeUrl.startsWith('/')) {
                requestedUrl = requestedUrl.substr(1);
            }
        }
        // If ignoreIncomplete == false and if router.url requested is == finalizeUrl, redirect to finalizeUrl.
        if (step && Object.keys(step).length > 0) {
            if (!next) {
                this.setStepsStatuses(step, navForward);
            }
            const stepUrl = step.stepUrl;
            if (requestedUrl !== finalizeUrl) {
                this.eventStream.submitToStream(this.navigateToStep, 'After', {
                    url: [baseUrl, stepUrl].join('/'),
                });
                this.router.navigate([baseUrl, stepUrl]);
            } else {
                const currentStepUrl = [baseUrl, stepUrl].join('/');
                this.eventStream.submitToStream(this.navigateToStep, 'After', {
                    url: currentStepUrl,
                });
                this.router.navigate([currentStepUrl]);
            }
        } else {
            this.eventStream.submitToStream(this.navigateToStep, 'Error', {
                step,
                next,
                navForward,
                config: config ? config : this.ngxGwConfig,
            });
            throw new Error(
                'Cannot navigate to step in wizard! Wizard not initialized or no data passed in to operate on!',
            );
        }
    }

    /**
     * Given the next step we're planning to advance to, this takes care of setting the status for the previous step and the new current
     *
     * PrevComplete will default to true and should be true if we're advancing due to clicking the 'next'
     * button, there are other conditions where this will be true too though.
     *
     * In this function, we're expecting that nextStep is meant to be the current step, so we're
     * acting accordingly and setting next step's status to current, while adjusting the previous
     * step's status to either complete or incomplete.
     */
    setStepsStatuses(
        currentStep: INgxGwStep,
        prevComplete: boolean = true,
        steps?: INgxGwStep[],
        statusMap?: INgxGwStepStatusMap,
    ) {
        this.eventStream.submitToStream(this.setStepsStatuses, 'Before');
        if (this.ngxGwSteps.value.length > 0 && this.ngxGwStepStatusMap.value) {
            const minOrder = this.getMinOrder(this.ngxGwSteps.value);
            let prevStep = this.ngxGwSteps.value.find(
                step => step.status.statusId === this.ngxGwStepStatusMap.value.current.statusId,
            );
            let otherSteps: INgxGwStep[];
            if (!prevStep) {
                if (currentStep.stepOrder !== minOrder) {
                    otherSteps = this.ngxGwSteps.value.filter(
                        step => step.stepOrder < currentStep.stepOrder,
                    );
                    const maxOrder = this.getMaxOrder(otherSteps);
                    prevStep = otherSteps.find(step => step.stepOrder === maxOrder);
                    otherSteps = this.ngxGwSteps.value.filter(
                        step =>
                            step.stepId !== prevStep.stepId && step.stepId !== currentStep.stepId,
                    );
                    if (prevComplete) {
                        prevStep.status = this.ngxGwStepStatusMap.value.complete;
                        otherSteps.push(prevStep);
                    } else {
                        prevStep.status = this.ngxGwStepStatusMap.value.incomplete;
                        otherSteps.push(prevStep);
                    }
                } else {
                    otherSteps = this.ngxGwSteps.value.filter(
                        step => step.stepId !== currentStep.stepId,
                    ); // Do not change any statuses
                }
            } else {
                otherSteps = this.ngxGwSteps.value.filter(
                    step => step.stepId !== prevStep.stepId && step.stepId !== currentStep.stepId,
                ); // Only previous step's status will be changed
                if (prevComplete) {
                    prevStep.status = this.ngxGwStepStatusMap.value.complete;
                    otherSteps.push(prevStep);
                } else {
                    prevStep.status = this.ngxGwStepStatusMap.value.incomplete;
                    otherSteps.push(prevStep);
                }
            }
            if (currentStep.status.statusId !== this.ngxGwStepStatusMap.value.current.statusId) {
                currentStep.status = this.ngxGwStepStatusMap.value.current;
            }
            const allSteps = [currentStep, ...otherSteps].sort((a, b) => a.stepOrder - b.stepOrder);
            this.eventStream.submitToStream(this.setStepsStatuses, 'After', { steps: allSteps });
            this.setGwSteps(allSteps);
        } else {
            if (steps && steps.length > 0 && statusMap) {
                this.setGwSteps(steps);
                this.setGwStepStatusMap(statusMap);
                this.eventStream.submitToStream(this.setStepsStatuses, 'Redo', {
                    steps,
                    statusMap,
                });
                return this.setStepsStatuses(currentStep, prevComplete);
            } else {
                this.eventStream.submitToStream(this.setStepsStatuses, 'Error', {
                    currentStep,
                    prevComplete,
                });
                throw new Error(
                    'Cannot set status for steps! Wizard not initialized or no data passed in to operate on!',
                );
            }
        }
    }

    /**
     * This function let's us go back into the wizard after we've completed it.
     *
     * It will by default go to the last completed step
     */
    resetFinalized(steps?: INgxGwStep[], statusMap?: INgxGwStepStatusMap, config?: INgxGwConfig) {
        this.eventStream.submitToStream(this.resetFinalized, 'Before');
        if (this.ngxGwSteps.value.length > 0 && this.ngxGwStepStatusMap.value) {
            this.finalized.next(false);
            const gwSteps = this.ngxGwSteps.value;
            const maxOrder = this.getMaxOrder(gwSteps);
            const current = gwSteps.find(step => step.stepOrder === maxOrder);
            gwSteps.filter(
                step => step.stepOrder === maxOrder,
            )[0].status = this.ngxGwStepStatusMap.value.current;
            this.setGwSteps(gwSteps);
            this.eventStream.submitToStream(this.resetFinalized, 'After', {
                steps: gwSteps,
                current,
                maxOrder,
            });
            this.navigateToStep(current, true);
        } else {
            if (
                steps &&
                steps.length > 0 &&
                statusMap &&
                config &&
                Object.keys(config).length > 0
            ) {
                this.setGwConfig(config);
                this.setGwSteps(steps);
                this.setGwStepStatusMap(statusMap);
                this.eventStream.submitToStream(this.resetFinalized, 'Redo', { steps });
                return this.resetFinalized();
            } else {
                this.eventStream.submitToStream(this.resetFinalized, 'Error', {
                    steps: steps ? steps : null,
                });
                throw new Error(
                    'Cannot reset finalized! Wizard not initialized or no data passed in to operate on!',
                );
            }
        }
    }

    /**
     * This completely resets the wizard, then delivers us to the first step
     */
    resetWizard(steps?: INgxGwStep[], statusMap?: INgxGwStepStatusMap, config?: INgxGwConfig) {
        this.eventStream.submitToStream(this.resetWizard, 'Before');
        if (this.ngxGwSteps.value.length > 0 && this.ngxGwStepStatusMap.value) {
            this.finalized.next(false);
            const gwSteps = this.ngxGwSteps.value;
            const minOrder = this.getMinOrder(gwSteps);
            const current = gwSteps.find(step => step.stepOrder === minOrder);
            gwSteps.filter(
                step => step.stepOrder === minOrder,
            )[0].status = this.ngxGwStepStatusMap.value.current;
            gwSteps
                .filter(step => step.stepOrder > minOrder)
                .map(step => (step.status = this.ngxGwStepStatusMap.value.initial));
            this.setGwSteps(gwSteps);
            this.eventStream.submitToStream(this.resetWizard, 'After', {
                steps: this.ngxGwSteps.value,
                current,
                minOrder,
            });
            this.navigateToStep(current, true);
        } else {
            if (
                steps &&
                steps.length > 0 &&
                statusMap &&
                config &&
                Object.keys(config).length > 0
            ) {
                this.setGwConfig(config);
                this.setGwSteps(steps);
                this.setGwStepStatusMap(statusMap);
                this.eventStream.submitToStream(this.resetWizard, 'Redo', { steps });
                return this.resetWizard();
            } else {
                this.eventStream.submitToStream(this.resetWizard, 'Error', {
                    steps: steps ? steps : null,
                });
                throw new Error(
                    'Cannot reset wizard! Wizard not initialized or no data passed in to operate on!',
                );
            }
        }
    }

    getMinOrder(steps: INgxGwStep[]): number {
        if (steps && steps.length > 0) {
            return Math.min.apply(
                Math,
                steps.map(step => step.stepOrder),
            );
        } else {
            throw new Error(
                'Cannot find minimum step order! Wizard not initialized or no data passed in to operate on!',
            );
        }
    }

    getMaxOrder(steps: INgxGwStep[]): number {
        if (steps && steps.length > 0) {
            return Math.max.apply(
                Math,
                steps.map(step => step.stepOrder),
            );
        } else {
            throw new Error(
                'Cannot find maximum step order! Wizard not initialized or no data passed in to operate on!',
            );
        }
    }

    getStepCount(stepOrder: number, steps?: INgxGwStep[]) {
        let stepCount = 0;
        if (this.ngxGwSteps.value.length > 0) {
            for (const step of this.ngxGwSteps.value) {
                stepCount++;
                if (step.stepOrder === stepOrder) {
                    break;
                }
            }
        } else {
            if (steps && steps.length > 0) {
                this.setGwSteps(steps);
                return this.getStepCount(stepOrder);
            } else {
                throw new Error(
                    'Cannot find step count! Wizard not initialized or no data passed in to operate on!',
                );
            }
        }
        return stepCount;
    }

    /**
     * This simply determines the amount of incrementation between step orders
     * @param steps: INgxGwStep[]
     */
    determineStepOrderIncrement(steps: INgxGwStep[]) {
        const stepOrders = steps
            .map(step => step.stepOrder)
            .sort((a, b) => (a > b ? a - b : b - a));
        const diff = [];
        for (let i = 1; i < stepOrders.length; i++) {
            diff.push(stepOrders[i] - stepOrders[i - 1]);
        }
        let sum = 0;
        diff.forEach(d => (sum += parseInt(d, 10)));
        return sum / steps.length;
    }
}
