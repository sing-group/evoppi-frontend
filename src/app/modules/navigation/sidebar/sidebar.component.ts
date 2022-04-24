/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2022 - Noé Vázquez González,
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

import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationInfo} from '../../../entities';
import {StatsService} from '../../main/services/stats.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    @Input() public routes: NavigationInfo[];

    public dbVersion: string;

    private filteredRoutes: NavigationInfo[];

    constructor(
        private statsService: StatsService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.filteredRoutes = this.routes.filter(route => route.showInMenu);
        this.statsService.getDatabaseVersion()
            .subscribe(dbVersion => this.dbVersion = dbVersion);
    }

    public get menuItems(): NavigationInfo[] {
        return this.filteredRoutes;
    }

    isMobileMenu() {
        return window.screen.width <= 991;
    };
}
