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
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../services/admin.service';
import {ResearcherService} from '../../services/researcher.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  public role: string;
  public formNewUser: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder,
              private adminService: AdminService, private researcherService: ResearcherService) { }

  ngOnInit() {
    this.role = this.activatedRoute.snapshot.paramMap.get('role').toUpperCase();
    this.formNewUser = this.formBuilder.group({
      'role': [this.role, [Validators.required, Validators.pattern('^(ADMIN)$|^(RESEARCHER)$')]],
      'login': ['', [Validators.required, Validators.minLength(1)]],
      'email': ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onCreate() {
    if (this.formNewUser.status === 'INVALID') {
      return;
    }
    const formModel = this.formNewUser.value;
    if (formModel.role === 'ADMIN') {
      this.adminService.createAdmin(formModel.login, formModel.role, formModel.email, formModel.password)
        .subscribe((res) => {
          this.router.navigateByUrl('/users');
        }, (err) => {
          this.showErrors(err);
        });
    } else if (formModel.role === 'RESEARCHER') {
      this.researcherService.createResearcher(formModel.login, formModel.role, formModel.email, formModel.password)
        .subscribe((res) => {
          this.router.navigateByUrl('/users');
        }, (err) => {
          this.showErrors(err);
        });
    }
  }

  private showErrors(err: any): void {
    if (err.error.indexOf('email') >= 0) {
      this.formNewUser.get('email').setErrors({'validEmail': err.error});
    } else if (err.error.indexOf('password') >= 0) {
      this.formNewUser.get('password').setErrors({'validPassword': err.error});
    } else if (err.error.indexOf('login') >= 0) {
      this.formNewUser.get('login').setErrors({'validLogin': err.error});
    } else {
      this.formNewUser.setErrors({'invalidForm': err.error});
    }
  }

}
