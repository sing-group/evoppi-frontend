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
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GeneInfo, Interactome, Species} from '../../../entities/bio';
import {SpeciesService} from '../../results/services/species.service';
import {InteractomeService} from '../../results/services/interactome.service';
import {InteractionService} from '../../results/services/interaction.service';
import {GeneService} from '../../results/services/gene.service';
import {debounceTime, map} from 'rxjs/operators';
import {ConfirmSheetComponent} from '../../material-design/confirm-sheet/confirm-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {WorkStatusService} from '../../results/services/work-status.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-form-distinct-species',
    templateUrl: './form-distinct-species.component.html',
    styleUrls: ['./form-distinct-species.component.scss']
})
export class FormDistinctSpeciesComponent implements OnInit {
    private static readonly DEFAULT_VALUES = {
        eValue: 0.05,
        minAlignLength: 18,
        numDescriptions: 1,
        minIdentity: 95,
        level: 1
    };

    public referenceSpecies: Species[];
    public targetSpecies: Species[];

    public referenceInteractomes: Interactome[];
    public targetInteractomes: Interactome[];

    public genes: GeneInfo[];

    public searchingGenes = false;
    public processing = false;

    public formDistinctSpecies: FormGroup;

    private controlReferenceSpecies: AbstractControl;
    private controlReferenceInteractomes: AbstractControl;
    private controlTargetSpecies: AbstractControl;
    private controlTargetInteractomes: AbstractControl;
    private controlGene: AbstractControl;

    private lastGeneSearchSubscription: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private speciesService: SpeciesService,
        private interactomeService: InteractomeService,
        private interactionService: InteractionService,
        private geneService: GeneService,
        private formBuilder: FormBuilder,
        private bottomSheet: MatBottomSheet,
        private workStatusService: WorkStatusService) {
    }

    ngOnInit(): void {
        this.formDistinctSpecies = this.formBuilder.group({
            'referenceSpecies': [null, Validators.required],
            'targetSpecies': [{value: null, disabled: true}, Validators.required],
            'referenceInteractome': [{value: null, disabled: true}, Validators.required],
            'targetInteractome': [{value: null, disabled: true}, Validators.required],
            'gene': [{value: null, disabled: true}, Validators.required],
            'eValue': [FormDistinctSpeciesComponent.DEFAULT_VALUES.eValue, [Validators.required, Validators.min(0)]],
            'minAlignLength': [FormDistinctSpeciesComponent.DEFAULT_VALUES.minAlignLength, [Validators.required, Validators.min(0)]],
            'numDescriptions': [
                FormDistinctSpeciesComponent.DEFAULT_VALUES.numDescriptions,
                [Validators.required, Validators.min(1), Validators.max(100)]
            ],
            'minIdentity': [
                FormDistinctSpeciesComponent.DEFAULT_VALUES.minIdentity,
                [Validators.required, Validators.min(0), Validators.max(100)]
            ],
            'level': [FormDistinctSpeciesComponent.DEFAULT_VALUES.level, [Validators.required, Validators.min(1), Validators.max(3)]],
        });

        this.controlReferenceSpecies = this.formDistinctSpecies.get('referenceSpecies');
        this.controlReferenceInteractomes = this.formDistinctSpecies.get('referenceInteractome');
        this.controlTargetSpecies = this.formDistinctSpecies.get('targetSpecies');
        this.controlTargetInteractomes = this.formDistinctSpecies.get('targetInteractome');
        this.controlGene = this.formDistinctSpecies.get('gene');

        this.updateReferenceSpecies();

        this.controlReferenceSpecies.valueChanges.subscribe(species => {
            this.onReferenceSpeciesChange(species);

            if (this.controlTargetSpecies.value === species) {
                this.controlTargetSpecies.reset();
            }
        });

        this.controlTargetSpecies.valueChanges.subscribe(species => {
            if (species !== null) {
                this.onTargetSpeciesChange(species);
            }
        });

        this.controlReferenceSpecies.statusChanges.subscribe(status => {
            if (status === 'VALID') {
                this.controlTargetSpecies.enable();
                this.controlReferenceInteractomes.enable();
            } else {
                this.controlTargetSpecies.reset();
                this.controlTargetSpecies.disable();
                this.controlReferenceInteractomes.reset();
                this.controlReferenceInteractomes.disable();
            }
        });

        this.controlTargetSpecies.statusChanges.subscribe(status => {
            if (status === 'VALID') {
                this.controlTargetInteractomes.enable();
            } else {
                this.controlTargetInteractomes.reset();
                this.controlTargetInteractomes.disable();
            }
        });

        this.controlReferenceInteractomes.statusChanges.subscribe(status => {
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

    public selectAllReferenceInteractomes(): void {
        this.controlReferenceInteractomes.setValue(this.referenceInteractomes);
    }

    public deselectAllReferenceInteractomes(): void {
        this.controlReferenceInteractomes.reset();
    }

    public selectAllTargetInteractomes(): void {
        this.controlTargetInteractomes.setValue(this.targetInteractomes);
    }

    public deselectAllTargetInteractomes(): void {
        this.controlTargetInteractomes.reset();
    }

    public onGeneSelected(value): void {
        this.controlGene.patchValue(value, {emitEvent: false});
        this.genes = [];
    }

    public isValidForm(): boolean {
        return this.formDistinctSpecies.valid
            && Number.parseInt(this.controlGene.value, 10) >= 0
            && !this.processing;
    }

    public onRequestCompare(): void {
        if (!this.isValidForm()) {
            return;
        }

        this.processing = true;

        const formModel = this.formDistinctSpecies.value;
        this.interactionService.getDistinctSpeciesInteraction(
            formModel.gene,
            formModel.referenceInteractome.map(interactome => interactome.id),
            formModel.targetInteractome.map(interactome => interactome.id),
            formModel.level,
            formModel.eValue,
            formModel.numDescriptions,
            formModel.minIdentity / 100,
            formModel.minAlignLength
        )
            .subscribe(
                (work) => {
                    this.formDistinctSpecies.reset(FormDistinctSpeciesComponent.DEFAULT_VALUES);
                    this.workStatusService.setLocalWork('distinctWorks', work);
                    this.showNotification();
                },
                error => {
                    this.formDistinctSpecies.setErrors({'invalidForm': 'Error: ' + error.error});
                    throw error;
                },
                () => this.processing = false
            );
    }

    private updateReferenceSpecies(): void {
        this.speciesService.listAll()
            .pipe(map(species => species.filter(specie => specie.interactomes.length >= 1)))
        .subscribe(species => this.referenceSpecies = species);
    }

    private onReferenceSpeciesChange(species: Species) {
        this.referenceInteractomes = [];
        if (species === null) {
            return;
        }
        this.targetSpecies = this.referenceSpecies.filter(s => s !== species);

        const interactomeIds = species.interactomes.map(interactome => interactome.id);
        this.interactomeService.getInteractomesByIds(interactomeIds)
            .subscribe(
                interactomes => this.referenceInteractomes = interactomes,
                error => { throw error; },
                () => this.referenceInteractomes.sort((a, b) => a.name < b.name ? -1 : 1)
            );
    }

    private onTargetSpeciesChange(species: Species) {
        this.targetInteractomes = [];

        const interactomeIds = species.interactomes.map(interactome => interactome.id);
        this.interactomeService.getInteractomesByIds(interactomeIds)
            .subscribe(
                interactomes => this.targetInteractomes = interactomes,
                error => { throw error; },
                () => this.targetInteractomes.sort((a, b) => a.name < b.name ? -1 : 1)
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

        const interactomes = this.formDistinctSpecies.value.referenceInteractome.map(interactome => interactome.id);

        this.lastGeneSearchSubscription = this.geneService.getGeneName(value, interactomes)
            .subscribe(
                genes => this.genes = genes,
                error => { throw error; },
                () => {
                    this.searchingGenes = false;
                    this.lastGeneSearchSubscription.unsubscribe();
                }
            );
    }

    private showNotification(): void {
        this.bottomSheet.open(
            ConfirmSheetComponent,
            {
                data: {
                    title: 'Interactions requested',
                    message: 'Different species interactions correctly requested. The analysis may take some time, but you can track its ' +
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
