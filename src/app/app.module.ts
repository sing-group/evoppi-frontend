/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2018 - Noé Vázquez González,
 *  Miguel Reboiro-Jato, Jorge Vieira, Hugo López-Fernández,
 *  and Cristina Vieira.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import 'hammerjs';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FormSameSpeciesComponent} from './components/form-same-species/form-same-species.component';
import {FormDistinctSpeciesComponent} from './components/form-distinct-species/form-distinct-species.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SpeciesService} from './services/species.service';
import {InteractomeService} from './services/interactome.service';
import {GeneService} from './services/gene.service';
import {InteractionService} from './services/interaction.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {TabgroupComponent} from './components/tabgroup/tabgroup.component';
import {LoginComponent} from './components/login/login.component';
import {UserService} from './services/user.service';
import {DialogComponent} from './components/dialog/dialog.component';
import {UserManagerComponent} from './components/user-manager/user-manager.component';
import {AdminService} from './services/admin.service';
import {AuthInterceptor} from './classes/auth.interceptor';
import {AuthService} from './services/auth.service';
import {GraphComponent} from './components/graph/graph.component';
import {DraggableDirective} from './directives/draggable.directive';
import {ZoomableDirective} from './directives/zoomable.directive';
import {D3Service} from './services/d3.service';
import {InteractomesComponent} from './components/interactomes/interactomes.component';
import {AutocompleteComponent} from './components/autocomplete/autocomplete.component';
import {WorkStatusComponent} from './components/work-status/work-status.component';
import {WorkService} from './services/work.service';
import {GeneInfoComponent} from './components/gene-info/gene-info.component';
import {LegendSameSpeciesComponent} from './components/legend-same-species/legend-same-species.component';
import {LegendDistinctSpeciesComponent} from './components/legend-distinct-species/legend-distinct-species.component';
import {BlastResultComponent} from './components/blast-result/blast-result.component';
import {OnInitDirective} from './directives/on-init.directive';
import {AfterViewInitDirective} from './directives/after-view-init.directive';
import {UserWorkManagerComponent} from './components/user-work-manager/user-work-manager.component';
import {ResearcherService} from './services/researcher.service';
import {UserTableComponent} from './components/user-table/user-table.component';
import {UserCreateComponent} from './components/user-create/user-create.component';
import {LegendTableComponent} from './components/legend-table/legend-table.component';

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
    MatPaginatorModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    MatSliderModule,
    MatChipsModule,
    MatSortModule,
    MatListModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatRadioModule,
    MatProgressSpinnerModule,
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
    MatPaginatorModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    MatSliderModule,
    MatChipsModule,
    MatSortModule,
    MatListModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
})
export class MaterialModule {
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FormSameSpeciesComponent,
    FormDistinctSpeciesComponent,
    TabgroupComponent,
    LoginComponent,
    DialogComponent,
    UserManagerComponent,
    GraphComponent,
    InteractomesComponent,
    DraggableDirective,
    ZoomableDirective,
    AutocompleteComponent,
    WorkStatusComponent,
    GeneInfoComponent,
    LegendSameSpeciesComponent,
    LegendDistinctSpeciesComponent,
    BlastResultComponent,
    OnInitDirective,
    AfterViewInitDirective,
    UserWorkManagerComponent,
    UserTableComponent,
    UserCreateComponent,
    LegendTableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    SpeciesService,
    InteractomeService,
    GeneService,
    InteractionService,
    UserService,
    AdminService,
    ResearcherService,
    AuthService,
    D3Service,
    WorkService,
  ],
  entryComponents: [
    DialogComponent,
    WorkStatusComponent,
    GeneInfoComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
