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
