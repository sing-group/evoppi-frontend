import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableInputComponent} from './components/table-input/table-input.component';
import { TableSelectComponent } from './components/table-select/table-select.component';


@NgModule({
    declarations: [
        TableInputComponent,
        TableSelectComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialDesignModule
    ],
    exports: [
        TableInputComponent,
        TableSelectComponent
    ]
})
export class SharedModule {
}
