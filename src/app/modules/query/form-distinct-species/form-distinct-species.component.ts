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
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {GeneInfo, Interactome, Species} from '../../../entities/bio';
import {SpeciesService} from '../../results/services/species.service';
import {InteractomeService} from '../../results/services/interactome.service';
import {InteractionService} from '../../results/services/interaction.service';
import {GeneService} from '../../results/services/gene.service';
import {debounceTime, map} from 'rxjs/operators';
import {ConfirmSheetComponent} from '../../material-design/confirm-sheet/confirm-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {WorkStatusService} from '../../results/services/work-status.service';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {InteractomeSelectionDialogComponent} from '../../shared/components/interactome-selection-dialog/interactome-selection-dialog.component';

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
    public referencePredictomes: Interactome[];
    public targetInteractomes: Interactome[];
    public targetPredictomes: Interactome[];

    public genes: GeneInfo[];

    public searchingGenes = false;
    public processing = false;

    public formDistinctSpecies: FormGroup;

    private controlReferenceSpecies: AbstractControl;
    private controlReferenceInteractomes: AbstractControl;
    private controlReferencePredictomes: AbstractControl;
    private controlTargetSpecies: AbstractControl;
    private controlTargetInteractomes: AbstractControl;
    private controlTargetPredictomes: AbstractControl;
    private controlGene: AbstractControl;

    private lastGeneSearchSubscription: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog,
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
            'referenceInteractomes': [{value: null, disabled: true}, [this.validateReferenceInteractomeSelection()]],
            'referencePredictomes': [{value: null, disabled: true}, [this.validateReferenceInteractomeSelection()]],
            'targetInteractomes': [{value: null, disabled: true}, [this.validateTargetInteractomeSelection()]],
            'targetPredictomes': [{value: null, disabled: true}, [this.validateTargetInteractomeSelection()]],
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
        this.controlReferenceInteractomes = this.formDistinctSpecies.get('referenceInteractomes');
        this.controlReferencePredictomes = this.formDistinctSpecies.get('referencePredictomes');
        this.controlTargetSpecies = this.formDistinctSpecies.get('targetSpecies');
        this.controlTargetInteractomes = this.formDistinctSpecies.get('targetInteractomes');
        this.controlTargetPredictomes = this.formDistinctSpecies.get('targetPredictomes');
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
                this.controlReferencePredictomes.enable();
            } else {
                this.controlTargetSpecies.reset();
                this.controlTargetSpecies.disable();
                this.controlReferenceInteractomes.reset();
                this.controlReferenceInteractomes.disable();
                this.controlReferencePredictomes.reset();
                this.controlReferencePredictomes.disable();
            }
        });

        this.controlTargetSpecies.statusChanges.subscribe(status => {
            if (status === 'VALID') {
                this.controlTargetInteractomes.enable();
                this.controlTargetPredictomes.enable();
            } else {
                this.controlTargetInteractomes.reset();
                this.controlTargetInteractomes.disable();
                this.controlTargetPredictomes.reset();
                this.controlTargetPredictomes.disable();
            }
        });

        this.controlReferenceInteractomes.statusChanges.subscribe(status => this.updateControlGene(status));

        this.controlReferencePredictomes.statusChanges.subscribe(status => this.updateControlGene(status));

        this.controlGene.valueChanges
            .pipe(debounceTime(500))
            .subscribe(genes => this.updateGenes(genes));
    }

    private validateReferenceInteractomeSelection(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.referenceInteractomes === undefined || this.referencePredictomes === undefined) {
                console.warn('Reference interactomes/predictomes are not loaded.');
                return null;
            }

            if (
                (!this.controlReferenceInteractomes.value || this.controlReferenceInteractomes.value.length === 0) &&
                (!this.controlReferencePredictomes.value || this.controlReferencePredictomes.value.length === 0)
            ) {
                return {
                    'referenceInteractomes': `At least one reference interactome or predictome must be selected.`,
                    'referencePredictomes': `At least one reference interactome or predictome must be selected.`
                };
            } else {
                return null;
            }
        }
    }

    private validateTargetInteractomeSelection(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.targetInteractomes === undefined || this.targetPredictomes === undefined) {
                console.warn('Target interactomes/predictomes are not loaded.');
                return null;
            }

            if (
                (!this.controlTargetInteractomes.value || this.controlTargetInteractomes.value.length === 0) &&
                (!this.controlTargetPredictomes.value || this.controlTargetPredictomes.value.length === 0)
            ) {
                return {
                    'targetInteractomes': `At least one target interactome or predictome must be selected.`,
                    'targetPredictomes': `At least one target interactome or predictome must be selected.`
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

    public hasReferencePredictomes(): boolean {
        return this.referencePredictomes !== undefined && this.referencePredictomes.length > 0;
    }

    public hasTargetPredictomes(): boolean {
        return this.targetPredictomes !== undefined && this.targetPredictomes.length > 0;
    }

    public summarizeSelectedReferencePredictomes(): string {
        return this.summarizeSelectedPredictomes(this.controlReferencePredictomes.value);
    }

    public summarizeSelectedTargetPredictomes(): string {
        return this.summarizeSelectedPredictomes(this.controlTargetPredictomes.value);
    }

    private summarizeSelectedPredictomes(predictomes?: Interactome[]): string {
        if (predictomes && predictomes.length > 0) {
            const numSelected = predictomes.length;
            return numSelected === 1 ? 'One predictome selected' : `${numSelected} predictomes selected`;
        } else {
            return 'No predictome selected';
        }
    }

    public selectAllReferenceInteractomes(): void {
        this.controlReferenceInteractomes.setValue(this.referenceInteractomes);
    }

    public deselectAllReferenceInteractomes(): void {
        this.controlReferenceInteractomes.reset();
    }

    public selectAllReferencePredictomes(): void {
        this.controlReferencePredictomes.setValue(this.referencePredictomes);
    }

    public deselectAllReferencePredictomes(): void {
        this.controlReferencePredictomes.reset();
    }

    public selectAllTargetInteractomes(): void {
        this.controlTargetInteractomes.setValue(this.targetInteractomes);
    }

    public deselectAllTargetInteractomes(): void {
        this.controlTargetInteractomes.reset();
    }

    public selectAllTargetPredictomes(): void {
        this.controlTargetPredictomes.setValue(this.targetPredictomes);
    }

    public deselectAllTargetPredictomes(): void {
        this.controlTargetPredictomes.reset();
    }

    public onGeneSelected(value): void {
        this.controlGene.patchValue(value, {emitEvent: false});
        this.genes = [];
    }

    public isValidForm(): boolean {
        this.forceInteractomeControlsValidation();

        return this.formDistinctSpecies.valid
            && Number.parseInt(this.controlGene.value, 10) >= 0
            && !this.processing;
    }

    private forceInteractomeControlsValidation(): void {
        if (!this.controlReferenceInteractomes.valid) {
            this.controlReferenceInteractomes.updateValueAndValidity();
        }
        if (!this.controlReferencePredictomes.valid) {
            this.controlReferencePredictomes.updateValueAndValidity();
        }
        if (!this.controlTargetInteractomes.valid) {
            this.controlTargetInteractomes.updateValueAndValidity();
        }
        if (!this.controlTargetPredictomes.valid) {
            this.controlTargetPredictomes.updateValueAndValidity();
        }
    }

    public onRequestCompare(): void {
        if (!this.isValidForm()) {
            return;
        }

        this.processing = true;

        const referenceInteractomes = this.getCurrentQueryReferenceInteractomes();
        const targetInteractomes = this.getCurrentQueryTargetInteractomes();

        const formModel = this.formDistinctSpecies.value;
        this.interactionService.getDistinctSpeciesInteraction(
            formModel.gene,
            referenceInteractomes,
            targetInteractomes,
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
            .pipe(map(species => species.filter(s => s.interactomes.length >= 1 || s.predictomes.length >= 1)))
            .subscribe(species => this.referenceSpecies = species);
    }

    private onReferenceSpeciesChange(species: Species) {
        if (species !== null) {
            this.targetSpecies = this.referenceSpecies.filter(s => s !== species);
        }

        this.updateReferenceInteractomes(species);
        this.updateReferencePredictomes(species);
    }

    private updateReferenceInteractomes(species: Species) {
        if (this.referenceInteractomes === undefined) {
            this.referenceInteractomes = [];
        }
        this.updateInteractomes(species, this.referenceInteractomes);
    }

    private updateReferencePredictomes(species: Species) {
        if (this.referencePredictomes === undefined) {
            this.referencePredictomes = [];
        }
        this.updatePredictomes(species, this.referencePredictomes);
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

    private updateInteractomes(species: Species, interactomes: Interactome[]): void {
        this.updateInteractomesOrPredictomes(
            species, interactomes, (speciesToMap: Species) => speciesToMap.interactomes.map(interactome => interactome.id)
        );
    }

    private updatePredictomes(species: Species, predictomes: Interactome[]): void {
        this.updateInteractomesOrPredictomes(
            species, predictomes, (speciesToMap: Species) => speciesToMap.predictomes.map(predictome => predictome.id)
        );
    }

    private onTargetSpeciesChange(species: Species) {
        this.updateTargetInteractomes(species);
        this.updateTargetPredictomes(species);
    }

    private updateTargetInteractomes(species: Species) {
        if (this.targetInteractomes === undefined) {
            this.targetInteractomes = [];
        }
        this.updateInteractomes(species, this.targetInteractomes);
    }

    private updateTargetPredictomes(species: Species) {
        if (this.targetPredictomes === undefined) {
            this.targetPredictomes = [];
        }
        this.updatePredictomes(species, this.targetPredictomes);
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

        const interactomes = this.getCurrentQueryReferenceInteractomes();

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

    private getCurrentQueryReferenceInteractomes(): number[] {
        const formModel = this.formDistinctSpecies.value;

        const queryInteractomes = [];
        if (formModel.referenceInteractomes) {
            formModel.referenceInteractomes.map(i => i.id).forEach(i => queryInteractomes.push(i));
        }
        if (formModel.referencePredictomes) {
            formModel.referencePredictomes.map(p => p.id).forEach(p => queryInteractomes.push(p));
        }

        return queryInteractomes;
    }

    private getCurrentQueryTargetInteractomes(): number[] {
        const formModel = this.formDistinctSpecies.value;

        const queryInteractomes = [];
        if (formModel.targetInteractomes) {
            formModel.targetInteractomes.map(i => i.id).forEach(i => queryInteractomes.push(i));
        }
        if (formModel.targetPredictomes) {
            formModel.targetPredictomes.map(p => p.id).forEach(p => queryInteractomes.push(p));
        }

        return queryInteractomes;
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

    public onSelectReferencePredictomes(): void {
        this.showPredictomeSelectionDialog(
            'Reference predictome selection', this.referenceSpecies, this.referencePredictomes, this.controlReferencePredictomes
        );
    }

    public onSelectTargetPredictomes(): void {
        this.showPredictomeSelectionDialog(
            'Target predictome selection', this.targetSpecies, this.targetPredictomes, this.controlTargetPredictomes
        );
    }

    private showPredictomeSelectionDialog(
        title: string, species: Species[], predictomes: Interactome[], control: AbstractControl
    ): void {
        this.dialog.open(InteractomeSelectionDialogComponent, {
            minWidth: 600,
            data: {
                title: title,
                filters: [
                    {
                        name: 'Species',
                        values: species.map(s => s.name)
                    },
                    {
                        name: 'Database',
                        values: ['DIOPT', 'ENSEMBL']
                    }
                ],
                interactomes: predictomes,
                selectedInteractomeIds: control.value === null
                    ? []
                    : control.value.map(
                        predictome => predictome.id
                    )
            }
        }).afterClosed().subscribe((selected: number[]) => {
            if (selected) {
                control.setValue(
                    predictomes.filter(
                        predictome => selected.includes(predictome.id)
                    )
                );
            }
        });
    }
}
