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

import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {concatMap, map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {SpeciesService} from './species.service';
import {Interactome} from '../../../entities/bio';
import {EvoppiError} from '../../../entities/notification';
import {InteractomeQueryParams} from '../../../entities/bio/interactome-query-params';
import {saveAs} from 'file-saver';
import {toPlainObject} from '../../../utils/types';

@Injectable()
export class InteractomeService {

    private endpoint = environment.evoppiUrl + 'api/interactome';

    constructor(private http: HttpClient, private speciesService: SpeciesService) {
    }

    getInteractome(id: number, retrieveSpecies: boolean = false): Observable<Interactome> {
        let request = this.http.get<Interactome>(this.endpoint + '/' + id);

        if (retrieveSpecies) {
            request = request.pipe(
                concatMap(
                    interactome => this.speciesService.getSpeciesById(interactome.species.id)
                        .pipe(
                            map(species => {
                                interactome.species = species;

                                return interactome;
                            })
                        )
                )
            );
        }

        return request
            .pipe(
                EvoppiError.throwOnError(
                    'Error requesting interactome',
                    `The interactome '${id}' could not be retrieved from the backend.`
                )
            );
    }

    getInteractomesByIds(ids: number[], retrieveSpecies: boolean = false): Observable<Interactome[]> {
        return forkJoin(
            ids.map(id => this.getInteractome(id, retrieveSpecies))
        );
    }

    getInteractomes(queryParams: InteractomeQueryParams, retrieveSpecies: boolean = false): Observable<Interactome[]> {
        const options = {
            params: new HttpParams({
                fromObject: toPlainObject(queryParams)
            }),
            headers: new HttpHeaders({
                'Accept': 'application/json'
            })
        };

        let request = this.http.get<Interactome[]>(this.endpoint, options);

        if (retrieveSpecies) {
            request = request.pipe(
                concatMap(
                    interactomes => forkJoin(
                        interactomes.map(interactome => interactome.species.id)
                            .filter((item, index, species) => species.indexOf(item) === index) // Removes duplicates
                            .map(speciesId => this.speciesService.getSpeciesById(speciesId))
                    )
                        .pipe(
                            map(species => {
                                const speciesById = species.reduce((reduced, spec) => {
                                    reduced[spec.id] = spec;
                                    return reduced;
                                }, {});

                                for (const interactome of interactomes) {
                                    interactome.species = speciesById[interactome.species.id];
                                }

                                return interactomes;
                            })
                        )
                )
            );
        }

        return request
            .pipe(
                EvoppiError.throwOnError(
                    'Error requesting interactomes',
                    'The interactomes could not be retrieved from the backend.'
                )
            );
    }

    downloadInteractomeTsv(interactome: Interactome) {
        const options = {
            headers: new HttpHeaders({
                'Accept': 'text/plain'
            })
        };

        this.http.get(this.endpoint + '/' + interactome.id + '/interactions', {responseType: 'blob'})
            .pipe(
                EvoppiError.throwOnError(
                    'Error requesting interactions TSV',
                    `Interactions for interactome '${interactome.id}' could not be retrieved from the backend.`
                )
            )
            .subscribe(res => {
                const blob = new Blob([res], {type: 'text/plain'});
                saveAs(blob, interactome.name + '_' + interactome.dbSourceIdType + '_' + interactome.species.name + '.tsv');
            });
    }
}
