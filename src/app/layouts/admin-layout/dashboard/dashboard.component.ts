/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 * .
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {Component, OnInit} from '@angular/core';
import {Navigation} from '../../../navigation/navigation.module';
import NavigationInfo = Navigation.NavigationInfo;
import {ADMIN_LAYOUT_NAVIGATION_INFO} from '../admin-layout.navigation';
import {QUERY_NAVIGATION_INFO, RESULTS_NAVIGATION_INFO} from '../admin-layout.navigation';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {

  }

  get resultsNavigationInfo(): NavigationInfo {
    return RESULTS_NAVIGATION_INFO;
  }

  get queryNavigationInfo(): NavigationInfo {
    return QUERY_NAVIGATION_INFO;
  }
}
