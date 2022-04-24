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

import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {NotificationService} from '../../notification/services/notification.service';
import {ActivatedRoute} from '@angular/router';
import {BrowserService} from '../services/browser.service';

@Component({
    selector: 'app-registration',
    templateUrl: './recovery.component.html',
    styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {

    formRecovery: FormGroup;
    recoveryConfirmation = false;

    formErrors = {
        'username': '',
        'password': '',
        'confirmPassword': ''
    };
    validationMessages = {
        'username': {
            'required': 'Username is required.'
        },
        'password': {
            'required': 'Password is required.',
            'minlength': 'Password can\'t be shorter than 6.'
        },
        'confirmPassword': {
            'required': 'Password is required.',
            'match': 'Passwords do not match.',
            'minlength': 'Password can\'t be shorter than 6.'
        },
    };

    constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService,
                private notificationService: NotificationService, private route: ActivatedRoute, private browserService: BrowserService) {
    }

    ngOnInit() {

        if (this.route.routeConfig.data.state === 'recoveryConfirmation') {
            this.recoveryConfirmation = true;
            this.formRecovery = this.formBuilder.group({
                'password': ['', [Validators.required, Validators.minLength(6)]],
                'confirmPassword': ['', [Validators.required, Validators.minLength(6), this.passwordMatchValidator]],
            });
        } else {
            this.formRecovery = this.formBuilder.group({
                'username': ['', Validators.required],
            });
        }
        this.formRecovery.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    onValueChanged(data?: any) {
        if (!this.formRecovery) {
            return;
        }
        for (const field of Object.keys(this.formErrors)) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = this.formRecovery.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key of Object.keys(control.errors)) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    onRecovery() {
        if (this.formRecovery.status === 'INVALID') {
            return;
        }
        const formModel = this.formRecovery.value;
        this.authenticationService.recovery(formModel.username)
            .subscribe(() => {
                    this.notificationService.success('Recovery mail sent successfully',
                        'Please check your email to reset your password.');
                },
                (error) => {
                    this.formRecovery.setErrors({'invalidForm': 'Error: ' + error});
                    this.notificationService.error('There was an error recovering your password', error);
                }
            );
    }

    onConfirm() {
        if (this.formRecovery.status === 'INVALID') {
            return;
        }
        const formModel = this.formRecovery.value;
        this.authenticationService.confirmRecovery(this.route.snapshot.queryParams.uuid, formModel.password)
            .subscribe(() => {
                    this.notificationService.success('Password changed successfully',
                        'You can now log in with the new password.');
                },
                (error) => {
                    this.formRecovery.setErrors({'invalidForm': 'Error: ' + error});
                    this.notificationService.error('There was an error changing your password', error);
                }
            );
    }

    onKeyDownForm(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.onRecovery();
        }
    }

    private passwordMatchValidator(control: AbstractControl) {

        if (control.root.get('password') && control.root.get('password').value === control.value) {
            return null;
        }
        return {match: false};
    }

}
