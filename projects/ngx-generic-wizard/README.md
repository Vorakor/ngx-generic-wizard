# Ngx Generic Wizard

The Generic Wizard will generate any amount of steps that you want in your wizard and is reusable. It comes with three different components, a service, and a number of interfaces which need to be used to interact with the components, given the nature of this complex wizard generator.

## Install

Basic install and setup include this:

```
npm install ngx-generic-wizard
```

Be sure to add the module and service to your app.module.ts file:

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
...
import { NgxGenericWizardModule, NgxGenericWizardService } from 'ngx-generic-wizard'; // <-- Here
...

@NgModule({
    declarations: [...],
    imports: [
        BrowserModule,
        ...
        NgxGenericWizardModule, // <-- And here
        ...
    ],
    providers: [NgxGenericWizardService] // And don't forget this!
})
export class AppModule {}
```

You need to ensure that you do actually add the service as NgxGenericWizard won't work without it, that service is necessary to handle the extremely complex interaction between steps and the application that's using the wizard.

Also ensure that if you have other modules or you are doing lazy loading, you may need to put the import and providers statement in multiple locations for NgxGenericWizardModule, NgxGenericWizardService. You should not need to directly import the components though.

## Usage

To use NgxGenericWizard we first need to introduce some objects to you: config, steps, and statusMap.

The config object has configurations per wizard that each wizard needs in order to run, each application can have many configs, each config can have many steps. The config object includes a few important fields such as configId, code, description, applicationId, moduleId, baseUrl, and finalizeUrl. It also includes two boolean value of ignoreIncomplete and completedDisabled, ignoreIncomplete=true means that many users can use the same wizard at the same time and they should all have their own copy of it, that versus if ignoreIncomplete=false many users should be using the same instance of the wizard and therefore you will need to synchronize them. The finalizeUrl is the URL you want the wizard to navigate to on completion.

The step object is details regarding the various steps of the wizard, each step has an assigned configuration and status. The step object also contains stepId, stepOrder, and stepUrl as necessary parameters. StepOrder is obviously the order that the steps will appear in, and stepUrl is the URL that the step will navigate to, now keep in mind, when steps are navigating, they will combine the configuration's baseUrl with the steps URL, so for example: if the config object's baseUrl is 'user' and the stepUrl is 'create', then the step will attempt to navigate to 'user/create'.

The statusMap object maps the INgxStepStatus interface to four distinct objects: initial, current, complete, and incomplete. Using this status map you can choose the code or description for each step, as long as you map them to those four specific states then NgxGenericWizard will know what status to assign which step as it is going through it's processing.

Now, to use NgxGenericWizard, you are going to need to initialize it, as mentioned before this is a generic wizard and can get rather complex. To initialize it, create a configuration object and step object array to pass into it:

```ts
config: INgxGwConfig = {
    configId: 1,
    code: 'USRPRCSS',
    description: 'User Process Wizard',
    baseUrl: 'user',
    finalizeUrl: 'dashboard',
    ignoreIncomplete: true,
    completedDisabled: true,
    applicationId: 1,
    moduleId: 1
};
/* Note: you do not have to put the steps themselves in order, the stepOrder should dictate the desired order of the steps.  And it is encouraged to go in multiples of 100 for the stepOrder, this way if you forgot a step you can insert it between other steps, or perhaps if at a later time you wanted to programmatically add another step you can do so. */
steps: INgxGwStep[] = [
    {
        stepId: 1,
        configId: 1,
        status: {
            statusId: 2,
            code: 'CRR',
            description: 'CURRENT'
        },
        code: 'CRTUSRSGNNF',
        description: 'Create User Sign In Information',
        stepOrder: 100,
        stepUrl: 'create-sign-in'
    },
    {
        stepId: 2,
        configId: 1,
        status: {
            statusId: 1,
            code: 'INI',
            description: 'INITIAL'
        },
        code: 'CRTUSRPRFLNF',
        description: 'Create User Profile Information',
        stepOrder: 300,
        stepUrl: 'create-profile'
    },
    {
        stepId: 3,
        configId: 1,
        status: {
            statusId: 1,
            code: 'INI',
            description: 'INITIAL'
        },
        code: 'CRTUSRNMNF',
        description: 'Create Basic User Information',
        stepOrder: 200,
        stepUrl: 'create-user-info'
    }
];
// Also build the statusMap here.  NgxGenericWizard is programmed to look at this status map when determining statuses.
statusMap: INgxGwStepStatusMap = {
    initial: {
      statusId: 1,
      code: 'INI',
      description: 'INITIAL'
    },
    current: {
      statusId: 2,
      code: 'CRR',
      description: 'CURRENT'
    },
    complete: {
      statusId: 3,
      code: 'CMP',
      description: 'COMPLETE'
    },
    incomplete: {
      statusId: 4,
      code: 'ICMP',
      description: 'INCOMPLETE'
    }
  };
```

Now, NgxGenericWizard was more or less built with the assumption that you may want to hook up a data structure to it, which also means that as part of the initialization, it is expecting a boolean 'loaded' observable as well as an observable containing the current step you want it to advance to. If you have neither of those, you can simply use this:

```ts
...
import { Observable, of } from 'rxjs';
...

@Component({
    selector: 'user-container',
    templateUrl: './user-container.component.html',
    styleUrls: ['./user-container.component.scss']
})
export class UserContainerComponent {
    // Config, steps, and statusMap from above here...
    userLoaded$: Observable<boolean> = of(true); // <-- Rxjs's of() function creates an observable for you.
    userCurrentStep$: Observable<INgxGwStep> = of({
        stepId: 1,
        configId: 1,
        status: {
            statusId: 2,
            code: 'CRR',
            description: 'CURRENT'
        },
        code: 'CRTUSRSGNNF',
        description: 'Create User Sign In Information',
        stepOrder: 100,
        stepUrl: 'create-sign-in'
    } as INgxGwStep);
}
```

Now to actually call the initialization function, remember that you need to have NgxGenericWizardService as a provider!

```ts
...
import {
  NgxGenericWizardService
} from 'ngx-generic-wizard';
...

@Component({
    selector: 'user-container',
    templateUrl: './user-container.component.html',
    styleUrls: ['./user-container.component.scss']
})
export class UserContainerComponent {
    // Config, steps, and statusMap from above here...
    // userLoaded and userCurrentStep from above here...
    constructor(private ngxGwService: NgxGenericWizardService) {
        this.ngxGwService.initialized$.subscribe(loaded => {
            // The reason we're looking at the initialized$ observable here is so that we don't reinitialize the wizard multiple times.
            if (!loaded) {
                this.ngxGwService.initializeWizard(
                this.config,
                this.steps,
                this.statusMap,
                this.userLoaded$,
                this.userCurrentStep$
                );
            }
        });
    }

    // Use this function here so you can re-enter the wizard if needed.
    reenterWizard() {
        this.ngxGwService.resetFinalized(this.config);
        this.router.navigate(['user', 'create-sign-in']);
    }
}
```

So now we've added the code to our component, however, we need to add the components from NgxGenericWizard to our template. Assuming our template file is user-container.component.html:

```html
<div class="page">
    <ngx-gw-step-container [config]="config"></ngx-gw-step-container>
    <!-- Yes, we only need to pass these components the configuration object, because they're getting the rest of their functionality and information from that service that I told you was important to provide. -->
    <ngx-gw-button-container [config]="config"></ngx-gw-button-container>
    <router-outlet></router-outlet>
</div>
<!-- You can choose to have the button container above the pages the wizard is going to respond to, or below them like the example below: -->
<!-- <div class="page">
  <ngx-gw-step-container [config]="config"></ngx-gw-step-container>
  <router-outlet></router-outlet>
  <ngx-gw-button-container [config]="config"></ngx-gw-button-container>
</div> -->
<!-- The button container holds the next, previous, and re-enter wizard buttons, so you need to include it on the page.  The step container holds the remainder of the UI which will also allow some limited navigation options depending on your configuration. -->
```

Assuming you've followed this code to the letter you should end up with a view looking like this:

More documentation about connecting a data source coming soon.

TODO:

-   Finish detailing connecting a data source to a wizard.
-   Finish Color Scheme / Styling tooling.
-   Finish writing unit tests.
-   Move repo to workspace repo.
-   Create new sub-repo for this lib.
-   Add ngx-dynamic-forms as another sub-repo for workspace.

## Notes

If you accidentally installed version 0.1.0 of NgxGenericWizard, please install a later version as that version will not work.
