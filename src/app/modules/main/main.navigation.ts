/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2019 - Noé Vázquez González,
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

import {NavigationInfo} from '../../entities';
import {Role} from '../../entities/data';

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
        backRouteTitle: 'Go back to results'
    },
    {
        path: '/results/chart/distinct',
        title: 'Distinct species results chart',
        showInMenu: false,
        backRoute: '/results',
        backRouteTitle: 'Go back to results'
    },
    {
        path: '/results/table/same',
        title: 'Same species results table',
        showInMenu: false,
        backRoute: '/results',
        backRouteTitle: 'Go back to results'
    },
    {
        path: '/results/table/distinct',
        title: 'Distinct species results table',
        showInMenu: false,
        backRoute: '/results',
        backRouteTitle: 'Go back to results'
    },
    {
        path: '/species',
        title: 'Species',
        showInMenu: true,
        icon: 'pets'
    },
    {
        path: '/species/creation',
        title: 'Create new species',
        showInMenu: false,
        backRoute: '/species',
        backRouteTitle: 'Go back to species'
    },
    {
        path: '/interactomes',
        title: 'Interactomes',
        showInMenu: true,
        icon: 'sync_alt'
    },
    {
        path: '/interactomes/creation',
        title: 'Create new interactome',
        showInMenu: false,
        backRoute: '/interactomes',
        backRouteTitle: 'Go back to interactomes'
    },
    {
        path: '/management/users',
        title: 'Users',
        showInMenu: false,
        icon: 'face',
        allowedRoles: [ Role.ADMIN ]
    },
    {
        path: '/management/species',
        title: 'Species',
        showInMenu: false,
        icon: 'pets',
        allowedRoles: [ Role.ADMIN ]
    },
    {
        path: '/management/interactomes',
        title: 'Interactomes',
        showInMenu: false,
        icon: 'repeat',
        allowedRoles: [ Role.ADMIN ]
    },
    {
        path: '/management/works',
        title: 'Works',
        showInMenu: true,
        icon: 'settings',
        allowedRoles: [ Role.ADMIN ]
    },
    {
        path: '/login',
        title: 'Login',
        showInMenu: false,
        backRoute: '/dashboard',
        icon: 'lock_open',
        allowedRoles: [ Role.GUEST ]
    },
    {
        path: '/logout',
        title: 'Logout',
        showInMenu: false,
        backRoute: '/dashboard',
        icon: 'lock_close',
        allowedRoles: [ Role.ADMIN, Role.RESEARCHER ]
    },
    {
        path: '/registration',
        title: 'Registration',
        showInMenu: false,
        backRoute: '/dashboard',
        icon: 'lock_open',
        allowedRoles: [ Role.GUEST ]
    },
    {
        path: '/registration/confirmation',
        title: 'Login',
        showInMenu: false,
        backRoute: '/dashboard',
        icon: 'lock_open',
        allowedRoles: [ Role.GUEST ]
    },
    {
        path: '/recovery',
        title: 'Recovery',
        showInMenu: false,
        backRoute: '/login',
        icon: 'lock_open',
        allowedRoles: [ Role.GUEST ]
    },
    {
        path: '/password/recovery',
        title: 'Login',
        showInMenu: false,
        backRoute: '/dashboard',
        icon: 'lock_open',
        allowedRoles: [ Role.GUEST ]
    },
    {
        path: '/help',
        title: 'Database',
        showInMenu: true,
        backRoute: '/dashboard',
        icon: 'info'
    }
];
