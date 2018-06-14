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

import {NavigationInfo} from '../../entities';

export const QUERY_NAVIGATION_INFO: NavigationInfo = {
    path: '/query', title: 'Query', showInMenu: true, icon: 'search'
};
export const RESULTS_NAVIGATION_INFO: NavigationInfo = {
    path: '/results', title: 'Results', showInMenu: true, icon: 'list'
};
export const MAIN_NAVIGATION_INFO: NavigationInfo[] = [
    {path: '/dashboard', title: 'Dashboard', showInMenu: true, icon: 'dashboard'},
    QUERY_NAVIGATION_INFO,
    RESULTS_NAVIGATION_INFO,
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
    },
    {
        path: '/species',
        title: 'Species',
        showInMenu: true,
        icon: 'pets',
        allowedRoles: [ 'RESEARCHER' ]
    },
    {
        path: '/interactomes',
        title: 'Interactomes',
        showInMenu: true,
        icon: 'repeat',
        allowedRoles: [ 'RESEARCHER' ]
    },
    {
        path: '/management/users',
        title: 'Users',
        showInMenu: true,
        icon: 'face',
        allowedRoles: [ 'ADMIN' ]
    },
    {
        path: '/management/species',
        title: 'Species',
        showInMenu: true,
        icon: 'pets',
        allowedRoles: [ 'ADMIN' ]
    },
    {
        path: '/management/interactomes',
        title: 'Interactomes',
        showInMenu: true,
        icon: 'repeat',
        allowedRoles: [ 'ADMIN' ]
    }
];
