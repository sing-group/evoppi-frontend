import {ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {Interactome} from '../../../../entities';
import {MatListOption, MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {MatSelect} from '@angular/material/select';

export interface InteractomeFilter {
    readonly name: string,
    readonly values: string[]
}

interface SelectableInteractome extends Interactome {
    selected: boolean;
}

@Component({
    selector: 'app-interactome-selection-form',
    templateUrl: './interactome-selection-form.component.html',
    styleUrls: ['./interactome-selection-form.component.scss']
})
export class InteractomeSelectionFormComponent implements OnInit {
    private _interactomes: Interactome[];
    @Input() public selectedInteractomeIds: number[];
    @Input() public filters: InteractomeFilter[];

    @Output() public selectedInteractomeIdsChange: EventEmitter<number[]>;

    public searchText: string;

    public filteredInteractomes: SelectableInteractome[];

    private selectableInteractomes: SelectableInteractome[];
    private readonly filterValues: Map<string, string>;

    @ViewChild('interactomeList') private interactomeList: MatSelectionList;

    constructor() {
        this.selectedInteractomeIds = [];
        this.selectedInteractomeIdsChange = new EventEmitter<number[]>();
        this.filters = [];

        this.searchText = '';

        this.filteredInteractomes = [];

        this.selectableInteractomes = [];
        this.filterValues = new Map<string, string>();
    }

    public ngOnInit(): void {
        this.updateSelectableInteractomes();
        this.updateFilteredInteractomes();
    }

    @Input() public set interactomes(interactomes: Interactome[]) {
        this._interactomes = interactomes;
        this.updateSelectableInteractomes();
    }

    public get interactomes(): Interactome[] {
        return this._interactomes;
    }

    public hasFilterValue(filterName: string): boolean {
        return this.filterValues.has(filterName)
    }

    public keepValidValues(values: string[]): string[] {
        return values.filter(value => this.interactomes.some(interactome => this.isTextInInteractomeName(value, interactome)));
    }

    public onClearSearchText(): void {
        this.searchText = '';
    }

    public onChangeFilter(filterName: string, filterValue: string): void {
        if (filterValue.length === 0) {
            this.filterValues.delete(filterName);
        } else {
            this.filterValues.set(filterName, filterValue);
        }

        this.updateFilteredInteractomes();
    }

    public onClearFilter(filterName: string, event: MouseEvent, filterSelect: MatSelect): void {
        this.filterValues.delete(filterName);
        filterSelect.options.find(option => option.value === '').select();
        event.stopPropagation();
    }

    public onChangeSearch(): void {
        this.updateFilteredInteractomes();
    }

    public onSelectAll(): void {
        this.interactomeList.selectAll();
        this.updateSelection(this.interactomeList.options.toArray());
    }

    public onDeselectAll(): void {
        this.interactomeList.deselectAll();
        this.updateSelection(this.interactomeList.options.toArray());
    }

    public onSelectedInteractomeChange(event: MatSelectionListChange) {
        this.updateSelection(event.options);
    }

    private updateSelection(options: MatListOption[]) {
        options.forEach(option => option.value.selected = option.selected);

        this.selectedInteractomeIds = this.selectableInteractomes
            .filter(interactome => interactome.selected)
            .map(interactome => interactome.id);

        this.selectedInteractomeIdsChange.emit(this.selectedInteractomeIds);
    }

    private updateSelectableInteractomes() {
        this.selectableInteractomes = this.interactomes
            .map(interactome => ({
                selected: this.selectedInteractomeIds.includes(interactome.id),
                ...interactome
            }));
    }

    private updateFilteredInteractomes() {
        if (this.filterValues.size === 0 && this.searchText.length === 0) {
            this.filteredInteractomes = this.selectableInteractomes;
        } else {
            this.filteredInteractomes = this.selectableInteractomes.filter(interactome => {
                const searchRE = new RegExp(this.searchText, 'i');
                if (!searchRE.test(interactome.name)) {
                    return false;
                }

                for (const value of this.filterValues.values()) {
                    if (!this.isTextInInteractomeName(value, interactome)) {
                        return false;
                    }
                }
                return true;
            });
        }
    }

    private isTextInInteractomeName(text: string, interactome: Interactome): boolean {
        return new RegExp(text, 'i').test(interactome.name);
    }
}
