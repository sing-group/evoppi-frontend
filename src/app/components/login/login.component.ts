import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {UserService} from '../../services/user.service';
import {Location} from '@angular/common';
import {DialogComponent} from '../dialog/dialog.component';
import {Router} from '@angular/router';

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

  constructor(private userService: UserService, private formBuilder: FormBuilder, private location: Location,
              private router: Router, private matDialog: MatDialog) { }

  ngOnInit() {
    if (this.location.isCurrentPathEqualTo('/logout')) {
      this.userService.logOut();
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
          this.userService.logIn(formModel.username, role);
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
