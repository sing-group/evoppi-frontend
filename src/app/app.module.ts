import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule, MatSelectModule, MatTableModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormSameSpeciesComponent } from './components/form-same-species/form-same-species.component';
import { FormDistinctSpeciesComponent } from './components/form-distinct-species/form-distinct-species.component';
import {HttpClientModule} from '@angular/common/http';
import {SpeciesService} from './services/species.service';
import { InteractomeService } from './services/interactome.service';

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
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
    HttpClientModule,
    MaterialModule
  ],
  providers: [
    SpeciesService,
    InteractomeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
