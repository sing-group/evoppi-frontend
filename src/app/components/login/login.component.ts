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

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {UserService} from '../../services/user.service';
import {Location} from '@angular/common';
import {DialogComponent} from '../dialog/dialog.component';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;

  formErrors = {
    'username': '',
    'password': ''
  };
  validationMessages = {
    'username': {
      'required':      'Username is required.'
    },
    'password': {
      'required': 'Password is required.'
    }
  };

  constructor(private userService: UserService, private authService: AuthService, private formBuilder: FormBuilder,
              private location: Location, private router: Router, private matDialog: MatDialog) { }

  ngOnInit() {
    if (this.location.isCurrentPathEqualTo('/logout')) {
      this.authService.logOut();
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
    this.userService.getRole(formModel.username, formModel.password)
      .subscribe((role) => {
        if (role === 'INVALID') {
          this.openDialog('Login error', 'Username or password incorrect. Please try again.');
        } else {
          this.authService.logIn(formModel.username, formModel.password, role);
          this.router.navigate(['/compare']);
        }
      });
  }

  goBack(): void {
    this.location.back();
  }

  private openDialog(title, content): void {
    const dialogRef = this.matDialog.open(DialogComponent, {
      maxWidth: '400px',
      data: { title: title, content: content }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

}
