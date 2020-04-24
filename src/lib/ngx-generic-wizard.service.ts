import { Injectable } from '@angular/core';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import {
    INgxGwStep,
    NgxGwStep,
    INgxGwConfig,
    NgxGwConfig,
    INgxGwStepStatusMap,
    INgxGwColorScheme,
    INgxGwStepStatus,
} from './interfaces';
import { distinctUntilChanged, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class NgxGenericWizardService {
    /**
     * Model based behavior subjects and observables
     */
    private ngxGwColorSchemes: BehaviorSubject<INgxGwColorScheme[]> = new BehaviorSubject<
        INgxGwColorScheme[]
    >(null);
    ngxGwColorSchemes$: Observable<INgxGwColorScheme[]> = this.ngxGwColorSchemes.asObservable();
    private ngxGwConfigs: BehaviorSubject<INgxGwConfig[]> = new BehaviorSubject<INgxGwConfig[]>(
        null,
    );
    ngxGwConfigs$: Observable<INgxGwConfig[]> = this.ngxGwConfigs.asObservable();
    // Part of admin type pages and functionality that will be built later
    // private ngxGwConfigHistory: BehaviorSubject<
    //   NgxGwConfigHistory[]
    // > = new BehaviorSubject<NgxGwConfigHistory[]>(null);
    // ngxGwConfigHistory$: Observable<
    //   NgxGwConfigHistory[]
    // > = this.ngxGwConfigHistory.asObservable();
    // private ngxGwLogs: BehaviorSubject<NgxGwLogs[]> = new BehaviorSubject<
    //   NgxGwLogs[]
    // >(null);
    // ngxGwLogs$: Observable<NgxGwLogs[]> = this.ngxGwLogs.asObservable();
    private ngxGwSteps: BehaviorSubject<INgxGwStep[]> = new BehaviorSubject<INgxGwStep[]>(null);
    ngxGwSteps$: Observable<INgxGwStep[]> = this.ngxGwSteps.asObservable();
    // Part of admin type pages and functionality that will be built later
    // private ngxGwStepsHistory: BehaviorSubject<
    //   NgxGwStepHistory[]
    // > = new BehaviorSubject<NgxGwStepHistory[]>(null);
    // ngxGwStepsHistory$: Observable<
    //   NgxGwStepHistory[]
    // > = this.ngxGwStepsHistory.asObservable();
    private wizardStepStatusMap: BehaviorSubject<INgxGwStepStatusMap> = new BehaviorSubject<
        INgxGwStepStatusMap
    >(null);
    wizardStepStatusMap$: Observable<INgxGwStepStatusMap> = this.wizardStepStatusMap.asObservable();

    /**
     * Functionality based behavior subjects and observables
     */
    private initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    initialized$: Observable<boolean> = this.initialized.asObservable();
    private finalized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    finalized$: Observable<boolean> = this.finalized.asObservable();
    subs: Subscription[] = [];
    constructor(private router: Router) {}

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
    initializeWizard(
        config: INgxGwConfig,
        steps: INgxGwStep[],
        statusMap: INgxGwStepStatusMap,
        externalDataLoaded$: Observable<boolean>,
        externalDataCurrentStep$: Observable<INgxGwStep>,
        colorScheme?: INgxGwColorScheme,
    ) {
        this.finalized.next(false);
        this.wizardStepStatusMap.next(statusMap);
        const exDaLoad = externalDataLoaded$
            .pipe(
                distinctUntilChanged(),
                filter(loaded => loaded !== null),
            )
            .subscribe(loaded => {
                if (!loaded) {
                    throw new Error(
                        'Cannot initialize wizard when external data has not been loaded',
                    );
                }
            });
        this.addSubscription(exDaLoad);
        const curStep = externalDataCurrentStep$
            .pipe(
                filter(step => step !== null),
                distinctUntilChanged(),
            )
            .subscribe(step => {
                steps.sort((a, b) => a.stepOrder - b.stepOrder);
                this.ngxGwSteps.next(steps);
                this.setCurrentStepStatuses(step, false);
                this.ngxGwConfigs.next([config]);
                this.initialized.next(true);
                if (colorScheme) {
                    this.setColorScheme(colorScheme.configId ? config : null);
                } else {
                    this.setDefaultColorScheme();
                }
                this.navigateToStep(step);
            });
        this.addSubscription(curStep);
        return;
    }

    /**
     * This function adds steps to either an existing configuration or adds the new configuration and the new
     * steps for said configuration.
     *
     * If config is null then we're expecting that the config is already in the list of configurations.
     */
    addSteps(steps: INgxGwStep[], config: INgxGwConfig = null) {
        const stepComp = new NgxGwStep();
        if (config) {
            const confComp = new NgxGwConfig();
            const configs = this.ngxGwConfigs.value;
            let addConfig = true;
            // Checking for duplicate configs here
            configs.forEach(conf => {
                if (confComp.Compare(config, conf)) {
                    addConfig = false;
                }
            });
            if (addConfig) {
                configs.push(config);
                this.ngxGwConfigs.next(configs);
            }
        } else {
            config = this.ngxGwConfigs.value.filter(conf => conf.configId === steps[0].configId)[0];
            if (!config) {
                throw new Error(
                    'No configuration defined or cannot find configuration for steps provided!',
                );
            }
        }
        const allSteps = this.ngxGwSteps.value;
        const currentConfigSteps = allSteps.filter(st => st.configId === config.configId);
        const otherSteps = allSteps.filter(st => st.configId !== config.configId);
        const addSteps: INgxGwStep[] = [];
        // Checking for duplicate steps here
        steps.forEach(step => {
            let addStep = true;
            currentConfigSteps.forEach(st => {
                if (stepComp.Compare(step, st)) {
                    addStep = false;
                }
            });
            if (addStep) {
                addSteps.push(step);
            }
        });
        if (addSteps.length > 0) {
            addSteps.forEach(step => {
                const dupStepOrder = currentConfigSteps.filter(
                    st => st.stepOrder === step.stepOrder,
                );
                if (dupStepOrder.length > 0) {
                    const nextStep = currentConfigSteps.filter(
                        st => st.stepOrder > step.stepOrder,
                    )[0];
                    step.stepOrder = (dupStepOrder[0].stepOrder + nextStep.stepOrder) / 2;
                }
                currentConfigSteps.push(step);
            });
        }
        this.ngxGwSteps.next([...otherSteps, ...currentConfigSteps]);
        return;
    }

    /**
     * This function removes steps from a configuration.
     *
     * We are not passing in a configuration here because we're expecting that the configuration is in the
     * list already, however, if we can't find a configuration... well, can't remove steps from a
     * configuration that isn't in the list in the first place.
     */
    removeSteps(steps: INgxGwStep[]) {
        const stepComp = new NgxGwStep();
        const allSteps = this.ngxGwSteps.value;
        const currentConfigSteps = allSteps.filter(st => st.configId === steps[0].configId);
        if (currentConfigSteps.length === 0) {
            throw new Error('Cannot remove steps from a configuration that does not exist');
        }
        const otherSteps = allSteps.filter(st => st.configId !== steps[0].configId);
        const newCurrentConfigSteps: INgxGwStep[] = [];
        currentConfigSteps.forEach(curStep => {
            let keepStep = true;
            steps.forEach(rmstep => {
                if (stepComp.Compare(rmstep, curStep)) {
                    keepStep = false;
                }
            });
            if (keepStep) {
                newCurrentConfigSteps.push(curStep);
            }
        });
        if (newCurrentConfigSteps.length > 0) {
            this.ngxGwSteps.next([...otherSteps, ...newCurrentConfigSteps]);
        } else {
            this.ngxGwSteps.next(otherSteps);
            const configId = steps[0].configId;
            const configs = this.ngxGwConfigs.value.filter(conf => conf.configId !== configId);
            this.ngxGwConfigs.next(configs);
        }
        return;
    }

    /**
     * This function advances our UI to the next step of the wizard assuming that the previous step was
     * completed successfully.
     *
     * We need to pass in the config here in case we have a couple wizards going.
     */
    next(config: INgxGwConfig) {
        const steps = this.ngxGwSteps.value.filter(step => step.configId === config.configId);
        const otherSteps = this.ngxGwSteps.value.filter(step => step.configId !== config.configId);
        const maxOrder: number = this.getMaxOrder(config);
        const currentStep = steps.filter(
            step => step.status.code === this.wizardStepStatusMap.value.current.code,
        )[0];
        if (currentStep.stepOrder === maxOrder) {
            steps.filter(
                step => step.status.code === this.wizardStepStatusMap.value.current.code,
            )[0].status = this.wizardStepStatusMap.value.complete;
            this.ngxGwSteps.next([...otherSteps, ...steps]);
            this.finalized.next(true);
            this.router.navigate([config.finalizeUrl]);
        } else {
            let minOrder: number;
            let nextStep: INgxGwStep;
            const incompSteps = steps.filter(
                step =>
                    step.status.code === this.wizardStepStatusMap.value.incomplete.code &&
                    step.stepOrder > currentStep.stepOrder,
            );
            if (incompSteps.length > 0) {
                minOrder = this.getMinOrder(null, incompSteps);
                nextStep = steps.filter(step => step.stepOrder === minOrder)[0];
            } else {
                const initSteps = steps.filter(
                    step =>
                        step.status.code === this.wizardStepStatusMap.value.initial.code &&
                        step.stepOrder > currentStep.stepOrder,
                );
                if (initSteps.length > 0) {
                    minOrder = this.getMinOrder(null, initSteps);
                    nextStep = steps.filter(step => step.stepOrder === minOrder)[0];
                } else {
                    const compSteps = steps.filter(
                        step =>
                            step.status.code === this.wizardStepStatusMap.value.complete.code &&
                            step.stepOrder > currentStep.stepOrder,
                    );
                    minOrder = this.getMinOrder(null, compSteps);
                    nextStep = steps.filter(step => step.stepOrder === minOrder)[0];
                }
            }
            this.setCurrentStepStatuses(nextStep);
            this.navigateToStep(nextStep, true);
        }
        return;
    }

    /**
     * This function advances our UI to the previous step of the wizard, assuming that the previous step
     * was not completed
     *
     * Again we have to pass in the config to determine which wizard we need to act on.
     */
    prev(config: INgxGwConfig) {
        const steps = this.ngxGwSteps.value.filter(step => step.configId === config.configId);
        const otherSteps = this.ngxGwSteps.value.filter(step => step.configId !== config.configId);
        const minOrder: number = this.getMinOrder(config.configId);
        const currentStep = steps.filter(
            step => step.status.code === this.wizardStepStatusMap.value.current.code,
        )[0];
        if (currentStep.stepOrder === minOrder) {
            // We cannot go beyond the first step of the process
            this.ngxGwSteps.next([...otherSteps, ...steps]);
        } else {
            let prevOrder: number;
            let nextStep: INgxGwStep;
            const incompSteps = steps.filter(
                step =>
                    step.status.code === this.wizardStepStatusMap.value.incomplete.code &&
                    step.stepOrder < currentStep.stepOrder,
            );
            if (incompSteps.length > 0) {
                prevOrder = this.getMaxOrder(null, incompSteps);
                nextStep = steps.filter(step => step.stepOrder === prevOrder)[0];
            } else {
                const compSteps = steps.filter(
                    step =>
                        step.status.code === this.wizardStepStatusMap.value.complete.code &&
                        step.stepOrder < currentStep.stepOrder,
                );
                prevOrder = this.getMaxOrder(null, compSteps);
                nextStep = steps.filter(step => step.stepOrder === prevOrder)[0];
            }
            this.navigateToStep(nextStep);
        }
        return;
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
        let requestedUrl = this.router.routerState.snapshot.url;
        const finalizeUrl =
            this.ngxGwConfigs.value.length > 0
                ? this.ngxGwConfigs.value.find(conf => conf.configId === step.configId).finalizeUrl
                : config.finalizeUrl;
        if (requestedUrl.startsWith('/')) {
            if (!finalizeUrl.startsWith('/')) {
                requestedUrl = requestedUrl.substr(1);
            }
        }
        // If ignoreIncomplete == false and if router.url requested is == finalizeUrl, redirect to finalizeUrl.
        if (step && Object.keys(step).length > 0) {
            if (!next && !navForward) {
                this.setCurrentStepStatuses(step, false);
            } else if (!next && navForward) {
                this.setCurrentStepStatuses(step, true);
            }
            const stepUrl = step.stepUrl;
            const baseUrl =
                this.ngxGwConfigs.value.length > 0
                    ? this.ngxGwConfigs.value.find(conf => conf.configId === step.configId).baseUrl
                    : config.baseUrl;
            if (requestedUrl !== finalizeUrl) {
                this.router.navigate([...baseUrl.split('/'), stepUrl]);
            } else {
                const currentStepUrl = [baseUrl, stepUrl].join('/');
                if (!this.finalized.value) {
                    this.router.navigate([currentStepUrl]);
                }
            }
        }
        return;
    }

    /**
     * Given the next step we're planning to advance to, this takes care of setting our steps' status.
     *
     * PrevComplete will default to true and should be true if we're advancing due to clicking the 'next'
     * button, there are other conditions where this will be true too though.
     *
     * In this function, we're expecting that nextStep is meant to be the current step, so we're
     * acting accordingly and setting next step's status to current, while adjusting the previous
     * step's status to either complete or incomplete.
     */
    setCurrentStepStatuses(nextStep: INgxGwStep, prevComplete: boolean = true) {
        if (nextStep && Object.keys(nextStep).length > 0) {
            const allSteps: INgxGwStep[] = this.ngxGwSteps.value ? this.ngxGwSteps.value : [];
            const otherSteps = allSteps.filter(ost => ost.configId !== nextStep.configId);
            const responseSteps = allSteps.filter(rst => rst.configId === nextStep.configId);
            const init = this.initialized$
                .pipe(
                    filter(initi => initi !== null),
                    distinctUntilChanged(),
                )
                .subscribe(initialized => {
                    responseSteps
                        .filter(st => st.stepOrder === nextStep.stepOrder)
                        .map(st => {
                            st.status = this.wizardStepStatusMap.value.current;
                        });
                    if (initialized) {
                        responseSteps
                            .filter(
                                st =>
                                    st.status === this.wizardStepStatusMap.value.current &&
                                    st.stepId !== nextStep.stepId,
                            )
                            .map(st => {
                                if (!prevComplete) {
                                    st.status = this.wizardStepStatusMap.value.incomplete;
                                } else {
                                    st.status = this.wizardStepStatusMap.value.complete;
                                }
                                return st;
                            });
                    } else {
                        responseSteps
                            .filter(st => st.stepOrder < nextStep.stepOrder)
                            .map(st => {
                                if (!prevComplete) {
                                    st.status = this.wizardStepStatusMap.value.incomplete;
                                } else {
                                    st.status = this.wizardStepStatusMap.value.complete;
                                }
                                return st;
                            });
                        responseSteps
                            .filter(st => st.stepOrder > nextStep.stepOrder)
                            .map(st => (st.status = this.wizardStepStatusMap.value.initial));
                    }
                });
            this.addSubscription(init);
            this.ngxGwSteps.next([...otherSteps, ...responseSteps]);
        }
        return;
    }

    /**
     * This function let's us go back into the wizard after we've completed it.
     *
     * We're passing in the config of the wizard we want to get back into.
     */
    resetFinalized(
        config: INgxGwConfig,
        reenter?: boolean,
        newCurrent?: INgxGwStep,
        newStatus?: INgxGwStepStatus,
    ) {
        this.finalized.next(false);
        let current: INgxGwStep;
        if (!reenter) {
            const allSteps = this.ngxGwSteps.value;
            const otherSteps = allSteps.filter(step => step.configId !== config.configId);
            const resetSteps = allSteps.filter(step => step.configId === config.configId);
            resetSteps.filter(
                step => step.stepOrder === 1,
            )[0].status = this.wizardStepStatusMap.value.current;
            this.ngxGwSteps.next([...otherSteps, ...resetSteps]);
            current = resetSteps.filter(step => step.stepOrder === 1)[0];
            this.navigateToStep(current);
        } else {
            if (!newCurrent || !newStatus) {
                throw new Error('No new current step or status defined!');
            } else {
                current = newCurrent;
                current.status = newStatus;
                this.navigateToStep(current, false, false, config);
            }
        }
        return;
    }

    /**
     * This function is only for cleanup purposes.
     *
     * Passing in a subscription adds the subscription to the subs array,
     * then calling {@link destroyWizard()} will destroy all of the subscriptions.
     */
    addSubscription(subscription: Subscription) {
        this.subs.push(subscription);
        return;
    }

    setColorScheme(config?: INgxGwConfig) {
        const colorSchemes = this.ngxGwColorSchemes.value;
        if (config && colorSchemes.filter(sch => sch.configId === config.configId).length > 0) {
            // Update existing color scheme
        } else if (config) {
            // Insert new color scheme
        } else {
            // Insert template color scheme
        }
    }

    setDefaultColorScheme() {
        // Insert template color scheme (not attached to a config)
    }

    getMinOrder(configId?: number, steps?: INgxGwStep[]): number {
        let allSteps: INgxGwStep[] = [];
        if (configId) {
            allSteps = this.ngxGwSteps.value.filter(rst => rst.configId === configId);
        } else if (steps) {
            allSteps = steps;
        }
        return Math.min.apply(
            Math,
            allSteps.map(step => step.stepOrder),
        );
    }

    getMaxOrder(config?: INgxGwConfig, steps?: INgxGwStep[]): number {
        let allSteps: INgxGwStep[] = [];
        if (config) {
            allSteps = this.ngxGwSteps.value.filter(rst => rst.configId === config.configId);
        } else if (steps) {
            allSteps = steps;
        }
        return Math.max.apply(
            Math,
            allSteps.map(step => step.stepOrder),
        );
    }

    getStepCount(configId: number, stepOrder: number) {
        const allSteps: INgxGwStep[] = this.ngxGwSteps.value
            .filter(rst => rst.configId === configId)
            .sort((a, b) => a.stepOrder - b.stepOrder);
        let stepCount = 0;
        for (const step of allSteps) {
            stepCount++;
            if (step.stepOrder === stepOrder) {
                break;
            }
        }
        return stepCount;
    }

    destroyWizard() {
        this.subs.forEach(subscription => subscription.unsubscribe());
        return;
    }
}
