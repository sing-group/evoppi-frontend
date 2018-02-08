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

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Interactome} from '../../interfaces/interactome';

const DEMO_DATA: Interactome[] = [
  {id: 1, name: 'Interactome 1', uri: 'uri 1'},
  {id: 2, name: 'Interactome 2', uri: 'uri 2'},
  {id: 3, name: 'Interactome 3', uri: 'uri 3'},
  {id: 4, name: 'Interactome 4', uri: 'uri 4'},

];

@Component({
  selector: 'app-interactomes',
  templateUrl: './interactomes.component.html',
  styleUrls: ['./interactomes.component.css']
})
export class InteractomesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Interactome> = new MatTableDataSource<Interactome>(DEMO_DATA);
  displayedColumns = ['id', 'name', 'species', 'download'];



  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
