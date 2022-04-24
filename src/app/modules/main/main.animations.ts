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

import {animate, group, query, style, transition, trigger} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
    transition('results-list => results-detail', [
        query('.footer', style({opacity: 0})),
        query(':enter, :leave', style({position: 'fixed', width: '100%', height: '100%'}), {optional: true}),
        group([
            query(':enter', [
                style({transform: 'translateX(100%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateX(0%)', opacity: 1}))
            ], {optional: true}),
            query(':leave', [
                style({transform: 'translateX(0%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateX(-100%)', opacity: 0.5}))
            ], {optional: true})
        ]),
        query('.footer', style({opacity: 1}))
    ]),
    transition('results-detail => results-list', [
        query('.footer', style({opacity: 0})),
        query(':leave, :enter', style({position: 'fixed', width: '100%', height: '100%'}), {optional: true}),
        group([
            query(':enter', [
                style({transform: 'translateX(-100%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateX(0%)', opacity: 1}))
            ], {optional: true}),
            query(':leave', [
                style({transform: 'translateX(0%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateX(100%)', opacity: 0.5}))
            ], {optional: true}),
        ]),
        query('.footer', style({opacity: 1}))
    ])
]);
