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
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {concatMap, map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {SpeciesService} from './species.service';
import {Interactome} from '../../../entities/bio';
import {saveAs} from 'file-saver/FileSaver';
import {EvoppiError} from '../../../entities/notification';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';

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

    getInteractomes(): Observable<Interactome[]> {
        return this.http.get<Interactome[]>(this.endpoint)
            .pipe(
                EvoppiError.throwOnError(
                    'Error requesting interactomes',
                    'The interactomes could not be retrieved from the backend.'
                )
            );
    }

    downloadSingleFasta(resultUrl: string, suffix: string) {
        this.http.get(resultUrl + '/interactome/fasta', {responseType: 'blob'})
            .pipe(
                EvoppiError.throwOnError(
                    'Error requesting single FASTA',
                    'Single FASTA could not be retrieved from the backend.'
                )
            )
            .subscribe(res => {
                const blob = new Blob([res], {type: 'text/x-fasta'});
                saveAs(blob, 'SingleFasta_' + suffix + '.fasta');
            });
    }

    downloadFasta(resultUrl: string, suffix: string, id: number ) {
        this.http.get(resultUrl + '/interactome/' + id + '/fasta', {responseType: 'blob'})
            .pipe(
                EvoppiError.throwOnError(
                    'Error requesting FASTA',
                    `FASTA for interactome '${id}' could not be retrieved from the backend.`
                )
            )
            .subscribe(res => {
                const blob = new Blob([res], {type: 'text/x-fasta'});
                saveAs(blob, 'Fasta_' + suffix + '.fasta');
            });
    }
}
