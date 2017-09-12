import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule, MdCheckboxModule, MdIconModule, MdInputModule, MdSelectModule, MdTableModule, MdTabsModule,
  MdToolbarModule
} from '@angular/material';
import { NavbarComponent } from './navbar/navbar.component';
import { FormSameSpeciesComponent } from './form-same-species/form-same-species.component';
import { FormDistinctSpeciesComponent } from './form-distinct-species/form-distinct-species.component';
import {CdkTableModule} from "@angular/cdk/table";

@NgModule({
  imports: [
    MdButtonModule,
    MdCheckboxModule,
    MdToolbarModule,
    MdIconModule,
    MdTabsModule,
    MdInputModule,
    MdSelectModule,
    MdTableModule,
    CdkTableModule,
  ],
  exports: [
    MdButtonModule,
    MdCheckboxModule,
    MdToolbarModule,
    MdIconModule,
    MdTabsModule,
    MdInputModule,
    MdSelectModule,
    MdTableModule,
    CdkTableModule,
  ],
})
export class MaterialModule { }

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FormSameSpeciesComponent,
    FormDistinctSpeciesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
