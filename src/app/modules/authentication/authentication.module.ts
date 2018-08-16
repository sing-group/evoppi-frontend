/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationService} from './services/authentication.service';
import {ModuleWithProviders} from '@angular/compiler/src/core';
import {LoginComponent} from './login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {BrowserService} from './services/browser.service';
import {RouterModule} from '@angular/router';
import {RegistrationComponent} from './registration/registration.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialDesignModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [
        LoginComponent,
        RegistrationComponent
    ],
    exports: [
        LoginComponent,
        RegistrationComponent
    ]
})
export class AuthenticationModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthenticationModule,
            providers: [ AuthenticationService, BrowserService ]
        }
    }
}
