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

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {NotificationService} from '../../notification/services/notification.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

    formRegister: FormGroup;

    formErrors = {
        'username': '',
        'password': '',
        'email': ''
    };
    validationMessages = {
        'username': {
            'required': 'Username is required.'
        },
        'password': {
            'required': 'Password is required.'
        },
        'email' : {
            'required': 'Email is required.',
            'email': 'Email is incorrect.'
        }
    };

    constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService,
                private notificationService: NotificationService) {
    }

    ngOnInit() {

        this.formRegister = this.formBuilder.group({
            'username': ['', Validators.required],
            'email': ['', Validators.email],
            'password': ['', Validators.required],
        });
        this.formRegister.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    onValueChanged(data?: any) {
        if (!this.formRegister) { return; }
        for (const field of Object.keys(this.formErrors)) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = this.formRegister.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key of Object.keys(control.errors)) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    onRegister() {
        if (this.formRegister.status === 'INVALID') {
            return;
        }
        const formModel = this.formRegister.value;
        this.authenticationService.register(formModel.username, formModel.email, formModel.password)
            .subscribe(() => {
                this.notificationService.success('User registered successfully',
                    'Please check your email to validate your account.');
                },
                (error) => {
                    this.formRegister.setErrors({'invalidForm': 'Error: ' + error});
                    this.notificationService.error('There was an error creating a new accout', error);
                }
            );
    }

    onKeyDownForm(event: KeyboardEvent) {
        if (event.keyCode === 13) {
           this.onRegister();
        }
    }

}
