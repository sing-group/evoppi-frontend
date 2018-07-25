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

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {SpeciesService} from './species.service';
import {Interactome} from '../../../entities/bio';
import {ErrorHelper} from '../../../helpers/error.helper';

@Injectable()
export class InteractomeService {

    private endpoint = environment.evoppiUrl + 'api/interactome';

    constructor(private http: HttpClient, private speciesService: SpeciesService) {
    }

    getInteractome(id: number, retrieveSpecies: boolean = false): Observable<Interactome> {
        let request = this.http.get<Interactome>(this.endpoint + '/' + id);

        if (retrieveSpecies) {
            request = request.concatMap(
                interactome => this.speciesService.getSpeciesById(interactome.species.id),
                (interactome, species) => {
                    interactome.species = species;

                    return interactome;
                }
            );
        }

        return request
            .pipe(
                catchError(ErrorHelper.handleError('getInteractome', null))
            );
    }

    getInteractomes(): Observable<Interactome[]> {
        return this.http.get<Interactome[]>(this.endpoint)
            .pipe(
                catchError(ErrorHelper.handleError('getInteractomes', []))
            );
    }
}
