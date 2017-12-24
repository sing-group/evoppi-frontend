import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import {Interaction} from '../../interfaces/interaction';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
    });
  }

  onLogin() {
    if (this.formLogin.status === 'INVALID') {
      console.log('INVALID');
      return;
    }
    const formModel = this.formLogin.value;
    this.userService.getRole(formModel.username, formModel.password)
      .subscribe((role) => {
        console.log(role);
      });
  }

}
