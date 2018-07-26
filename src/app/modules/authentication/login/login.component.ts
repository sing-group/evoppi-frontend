/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 * .
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

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    formLogin: FormGroup;

    formErrors = {
        'username': '',
        'password': ''
    };
    validationMessages = {
        'username': {
            'required': 'Username is required.'
        },
        'password': {
            'required': 'Password is required.'
        }
    };

    constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router,
                private matDialog: MatDialog, private route: ActivatedRoute) {
    }

    ngOnInit() {
        if (this.route.routeConfig.data.state === 'logout') {
            this.authenticationService.logOut();
        }

        this.formLogin = this.formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required],
        });
        this.formLogin.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    onValueChanged(data?: any) {
        if (!this.formLogin) { return; }
        for (const field of Object.keys(this.formErrors)) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = this.formLogin.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key of Object.keys(control.errors)) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    onLogin() {
        if (this.formLogin.status === 'INVALID') {
            return;
        }
        const formModel = this.formLogin.value;
        this.authenticationService.checkCredentials(formModel.username, formModel.password)
            .subscribe((role) => {
                if (role === 'INVALID') {
                    this.formLogin.setErrors({'invalidForm': 'Error: User or password incorrect. Please try again.'});
                } else {
                    this.authenticationService.logIn(formModel.username, formModel.password, role);
                    this.router.navigate(['/query']);
                }
            });
    }

    onKeyDownForm(event: KeyboardEvent) {
        if (event.keyCode === 13) {
           this.onLogin();
        }
    }

}
