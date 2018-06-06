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

declare var $: any;

@Component({
    selector: 'app-form-same-species',
    templateUrl: './form-same-species.component.html',
    styleUrls: ['./form-same-species.component.scss']
})
export class FormSameSpeciesComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    showNotification() {
        $.notify(
            {
                icon: 'add_alert',
                message: '<strong>Same species</strong> interactions requested'
            },
            {
                type: 'warning',
                timer: 5000,
                placement: {
                    from: 'bottom',
                    align: 'center'
                }
            }
        );
    }

}
