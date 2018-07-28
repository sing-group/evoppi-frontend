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

import {BlastResult} from './blast-result.model';

export class Node implements d3.SimulationNodeDatum {
    // optional - defining optional implementation properties - required for relevant typing assistance
    index?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;

    id: string;
    label: string | number;
    description: string;
    linkCount = 0;
    type?: number;
    blastResults?: BlastResult[];

    constructor(id, label, description, blastResults = []) {
        this.id = id;
        this.label = label;
        this.description = description;
        this.type = blastResults.length > 0 ? 2 : 1;
        this.blastResults = blastResults;
    }

    normal = () => {
        return Math.sqrt(this.linkCount / 100);
    }

    get r() {
        return 100 * this.normal() + 30;
    }

    get fontSize() {
        return (20 * this.normal() + 10) + 'px';
    }
}
