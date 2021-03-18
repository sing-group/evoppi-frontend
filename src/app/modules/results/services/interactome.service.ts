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

@Injectable()
export class InteractomeService implements PaginatedDataProvider<Interactome> {

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

    public listAll(retrieveSpecies: boolean = false): Observable<Interactome[]> {
        let request = this.http.get<Interactome[]>(this.endpoint);

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

    list(options: ListingOptions, retrieveSpecies: boolean = false): Observable<PageData<Interactome>> {
        const params = QueryHelper.listingOptionsToHttpParams(options);

        let request = this.http.get<Interactome[]>(this.endpoint, {params, 'observe': 'response'});

        if (retrieveSpecies) {
            request = request.pipe(
                concatMap(
                    response => forkJoin(
                        response.body.map(interactome => interactome.species.id)
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
                                    interactome.species = speciesById[interactome.species.id];
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

    public createInteractome(
        interactomeFile: File,
        name: string,
        species: Species,
        dbSource: UniProtDb,
        geneColumn1: number,
        geneColumn2: number,
        headerLinesCount: number,
        genePrefix?: string,
        geneSuffix?: string,
        multipleInteractomeParams?: {
            speciesFileId: number,
            speciesColumn1: number,
            speciesColumn2: number,
            speciesPrefix?: string,
            speciesSuffix?: string
        }
    ): Observable<Work> {
        const formData: FormData = new FormData();

        formData.append('file', interactomeFile);
        formData.append('name', name);
        formData.append('speciesDbId', String(species.id));
        formData.append('dbSource', dbSource.name);
        formData.append('geneColumn1', String(geneColumn1));
        formData.append('geneColumn2', String(geneColumn2));
        formData.append('headerLinesCount', String(headerLinesCount));

        if (genePrefix) {
            formData.append('genePrefix', genePrefix);
        }
        if (geneSuffix) {
            formData.append('geneSuffix', geneSuffix);
        }

        if (multipleInteractomeParams) {
            formData.append('speciesFileId', String(multipleInteractomeParams.speciesFileId));
            formData.append('organismColumn1', String(multipleInteractomeParams.speciesColumn1));
            formData.append('organismColumn2', String(multipleInteractomeParams.speciesColumn2));
            if (multipleInteractomeParams.speciesPrefix) {
                formData.append('organismPrefix', multipleInteractomeParams.speciesPrefix);
            }
            if (multipleInteractomeParams.speciesSuffix) {
                formData.append('organismSuffix', multipleInteractomeParams.speciesSuffix);
            }
        }

        return this.http.post<Work>(this.endpoint, formData)
            .pipe(
                EvoppiError.throwOnError(
                    'Error creating interactome',
                    'The interactomes could not be created.'
                )
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
                saveAs(blob, interactome.name + '_' + interactome.dbSourceIdType + '_' + interactome.species.name + '.tsv');
            });
    }
}
