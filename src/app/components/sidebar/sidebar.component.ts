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

export declare interface RouteInfo {
    path: string;
    title: string;
    showInMenu: boolean;
    icon?: string;
    class?: string;
    backRoute?: string;
    backRouteTitle?: string;
}

export const ROUTES: RouteInfo[] = [
    {path: '/dashboard', title: 'Dashboard', showInMenu: true, icon: 'dashboard'},
    {path: '/query', title: 'Query', showInMenu: true, icon: 'search'},
    {path: '/results', title: 'Results', showInMenu: true, icon: 'list'},
    {
        path: '/results/chart/same',
        title: 'Same species results chart',
        showInMenu: false,
        backRoute: '/results',
        backRouteTitle: 'Go back to Results'
    },
    {
        path: '/results/chart/distinct',
        title: 'Distinct species results chart',
        showInMenu: false,
        backRoute: '/results',
        backRouteTitle: 'Go back to Results'
    },
    {
        path: '/results/table/same',
        title: 'Same species results table',
        showInMenu: false,
        backRoute: '/results',
        backRouteTitle: 'Go back to Results'
    },
    {
        path: '/results/table/distinct',
        title: 'Distinct species results table',
        showInMenu: false,
        backRoute: '/results',
        backRouteTitle: 'Go back to Results'
    }
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];

    constructor() {
    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem.showInMenu);
    }

    isMobileMenu() {
        return window.screen.width <= 991;
    };
}
