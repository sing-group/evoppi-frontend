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

import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormGroupDirective, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Species} from '../../../entities/bio';
import {ActivatedRoute, Router} from '@angular/router';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {SpeciesService} from '../../results/services/species.service';
import {ConfirmSheetComponent} from '../../material-design/confirm-sheet/confirm-sheet.component';
import {PredictomeService} from '../services/predictome.service';

@Component({
    selector: 'app-predictome-creation',
    templateUrl: './predictome-creation.component.html',
    styleUrls: ['./predictome-creation.component.scss']
})
export class PredictomeCreationComponent implements OnInit {
    public form: FormGroup;

    public processing: boolean;

    public species: Species[];
    private interactomeNames: string[];

    @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly bottomSheet: MatBottomSheet,
        private readonly formBuilder: FormBuilder,
        private readonly predictomeService: PredictomeService,
        private readonly speciesService: SpeciesService
    ) {
        this.processing = false;
        this.form = this.formBuilder.group({
                predictomeFile: [undefined, Validators.required],
                sourceInteractome: [undefined, [Validators.required, this.validateInteractomeName()]],
                conversionDatabase: [undefined, Validators.required],
                speciesA: [undefined, Validators.required],
            }
        );
    }

    ngOnInit(): void {
        this.speciesService.listAll().subscribe(species => this.species = species);
        this.predictomeService.listAll().subscribe(
            interactomes => this.interactomeNames = interactomes.map(interactome => interactome.name)
        );
    }

    private validateInteractomeName(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.interactomeNames === undefined) {
                console.warn('Predicted interactome names are not loaded.');
                return null;
            } else {
                if (this.interactomeNames.includes('Based on ' + control.value)) {
                    console.log('Here we are...');
                    return {
                        'sourceInteractome': `A predicted interactome with the same name already exists.`
                    }
                } else {
                    return null;
                }
            }
        };
    }

    hasValidationError(fieldName: string): boolean {
        const field = this.form.get(fieldName);

        return field.invalid && (field.dirty || field.touched);
    }

    getValidationError(fieldName: string): string {
        switch (fieldName) {
            case 'sourceInteractome':
                const field = this.form.get('sourceInteractome');

                if (field.errors.sourceInteractome !== undefined) {
                    return field.errors.sourceInteractome;
                } else {
                    return 'Source predicted interactome can\'t be empty.';
                }
            case 'predictomeFile':
                return 'A file with the predicted interactome information must be provided';
            case 'conversionDatabase':
                return 'The conversion database can\'t be empty';
            case 'speciesA':
                return 'A species A must be selected';
            default:
                throw new Error('Unknown field: ' + fieldName);
        }
    }

    onSubmit() {
        if (!this.isValidForm()) {
            throw new Error('Form is not valid');
        }

        this.processing = true;
        this.form.disable();

        const formModel = this.form.value;

        this.predictomeService.createPredictome(
            formModel.predictomeFile.files[0],
            formModel.speciesA,
            formModel.sourceInteractome,
            formModel.conversionDatabase
        ).subscribe(
            () => {
                this.showNotification();
                this.form.reset();
                this.formDirective.resetForm();
                this.form.enable();
                this.processing = false;
            },
            error => {
                this.form.enable();
                this.form.setErrors({'invalidForm': true});
                this.processing = false;
                console.log(this.form.hasError('invalidForm'));
            }
        );
    }

    isValidForm() {
        return !this.processing && this.form.valid;
    }

    private showNotification(): void {
        this.bottomSheet.open(
            ConfirmSheetComponent,
            {
                data: {
                    title: 'Predicted interactome created',
                    message: 'The predicted interactome was created. You can see it in the predicted interactomes list.',
                    confirmLabel: this.route.routeConfig.data.redirectRouteTitle,
                    cancelLabel: 'Close',
                    headerClass: 'card-header-success'
                }
            }
        ).afterDismissed().subscribe(redirect => {
            if (redirect) {
                this.router.navigate([
                    this.route.routeConfig.data.redirectRoute
                ]);
            }
        });
    }

    hasGlobalErrors() {
        return this.form.errors?.invalidForm !== undefined;
    }
}
