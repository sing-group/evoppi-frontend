import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableInputComponent} from './components/table-input/table-input.component';


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
    ]
})
export class SharedModule {
}
