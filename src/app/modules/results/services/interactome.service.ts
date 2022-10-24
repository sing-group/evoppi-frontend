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

import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {concatMap, map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {SpeciesService} from './species.service';
import {Interactome, Species} from '../../../entities/bio';
import {EvoppiError} from '../../../entities/notification';
import {saveAs} from 'file-saver';
import {PaginatedDataProvider} from '../../../entities/data-source/paginated-data-provider';
import {PageData} from '../../../entities/data-source/page-data';
import {ListingOptions} from '../../../entities/data-source/listing-options';
import {QueryHelper} from '../../../helpers/query.helper';
import {UniProtDb} from '../../../entities/bio/uniprot-db';
import {Work} from '../../../entities/execution';
import {InteractomeCollection} from '../../../entities/bio/interactome-collection.model';

@Injectable()
export class InteractomeService implements PaginatedDataProvider<Interactome> {

    private endpoint = environment.evoppiUrl + 'api/interactome';

    constructor(private http: HttpClient, private speciesService: SpeciesService) {
    }

    list(options: ListingOptions, retrieveSpecies: boolean = false): Observable<PageData<Interactome>> {
        const params = QueryHelper.listingOptionsToHttpParams(options);

        let request = this.http.get<Interactome[]>(this.endpoint, {params, 'observe': 'response'});

        if (retrieveSpecies) {
            request = request.pipe(
                concatMap(
                    response => forkJoin(
                        response.body.map(interactome => [interactome.speciesA.id, interactome.speciesB.id])
                            .reduce((x, y) => x.concat(y), [])
                            .filter((item, index, species) => species.indexOf(item) === index) // Removes duplicates
                            .map(speciesId => this.speciesService.getSpeciesById(speciesId))
                    )
                        .pipe(
                            map(species => {
                                const speciesById = species.reduce((reduced, spec) => {
                                    reduced[spec.id] = spec;
                                    return reduced;
                                }, {});

                                for (const interactome of response.body) {
                                    interactome.speciesA = speciesById[interactome.speciesA.id];
                                    interactome.speciesB = speciesById[interactome.speciesB.id];
                                }

                                return response;
                            })
                        )
                )
            );
        }

        return request
            .pipe(
                map(response => new PageData(Number(response.headers.get('X-Total-Count')), response.body)),
                EvoppiError.throwOnError(
                    'Error requesting interactomes',
                    'The interactomes could not be retrieved from the backend.'
                )
            );
    }

    getInteractome(id: number, retrieveSpecies: boolean = false): Observable<Interactome> {
        let request = this.http.get<Interactome>(this.endpoint + '/' + id);

        if (retrieveSpecies) {
            request = request.pipe(
                concatMap(
                    interactome => this.speciesService.getSpeciesById(interactome.speciesA.id)
                        .pipe(
                            map(species => {
                                interactome.speciesA = species;

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

    public downloadInteractomeTsv(interactome: Interactome) {
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
                const interactomeName = interactome.speciesA.name === interactome.speciesB.name ?
                    interactome.name + '_' + interactome.speciesA.name + '.tsv' :
                    interactome.name + '_' + interactome.speciesA.name + '_' + interactome.speciesB.name + '.tsv';
                saveAs(blob, interactomeName);
            });
    }

    public deleteInteractome(interactome: Interactome) {
        return this.http.delete(this.endpoint + '/' + interactome.id)
            .pipe(
                EvoppiError.throwOnError(
                    'Error deleting interactome',
                    `An error ocurred when deleting interactome '${interactome.id}'.`
                )
            );
    }

    public listCollections(): Observable<InteractomeCollection[]> {
        return this.http.get<InteractomeCollection[]>(this.endpoint + '/collections')
            .pipe(
                map(res => res.sort((a, b) => a.name < b.name ? -1 : 1)),
                EvoppiError.throwOnError('Error retrieving interactome collections', 'The list of interactome collections could not be retrieved from the backend.')
            );
    }
}
