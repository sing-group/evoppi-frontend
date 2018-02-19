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
import {MatTableDataSource} from '@angular/material';
import {Work} from '../../interfaces/work';
import {Status} from '../../interfaces/status';

@Component({
  selector: 'app-user-work-manager',
  templateUrl: './user-work-manager.component.html',
  styleUrls: ['./user-work-manager.component.css']
})
export class UserWorkManagerComponent implements OnInit {
  dataSource: MatTableDataSource<Work>;
  displayedColumns = ['id', 'name', 'description', 'creationDateTime', 'startDateTime', 'endDateTime', 'status', 'open', 'delete'];

  private demoWork: Work[] = [{
    id: {id: '99', uri: 'http://192.168.0.16:8080/evoppi-backend/rest/api/work/5ec7a67e-05b1-4038-949f-ca8773e120cb'},
    name: 'Same species interactions',
    description: 'Find same species interactions',
    creationDateTime: new Date('2018-02-19T18:41:58.382'),
    startDateTime: null,
    endDateTime: null,
    resultReference: 'http://192.168.0.16:8080/evoppi-backend/rest/api/interaction/result/6841f62b-49f5-478c-8632-5c2211cc09af',
    status: Status.SCHEDULED,
    steps: []
  }, {
    id: {id: '98', uri: 'http://192.168.0.16:8080/evoppi-backend/rest/api/work/5ec7a67e-05b1-4038-949f-ca8773e120cb'},
    name: 'Different species interactions',
    description: 'Find different species interactions',
    creationDateTime: new Date('2018-02-14T18:41:58.382'),
    startDateTime: new Date('2018-02-14T18:42:58.382'),
    endDateTime: null,
    resultReference: 'http://192.168.0.16:8080/evoppi-backend/rest/api/interaction/result/6841f62b-49f5-478c-8632-5c2211cc09af',
    status: Status.RUNNING,
    steps: []
  }];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Work>(this.demoWork);
  }

}
