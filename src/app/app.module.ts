/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2022 - Noé Vázquez González,
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

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ErrorHandler, NgModule, SecurityContext} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppRoutingModule} from './app.routing';

import {AppComponent} from './app.component';
import {AuthenticationModule} from './modules/authentication/authentication.module';
import {BrowserModule} from '@angular/platform-browser';
import {MainModule} from './modules/main/main.module';
import {ToastrModule} from 'ngx-toastr';
import {NotificationModule} from './modules/notification/notification.module';
import {ErrorNotificationHandler} from './modules/notification/handlers/error-notification.handler';
import {MarkdownModule} from 'ngx-markdown';

@NgModule({
    imports: [
        AppRoutingModule,
        AuthenticationModule.forRoot(),
        BrowserModule,
        BrowserAnimationsModule,
        MainModule,
        MarkdownModule.forRoot({
            sanitize: SecurityContext.NONE
        }),
        NotificationModule.forRoot(),
        RouterModule,
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
            preventDuplicates: true
        })
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: ErrorNotificationHandler
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
