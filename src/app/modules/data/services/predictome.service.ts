import {Injectable} from '@angular/core';
import {PaginatedDataProvider} from '../../../entities/data-source/paginated-data-provider';
import {Predictome} from '../../../entities/bio/predictome.model';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SpeciesService} from '../../results/services/species.service';
import {InteractomeService} from '../../results/services/interactome.service';
import {forkJoin, Observable} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';
import {EvoppiError} from '../../../entities/notification';
import {ListingOptions} from '../../../entities/data-source/listing-options';
import {PageData} from '../../../entities/data-source/page-data';
import {QueryHelper} from '../../../helpers/query.helper';
import {Interactome, Species} from '../../../entities/bio';

@Injectable({
    providedIn: 'root'
})
export class PredictomeService implements PaginatedDataProvider<Predictome> {

    private endpoint = environment.evoppiUrl + 'api/interactome/predictome';

    constructor(
        private http: HttpClient,
        private speciesService: SpeciesService,
        private interactomeService: InteractomeService
    ) {
    }

    public listAll(retrieveSpecies: boolean = false): Observable<Predictome[]> {
        let request = this.http.get<Predictome[]>(this.endpoint);

        if (retrieveSpecies) {
            request = request.pipe(
                concatMap(
                    interactomes => forkJoin(
                        interactomes.map(interactome => [interactome.speciesA.id, interactome.speciesB.id])
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
                    'Error requesting predictomes',
                    'The predictomes could not be retrieved from the backend.'
                )
            );

    }

    list(options: ListingOptions, retrieveSpecies: boolean = false): Observable<PageData<Predictome>> {
        const params = QueryHelper.listingOptionsToHttpParams(options);

        let request = this.http.get<Predictome[]>(this.endpoint, {params, 'observe': 'response'});

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
                    'Error requesting predictomes',
                    'The predictomes could not be retrieved from the backend.'
                )
            );
    }

    public createPredictome(
        interactomeFile: File,
        speciesA: Species,
        sourceInteractome: String,
        conversionDatabase: String,
    ): Observable<Predictome> {
        const formData: FormData = new FormData();

        formData.append('file', interactomeFile);
        formData.append('speciesADbId', String(speciesA.id));
        formData.append('speciesBDbId', String(speciesA.id));
        formData.append('sourceInteractome', String(sourceInteractome));
        formData.append('conversionDatabase', String(conversionDatabase));

        return this.http.post<Predictome>(this.endpoint, formData)
            .pipe(
                EvoppiError.throwOnError(
                    'Error creating predictome',
                    'The predictome could not be created.'
                )
            );
    }

    downloadInteractomeTsv(interactome: Predictome) {
        this.interactomeService.downloadInteractomeTsv(interactome);
    }

    deleteInteractome(interactome: Interactome) {
        return this.interactomeService.deleteInteractome(interactome);
    }
}
