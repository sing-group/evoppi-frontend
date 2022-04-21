import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SpeciesService} from '../../results/services/species.service';
import {forkJoin, Observable, iif, of} from 'rxjs';
import {Interactome, Species} from '../../../entities/bio';
import {concatMap, map} from 'rxjs/operators';
import {EvoppiError} from '../../../entities/notification';
import {ListingOptions} from '../../../entities/data-source/listing-options';
import {PageData} from '../../../entities/data-source/page-data';
import {QueryHelper} from '../../../helpers/query.helper';
import {UniProtDb} from '../../../entities/bio/uniprot-db';
import {Work} from '../../../entities/execution';
import {PaginatedDataProvider} from '../../../entities/data-source/paginated-data-provider';
import {DatabaseInteractome} from '../../../entities/bio/database-interactome.model';
import {InteractomeService} from '../../results/services/interactome.service';

@Injectable()
export class DatabaseInteractomeService implements PaginatedDataProvider<DatabaseInteractome> {

    private endpoint = environment.evoppiUrl + 'api/interactome/database';

    constructor(
        private http: HttpClient,
        private speciesService: SpeciesService,
        private interactomeService: InteractomeService
    ) {
    }

    public listAll(retrieveSpecies: boolean = false): Observable<DatabaseInteractome[]> {
        let request = this.http.get<DatabaseInteractome[]>(this.endpoint);

        if (retrieveSpecies) {
            const empty: Species[] = [];

            request = request.pipe(
                concatMap(
                    interactomes => iif(() => interactomes.length === 0, of(empty), forkJoin(
                        interactomes.map(interactome => [interactome.speciesA.id, interactome.speciesB.id])
                            .reduce((x, y) => x.concat(y), [])
                            .filter((item, index, species) => species.indexOf(item) === index) // Removes duplicates
                            .map(speciesId => this.speciesService.getSpeciesById(speciesId))
                    ))
                        .pipe(
                            map(species => {
                                const speciesById = species.reduce((reduced, spec) => {
                                    reduced[spec.id] = spec;
                                    return reduced;
                                }, {});

                                for (const interactome of interactomes) {
                                    interactome.speciesA = speciesById[interactome.speciesA.id];
                                    interactome.speciesB = speciesById[interactome.speciesB.id];
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
                    'Error requesting database interactomes',
                    'The database interactomes could not be retrieved from the backend.'
                )
            );

    }

    list(options: ListingOptions, retrieveSpecies: boolean = false): Observable<PageData<DatabaseInteractome>> {
        const params = QueryHelper.listingOptionsToHttpParams(options);

        let request = this.http.get<DatabaseInteractome[]>(this.endpoint, {params, 'observe': 'response'});

        if (retrieveSpecies) {
            const empty: Species[] = [];

            request = request.pipe(
                concatMap(
                    response => iif(() => response.body.length === 0 , of(empty), forkJoin(
                        response.body.map(interactome => [interactome.speciesA.id, interactome.speciesB.id])
                            .reduce((x, y) => x.concat(y), [])
                            .filter((item, index, species) => species.indexOf(item) === index) // Removes duplicates
                            .map(speciesId => this.speciesService.getSpeciesById(speciesId))
                    ))
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
                    'Error requesting database interactomes',
                    'The database interactomes could not be retrieved from the backend.'
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
                    'The interactome could not be created.'
                )
            );
    }

    downloadInteractomeTsv(interactome: DatabaseInteractome) {
        this.interactomeService.downloadInteractomeTsv(interactome);
    }

    deleteInteractome(interactome: Interactome) {
        return this.interactomeService.deleteInteractome(interactome);
    }
}
