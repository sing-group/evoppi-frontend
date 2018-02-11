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

import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WorkService} from '../../services/work.service';
import {Work} from '../../interfaces/work';
import {MatTabGroup} from '@angular/material';

@Component({
  selector: 'app-tabgroup',
  templateUrl: './tabgroup.component.html',
  styleUrls: ['./tabgroup.component.css']
})
export class TabgroupComponent implements OnInit {

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  public work: Work;

  constructor(private activatedRoute: ActivatedRoute, private workService: WorkService) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParamMap.has('result')) {
      this.workService.get(this.activatedRoute.snapshot.queryParamMap.get('result'))
        .subscribe((res) => {
          this.work = res;
          if (this.work.name.startsWith('Same species')) {
            this.tabGroup.selectedIndex = 1;
          } else {
            this.tabGroup.selectedIndex = 0;
          }
        });
    }
  }

}
