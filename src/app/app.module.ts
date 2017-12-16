import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule, MatSelectModule, MatTableModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormSameSpeciesComponent } from './components/form-same-species/form-same-species.component';
import { FormDistinctSpeciesComponent } from './components/form-distinct-species/form-distinct-species.component';
import {HttpClientModule} from '@angular/common/http';
import {SpeciesService} from './services/species.service';
import { InteractomeService } from './services/interactome.service';
import { GeneService } from './services/gene.service';
import { InteractionService } from './services/interaction.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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
    MatAutocompleteModule,
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
    MatAutocompleteModule,
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
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    SpeciesService,
    InteractomeService,
    GeneService,
    InteractionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
