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
import {InteractomeService} from '../../services/interactome.service';

@Component({
  selector: 'app-interactomes',
  templateUrl: './interactomes.component.html',
  styleUrls: ['./interactomes.component.css']
})
export class InteractomesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Interactome>;
  displayedColumns = ['species', 'name', 'dbSourceIdType', 'numOriginalInteractions', 'numUniqueOriginalInteractions',
    'numUniqueOriginalGenes', 'numInteractionsNotToUniProtKB', 'numGenesNotToUniProtKB', 'numInteractionsNotToGeneId',
    'numGenesNotToGeneId', 'numFinalInteractions', 'probFinalInteractions', 'download'];

  constructor(private interactomeService: InteractomeService) { }

  ngOnInit() {
    this.interactomeService.getInteractomes().subscribe((res) => {
      this.dataSource = new MatTableDataSource<Interactome>(res);
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
  }
}
