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

import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GeneInfo, Interactome, Species} from '../../../entities/bio';
import {SpeciesService} from '../../results/services/species.service';
import {InteractomeService} from '../../results/services/interactome.service';
import {InteractionService} from '../../results/services/interaction.service';
import {GeneService} from '../../results/services/gene.service';
import {debounceTime} from 'rxjs/operators';

@Component({
    selector: 'app-form-distinct-species',
    templateUrl: './form-distinct-species.component.html',
    styleUrls: ['./form-distinct-species.component.scss']
})
export class FormDistinctSpeciesComponent implements OnInit {
    private species: Species[];
    public interactomes: Interactome[][] = [];

    public targetSpecies: Species[];
    public referenceSpecies: Species[];
    public genes: GeneInfo[];

    public searchingGenes = false;
    public processing = false;

    public formDistinctSpecies: FormGroup;

    constructor(private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,
                private speciesService: SpeciesService, private interactomeService: InteractomeService,
                private interactionService: InteractionService, private geneService: GeneService) {
    }

    ngOnInit(): void {
        this.formDistinctSpecies = this.formBuilder.group({
            'referenceSpecies': ['', Validators.required],
            'targetSpecies': ['', Validators.required],
            'referenceInteractome': ['', Validators.required],
            'targetInteractome': ['', Validators.required],
            'gene': ['', Validators.required],
            'eValue': ['0.05', [Validators.required, Validators.min(0)]],
            'minAlignLength': ['18', [Validators.required, Validators.min(0)]],
            'numDescriptions': ['1', [Validators.required, Validators.min(1), Validators.max(100)]],
            'minIdentity': ['95', [Validators.required, Validators.min(0), Validators.max(100)]],
            'level': ['1', [Validators.required, Validators.min(1), Validators.max(3)]],
        });

        this.updateSpecies();

        this.formDistinctSpecies.get('referenceSpecies').valueChanges.subscribe(value => {
            this.onChangeSpecies(value, 1);
        });
        this.formDistinctSpecies.get('targetSpecies').valueChanges.subscribe(value => {
            this.onChangeSpecies(value, 2);
        });

        this.formDistinctSpecies.controls.gene.valueChanges
            .pipe(debounceTime(500))
        .subscribe(res => this.updateGenes(res));
    }

    public selectAllInteractomes(control: string, values) {
        this.formDistinctSpecies.controls[control].setValue(values);
    }

    public deselectAllInteractomes(control: string) {
        this.formDistinctSpecies.controls[control].setValue([]);
    }

    public onGeneSelected(value): void {
        this.formDistinctSpecies.patchValue({gene: value}, {emitEvent: false});
        this.genes = [];
    }

    private onChangeSpecies(value: Species, index: number): void {
        this.interactomes[index] = [];
        if (index === 1) {
            this.targetSpecies = this.species.slice();
            const i: number = this.targetSpecies.indexOf(value);
            this.targetSpecies.splice(i, 1);
        } else {
            this.referenceSpecies = this.species.slice();
            const i: number = this.referenceSpecies.indexOf(value);
            this.referenceSpecies.splice(i, 1);
        }

        for (const interactome of value.interactomes) {
            this.interactomeService.getInteractome(interactome.id)
                .subscribe(
                    res => this.interactomes[index].push(res),
                    err => {},
                    () => this.interactomes[index].sort((a, b) => a.name < b.name ? -1 : 1)
                );
        }
    }

    private updateGenes(value: string): void {
        if (!this.formDistinctSpecies.get('referenceInteractome').valid) {
            alert('First, select Reference Interactome');
            return;
        } else if (value === '') {
            this.genes = [];
            return;
        }

        this.searchingGenes = true;

        const interactomes = this.formDistinctSpecies.value.referenceInteractome.map((item) => item.id);
        this.geneService.getGeneName(value, interactomes)
            .subscribe(
                res => this.genes = res,
                error => {},
                () => this.searchingGenes = false
            );
    }

    public onRequestCompare(): void {
        if (this.processing || this.formDistinctSpecies.status === 'INVALID') {
            return;
        }

        this.processing = true;

        const formModel = this.formDistinctSpecies.value;
        this.interactionService.getDistinctSpeciesInteraction(
            formModel.gene,
            formModel.referenceInteractome.map(item => item.id),
            formModel.targetInteractome.map(item => item.id),
            formModel.level,
            formModel.eValue,
            formModel.numDescriptions,
            formModel.minIdentity / 100,
            formModel.minAlignLength
        )
            .subscribe(
                work => this.showNotification(),
                error => this.formDistinctSpecies.setErrors({'invalidForm': 'Error: ' + error.error}),
                () => this.processing = false
            );
    }

    private updateSpecies(): void {
        this.speciesService.getSpecies()
            .subscribe(species => {
                this.species = this.referenceSpecies = this.targetSpecies = species;
            });
    }

    private showNotification(): void {
        const snackBar = this.snackBar.open('Different species interactions requested', 'Go to results', {
            duration: 5000
        });
        snackBar.onAction().subscribe(() => this.router.navigate([
            this.route.routeConfig.data.resultsResource
        ]));
    }
}
