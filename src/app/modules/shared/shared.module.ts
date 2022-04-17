import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableInputComponent} from './components/table-input/table-input.component';
import {CanDeactivateComponentGuardService} from './components/can-deactivate/can-deactivate-component-guard-service';
import { JoinPipe } from './pipes/join.pipe';
import {InteractomeSelectionFormComponent} from './components/interactome-selection-form/interactome-selection-form.component';
import {InteractomeSelectionDialogComponent} from './components/interactome-selection-dialog/interactome-selection-dialog.component';


@NgModule({
    declarations: [
        TableInputComponent,
        JoinPipe,
        InteractomeSelectionFormComponent,
        InteractomeSelectionDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialDesignModule
    ],
    exports: [
        TableInputComponent,
        JoinPipe,
        InteractomeSelectionFormComponent,
        InteractomeSelectionDialogComponent
    ],
    providers: [
        CanDeactivateComponentGuardService
    ]
})
export class SharedModule {
}
