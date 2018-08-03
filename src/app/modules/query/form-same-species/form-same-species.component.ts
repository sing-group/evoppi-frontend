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

import {Component, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GeneInfo, Interactome, Species} from '../../../entities/bio';
import {SpeciesService} from '../../results/services/species.service';
import {GeneService} from '../../results/services/gene.service';
import {InteractionService} from '../../results/services/interaction.service';
import {debounceTime, map} from 'rxjs/operators';
import {InteractomeService} from '../../results/services/interactome.service';
import {AbstractControl} from '@angular/forms/src/model';
import {ConfirmSheetComponent} from '../../material-design/confirm-sheet/confirm-sheet.component';

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
    public genes: GeneInfo[];

    public searchingGenes: boolean;
    public processing: boolean;

    public formSameSpecies: FormGroup;

    private controlSpecies: AbstractControl;
    private controlInteractomes: AbstractControl;
    private controlGene: AbstractControl;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private speciesService: SpeciesService,
        private interactomeService: InteractomeService,
        private geneService: GeneService,
        private interactionService: InteractionService,
        private formBuilder: FormBuilder,
        private bottomSheet: MatBottomSheet
    ) {
    }

    ngOnInit(): void {
        this.processing = false;
        this.searchingGenes = false;

        this.species = [];
        this.interactomes = [];
        this.genes = [];

        this.formSameSpecies = this.formBuilder.group({
            'species': [null, Validators.required],
            'interactomes': [{value: null, disabled: true}, [Validators.required]],
            'gene': [{value: null, disabled: true}, [Validators.required]],
            'level': [FormSameSpeciesComponent.DEFAULT_VALUES.level, [Validators.required, Validators.min(1), Validators.max(3)]]
        });

        this.controlSpecies = this.formSameSpecies.get('species');
        this.controlInteractomes = this.formSameSpecies.get('interactomes');
        this.controlGene = this.formSameSpecies.get('gene');

        this.updateSpecies();

        this.controlSpecies.valueChanges.subscribe(species => {
            this.updateInteractomes(species);

            this.controlInteractomes.reset();
            this.controlInteractomes.enable();
        });

        this.controlInteractomes.statusChanges.subscribe(status => {
            if (status === 'VALID') {
                this.controlGene.enable();
            } else {
                this.controlGene.reset();
                this.controlGene.disable();
            }
        });

        this.controlGene.valueChanges
            .pipe(debounceTime(500))
        .subscribe(genes => this.updateGenes(genes));
    }

    public selectAllInteractomes(): void {
        this.controlInteractomes.setValue(this.interactomes);
    }

    public deselectAllInteractomes(): void {
        this.controlInteractomes.reset();
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
        this.interactionService.getSameSpeciesInteraction(
            formModel.gene,
            formModel.interactomes.map(interactome => interactome.id),
            formModel.level
        )
            .subscribe(
                () => {
                    this.formSameSpecies.reset(FormSameSpeciesComponent.DEFAULT_VALUES.level);
                    this.showNotification();
                },
                error => {
                    this.formSameSpecies.controls['gene'].setErrors({'incorrect': 'Unknown gene'});
                    throw error;
                },
                () => this.processing = false
            );
    }

    public isValidForm(): boolean {
        return this.formSameSpecies.valid
            && Number.parseInt(this.controlGene.value, 10) >= 0
            && !this.processing;
    }

    private updateSpecies(): void {
        this.speciesService.getSpecies()
            .pipe(map(species => species.filter(specie => specie.interactomes.length > 1)))
        .subscribe(species => this.species = species);
    }

    private updateInteractomes(species: Species): void {
        this.interactomes = [];

        const interactomeIds = species.interactomes.map(interactome => interactome.id);
        this.interactomeService.getInteractomesByIds(interactomeIds)
            .subscribe(
                interactomes => this.interactomes = interactomes,
                error => { throw error; },
                () => this.interactomes.sort((a, b) => a.name < b.name ? -1 : 1)
            );
    }

    private updateGenes(value: string): void {
        if (this.searchingGenes) {
            return;
        }
        if (!value) {
            this.genes = [];
            return;
        }

        this.searchingGenes = true;

        let interactomes = [];
        if (this.interactomes.length > 0) {
            interactomes = this.interactomes.map((interactome) => interactome.id);
        }
        this.geneService.getGeneName(value, interactomes)
            .subscribe(
                genes => this.genes = genes,
                error => { throw error; },
                () => this.searchingGenes = false
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
