import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormGroupDirective, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {SpeciesService} from '../../results/services/species.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ConfirmSheetComponent} from '../../material-design/confirm-sheet/confirm-sheet.component';

@Component({
    selector: 'app-species-creation',
    templateUrl: './species-creation.component.html',
    styleUrls: ['./species-creation.component.scss']
})
export class SpeciesCreationComponent implements OnInit {
    public form: FormGroup;

    public processing: boolean;

    private speciesNames: string[];

    @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly bottomSheet: MatBottomSheet,
        private readonly formBuilder: FormBuilder,
        private readonly speciesService: SpeciesService
    ) {
        this.processing = false;
        this.form = this.formBuilder.group({
            name: [undefined, [Validators.required, this.validateSpeciesName()]],
            gbffGzipFileUrl: [undefined, Validators.required]
        });
    }

    ngOnInit(): void {
        this.speciesService.listAll().subscribe(species => this.speciesNames = species.map(species => species.name));
    }

    private validateSpeciesName(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.speciesNames === undefined) {
                console.warn('Species names are not loaded.');
                return null;
            } else {
                if (this.speciesNames.includes(control.value)) {
                    return {
                        'name': `A species with the same name already exists.`
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
            case 'name':
                const field = this.form.get('name');

                if (field.errors.name !== undefined) {
                    return field.errors.name;
                } else {
                    return 'Name can\'t be empty.';
                }
            case 'gbffGzipFileUrl':
                return 'The URL to the GBFF compressed file must be provided';
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

        this.speciesService.createSpecies(
            formModel.name,
            formModel.gbffGzipFileUrl
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
                    title: 'Species creation requested',
                    message: 'The species is being processed. You can check results to track it processing status.',
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
