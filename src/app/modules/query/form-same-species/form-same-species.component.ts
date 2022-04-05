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

import {Component, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {GeneInfo, Interactome, Species} from '../../../entities/bio';
import {SpeciesService} from '../../results/services/species.service';
import {GeneService} from '../../results/services/gene.service';
import {InteractionService} from '../../results/services/interaction.service';
import {debounceTime, map} from 'rxjs/operators';
import {InteractomeService} from '../../results/services/interactome.service';
import {ConfirmSheetComponent} from '../../material-design/confirm-sheet/confirm-sheet.component';
import {WorkStatusService} from '../../results/services/work-status.service';
import {Subscription} from 'rxjs';
import {Predictome} from '../../../entities/bio/predictome.model';

@Component({
    selector: 'app-form-same-species',
    templateUrl: './form-same-species.component.html',
    styleUrls: ['./form-same-species.component.scss']
})
export class FormSameSpeciesComponent implements OnInit {
    private static readonly DEFAULT_VALUES = {
        level: 1
    };

    public species: Species[];
    public interactomes: Interactome[] = [];
    public predictomes: Interactome[] = [];
    public genes: GeneInfo[];

    public searchingGenes: boolean;
    public processing: boolean;

    public formSameSpecies: FormGroup;

    private controlSpecies: AbstractControl;
    private controlInteractomes: AbstractControl;
    private controlPredictomes: AbstractControl;
    private controlGene: AbstractControl;

    private lastGeneSearchSubscription: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private speciesService: SpeciesService,
        private interactomeService: InteractomeService,
        private geneService: GeneService,
        private interactionService: InteractionService,
        private formBuilder: FormBuilder,
        private bottomSheet: MatBottomSheet,
        private workStatusService: WorkStatusService
    ) {
    }

    ngOnInit(): void {
        this.processing = false;
        this.searchingGenes = false;

        this.species = [];
        this.interactomes = [];
        this.predictomes = [];
        this.genes = [];

        this.formSameSpecies = this.formBuilder.group({
            'species': [null, Validators.required],
            'interactomes': [{value: null, disabled: true}, [this.validateInteractomeSelection()]],
            'predictomes': [{value: null, disabled: true}, [this.validateInteractomeSelection()]],
            'gene': [{value: null, disabled: true}, [Validators.required]],
            'level': [FormSameSpeciesComponent.DEFAULT_VALUES.level, [Validators.required, Validators.min(1), Validators.max(3)]]
        });

        this.controlSpecies = this.formSameSpecies.get('species');
        this.controlInteractomes = this.formSameSpecies.get('interactomes');
        this.controlPredictomes = this.formSameSpecies.get('predictomes');
        this.controlGene = this.formSameSpecies.get('gene');

        this.updateSpecies();

        this.controlSpecies.valueChanges.subscribe(species => {
            this.updateInteractomes(species);

            this.controlInteractomes.reset();
            this.controlInteractomes.enable();

            this.updatePredictomes(species);

            this.controlPredictomes.reset();
            this.controlPredictomes.enable();
        });

        this.controlInteractomes.statusChanges.subscribe(status => this.updateControlGene(status));

        this.controlPredictomes.statusChanges.subscribe(status => this.updateControlGene(status));

        this.controlGene.valueChanges
            .pipe(debounceTime(500))
            .subscribe(genes => this.updateGenes(genes));
    }

    private validateInteractomeSelection(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.interactomes === undefined || this.predictomes === undefined) {
                console.warn('Interactomes/predictomes are not loaded.');
                return null;
            }

            if (
                (!this.controlInteractomes.value || this.controlInteractomes.value.length === 0) &&
                (!this.controlPredictomes.value || this.controlPredictomes.value.length === 0)
            ) {
                return {
                    'interactomes': `At least one interactome or predictome must be selected.`,
                    'predictomes': `At least one interactome or predictome must be selected.`
                };
            } else {
                return null;
            }
        }
    }

    private updateControlGene(status: string): void {
        if (status === 'VALID') {
            this.controlGene.enable();
        } else {
            this.controlGene.reset();
            this.controlGene.disable();
        }
    }

    public selectAllInteractomes(): void {
        this.controlInteractomes.setValue(this.interactomes);
    }

    public deselectAllInteractomes(): void {
        this.controlInteractomes.reset();
    }

    public selectAllPredictomes(): void {
        this.controlPredictomes.setValue(this.predictomes);
    }

    public deselectAllPredictomes(): void {
        this.controlPredictomes.reset();
    }

    public onGeneSelected(value): void {
        this.controlGene.patchValue(value, {emitEvent: false});
        this.genes = [];
    }

    public onRequestCompare(): void {
        if (!this.isValidForm()) {
            return;
        }

        this.processing = true;

        const formModel = this.formSameSpecies.value;

        const queryInteractomes = this.getCurrentQueryInteractomes();

        this.interactionService.getSameSpeciesInteraction(
            formModel.gene,
            queryInteractomes,
            formModel.level
        )
            .subscribe(
                (work) => {
                    this.formSameSpecies.reset(FormSameSpeciesComponent.DEFAULT_VALUES.level);
                    this.workStatusService.setLocalWork('sameWorks', work);
                    this.showNotification();
                },
                error => {
                    this.formSameSpecies.controls['gene'].setErrors({'incorrect': 'Unknown gene'});
                    throw error;
                },
                () => this.processing = false
            );

        this.processing = false;
    }

    private getCurrentQueryInteractomes(): number[] {
        const formModel = this.formSameSpecies.value;

        const queryInteractomes = [];
        if (formModel.interactomes) {
            formModel.interactomes.map(i => i.id).forEach(i => queryInteractomes.push(i));
        }
        if (formModel.predictomes) {
            formModel.predictomes.map(p => p.id).forEach(p => queryInteractomes.push(p));
        }

        return queryInteractomes;
    }

    public isValidForm(): boolean {
        this.forceInteractomeControlsValidation();

        return this.formSameSpecies.valid
            && Number.parseInt(this.controlGene.value, 10) >= 0
            && !this.processing;
    }

    private forceInteractomeControlsValidation(): void {
        if (!this.controlPredictomes.valid) {
            this.controlPredictomes.updateValueAndValidity();
        }
        if (!this.controlInteractomes.valid) {
            this.controlInteractomes.updateValueAndValidity();
        }
    }

    private updateSpecies(): void {
        this.speciesService.listAll()
            .pipe(map(species => species.filter(s => s.interactomes.length >= 1 || s.predictomes.length >= 1)))
            .subscribe(species => this.species = species);
    }

    private updateInteractomesOrPredictomes(
        species: Species,
        interactomes: Interactome[],
        speciesToInteractomeIds: (species: Species) => number[]
    ): void {
        interactomes.splice(0, interactomes.length);

        if (species === null) {
            return;
        }

        const interactomeIds = speciesToInteractomeIds(species);

        this.interactomeService.getInteractomesByIds(interactomeIds)
            .subscribe(
                newInteractomes => newInteractomes.forEach(
                    interactome => {
                        if (interactome.speciesA.id === species.id && interactome.speciesB.id === species.id) {
                            interactomes.push(interactome);
                        }
                    }
                ),
                error => {
                    throw error;
                },
                () => interactomes.sort((a, b) => a.name < b.name ? -1 : 1)
            );
    }

    private updateInteractomes(species: Species): void {
        if (this.interactomes === undefined) {
            this.interactomes = [];
        }

        this.updateInteractomesOrPredictomes(
            species, this.interactomes, speciesToMap => speciesToMap.interactomes.map(interactome => interactome.id)
        );
    }

    private updatePredictomes(species: Species): void {
        if (this.predictomes === undefined) {
            this.predictomes = [];
        }

        this.updateInteractomesOrPredictomes(
            species, this.predictomes, speciesToMap => speciesToMap.predictomes.map(interactome => interactome.id)
        );
    }

    private updateGenes(value: string): void {
        if (this.searchingGenes) {
            this.lastGeneSearchSubscription.unsubscribe();
        }

        if (!value) {
            this.genes = [];
            return;
        }

        this.searchingGenes = true;

        const interactomes = this.getCurrentQueryInteractomes();

        this.lastGeneSearchSubscription = this.geneService.getGeneName(value, interactomes)
            .subscribe(
                genes => this.genes = genes,
                error => {
                    throw error;
                },
                () => {
                    this.searchingGenes = false;
                    this.lastGeneSearchSubscription.unsubscribe();
                }
            );
    }

    private showNotification() {
        this.bottomSheet.open(
            ConfirmSheetComponent,
            {
                data: {
                    title: 'Interactions requested',
                    message: 'Same species interactions correctly requested. The analysis may take some time, but you can track its ' +
                        'status in the Results section.',
                    confirmLabel: 'Go to results',
                    cancelLabel: 'Close',
                    headerClass: 'card-header-success'
                }
            }
        ).afterDismissed().subscribe(goToResults => {
            if (goToResults) {
                this.router.navigate([
                    this.route.routeConfig.data.resultsResource
                ]);
            }
        });
    }
}
