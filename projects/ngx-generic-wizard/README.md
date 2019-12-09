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
```

You need to ensure that you do actually add the service as NgxGenericWizard won't work without it, that service is necessary to handle the extremely complex interaction between steps and the application that's using the wizard.

## Usage

TODO:

-   Finish Usage section.
-   Finish Color Scheme / Styling tooling.
-   Finish writing unit tests.
-   Move repo to workspace repo.
-   Create new sub-repo for this lib.
-   Add ngx-dynamic-forms as another sub-repo for workspace.
