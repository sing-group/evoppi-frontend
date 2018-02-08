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
import {Interaction} from '../../interfaces/interaction';
import {MatTableDataSource} from '@angular/material';
import {User} from '../../classes/user';
import {AdminService} from '../../services/admin.service';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {
  dataSource: MatTableDataSource<User>;
  displayedColumns = ['Login', 'Email', 'Role', 'Edit', 'Delete'];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getAdmins().subscribe((res) => {
      this.dataSource = new MatTableDataSource<User>(res);
      console.log(res);
    });
  }

}
