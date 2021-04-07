import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableInputComponent} from './components/table-input/table-input.component';
import {CanDeactivateComponentGuardService} from './components/can-deactivate/can-deactivate-component-guard-service';


@NgModule({
    declarations: [
        TableInputComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialDesignModule
    ],
    exports: [
        TableInputComponent
    ],
    providers: [
        CanDeactivateComponentGuardService
    ]
})
export class SharedModule {
}
