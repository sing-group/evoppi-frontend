/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
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

import {Component, Input, OnChanges} from '@angular/core';

@Component({
    selector: 'app-legend-same-species',
    templateUrl: './legend-same-species.component.html',
    styleUrls: ['./legend-same-species.component.scss']
})
export class LegendSameSpeciesComponent implements OnChanges {

    @Input() graphWidth = 200;
    @Input() graphHeight = 200;

    private _options: { width, height };

    constructor() {
    }

    ngOnChanges() {
        this.options = {width: this.graphWidth, height: this.graphHeight};
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

}
