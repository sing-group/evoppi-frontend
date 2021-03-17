import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormGroupDirective, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {SpeciesService} from '../../results/services/species.service';
import {Species} from '../../../entities/bio';
import {UNIPROT_DBS, UniProtDb} from '../../../entities/bio/uniprot-db';
import {InteractomeService} from '../../results/services/interactome.service';
import {ConfirmSheetComponent} from '../../material-design/confirm-sheet/confirm-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ActivatedRoute, Router} from '@angular/router';

function validateMultipleSpeciesField(fieldName: string, validators: ValidatorFn | ValidatorFn[]): ValidatorFn {
    if (!Array.isArray(validators)) {
        validators = [validators];
    }
    const validator = Validators.compose(validators);

    return (control: AbstractControl): ValidationErrors | null => {
        const isMultiple = control.get('multipleSpecies');

        const field = control.get(fieldName);

        if (isMultiple.value) {
            field.setErrors(validator(field));
        }

        return null;
    };
}

@Component({
    selector: 'app-interactome-creation',
    templateUrl: './interactome-creation.component.html',
    styleUrls: ['./interactome-creation.component.scss']
})
export class InteractomeCreationComponent implements OnInit {
    public form: FormGroup;

    public processing: boolean;

    public species: Species[];
    public databases: UniProtDb[] = UNIPROT_DBS;

    @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly bottomSheet: MatBottomSheet,
        private readonly formBuilder: FormBuilder,
        private readonly interactomesService: InteractomeService,
        private readonly speciesService: SpeciesService
    ) {
        this.processing = false;
        this.form = this.formBuilder.group({
            name: [undefined, Validators.required],
            interactomeFile: [undefined, Validators.required],
            sourceDatabase: [undefined, Validators.required],
            multipleSpecies: [false],
            species: [undefined, Validators.required],
            headerLinesCount: [undefined, [Validators.required, Validators.min(0), Validators.max(100)]],
            geneColumn1: [undefined, [Validators.required, Validators.min(0), Validators.max(100)]],
            geneColumn2: [undefined, [Validators.required, Validators.min(0), Validators.max(100)]],
            genePrefix: [undefined],
            geneSuffix: [undefined],
            speciesFileId: [undefined],
            speciesColumn1: [undefined],
            speciesColumn2: [undefined],
            speciesPrefix: [undefined],
            speciesSuffix: [undefined]
        }, {
            validators: [
                validateMultipleSpeciesField('speciesFileId', Validators.required),
                validateMultipleSpeciesField('speciesColumn1', [Validators.required, Validators.min(0), Validators.max(100)]),
                validateMultipleSpeciesField('speciesColumn2', [Validators.required, Validators.min(0), Validators.max(100)])
            ]
        });
    }

    ngOnInit(): void {
        this.speciesService.listAll().subscribe(species => this.species = species);
    }

    get isMultipleSpecies(): boolean {
        return this.form.get('multipleSpecies').value;
    }

    hasValidationError(fieldName: string): boolean {
        const field = this.form.get(fieldName);

        return field.invalid && (field.dirty || field.touched);
    }

    getValidationError(fieldName: string): string {
        switch (fieldName) {
            case 'name':
                return 'Name can\'t be empty.';
            case 'interactomeFile':
                return 'A file with the interactome information must be provided';
            case 'sourceDatabase':
                return 'A source database must be selected';
            case 'species':
                return 'A species must be selected';
            case 'headerLinesCount':
                return 'A number of header lines must be provided (min: 0, max: 100)';
            case 'geneColumn1':
                return 'The index of the first column with the genes must be provided (min: 0, max: 100)';
            case 'geneColumn2':
                return 'The index of the second column with the genes must be provided (min: 0, max: 100)';
            case 'speciesFileId':
                return 'The identifier of the species in the file must be provided.';
            case 'speciesColumn1':
                return 'The index of the first column with the species must be provided (min: 0, max: 100)';
            case 'speciesColumn2':
                return 'The index of the second column with the species must be provided (min: 0, max: 100)';
            default:
                throw new Error('Unknown field: ' + fieldName);
        }
    }

    onFileChanged(event) {
        const reader = new FileReader();
        reader.onload = () => {
            console.log(reader.result);
        };
        reader.readAsText(event.target.files[0]);
    }

    onSubmit() {
        if (!this.isValidForm()) {
            throw new Error('Form is not valid');
        }

        this.processing = true;
        this.form.disable();

        const formModel = this.form.value;

        let multipleInteractomeParams = undefined;
        if (formModel.isMultipleSpecies) {
            multipleInteractomeParams = {
                speciesFileId: formModel.speciesFileId,
                organismColumn1: formModel.speciesColumn1,
                organismColumn2: formModel.speciesColumn2,
                organismPrefix: formModel.speciesPrefix,
                organismSuffix: formModel.speciesSuffix
            };
        }
        this.interactomesService.createInteractome(
            formModel.interactomeFile.files[0],
            formModel.name,
            formModel.species,
            formModel.sourceDatabase,
            formModel.geneColumn1,
            formModel.geneColumn2,
            formModel.headerLinesCount,
            formModel.genePrefix,
            formModel.geneSuffix,
            multipleInteractomeParams
        ).subscribe(
            () => {
                this.showNotification();
                this.form.reset();
                this.formDirective.resetForm();
            },
            error => {
                this.form.setErrors({'invalidForm': 'Error: ' + error.error});
                throw error;
            },
            () => {
                this.processing = false;
                this.form.enable();
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
                    title: 'Interactome creation requested',
                    message: 'The interactome is being processed. You can check results to track it processing status.',
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
}
